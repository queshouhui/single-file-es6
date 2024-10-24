"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.lazy = exports.hooksFrames = exports.frameTree = exports.compression = void 0;
var compression = _interopRequireWildcard(require("./compression/compression.js"));
exports.compression = compression;
var frameTree = _interopRequireWildcard(require("./frame-tree/content/content-frame-tree.js"));
exports.frameTree = frameTree;
var hooksFrames = _interopRequireWildcard(require("./hooks/content/content-hooks-frames.js"));
exports.hooksFrames = hooksFrames;
var lazy = _interopRequireWildcard(require("./lazy/content/content-lazy-loader.js"));
exports.lazy = lazy;
function _getRequireWildcardCache(e) { if ("function" != typeof WeakMap) return null; var r = new WeakMap(), t = new WeakMap(); return (_getRequireWildcardCache = function (e) { return e ? t : r; })(e); }
function _interopRequireWildcard(e, r) { if (!r && e && e.__esModule) return e; if (null === e || "object" != typeof e && "function" != typeof e) return { default: e }; var t = _getRequireWildcardCache(r); if (t && t.has(e)) return t.get(e); var n = { __proto__: null }, a = Object.defineProperty && Object.getOwnPropertyDescriptor; for (var u in e) if ("default" !== u && {}.hasOwnProperty.call(e, u)) { var i = a ? Object.getOwnPropertyDescriptor(e, u) : null; i && (i.get || i.set) ? Object.defineProperty(n, u, i) : n[u] = e[u]; } return n.default = e, t && t.set(e, n), n; }