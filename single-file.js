"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.SingleFile = void 0;
exports.getPageData = getPageData;
exports.helper = void 0;
exports.init = init;
exports.vendor = exports.processors = exports.modules = void 0;
var processors = _interopRequireWildcard(require("./processors/index.js"));
exports.processors = processors;
var vendor = _interopRequireWildcard(require("./vendor/index.js"));
exports.vendor = vendor;
var modules = _interopRequireWildcard(require("./modules/index.js"));
exports.modules = modules;
var core = _interopRequireWildcard(require("./core/index.js"));
var helper = _interopRequireWildcard(require("./core/helper.js"));
exports.helper = helper;
var util = _interopRequireWildcard(require("./core/util.js"));
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

/* global globalThis */

let SingleFile = exports.SingleFile = void 0;
function init(initOptions) {
  if (typeof SingleFile == "undefined") {
    exports.SingleFile = SingleFile = core.getClass(util.getInstance(initOptions));
  }
}
async function getPageData(options = {}, initOptions, doc, win) {
  if (doc === undefined) {
    doc = globalThis.document;
  }
  if (win === undefined) {
    win = globalThis;
  }
  const frames = processors.frameTree;
  let framesSessionId;
  init(initOptions);
  if (doc && win) {
    helper.initDoc(doc);
    const preInitializationPromises = [];
    if (!options.saveRawPage) {
      let lazyLoadPromise;
      if (options.loadDeferredImages) {
        lazyLoadPromise = processors.lazy.process(options);
        if (options.loadDeferredImagesBeforeFrames) {
          await lazyLoadPromise;
        }
      }
      if (!options.removeFrames && frames && globalThis.frames) {
        let frameTreePromise;
        if (options.loadDeferredImages) {
          frameTreePromise = new Promise(resolve => globalThis.setTimeout(() => resolve(frames.getAsync(options)), options.loadDeferredImagesBeforeFrames || !options.loadDeferredImages ? 0 : options.loadDeferredImagesMaxIdleTime));
        } else {
          frameTreePromise = frames.getAsync(options);
        }
        if (options.loadDeferredImagesBeforeFrames) {
          options.frames = await frameTreePromise;
        } else {
          preInitializationPromises.push(frameTreePromise);
        }
      }
      if (options.loadDeferredImages && !options.loadDeferredImagesBeforeFrames) {
        preInitializationPromises.push(lazyLoadPromise);
      }
    }
    if (!options.loadDeferredImagesBeforeFrames) {
      [options.frames] = await Promise.all(preInitializationPromises);
    }
    framesSessionId = options.frames && options.frames.sessionId;
  }
  options.doc = doc;
  options.win = win;
  options.insertCanonicalLink = true;
  const externalOnProgress = options.onprogress;
  options.onprogress = async event => {
    if (event.type === event.RESOURCES_INITIALIZED && doc && win && options.loadDeferredImages) {
      processors.lazy.resetZoomLevel(options);
    }
    if (externalOnProgress) {
      await externalOnProgress(event);
    }
  };
  const processor = new SingleFile(options);
  await processor.run();
  if (framesSessionId) {
    frames.cleanup(framesSessionId);
  }
  const pageData = await processor.getPageData();
  if (options.compressContent) {
    const blob = await processors.compression.process(pageData, {
      insertTextBody: options.insertTextBody,
      url: options.url,
      createRootDirectory: options.createRootDirectory,
      selfExtractingArchive: options.selfExtractingArchive,
      extractDataFromPage: options.extractDataFromPage,
      preventAppendedData: options.preventAppendedData,
      insertCanonicalLink: options.insertCanonicalLink,
      insertMetaNoIndex: options.insertMetaNoIndex,
      insertMetaCSP: options.insertMetaCSP,
      password: options.password,
      zipScript: options.zipScript,
      embeddedImage: options.embeddedImage,
      embeddedPdf: options.embeddedPdf
    });
    delete pageData.resources;
    const reader = new globalThis.FileReader();
    reader.readAsArrayBuffer(blob);
    const arrayBuffer = await new Promise((resolve, reject) => {
      reader.addEventListener("load", () => resolve(reader.result), false);
      reader.addEventListener("error", event => reject(event.detail.error), false);
    });
    pageData.content = Array.from(new Uint8Array(arrayBuffer));
  }
  return pageData;
}