"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
var _contentFrameTree = require("./processors/frame-tree/content/content-frame-tree.js");
Object.keys(_contentFrameTree).forEach(function (key) {
  if (key === "default" || key === "__esModule") return;
  if (key in exports && exports[key] === _contentFrameTree[key]) return;
  Object.defineProperty(exports, key, {
    enumerable: true,
    get: function () {
      return _contentFrameTree[key];
    }
  });
});