"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.processors = exports.helper = void 0;
var frameTree = _interopRequireWildcard(require("./processors/frame-tree/content/content-frame-tree.js"));
var serializer = _interopRequireWildcard(require("./modules/html-serializer.js"));
var _helper = require("./core/helper.js");
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

const processors = exports.processors = {
  frameTree
};
const helper = exports.helper = {
  COMMENT_HEADER: _helper.COMMENT_HEADER,
  COMMENT_HEADER_LEGACY: _helper.COMMENT_HEADER_LEGACY,
  ON_BEFORE_CAPTURE_EVENT_NAME: _helper.ON_BEFORE_CAPTURE_EVENT_NAME,
  ON_AFTER_CAPTURE_EVENT_NAME: _helper.ON_AFTER_CAPTURE_EVENT_NAME,
  WAIT_FOR_USERSCRIPT_PROPERTY_NAME: _helper.WAIT_FOR_USERSCRIPT_PROPERTY_NAME,
  preProcessDoc: _helper.preProcessDoc,
  postProcessDoc: _helper.postProcessDoc,
  serialize(doc, compressHTML) {
    return serializer.process(doc, compressHTML);
  },
  getShadowRoot: _helper.getShadowRoot
};
(0, _helper.initUserScriptHandler)();