"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.helper = void 0;
var serializer = _interopRequireWildcard(require("./modules/html-serializer.js"));
var _templateFormatter = require("./modules/template-formatter.js");
var infobar = _interopRequireWildcard(require("./core/infobar.js"));
var _util = require("./core/util.js");
var zip = _interopRequireWildcard(require("./vendor/zip/zip.js"));
var _compressionExtract = require("./processors/compression/compression-extract.js");
var _compressionDisplay = require("./processors/compression/compression-display.js");
function _getRequireWildcardCache(e) { if ("function" != typeof WeakMap) return null; var r = new WeakMap(), t = new WeakMap(); return (_getRequireWildcardCache = function (e) { return e ? t : r; })(e); }
function _interopRequireWildcard(e, r) { if (!r && e && e.__esModule) return e; if (null === e || "object" != typeof e && "function" != typeof e) return { default: e }; var t = _getRequireWildcardCache(r); if (t && t.has(e)) return t.get(e); var n = { __proto__: null }, a = Object.defineProperty && Object.getOwnPropertyDescriptor; for (var u in e) if ("default" !== u && {}.hasOwnProperty.call(e, u)) { var i = a ? Object.getOwnPropertyDescriptor(e, u) : null; i && (i.get || i.set) ? Object.defineProperty(n, u, i) : n[u] = e[u]; } return n.default = e, t && t.set(e, n), n; }
/*
 * Copyright 2010-2020 Gildas Lormeau
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

const util = (0, _util.getInstance)();
const helper = exports.helper = {
  serialize(doc, compressHTML) {
    return serializer.process(doc, compressHTML);
  },
  getDoctypeString(doc) {
    return util.getDoctypeString(doc);
  },
  appendInfobar(doc, options, useShadowRoot) {
    return infobar.appendInfobar(doc, options, useShadowRoot);
  },
  extractInfobarData(doc) {
    return infobar.extractInfobarData(doc);
  },
  displayIcon(doc, useShadowRoot, options = {}) {
    return infobar.displayIcon(doc, useShadowRoot, options);
  },
  zip,
  extract: _compressionExtract.extract,
  display: _compressionDisplay.display,
  formatFilename: _templateFormatter.formatFilename,
  INFOBAR_TAGNAME: infobar.INFOBAR_TAGNAME
};