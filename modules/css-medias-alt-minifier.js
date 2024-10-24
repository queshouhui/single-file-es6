"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.process = process;
var cssTree = _interopRequireWildcard(require("./../vendor/css-tree.js"));
var mediaQueryParser = _interopRequireWildcard(require("./../vendor/css-media-query-parser.js"));
var _helper = require("./../core/helper.js");
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

const helper = {
  flatten: _helper.flatten
};
const MEDIA_ALL = "all";
const MEDIA_SCREEN = "screen";
const MEDIA_PRINT = "print";
function process(stylesheets, {
  keepPrintStyleSheets
} = {}) {
  const stats = {
    processed: 0,
    discarded: 0
  };
  stylesheets.forEach((stylesheetInfo, key) => {
    if (stylesheetInfo.stylesheet) {
      if (matchesMediaType(stylesheetInfo.mediaText || MEDIA_ALL, keepPrintStyleSheets) && stylesheetInfo.stylesheet.children) {
        const removedRules = processRules(stylesheetInfo.stylesheet.children, stats, keepPrintStyleSheets);
        removedRules.forEach(({
          cssRules,
          cssRule
        }) => cssRules.remove(cssRule));
      } else {
        stylesheets.delete(key);
        if (key.element) {
          key.element.remove();
        }
      }
    }
  });
  return stats;
}
function processRules(cssRules, stats, keepPrintStyleSheets, removedRules = []) {
  for (let cssRule = cssRules.head; cssRule; cssRule = cssRule.next) {
    const ruleData = cssRule.data;
    if (ruleData.type == "Atrule" && ruleData.name == "media" && ruleData.block && ruleData.block.children && ruleData.prelude && ruleData.prelude.children) {
      stats.processed++;
      if (matchesMediaType(cssTree.generate(ruleData.prelude), keepPrintStyleSheets)) {
        processRules(ruleData.block.children, stats, keepPrintStyleSheets, removedRules);
      } else {
        removedRules.push({
          cssRules,
          cssRule
        });
        stats.discarded++;
      }
    }
  }
  return removedRules;
}
function matchesMediaType(mediaText, keepPrintStyleSheets) {
  const foundMediaTypes = helper.flatten(mediaQueryParser.parseMediaList(mediaText).map(node => getMediaTypes(node)));
  return foundMediaTypes.find(mediaTypeInfo => !mediaTypeInfo.not && (mediaTypeInfo.value == MEDIA_SCREEN || mediaTypeInfo.value == MEDIA_ALL || keepPrintStyleSheets && mediaTypeInfo.value == MEDIA_PRINT) || mediaTypeInfo.not && (mediaTypeInfo.value != MEDIA_SCREEN || mediaText.includes(" and ")));
}
function getMediaTypes(parentNode, mediaTypes = []) {
  parentNode.nodes.map((node, indexNode) => {
    if (node.type == "media-query") {
      return getMediaTypes(node);
    } else {
      if (node.type == "media-type") {
        const nodeMediaType = {
          not: Boolean(indexNode && parentNode.nodes[0].type == "keyword" && parentNode.nodes[0].value == "not"),
          value: node.value
        };
        mediaTypes.push(nodeMediaType);
      }
    }
  });
  if (!mediaTypes.length) {
    mediaTypes.push({
      not: false,
      value: MEDIA_ALL
    });
  }
  return mediaTypes;
}