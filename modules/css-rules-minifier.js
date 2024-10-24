"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.process = process;
var cssTree = _interopRequireWildcard(require("./../vendor/css-tree.js"));
function _getRequireWildcardCache(e) { if ("function" != typeof WeakMap) return null; var r = new WeakMap(), t = new WeakMap(); return (_getRequireWildcardCache = function (e) { return e ? t : r; })(e); }
function _interopRequireWildcard(e, r) { if (!r && e && e.__esModule) return e; if (null === e || "object" != typeof e && "function" != typeof e) return { default: e }; var t = _getRequireWildcardCache(r); if (t && t.has(e)) return t.get(e); var n = { __proto__: null }, a = Object.defineProperty && Object.getOwnPropertyDescriptor; for (var u in e) if ("default" !== u && {}.hasOwnProperty.call(e, u)) { var i = a ? Object.getOwnPropertyDescriptor(e, u) : null; i && (i.get || i.set) ? Object.defineProperty(n, u, i) : n[u] = e[u]; } return n.default = e, t && t.set(e, n), n; }
/*
 * Copyright 2010-2022 Gildas Lormeau
 * contact : gildas.lormeau <at> gmail.com
 * 
 * This file is part of SingleFile.
 *
 *   The code in this file is free software: you can redistribute it and/or 
 *   modify it under the terms of the GNU Affero General Public License 
 *   (GNU AGPL) as published by the Free Software Foundation, either version 3
 *   of the License, or (at your option) any later version.
 * 
 *   The code in this file is distributed in the hope that it will be useful, 
 *   but WITHOUT ANY WARRANTY; without even the implied warranty of 
 *   MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE. See the GNU Affero 
 *   General Public License for more details.
 *
 *   As additional permission under GNU AGPL version 3 section 7, you may 
 *   distribute UNMODIFIED VERSIONS OF THIS file without the copy of the GNU 
 *   AGPL normally required by section 4, provided you include this license 
 *   notice and a URL through which recipients can access the Corresponding 
 *   Source.
 */

const DEBUG = false;
function process(stylesheets, styles, mediaAllInfo) {
  const stats = {
    processed: 0,
    discarded: 0
  };
  let sheetIndex = 0;
  stylesheets.forEach((stylesheetInfo, key) => {
    if (!stylesheetInfo.scoped && stylesheetInfo.stylesheet && !key.urlNode) {
      const cssRules = stylesheetInfo.stylesheet.children;
      if (cssRules) {
        stats.processed += cssRules.size;
        stats.discarded += cssRules.size;
        let mediaInfo;
        if (stylesheetInfo.mediaText && stylesheetInfo.mediaText != "all") {
          mediaInfo = mediaAllInfo.medias.get("style-" + sheetIndex + "-" + stylesheetInfo.mediaText);
        } else {
          mediaInfo = mediaAllInfo;
        }
        processRules(cssRules, sheetIndex, mediaInfo);
        stats.discarded -= cssRules.size;
      }
    }
    sheetIndex++;
  });
  let startTime;
  if (DEBUG) {
    startTime = Date.now();
    log("  -- STARTED processStyleAttribute");
  }
  styles.forEach(style => processStyleAttribute(style, mediaAllInfo));
  if (DEBUG) {
    log("  -- ENDED   processStyleAttribute delay =", Date.now() - startTime);
  }
  return stats;
}
function processRules(cssRules, sheetIndex, mediaInfo, indexes = {
  mediaRuleIndex: 0
}) {
  let startTime;
  if (DEBUG && cssRules.size > 1) {
    startTime = Date.now();
    log("  -- STARTED processRules", "rules.length =", cssRules.size);
  }
  const removedCssRules = [];
  for (let cssRule = cssRules.head; cssRule; cssRule = cssRule.next) {
    const ruleData = cssRule.data;
    if (ruleData.type == "Atrule" && ruleData.name == "import" && ruleData.prelude && ruleData.prelude.children && ruleData.prelude.children.head.data.importedChildren) {
      processRules(ruleData.prelude.children.head.data.importedChildren, sheetIndex, mediaInfo, indexes);
    } else if (ruleData.block && ruleData.block.children && ruleData.prelude && ruleData.prelude.children) {
      if (ruleData.type == "Atrule" && ruleData.name == "media") {
        const mediaText = cssTree.generate(ruleData.prelude);
        processRules(ruleData.block.children, sheetIndex, mediaInfo.medias.get("rule-" + sheetIndex + "-" + indexes.mediaRuleIndex + "-" + mediaText));
        indexes.mediaRuleIndex++;
      } else if (ruleData.type == "Rule") {
        const ruleInfo = mediaInfo.rules.get(ruleData);
        const pseudoSelectors = mediaInfo.pseudoRules.get(ruleData);
        if (!ruleInfo && !pseudoSelectors) {
          removedCssRules.push(cssRule);
        } else if (ruleInfo) {
          processRuleInfo(ruleData, ruleInfo, pseudoSelectors);
          if (!ruleData.prelude.children.size || !ruleData.block.children.size) {
            removedCssRules.push(cssRule);
          }
        }
      }
    } else {
      if (!ruleData || ruleData.type == "Raw" || ruleData.type == "Rule" && (!ruleData.prelude || ruleData.prelude.type == "Raw")) {
        removedCssRules.push(cssRule);
      }
    }
  }
  removedCssRules.forEach(cssRule => cssRules.remove(cssRule));
  if (DEBUG && cssRules.size > 1) {
    log("  -- ENDED   processRules delay =", Date.now() - startTime);
  }
}
function processRuleInfo(ruleData, ruleInfo, pseudoSelectors) {
  const removedDeclarations = [];
  const removedSelectors = [];
  let pseudoSelectorFound;
  for (let selector = ruleData.prelude.children.head; selector; selector = selector.next) {
    const selectorText = cssTree.generate(selector.data);
    if (pseudoSelectors && pseudoSelectors.has(selectorText)) {
      pseudoSelectorFound = true;
    }
    if (!ruleInfo.matchedSelectors.has(selectorText) && (!pseudoSelectors || !pseudoSelectors.has(selectorText))) {
      removedSelectors.push(selector);
    }
  }
  if (!pseudoSelectorFound) {
    for (let declaration = ruleData.block.children.tail; declaration; declaration = declaration.prev) {
      if (!ruleInfo.declarations.has(declaration.data)) {
        removedDeclarations.push(declaration);
      }
    }
  }
  removedDeclarations.forEach(declaration => ruleData.block.children.remove(declaration));
  removedSelectors.forEach(selector => ruleData.prelude.children.remove(selector));
}
function processStyleAttribute(styleData, mediaAllInfo) {
  const removedDeclarations = [];
  const styleInfo = mediaAllInfo.matchedStyles.get(styleData);
  if (styleInfo) {
    let propertyFound;
    for (let declaration = styleData.children.head; declaration && !propertyFound; declaration = declaration.next) {
      if (!styleInfo.declarations.has(declaration.data)) {
        removedDeclarations.push(declaration);
      }
    }
    removedDeclarations.forEach(declaration => styleData.children.remove(declaration));
  }
}
function log(...args) {
  console.log("S-File <css-min>", ...args); // eslint-disable-line no-console
}