"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.TokenStream = exports.List = exports.Lexer = void 0;
exports.clone = ro;
exports.ident = exports.generate = exports.fromPlainObject = exports.fork = exports.findLast = exports.findAll = exports.find = exports.definitionSyntax = exports.createSyntax = exports.createLexer = void 0;
exports.isCustomProperty = Rt;
exports.walk = exports.version = exports.vendorPrefix = exports.url = exports.tokenize = exports.tokenTypes = exports.tokenNames = exports.toPlainObject = exports.string = exports.property = exports.parse = exports.lexer = exports.keyword = void 0;
// dist/csstree.esm.js from https://github.com/csstree/csstree/tree/9de5189fadd6fb4e3a149eec0e80d6ed0d0541e5

/*
 * Copyright (C) 2016-2024 by Roman Dvornov
 * 
 * Permission is hereby granted, free of charge, to any person obtaining a copy
 * of this software and associated documentation files (the "Software"), to deal
 * in the Software without restriction, including without limitation the rights
 * to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
 * copies of the Software, and to permit persons to whom the Software is
 * furnished to do so, subject to the following conditions:
 * 
 * The above copyright notice and this permission notice shall be included in
 * all copies or substantial portions of the Software.
 * 
 * THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
 * IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
 * FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
 * AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
 * LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
 * OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN
 * THE SOFTWARE.
 */

var Ds = Object.create;
var tr = Object.defineProperty;
var Ns = Object.getOwnPropertyDescriptor;
var Os = Object.getOwnPropertyNames;
var zs = Object.getPrototypeOf,
  Fs = Object.prototype.hasOwnProperty;
var Oe = (e, t) => () => (t || e((t = {
    exports: {}
  }).exports, t), t.exports),
  x = (e, t) => {
    for (var r in t) tr(e, r, {
      get: t[r],
      enumerable: !0
    });
  },
  Rs = (e, t, r, n) => {
    if (t && typeof t == "object" || typeof t == "function") for (let i of Os(t)) !Fs.call(e, i) && i !== r && tr(e, i, {
      get: () => t[i],
      enumerable: !(n = Ns(t, i)) || n.enumerable
    });
    return e;
  };
var Ms = (e, t, r) => (r = e != null ? Ds(zs(e)) : {}, Rs(t || !e || !e.__esModule ? tr(r, "default", {
  value: e,
  enumerable: !0
}) : r, e));
var bo = Oe(ur => {
  var go = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789+/".split("");
  ur.encode = function (e) {
    if (0 <= e && e < go.length) return go[e];
    throw new TypeError("Must be between 0 and 63: " + e);
  };
  ur.decode = function (e) {
    var t = 65,
      r = 90,
      n = 97,
      i = 122,
      o = 48,
      s = 57,
      u = 43,
      l = 47,
      a = 26,
      c = 52;
    return t <= e && e <= r ? e - t : n <= e && e <= i ? e - n + a : o <= e && e <= s ? e - o + c : e == u ? 62 : e == l ? 63 : -1;
  };
});
var vo = Oe(hr => {
  var xo = bo(),
    pr = 5,
    yo = 1 << pr,
    ko = yo - 1,
    wo = yo;
  function Qs(e) {
    return e < 0 ? (-e << 1) + 1 : (e << 1) + 0;
  }
  function Xs(e) {
    var t = (e & 1) === 1,
      r = e >> 1;
    return t ? -r : r;
  }
  hr.encode = function (t) {
    var r = "",
      n,
      i = Qs(t);
    do n = i & ko, i >>>= pr, i > 0 && (n |= wo), r += xo.encode(n); while (i > 0);
    return r;
  };
  hr.decode = function (t, r, n) {
    var i = t.length,
      o = 0,
      s = 0,
      u,
      l;
    do {
      if (r >= i) throw new Error("Expected more digits in base 64 VLQ value.");
      if (l = xo.decode(t.charCodeAt(r++)), l === -1) throw new Error("Invalid base64 digit: " + t.charAt(r - 1));
      u = !!(l & wo), l &= ko, o = o + (l << s), s += pr;
    } while (u);
    n.value = Xs(o), n.rest = r;
  };
});
var Lt = Oe(Q => {
  function $s(e, t, r) {
    if (t in e) return e[t];
    if (arguments.length === 3) return r;
    throw new Error('"' + t + '" is a required argument.');
  }
  Q.getArg = $s;
  var So = /^(?:([\w+\-.]+):)?\/\/(?:(\w+:\w+)@)?([\w.-]*)(?::(\d+))?(.*)$/,
    Zs = /^data:.+\,.+$/;
  function nt(e) {
    var t = e.match(So);
    return t ? {
      scheme: t[1],
      auth: t[2],
      host: t[3],
      port: t[4],
      path: t[5]
    } : null;
  }
  Q.urlParse = nt;
  function qe(e) {
    var t = "";
    return e.scheme && (t += e.scheme + ":"), t += "//", e.auth && (t += e.auth + "@"), e.host && (t += e.host), e.port && (t += ":" + e.port), e.path && (t += e.path), t;
  }
  Q.urlGenerate = qe;
  var Js = 32;
  function el(e) {
    var t = [];
    return function (r) {
      for (var n = 0; n < t.length; n++) if (t[n].input === r) {
        var i = t[0];
        return t[0] = t[n], t[n] = i, t[0].result;
      }
      var o = e(r);
      return t.unshift({
        input: r,
        result: o
      }), t.length > Js && t.pop(), o;
    };
  }
  var mr = el(function (t) {
    var r = t,
      n = nt(t);
    if (n) {
      if (!n.path) return t;
      r = n.path;
    }
    for (var i = Q.isAbsolute(r), o = [], s = 0, u = 0;;) if (s = u, u = r.indexOf("/", s), u === -1) {
      o.push(r.slice(s));
      break;
    } else for (o.push(r.slice(s, u)); u < r.length && r[u] === "/";) u++;
    for (var l, a = 0, u = o.length - 1; u >= 0; u--) l = o[u], l === "." ? o.splice(u, 1) : l === ".." ? a++ : a > 0 && (l === "" ? (o.splice(u + 1, a), a = 0) : (o.splice(u, 2), a--));
    return r = o.join("/"), r === "" && (r = i ? "/" : "."), n ? (n.path = r, qe(n)) : r;
  });
  Q.normalize = mr;
  function Co(e, t) {
    e === "" && (e = "."), t === "" && (t = ".");
    var r = nt(t),
      n = nt(e);
    if (n && (e = n.path || "/"), r && !r.scheme) return n && (r.scheme = n.scheme), qe(r);
    if (r || t.match(Zs)) return t;
    if (n && !n.host && !n.path) return n.host = t, qe(n);
    var i = t.charAt(0) === "/" ? t : mr(e.replace(/\/+$/, "") + "/" + t);
    return n ? (n.path = i, qe(n)) : i;
  }
  Q.join = Co;
  Q.isAbsolute = function (e) {
    return e.charAt(0) === "/" || So.test(e);
  };
  function tl(e, t) {
    e === "" && (e = "."), e = e.replace(/\/$/, "");
    for (var r = 0; t.indexOf(e + "/") !== 0;) {
      var n = e.lastIndexOf("/");
      if (n < 0 || (e = e.slice(0, n), e.match(/^([^\/]+:\/)?\/*$/))) return t;
      ++r;
    }
    return Array(r + 1).join("../") + t.substr(e.length + 1);
  }
  Q.relative = tl;
  var To = function () {
    var e = Object.create(null);
    return !("__proto__" in e);
  }();
  function Ao(e) {
    return e;
  }
  function rl(e) {
    return Eo(e) ? "$" + e : e;
  }
  Q.toSetString = To ? Ao : rl;
  function nl(e) {
    return Eo(e) ? e.slice(1) : e;
  }
  Q.fromSetString = To ? Ao : nl;
  function Eo(e) {
    if (!e) return !1;
    var t = e.length;
    if (t < 9 || e.charCodeAt(t - 1) !== 95 || e.charCodeAt(t - 2) !== 95 || e.charCodeAt(t - 3) !== 111 || e.charCodeAt(t - 4) !== 116 || e.charCodeAt(t - 5) !== 111 || e.charCodeAt(t - 6) !== 114 || e.charCodeAt(t - 7) !== 112 || e.charCodeAt(t - 8) !== 95 || e.charCodeAt(t - 9) !== 95) return !1;
    for (var r = t - 10; r >= 0; r--) if (e.charCodeAt(r) !== 36) return !1;
    return !0;
  }
  function il(e, t, r) {
    var n = ye(e.source, t.source);
    return n !== 0 || (n = e.originalLine - t.originalLine, n !== 0) || (n = e.originalColumn - t.originalColumn, n !== 0 || r) || (n = e.generatedColumn - t.generatedColumn, n !== 0) || (n = e.generatedLine - t.generatedLine, n !== 0) ? n : ye(e.name, t.name);
  }
  Q.compareByOriginalPositions = il;
  function ol(e, t, r) {
    var n;
    return n = e.originalLine - t.originalLine, n !== 0 || (n = e.originalColumn - t.originalColumn, n !== 0 || r) || (n = e.generatedColumn - t.generatedColumn, n !== 0) || (n = e.generatedLine - t.generatedLine, n !== 0) ? n : ye(e.name, t.name);
  }
  Q.compareByOriginalPositionsNoSource = ol;
  function al(e, t, r) {
    var n = e.generatedLine - t.generatedLine;
    return n !== 0 || (n = e.generatedColumn - t.generatedColumn, n !== 0 || r) || (n = ye(e.source, t.source), n !== 0) || (n = e.originalLine - t.originalLine, n !== 0) || (n = e.originalColumn - t.originalColumn, n !== 0) ? n : ye(e.name, t.name);
  }
  Q.compareByGeneratedPositionsDeflated = al;
  function sl(e, t, r) {
    var n = e.generatedColumn - t.generatedColumn;
    return n !== 0 || r || (n = ye(e.source, t.source), n !== 0) || (n = e.originalLine - t.originalLine, n !== 0) || (n = e.originalColumn - t.originalColumn, n !== 0) ? n : ye(e.name, t.name);
  }
  Q.compareByGeneratedPositionsDeflatedNoLine = sl;
  function ye(e, t) {
    return e === t ? 0 : e === null ? 1 : t === null ? -1 : e > t ? 1 : -1;
  }
  function ll(e, t) {
    var r = e.generatedLine - t.generatedLine;
    return r !== 0 || (r = e.generatedColumn - t.generatedColumn, r !== 0) || (r = ye(e.source, t.source), r !== 0) || (r = e.originalLine - t.originalLine, r !== 0) || (r = e.originalColumn - t.originalColumn, r !== 0) ? r : ye(e.name, t.name);
  }
  Q.compareByGeneratedPositionsInflated = ll;
  function cl(e) {
    return JSON.parse(e.replace(/^\)]}'[^\n]*\n/, ""));
  }
  Q.parseSourceMapInput = cl;
  function ul(e, t, r) {
    if (t = t || "", e && (e[e.length - 1] !== "/" && t[0] !== "/" && (e += "/"), t = e + t), r) {
      var n = nt(r);
      if (!n) throw new Error("sourceMapURL could not be parsed");
      if (n.path) {
        var i = n.path.lastIndexOf("/");
        i >= 0 && (n.path = n.path.substring(0, i + 1));
      }
      t = Co(qe(n), t);
    }
    return mr(t);
  }
  Q.computeSourceURL = ul;
});
var Po = Oe(Lo => {
  var fr = Lt(),
    dr = Object.prototype.hasOwnProperty,
    Pe = typeof Map < "u";
  function ke() {
    this._array = [], this._set = Pe ? new Map() : Object.create(null);
  }
  ke.fromArray = function (t, r) {
    for (var n = new ke(), i = 0, o = t.length; i < o; i++) n.add(t[i], r);
    return n;
  };
  ke.prototype.size = function () {
    return Pe ? this._set.size : Object.getOwnPropertyNames(this._set).length;
  };
  ke.prototype.add = function (t, r) {
    var n = Pe ? t : fr.toSetString(t),
      i = Pe ? this.has(t) : dr.call(this._set, n),
      o = this._array.length;
    (!i || r) && this._array.push(t), i || (Pe ? this._set.set(t, o) : this._set[n] = o);
  };
  ke.prototype.has = function (t) {
    if (Pe) return this._set.has(t);
    var r = fr.toSetString(t);
    return dr.call(this._set, r);
  };
  ke.prototype.indexOf = function (t) {
    if (Pe) {
      var r = this._set.get(t);
      if (r >= 0) return r;
    } else {
      var n = fr.toSetString(t);
      if (dr.call(this._set, n)) return this._set[n];
    }
    throw new Error('"' + t + '" is not in the set.');
  };
  ke.prototype.at = function (t) {
    if (t >= 0 && t < this._array.length) return this._array[t];
    throw new Error("No element indexed by " + t);
  };
  ke.prototype.toArray = function () {
    return this._array.slice();
  };
  Lo.ArraySet = ke;
});
var No = Oe(Do => {
  var Io = Lt();
  function pl(e, t) {
    var r = e.generatedLine,
      n = t.generatedLine,
      i = e.generatedColumn,
      o = t.generatedColumn;
    return n > r || n == r && o >= i || Io.compareByGeneratedPositionsInflated(e, t) <= 0;
  }
  function Pt() {
    this._array = [], this._sorted = !0, this._last = {
      generatedLine: -1,
      generatedColumn: 0
    };
  }
  Pt.prototype.unsortedForEach = function (t, r) {
    this._array.forEach(t, r);
  };
  Pt.prototype.add = function (t) {
    pl(this._last, t) ? (this._last = t, this._array.push(t)) : (this._sorted = !1, this._array.push(t));
  };
  Pt.prototype.toArray = function () {
    return this._sorted || (this._array.sort(Io.compareByGeneratedPositionsInflated), this._sorted = !0), this._array;
  };
  Do.MappingList = Pt;
});
var zo = Oe(Oo => {
  var it = vo(),
    H = Lt(),
    It = Po().ArraySet,
    hl = No().MappingList;
  function oe(e) {
    e || (e = {}), this._file = H.getArg(e, "file", null), this._sourceRoot = H.getArg(e, "sourceRoot", null), this._skipValidation = H.getArg(e, "skipValidation", !1), this._ignoreInvalidMapping = H.getArg(e, "ignoreInvalidMapping", !1), this._sources = new It(), this._names = new It(), this._mappings = new hl(), this._sourcesContents = null;
  }
  oe.prototype._version = 3;
  oe.fromSourceMap = function (t, r) {
    var n = t.sourceRoot,
      i = new oe(Object.assign(r || {}, {
        file: t.file,
        sourceRoot: n
      }));
    return t.eachMapping(function (o) {
      var s = {
        generated: {
          line: o.generatedLine,
          column: o.generatedColumn
        }
      };
      o.source != null && (s.source = o.source, n != null && (s.source = H.relative(n, s.source)), s.original = {
        line: o.originalLine,
        column: o.originalColumn
      }, o.name != null && (s.name = o.name)), i.addMapping(s);
    }), t.sources.forEach(function (o) {
      var s = o;
      n !== null && (s = H.relative(n, o)), i._sources.has(s) || i._sources.add(s);
      var u = t.sourceContentFor(o);
      u != null && i.setSourceContent(o, u);
    }), i;
  };
  oe.prototype.addMapping = function (t) {
    var r = H.getArg(t, "generated"),
      n = H.getArg(t, "original", null),
      i = H.getArg(t, "source", null),
      o = H.getArg(t, "name", null);
    !this._skipValidation && this._validateMapping(r, n, i, o) === !1 || (i != null && (i = String(i), this._sources.has(i) || this._sources.add(i)), o != null && (o = String(o), this._names.has(o) || this._names.add(o)), this._mappings.add({
      generatedLine: r.line,
      generatedColumn: r.column,
      originalLine: n != null && n.line,
      originalColumn: n != null && n.column,
      source: i,
      name: o
    }));
  };
  oe.prototype.setSourceContent = function (t, r) {
    var n = t;
    this._sourceRoot != null && (n = H.relative(this._sourceRoot, n)), r != null ? (this._sourcesContents || (this._sourcesContents = Object.create(null)), this._sourcesContents[H.toSetString(n)] = r) : this._sourcesContents && (delete this._sourcesContents[H.toSetString(n)], Object.keys(this._sourcesContents).length === 0 && (this._sourcesContents = null));
  };
  oe.prototype.applySourceMap = function (t, r, n) {
    var i = r;
    if (r == null) {
      if (t.file == null) throw new Error(`SourceMapGenerator.prototype.applySourceMap requires either an explicit source file, or the source map's "file" property. Both were omitted.`);
      i = t.file;
    }
    var o = this._sourceRoot;
    o != null && (i = H.relative(o, i));
    var s = new It(),
      u = new It();
    this._mappings.unsortedForEach(function (l) {
      if (l.source === i && l.originalLine != null) {
        var a = t.originalPositionFor({
          line: l.originalLine,
          column: l.originalColumn
        });
        a.source != null && (l.source = a.source, n != null && (l.source = H.join(n, l.source)), o != null && (l.source = H.relative(o, l.source)), l.originalLine = a.line, l.originalColumn = a.column, a.name != null && (l.name = a.name));
      }
      var c = l.source;
      c != null && !s.has(c) && s.add(c);
      var h = l.name;
      h != null && !u.has(h) && u.add(h);
    }, this), this._sources = s, this._names = u, t.sources.forEach(function (l) {
      var a = t.sourceContentFor(l);
      a != null && (n != null && (l = H.join(n, l)), o != null && (l = H.relative(o, l)), this.setSourceContent(l, a));
    }, this);
  };
  oe.prototype._validateMapping = function (t, r, n, i) {
    if (r && typeof r.line != "number" && typeof r.column != "number") {
      var o = "original.line and original.column are not numbers -- you probably meant to omit the original mapping entirely and only map the generated position. If so, pass null for the original mapping instead of an object with empty or null values.";
      if (this._ignoreInvalidMapping) return typeof console < "u" && console.warn && console.warn(o), !1;
      throw new Error(o);
    }
    if (!(t && "line" in t && "column" in t && t.line > 0 && t.column >= 0 && !r && !n && !i)) {
      if (t && "line" in t && "column" in t && r && "line" in r && "column" in r && t.line > 0 && t.column >= 0 && r.line > 0 && r.column >= 0 && n) return;
      var o = "Invalid mapping: " + JSON.stringify({
        generated: t,
        source: n,
        original: r,
        name: i
      });
      if (this._ignoreInvalidMapping) return typeof console < "u" && console.warn && console.warn(o), !1;
      throw new Error(o);
    }
  };
  oe.prototype._serializeMappings = function () {
    for (var t = 0, r = 1, n = 0, i = 0, o = 0, s = 0, u = "", l, a, c, h, m = this._mappings.toArray(), f = 0, S = m.length; f < S; f++) {
      if (a = m[f], l = "", a.generatedLine !== r) for (t = 0; a.generatedLine !== r;) l += ";", r++;else if (f > 0) {
        if (!H.compareByGeneratedPositionsInflated(a, m[f - 1])) continue;
        l += ",";
      }
      l += it.encode(a.generatedColumn - t), t = a.generatedColumn, a.source != null && (h = this._sources.indexOf(a.source), l += it.encode(h - s), s = h, l += it.encode(a.originalLine - 1 - i), i = a.originalLine - 1, l += it.encode(a.originalColumn - n), n = a.originalColumn, a.name != null && (c = this._names.indexOf(a.name), l += it.encode(c - o), o = c)), u += l;
    }
    return u;
  };
  oe.prototype._generateSourcesContent = function (t, r) {
    return t.map(function (n) {
      if (!this._sourcesContents) return null;
      r != null && (n = H.relative(r, n));
      var i = H.toSetString(n);
      return Object.prototype.hasOwnProperty.call(this._sourcesContents, i) ? this._sourcesContents[i] : null;
    }, this);
  };
  oe.prototype.toJSON = function () {
    var t = {
      version: this._version,
      sources: this._sources.toArray(),
      names: this._names.toArray(),
      mappings: this._serializeMappings()
    };
    return this._file != null && (t.file = this._file), this._sourceRoot != null && (t.sourceRoot = this._sourceRoot), this._sourcesContents && (t.sourcesContent = this._generateSourcesContent(t.sources, t.sourceRoot)), t;
  };
  oe.prototype.toString = function () {
    return JSON.stringify(this.toJSON());
  };
  Oo.SourceMapGenerator = oe;
});
var $e = exports.tokenTypes = {};
x($e, {
  AtKeyword: () => D,
  BadString: () => Ae,
  BadUrl: () => V,
  CDC: () => G,
  CDO: () => pe,
  Colon: () => O,
  Comma: () => M,
  Comment: () => L,
  Delim: () => y,
  Dimension: () => k,
  EOF: () => ne,
  Function: () => g,
  Hash: () => T,
  Ident: () => p,
  LeftCurlyBracket: () => P,
  LeftParenthesis: () => w,
  LeftSquareBracket: () => j,
  Number: () => b,
  Percentage: () => E,
  RightCurlyBracket: () => q,
  RightParenthesis: () => d,
  RightSquareBracket: () => K,
  Semicolon: () => R,
  String: () => U,
  Url: () => _,
  WhiteSpace: () => v
});
var ne = 0,
  p = 1,
  g = 2,
  D = 3,
  T = 4,
  U = 5,
  Ae = 6,
  _ = 7,
  V = 8,
  y = 9,
  b = 10,
  E = 11,
  k = 12,
  v = 13,
  pe = 14,
  G = 15,
  O = 16,
  R = 17,
  M = 18,
  j = 19,
  K = 20,
  w = 21,
  d = 22,
  P = 23,
  q = 24,
  L = 25;
function W(e) {
  return e >= 48 && e <= 57;
}
function te(e) {
  return W(e) || e >= 65 && e <= 70 || e >= 97 && e <= 102;
}
function kt(e) {
  return e >= 65 && e <= 90;
}
function Bs(e) {
  return e >= 97 && e <= 122;
}
function _s(e) {
  return kt(e) || Bs(e);
}
function js(e) {
  return e >= 128;
}
function yt(e) {
  return _s(e) || js(e) || e === 95;
}
function ze(e) {
  return yt(e) || W(e) || e === 45;
}
function qs(e) {
  return e >= 0 && e <= 8 || e === 11 || e >= 14 && e <= 31 || e === 127;
}
function Ze(e) {
  return e === 10 || e === 13 || e === 12;
}
function he(e) {
  return Ze(e) || e === 32 || e === 9;
}
function Z(e, t) {
  return !(e !== 92 || Ze(t) || t === 0);
}
function Fe(e, t, r) {
  return e === 45 ? yt(t) || t === 45 || Z(t, r) : yt(e) ? !0 : e === 92 ? Z(e, t) : !1;
}
function wt(e, t, r) {
  return e === 43 || e === 45 ? W(t) ? 2 : t === 46 && W(r) ? 3 : 0 : e === 46 ? W(t) ? 2 : 0 : W(e) ? 1 : 0;
}
function vt(e) {
  return e === 65279 || e === 65534 ? 1 : 0;
}
var rr = new Array(128),
  Us = 128,
  Je = 130,
  nr = 131,
  St = 132,
  ir = 133;
for (let e = 0; e < rr.length; e++) rr[e] = he(e) && Je || W(e) && nr || yt(e) && St || qs(e) && ir || e || Us;
function Ct(e) {
  return e < 128 ? rr[e] : St;
}
function Re(e, t) {
  return t < e.length ? e.charCodeAt(t) : 0;
}
function Tt(e, t, r) {
  return r === 13 && Re(e, t + 1) === 10 ? 2 : 1;
}
function be(e, t, r) {
  let n = e.charCodeAt(t);
  return kt(n) && (n = n | 32), n === r;
}
function xe(e, t, r, n) {
  if (r - t !== n.length || t < 0 || r > e.length) return !1;
  for (let i = t; i < r; i++) {
    let o = n.charCodeAt(i - t),
      s = e.charCodeAt(i);
    if (kt(s) && (s = s | 32), s !== o) return !1;
  }
  return !0;
}
function no(e, t) {
  for (; t >= 0 && he(e.charCodeAt(t)); t--);
  return t + 1;
}
function et(e, t) {
  for (; t < e.length && he(e.charCodeAt(t)); t++);
  return t;
}
function or(e, t) {
  for (; t < e.length && W(e.charCodeAt(t)); t++);
  return t;
}
function le(e, t) {
  if (t += 2, te(Re(e, t - 1))) {
    for (let n = Math.min(e.length, t + 5); t < n && te(Re(e, t)); t++);
    let r = Re(e, t);
    he(r) && (t += Tt(e, t, r));
  }
  return t;
}
function tt(e, t) {
  for (; t < e.length; t++) {
    let r = e.charCodeAt(t);
    if (!ze(r)) {
      if (Z(r, Re(e, t + 1))) {
        t = le(e, t) - 1;
        continue;
      }
      break;
    }
  }
  return t;
}
function Ee(e, t) {
  let r = e.charCodeAt(t);
  if ((r === 43 || r === 45) && (r = e.charCodeAt(t += 1)), W(r) && (t = or(e, t + 1), r = e.charCodeAt(t)), r === 46 && W(e.charCodeAt(t + 1)) && (t += 2, t = or(e, t)), be(e, t, 101)) {
    let n = 0;
    r = e.charCodeAt(t + 1), (r === 45 || r === 43) && (n = 1, r = e.charCodeAt(t + 2)), W(r) && (t = or(e, t + 1 + n + 1));
  }
  return t;
}
function At(e, t) {
  for (; t < e.length; t++) {
    let r = e.charCodeAt(t);
    if (r === 41) {
      t++;
      break;
    }
    Z(r, Re(e, t + 1)) && (t = le(e, t));
  }
  return t;
}
function Me(e) {
  if (e.length === 1 && !te(e.charCodeAt(0))) return e[0];
  let t = parseInt(e, 16);
  return (t === 0 || t >= 55296 && t <= 57343 || t > 1114111) && (t = 65533), String.fromCodePoint(t);
}
var Be = exports.tokenNames = ["EOF-token", "ident-token", "function-token", "at-keyword-token", "hash-token", "string-token", "bad-string-token", "url-token", "bad-url-token", "delim-token", "number-token", "percentage-token", "dimension-token", "whitespace-token", "CDO-token", "CDC-token", "colon-token", "semicolon-token", "comma-token", "[-token", "]-token", "(-token", ")-token", "{-token", "}-token", "comment-token"];
function _e(e = null, t) {
  return e === null || e.length < t ? new Uint32Array(Math.max(t + 1024, 16384)) : e;
}
var io = 10,
  Ws = 12,
  oo = 13;
function ao(e) {
  let t = e.source,
    r = t.length,
    n = t.length > 0 ? vt(t.charCodeAt(0)) : 0,
    i = _e(e.lines, r),
    o = _e(e.columns, r),
    s = e.startLine,
    u = e.startColumn;
  for (let l = n; l < r; l++) {
    let a = t.charCodeAt(l);
    i[l] = s, o[l] = u++, (a === io || a === oo || a === Ws) && (a === oo && l + 1 < r && t.charCodeAt(l + 1) === io && (l++, i[l] = s, o[l] = u), s++, u = 1);
  }
  i[r] = s, o[r] = u, e.lines = i, e.columns = o, e.computed = !0;
}
var Et = class {
  constructor() {
    this.lines = null, this.columns = null, this.computed = !1;
  }
  setSource(t, r = 0, n = 1, i = 1) {
    this.source = t, this.startOffset = r, this.startLine = n, this.startColumn = i, this.computed = !1;
  }
  getLocation(t, r) {
    return this.computed || ao(this), {
      source: r,
      offset: this.startOffset + t,
      line: this.lines[t],
      column: this.columns[t]
    };
  }
  getLocationRange(t, r, n) {
    return this.computed || ao(this), {
      source: n,
      start: {
        offset: this.startOffset + t,
        line: this.lines[t],
        column: this.columns[t]
      },
      end: {
        offset: this.startOffset + r,
        line: this.lines[r],
        column: this.columns[r]
      }
    };
  }
};
var ie = 16777215,
  me = 24,
  Hs = new Map([[2, 22], [21, 22], [19, 20], [23, 24]]),
  rt = class {
    constructor(t, r) {
      this.setSource(t, r);
    }
    reset() {
      this.eof = !1, this.tokenIndex = -1, this.tokenType = 0, this.tokenStart = this.firstCharOffset, this.tokenEnd = this.firstCharOffset;
    }
    setSource(t = "", r = () => {}) {
      t = String(t || "");
      let n = t.length,
        i = _e(this.offsetAndType, t.length + 1),
        o = _e(this.balance, t.length + 1),
        s = 0,
        u = 0,
        l = 0,
        a = -1;
      for (this.offsetAndType = null, this.balance = null, r(t, (c, h, m) => {
        switch (c) {
          default:
            o[s] = n;
            break;
          case u:
            {
              let f = l & ie;
              for (l = o[f], u = l >> me, o[s] = f, o[f++] = s; f < s; f++) o[f] === n && (o[f] = s);
              break;
            }
          case 21:
          case 2:
          case 19:
          case 23:
            o[s] = l, u = Hs.get(c), l = u << me | s;
            break;
        }
        i[s++] = c << me | m, a === -1 && (a = h);
      }), i[s] = 0 << me | n, o[s] = n, o[n] = n; l !== 0;) {
        let c = l & ie;
        l = o[c], o[c] = n;
      }
      this.source = t, this.firstCharOffset = a === -1 ? 0 : a, this.tokenCount = s, this.offsetAndType = i, this.balance = o, this.reset(), this.next();
    }
    lookupType(t) {
      return t += this.tokenIndex, t < this.tokenCount ? this.offsetAndType[t] >> me : 0;
    }
    lookupTypeNonSC(t) {
      for (let r = this.tokenIndex; r < this.tokenCount; r++) {
        let n = this.offsetAndType[r] >> me;
        if (n !== 13 && n !== 25 && t-- === 0) return n;
      }
      return 0;
    }
    lookupOffset(t) {
      return t += this.tokenIndex, t < this.tokenCount ? this.offsetAndType[t - 1] & ie : this.source.length;
    }
    lookupOffsetNonSC(t) {
      for (let r = this.tokenIndex; r < this.tokenCount; r++) {
        let n = this.offsetAndType[r] >> me;
        if (n !== 13 && n !== 25 && t-- === 0) return r - this.tokenIndex;
      }
      return 0;
    }
    lookupValue(t, r) {
      return t += this.tokenIndex, t < this.tokenCount ? xe(this.source, this.offsetAndType[t - 1] & ie, this.offsetAndType[t] & ie, r) : !1;
    }
    getTokenStart(t) {
      return t === this.tokenIndex ? this.tokenStart : t > 0 ? t < this.tokenCount ? this.offsetAndType[t - 1] & ie : this.offsetAndType[this.tokenCount] & ie : this.firstCharOffset;
    }
    substrToCursor(t) {
      return this.source.substring(t, this.tokenStart);
    }
    isBalanceEdge(t) {
      return this.balance[this.tokenIndex] < t;
    }
    isDelim(t, r) {
      return r ? this.lookupType(r) === 9 && this.source.charCodeAt(this.lookupOffset(r)) === t : this.tokenType === 9 && this.source.charCodeAt(this.tokenStart) === t;
    }
    skip(t) {
      let r = this.tokenIndex + t;
      r < this.tokenCount ? (this.tokenIndex = r, this.tokenStart = this.offsetAndType[r - 1] & ie, r = this.offsetAndType[r], this.tokenType = r >> me, this.tokenEnd = r & ie) : (this.tokenIndex = this.tokenCount, this.next());
    }
    next() {
      let t = this.tokenIndex + 1;
      t < this.tokenCount ? (this.tokenIndex = t, this.tokenStart = this.tokenEnd, t = this.offsetAndType[t], this.tokenType = t >> me, this.tokenEnd = t & ie) : (this.eof = !0, this.tokenIndex = this.tokenCount, this.tokenType = 0, this.tokenStart = this.tokenEnd = this.source.length);
    }
    skipSC() {
      for (; this.tokenType === 13 || this.tokenType === 25;) this.next();
    }
    skipUntilBalanced(t, r) {
      let n = t,
        i,
        o;
      e: for (; n < this.tokenCount; n++) {
        if (i = this.balance[n], i < t) break e;
        switch (o = n > 0 ? this.offsetAndType[n - 1] & ie : this.firstCharOffset, r(this.source.charCodeAt(o))) {
          case 1:
            break e;
          case 2:
            n++;
            break e;
          default:
            this.balance[i] === n && (n = i);
        }
      }
      this.skip(n - this.tokenIndex);
    }
    forEachToken(t) {
      for (let r = 0, n = this.firstCharOffset; r < this.tokenCount; r++) {
        let i = n,
          o = this.offsetAndType[r],
          s = o & ie,
          u = o >> me;
        n = s, t(u, i, s, r);
      }
    }
    dump() {
      let t = new Array(this.tokenCount);
      return this.forEachToken((r, n, i, o) => {
        t[o] = {
          idx: o,
          type: Be[r],
          chunk: this.source.substring(n, i),
          balance: this.balance[o]
        };
      }), t;
    }
  };
exports.TokenStream = rt;
function Se(e, t) {
  function r(h) {
    return h < u ? e.charCodeAt(h) : 0;
  }
  function n() {
    if (a = Ee(e, a), Fe(r(a), r(a + 1), r(a + 2))) {
      c = 12, a = tt(e, a);
      return;
    }
    if (r(a) === 37) {
      c = 11, a++;
      return;
    }
    c = 10;
  }
  function i() {
    let h = a;
    if (a = tt(e, a), xe(e, h, a, "url") && r(a) === 40) {
      if (a = et(e, a + 1), r(a) === 34 || r(a) === 39) {
        c = 2, a = h + 4;
        return;
      }
      s();
      return;
    }
    if (r(a) === 40) {
      c = 2, a++;
      return;
    }
    c = 1;
  }
  function o(h) {
    for (h || (h = r(a++)), c = 5; a < e.length; a++) {
      let m = e.charCodeAt(a);
      switch (Ct(m)) {
        case h:
          a++;
          return;
        case Je:
          if (Ze(m)) {
            a += Tt(e, a, m), c = 6;
            return;
          }
          break;
        case 92:
          if (a === e.length - 1) break;
          let f = r(a + 1);
          Ze(f) ? a += Tt(e, a + 1, f) : Z(m, f) && (a = le(e, a) - 1);
          break;
      }
    }
  }
  function s() {
    for (c = 7, a = et(e, a); a < e.length; a++) {
      let h = e.charCodeAt(a);
      switch (Ct(h)) {
        case 41:
          a++;
          return;
        case Je:
          if (a = et(e, a), r(a) === 41 || a >= e.length) {
            a < e.length && a++;
            return;
          }
          a = At(e, a), c = 8;
          return;
        case 34:
        case 39:
        case 40:
        case ir:
          a = At(e, a), c = 8;
          return;
        case 92:
          if (Z(h, r(a + 1))) {
            a = le(e, a) - 1;
            break;
          }
          a = At(e, a), c = 8;
          return;
      }
    }
  }
  e = String(e || "");
  let u = e.length,
    l = vt(r(0)),
    a = l,
    c;
  for (; a < u;) {
    let h = e.charCodeAt(a);
    switch (Ct(h)) {
      case Je:
        c = 13, a = et(e, a + 1);
        break;
      case 34:
        o();
        break;
      case 35:
        ze(r(a + 1)) || Z(r(a + 1), r(a + 2)) ? (c = 4, a = tt(e, a + 1)) : (c = 9, a++);
        break;
      case 39:
        o();
        break;
      case 40:
        c = 21, a++;
        break;
      case 41:
        c = 22, a++;
        break;
      case 43:
        wt(h, r(a + 1), r(a + 2)) ? n() : (c = 9, a++);
        break;
      case 44:
        c = 18, a++;
        break;
      case 45:
        wt(h, r(a + 1), r(a + 2)) ? n() : r(a + 1) === 45 && r(a + 2) === 62 ? (c = 15, a = a + 3) : Fe(h, r(a + 1), r(a + 2)) ? i() : (c = 9, a++);
        break;
      case 46:
        wt(h, r(a + 1), r(a + 2)) ? n() : (c = 9, a++);
        break;
      case 47:
        r(a + 1) === 42 ? (c = 25, a = e.indexOf("*/", a + 2), a = a === -1 ? e.length : a + 2) : (c = 9, a++);
        break;
      case 58:
        c = 16, a++;
        break;
      case 59:
        c = 17, a++;
        break;
      case 60:
        r(a + 1) === 33 && r(a + 2) === 45 && r(a + 3) === 45 ? (c = 14, a = a + 4) : (c = 9, a++);
        break;
      case 64:
        Fe(r(a + 1), r(a + 2), r(a + 3)) ? (c = 3, a = tt(e, a + 1)) : (c = 9, a++);
        break;
      case 91:
        c = 19, a++;
        break;
      case 92:
        Z(h, r(a + 1)) ? i() : (c = 9, a++);
        break;
      case 93:
        c = 20, a++;
        break;
      case 123:
        c = 23, a++;
        break;
      case 125:
        c = 24, a++;
        break;
      case nr:
        n();
        break;
      case St:
        i();
        break;
      default:
        c = 9, a++;
    }
    t(c, l, l = a);
  }
}
var je = null,
  N = class {
    static createItem(t) {
      return {
        prev: null,
        next: null,
        data: t
      };
    }
    constructor() {
      this.head = null, this.tail = null, this.cursor = null;
    }
    createItem(t) {
      return N.createItem(t);
    }
    allocateCursor(t, r) {
      let n;
      return je !== null ? (n = je, je = je.cursor, n.prev = t, n.next = r, n.cursor = this.cursor) : n = {
        prev: t,
        next: r,
        cursor: this.cursor
      }, this.cursor = n, n;
    }
    releaseCursor() {
      let {
        cursor: t
      } = this;
      this.cursor = t.cursor, t.prev = null, t.next = null, t.cursor = je, je = t;
    }
    updateCursors(t, r, n, i) {
      let {
        cursor: o
      } = this;
      for (; o !== null;) o.prev === t && (o.prev = r), o.next === n && (o.next = i), o = o.cursor;
    }
    *[Symbol.iterator]() {
      for (let t = this.head; t !== null; t = t.next) yield t.data;
    }
    get size() {
      let t = 0;
      for (let r = this.head; r !== null; r = r.next) t++;
      return t;
    }
    get isEmpty() {
      return this.head === null;
    }
    get first() {
      return this.head && this.head.data;
    }
    get last() {
      return this.tail && this.tail.data;
    }
    fromArray(t) {
      let r = null;
      this.head = null;
      for (let n of t) {
        let i = N.createItem(n);
        r !== null ? r.next = i : this.head = i, i.prev = r, r = i;
      }
      return this.tail = r, this;
    }
    toArray() {
      return [...this];
    }
    toJSON() {
      return [...this];
    }
    forEach(t, r = this) {
      let n = this.allocateCursor(null, this.head);
      for (; n.next !== null;) {
        let i = n.next;
        n.next = i.next, t.call(r, i.data, i, this);
      }
      this.releaseCursor();
    }
    forEachRight(t, r = this) {
      let n = this.allocateCursor(this.tail, null);
      for (; n.prev !== null;) {
        let i = n.prev;
        n.prev = i.prev, t.call(r, i.data, i, this);
      }
      this.releaseCursor();
    }
    reduce(t, r, n = this) {
      let i = this.allocateCursor(null, this.head),
        o = r,
        s;
      for (; i.next !== null;) s = i.next, i.next = s.next, o = t.call(n, o, s.data, s, this);
      return this.releaseCursor(), o;
    }
    reduceRight(t, r, n = this) {
      let i = this.allocateCursor(this.tail, null),
        o = r,
        s;
      for (; i.prev !== null;) s = i.prev, i.prev = s.prev, o = t.call(n, o, s.data, s, this);
      return this.releaseCursor(), o;
    }
    some(t, r = this) {
      for (let n = this.head; n !== null; n = n.next) if (t.call(r, n.data, n, this)) return !0;
      return !1;
    }
    map(t, r = this) {
      let n = new N();
      for (let i = this.head; i !== null; i = i.next) n.appendData(t.call(r, i.data, i, this));
      return n;
    }
    filter(t, r = this) {
      let n = new N();
      for (let i = this.head; i !== null; i = i.next) t.call(r, i.data, i, this) && n.appendData(i.data);
      return n;
    }
    nextUntil(t, r, n = this) {
      if (t === null) return;
      let i = this.allocateCursor(null, t);
      for (; i.next !== null;) {
        let o = i.next;
        if (i.next = o.next, r.call(n, o.data, o, this)) break;
      }
      this.releaseCursor();
    }
    prevUntil(t, r, n = this) {
      if (t === null) return;
      let i = this.allocateCursor(t, null);
      for (; i.prev !== null;) {
        let o = i.prev;
        if (i.prev = o.prev, r.call(n, o.data, o, this)) break;
      }
      this.releaseCursor();
    }
    clear() {
      this.head = null, this.tail = null;
    }
    copy() {
      let t = new N();
      for (let r of this) t.appendData(r);
      return t;
    }
    prepend(t) {
      return this.updateCursors(null, t, this.head, t), this.head !== null ? (this.head.prev = t, t.next = this.head) : this.tail = t, this.head = t, this;
    }
    prependData(t) {
      return this.prepend(N.createItem(t));
    }
    append(t) {
      return this.insert(t);
    }
    appendData(t) {
      return this.insert(N.createItem(t));
    }
    insert(t, r = null) {
      if (r !== null) {
        if (this.updateCursors(r.prev, t, r, t), r.prev === null) {
          if (this.head !== r) throw new Error("before doesn't belong to list");
          this.head = t, r.prev = t, t.next = r, this.updateCursors(null, t);
        } else r.prev.next = t, t.prev = r.prev, r.prev = t, t.next = r;
      } else this.updateCursors(this.tail, t, null, t), this.tail !== null ? (this.tail.next = t, t.prev = this.tail) : this.head = t, this.tail = t;
      return this;
    }
    insertData(t, r) {
      return this.insert(N.createItem(t), r);
    }
    remove(t) {
      if (this.updateCursors(t, t.prev, t, t.next), t.prev !== null) t.prev.next = t.next;else {
        if (this.head !== t) throw new Error("item doesn't belong to list");
        this.head = t.next;
      }
      if (t.next !== null) t.next.prev = t.prev;else {
        if (this.tail !== t) throw new Error("item doesn't belong to list");
        this.tail = t.prev;
      }
      return t.prev = null, t.next = null, t;
    }
    push(t) {
      this.insert(N.createItem(t));
    }
    pop() {
      return this.tail !== null ? this.remove(this.tail) : null;
    }
    unshift(t) {
      this.prepend(N.createItem(t));
    }
    shift() {
      return this.head !== null ? this.remove(this.head) : null;
    }
    prependList(t) {
      return this.insertList(t, this.head);
    }
    appendList(t) {
      return this.insertList(t);
    }
    insertList(t, r) {
      return t.head === null ? this : (r != null ? (this.updateCursors(r.prev, t.tail, r, t.head), r.prev !== null ? (r.prev.next = t.head, t.head.prev = r.prev) : this.head = t.head, r.prev = t.tail, t.tail.next = r) : (this.updateCursors(this.tail, t.tail, null, t.head), this.tail !== null ? (this.tail.next = t.head, t.head.prev = this.tail) : this.head = t.head, this.tail = t.tail), t.head = null, t.tail = null, this);
    }
    replace(t, r) {
      "head" in r ? this.insertList(r, t) : this.insert(r, t), this.remove(t);
    }
  };
exports.List = N;
function Le(e, t) {
  let r = Object.create(SyntaxError.prototype),
    n = new Error();
  return Object.assign(r, {
    name: e,
    message: t,
    get stack() {
      return (n.stack || "").replace(/^(.+\n){1,3}/, `${e}: ${t}
`);
    }
  });
}
var ar = 100,
  so = 60,
  lo = "    ";
function co({
  source: e,
  line: t,
  column: r,
  baseLine: n,
  baseColumn: i
}, o) {
  function s(S, ee) {
    return a.slice(S, ee).map((Y, C) => String(S + C + 1).padStart(m) + " |" + Y).join(`
`);
  }
  let u = `
`.repeat(Math.max(n - 1, 0)),
    l = " ".repeat(Math.max(i - 1, 0)),
    a = (u + l + e).split(/\r\n?|\n|\f/),
    c = Math.max(1, t - o) - 1,
    h = Math.min(t + o, a.length + 1),
    m = Math.max(4, String(h).length) + 1,
    f = 0;
  r += (lo.length - 1) * (a[t - 1].substr(0, r - 1).match(/\t/g) || []).length, r > ar && (f = r - so + 3, r = so - 2);
  for (let S = c; S <= h; S++) S >= 0 && S < a.length && (a[S] = a[S].replace(/\t/g, lo), a[S] = (f > 0 && a[S].length > f ? "\u2026" : "") + a[S].substr(f, ar - 2) + (a[S].length > f + ar - 1 ? "\u2026" : ""));
  return [s(c, t), new Array(r + m + 2).join("-") + "^", s(t, h)].filter(Boolean).join(`
`).replace(/^(\s+\d+\s+\|\n)+/, "").replace(/\n(\s+\d+\s+\|)+$/, "");
}
function sr(e, t, r, n, i, o = 1, s = 1) {
  return Object.assign(Le("SyntaxError", e), {
    source: t,
    offset: r,
    line: n,
    column: i,
    sourceFragment(l) {
      return co({
        source: t,
        line: n,
        column: i,
        baseLine: o,
        baseColumn: s
      }, isNaN(l) ? 0 : l);
    },
    get formattedMessage() {
      return `Parse error: ${e}
` + co({
        source: t,
        line: n,
        column: i,
        baseLine: o,
        baseColumn: s
      }, 2);
    }
  });
}
function uo(e) {
  let t = this.createList(),
    r = !1,
    n = {
      recognizer: e
    };
  for (; !this.eof;) {
    switch (this.tokenType) {
      case 25:
        this.next();
        continue;
      case 13:
        r = !0, this.next();
        continue;
    }
    let i = e.getNode.call(this, n);
    if (i === void 0) break;
    r && (e.onWhiteSpace && e.onWhiteSpace.call(this, i, t, n), r = !1), t.push(i);
  }
  return r && e.onWhiteSpace && e.onWhiteSpace.call(this, null, t, n), t;
}
var po = () => {},
  Gs = 33,
  Ys = 35,
  lr = 59,
  ho = 123,
  mo = 0;
function Vs(e) {
  return function () {
    return this[e]();
  };
}
function cr(e) {
  let t = Object.create(null);
  for (let r of Object.keys(e)) {
    let n = e[r],
      i = n.parse || n;
    i && (t[r] = i);
  }
  return t;
}
function Ks(e) {
  let t = {
    context: Object.create(null),
    features: Object.assign(Object.create(null), e.features),
    scope: Object.assign(Object.create(null), e.scope),
    atrule: cr(e.atrule),
    pseudo: cr(e.pseudo),
    node: cr(e.node)
  };
  for (let [r, n] of Object.entries(e.parseContext)) switch (typeof n) {
    case "function":
      t.context[r] = n;
      break;
    case "string":
      t.context[r] = Vs(n);
      break;
  }
  return {
    config: t,
    ...t,
    ...t.node
  };
}
function fo(e) {
  let t = "",
    r = "<unknown>",
    n = !1,
    i = po,
    o = !1,
    s = new Et(),
    u = Object.assign(new rt(), Ks(e || {}), {
      parseAtrulePrelude: !0,
      parseRulePrelude: !0,
      parseValue: !0,
      parseCustomProperty: !1,
      readSequence: uo,
      consumeUntilBalanceEnd: () => 0,
      consumeUntilLeftCurlyBracket(a) {
        return a === ho ? 1 : 0;
      },
      consumeUntilLeftCurlyBracketOrSemicolon(a) {
        return a === ho || a === lr ? 1 : 0;
      },
      consumeUntilExclamationMarkOrSemicolon(a) {
        return a === Gs || a === lr ? 1 : 0;
      },
      consumeUntilSemicolonIncluded(a) {
        return a === lr ? 2 : 0;
      },
      createList() {
        return new N();
      },
      createSingleNodeList(a) {
        return new N().appendData(a);
      },
      getFirstListNode(a) {
        return a && a.first;
      },
      getLastListNode(a) {
        return a && a.last;
      },
      parseWithFallback(a, c) {
        let h = this.tokenIndex;
        try {
          return a.call(this);
        } catch (m) {
          if (o) throw m;
          this.skip(h - this.tokenIndex);
          let f = c.call(this);
          return o = !0, i(m, f), o = !1, f;
        }
      },
      lookupNonWSType(a) {
        let c;
        do if (c = this.lookupType(a++), c !== 13 && c !== 25) return c; while (c !== mo);
        return mo;
      },
      charCodeAt(a) {
        return a >= 0 && a < t.length ? t.charCodeAt(a) : 0;
      },
      substring(a, c) {
        return t.substring(a, c);
      },
      substrToCursor(a) {
        return this.source.substring(a, this.tokenStart);
      },
      cmpChar(a, c) {
        return be(t, a, c);
      },
      cmpStr(a, c, h) {
        return xe(t, a, c, h);
      },
      consume(a) {
        let c = this.tokenStart;
        return this.eat(a), this.substrToCursor(c);
      },
      consumeFunctionName() {
        let a = t.substring(this.tokenStart, this.tokenEnd - 1);
        return this.eat(2), a;
      },
      consumeNumber(a) {
        let c = t.substring(this.tokenStart, Ee(t, this.tokenStart));
        return this.eat(a), c;
      },
      eat(a) {
        if (this.tokenType !== a) {
          let c = Be[a].slice(0, -6).replace(/-/g, " ").replace(/^./, f => f.toUpperCase()),
            h = `${/[[\](){}]/.test(c) ? `"${c}"` : c} is expected`,
            m = this.tokenStart;
          switch (a) {
            case 1:
              this.tokenType === 2 || this.tokenType === 7 ? (m = this.tokenEnd - 1, h = "Identifier is expected but function found") : h = "Identifier is expected";
              break;
            case 4:
              this.isDelim(Ys) && (this.next(), m++, h = "Name is expected");
              break;
            case 11:
              this.tokenType === 10 && (m = this.tokenEnd, h = "Percent sign is expected");
              break;
          }
          this.error(h, m);
        }
        this.next();
      },
      eatIdent(a) {
        (this.tokenType !== 1 || this.lookupValue(0, a) === !1) && this.error(`Identifier "${a}" is expected`), this.next();
      },
      eatDelim(a) {
        this.isDelim(a) || this.error(`Delim "${String.fromCharCode(a)}" is expected`), this.next();
      },
      getLocation(a, c) {
        return n ? s.getLocationRange(a, c, r) : null;
      },
      getLocationFromList(a) {
        if (n) {
          let c = this.getFirstListNode(a),
            h = this.getLastListNode(a);
          return s.getLocationRange(c !== null ? c.loc.start.offset - s.startOffset : this.tokenStart, h !== null ? h.loc.end.offset - s.startOffset : this.tokenStart, r);
        }
        return null;
      },
      error(a, c) {
        let h = typeof c < "u" && c < t.length ? s.getLocation(c) : this.eof ? s.getLocation(no(t, t.length - 1)) : s.getLocation(this.tokenStart);
        throw new sr(a || "Unexpected input", t, h.offset, h.line, h.column, s.startLine, s.startColumn);
      }
    });
  return Object.assign(function (a, c) {
    t = a, c = c || {}, u.setSource(t, Se), s.setSource(t, c.offset, c.line, c.column), r = c.filename || "<unknown>", n = Boolean(c.positions), i = typeof c.onParseError == "function" ? c.onParseError : po, o = !1, u.parseAtrulePrelude = "parseAtrulePrelude" in c ? Boolean(c.parseAtrulePrelude) : !0, u.parseRulePrelude = "parseRulePrelude" in c ? Boolean(c.parseRulePrelude) : !0, u.parseValue = "parseValue" in c ? Boolean(c.parseValue) : !0, u.parseCustomProperty = "parseCustomProperty" in c ? Boolean(c.parseCustomProperty) : !1;
    let {
      context: h = "default",
      onComment: m
    } = c;
    if (!(h in u.context)) throw new Error("Unknown context `" + h + "`");
    typeof m == "function" && u.forEachToken((S, ee, Y) => {
      if (S === 25) {
        let C = u.getLocation(ee, Y),
          B = xe(t, Y - 2, Y, "*/") ? t.slice(ee + 2, Y - 2) : t.slice(ee + 2, Y);
        m(B, C);
      }
    });
    let f = u.context[h].call(u, c);
    return u.eof || u.error(), f;
  }, {
    SyntaxError: sr,
    config: u.config
  });
}
var Ro = Ms(zo(), 1),
  Fo = new Set(["Atrule", "Selector", "Declaration"]);
function Mo(e) {
  let t = new Ro.SourceMapGenerator(),
    r = {
      line: 1,
      column: 0
    },
    n = {
      line: 0,
      column: 0
    },
    i = {
      line: 1,
      column: 0
    },
    o = {
      generated: i
    },
    s = 1,
    u = 0,
    l = !1,
    a = e.node;
  e.node = function (m) {
    if (m.loc && m.loc.start && Fo.has(m.type)) {
      let f = m.loc.start.line,
        S = m.loc.start.column - 1;
      (n.line !== f || n.column !== S) && (n.line = f, n.column = S, r.line = s, r.column = u, l && (l = !1, (r.line !== i.line || r.column !== i.column) && t.addMapping(o)), l = !0, t.addMapping({
        source: m.loc.source,
        original: n,
        generated: r
      }));
    }
    a.call(this, m), l && Fo.has(m.type) && (i.line = s, i.column = u);
  };
  let c = e.emit;
  e.emit = function (m, f, S) {
    for (let ee = 0; ee < m.length; ee++) m.charCodeAt(ee) === 10 ? (s++, u = 0) : u++;
    c(m, f, S);
  };
  let h = e.result;
  return e.result = function () {
    return l && t.addMapping(o), {
      css: h(),
      map: t
    };
  }, e;
}
var Dt = {};
x(Dt, {
  safe: () => br,
  spec: () => gl
});
var ml = 43,
  fl = 45,
  gr = (e, t) => {
    if (e === 9 && (e = t), typeof e == "string") {
      let r = e.charCodeAt(0);
      return r > 127 ? 32768 : r << 8;
    }
    return e;
  },
  Bo = [[1, 1], [1, 2], [1, 7], [1, 8], [1, "-"], [1, 10], [1, 11], [1, 12], [1, 15], [1, 21], [3, 1], [3, 2], [3, 7], [3, 8], [3, "-"], [3, 10], [3, 11], [3, 12], [3, 15], [4, 1], [4, 2], [4, 7], [4, 8], [4, "-"], [4, 10], [4, 11], [4, 12], [4, 15], [12, 1], [12, 2], [12, 7], [12, 8], [12, "-"], [12, 10], [12, 11], [12, 12], [12, 15], ["#", 1], ["#", 2], ["#", 7], ["#", 8], ["#", "-"], ["#", 10], ["#", 11], ["#", 12], ["#", 15], ["-", 1], ["-", 2], ["-", 7], ["-", 8], ["-", "-"], ["-", 10], ["-", 11], ["-", 12], ["-", 15], [10, 1], [10, 2], [10, 7], [10, 8], [10, 10], [10, 11], [10, 12], [10, "%"], [10, 15], ["@", 1], ["@", 2], ["@", 7], ["@", 8], ["@", "-"], ["@", 15], [".", 10], [".", 11], [".", 12], ["+", 10], ["+", 11], ["+", 12], ["/", "*"]],
  dl = Bo.concat([[1, 4], [12, 4], [4, 4], [3, 21], [3, 5], [3, 16], [11, 11], [11, 12], [11, 2], [11, "-"], [22, 1], [22, 2], [22, 11], [22, 12], [22, 4], [22, "-"]]);
function _o(e) {
  let t = new Set(e.map(([r, n]) => gr(r) << 16 | gr(n)));
  return function (r, n, i) {
    let o = gr(n, i),
      s = i.charCodeAt(0);
    return (s === fl && n !== 1 && n !== 2 && n !== 15 || s === ml ? t.has(r << 16 | s << 8) : t.has(r << 16 | o)) && this.emit(" ", 13, !0), o;
  };
}
var gl = _o(Bo),
  br = _o(dl);
var bl = 92;
function xl(e, t) {
  if (typeof t == "function") {
    let r = null;
    e.children.forEach(n => {
      r !== null && t.call(this, r), this.node(n), r = n;
    });
    return;
  }
  e.children.forEach(this.node, this);
}
function yl(e) {
  Se(e, (t, r, n) => {
    this.token(t, e.slice(r, n));
  });
}
function jo(e) {
  let t = new Map();
  for (let [r, n] of Object.entries(e.node)) typeof (n.generate || n) == "function" && t.set(r, n.generate || n);
  return function (r, n) {
    let i = "",
      o = 0,
      s = {
        node(l) {
          if (t.has(l.type)) t.get(l.type).call(u, l);else throw new Error("Unknown node type: " + l.type);
        },
        tokenBefore: br,
        token(l, a) {
          o = this.tokenBefore(o, l, a), this.emit(a, l, !1), l === 9 && a.charCodeAt(0) === bl && this.emit(`
`, 13, !0);
        },
        emit(l) {
          i += l;
        },
        result() {
          return i;
        }
      };
    n && (typeof n.decorator == "function" && (s = n.decorator(s)), n.sourceMap && (s = Mo(s)), n.mode in Dt && (s.tokenBefore = Dt[n.mode]));
    let u = {
      node: l => s.node(l),
      children: xl,
      token: (l, a) => s.token(l, a),
      tokenize: yl
    };
    return s.node(r), s.result();
  };
}
function qo(e) {
  return {
    fromPlainObject(t) {
      return e(t, {
        enter(r) {
          r.children && !(r.children instanceof N) && (r.children = new N().fromArray(r.children));
        }
      }), t;
    },
    toPlainObject(t) {
      return e(t, {
        leave(r) {
          r.children && r.children instanceof N && (r.children = r.children.toArray());
        }
      }), t;
    }
  };
}
var {
    hasOwnProperty: xr
  } = Object.prototype,
  ot = function () {};
function Uo(e) {
  return typeof e == "function" ? e : ot;
}
function Wo(e, t) {
  return function (r, n, i) {
    r.type === t && e.call(this, r, n, i);
  };
}
function kl(e, t) {
  let r = t.structure,
    n = [];
  for (let i in r) {
    if (xr.call(r, i) === !1) continue;
    let o = r[i],
      s = {
        name: i,
        type: !1,
        nullable: !1
      };
    Array.isArray(o) || (o = [o]);
    for (let u of o) u === null ? s.nullable = !0 : typeof u == "string" ? s.type = "node" : Array.isArray(u) && (s.type = "list");
    s.type && n.push(s);
  }
  return n.length ? {
    context: t.walkContext,
    fields: n
  } : null;
}
function wl(e) {
  let t = {};
  for (let r in e.node) if (xr.call(e.node, r)) {
    let n = e.node[r];
    if (!n.structure) throw new Error("Missed `structure` field in `" + r + "` node type definition");
    t[r] = kl(r, n);
  }
  return t;
}
function Ho(e, t) {
  let r = e.fields.slice(),
    n = e.context,
    i = typeof n == "string";
  return t && r.reverse(), function (o, s, u, l) {
    let a;
    i && (a = s[n], s[n] = o);
    for (let c of r) {
      let h = o[c.name];
      if (!c.nullable || h) {
        if (c.type === "list") {
          if (t ? h.reduceRight(l, !1) : h.reduce(l, !1)) return !0;
        } else if (u(h)) return !0;
      }
    }
    i && (s[n] = a);
  };
}
function Go({
  StyleSheet: e,
  Atrule: t,
  Rule: r,
  Block: n,
  DeclarationList: i
}) {
  return {
    Atrule: {
      StyleSheet: e,
      Atrule: t,
      Rule: r,
      Block: n
    },
    Rule: {
      StyleSheet: e,
      Atrule: t,
      Rule: r,
      Block: n
    },
    Declaration: {
      StyleSheet: e,
      Atrule: t,
      Rule: r,
      Block: n,
      DeclarationList: i
    }
  };
}
function Yo(e) {
  let t = wl(e),
    r = {},
    n = {},
    i = Symbol("break-walk"),
    o = Symbol("skip-node");
  for (let a in t) xr.call(t, a) && t[a] !== null && (r[a] = Ho(t[a], !1), n[a] = Ho(t[a], !0));
  let s = Go(r),
    u = Go(n),
    l = function (a, c) {
      function h(C, B, ve) {
        let F = m.call(Y, C, B, ve);
        return F === i ? !0 : F === o ? !1 : !!(S.hasOwnProperty(C.type) && S[C.type](C, Y, h, ee) || f.call(Y, C, B, ve) === i);
      }
      let m = ot,
        f = ot,
        S = r,
        ee = (C, B, ve, F) => C || h(B, ve, F),
        Y = {
          break: i,
          skip: o,
          root: a,
          stylesheet: null,
          atrule: null,
          atrulePrelude: null,
          rule: null,
          selector: null,
          block: null,
          declaration: null,
          function: null
        };
      if (typeof c == "function") m = c;else if (c && (m = Uo(c.enter), f = Uo(c.leave), c.reverse && (S = n), c.visit)) {
        if (s.hasOwnProperty(c.visit)) S = c.reverse ? u[c.visit] : s[c.visit];else if (!t.hasOwnProperty(c.visit)) throw new Error("Bad value `" + c.visit + "` for `visit` option (should be: " + Object.keys(t).sort().join(", ") + ")");
        m = Wo(m, c.visit), f = Wo(f, c.visit);
      }
      if (m === ot && f === ot) throw new Error("Neither `enter` nor `leave` walker handler is set or both aren't a function");
      h(a);
    };
  return l.break = i, l.skip = o, l.find = function (a, c) {
    let h = null;
    return l(a, function (m, f, S) {
      if (c.call(this, m, f, S)) return h = m, i;
    }), h;
  }, l.findLast = function (a, c) {
    let h = null;
    return l(a, {
      reverse: !0,
      enter(m, f, S) {
        if (c.call(this, m, f, S)) return h = m, i;
      }
    }), h;
  }, l.findAll = function (a, c) {
    let h = [];
    return l(a, function (m, f, S) {
      c.call(this, m, f, S) && h.push(m);
    }), h;
  }, l;
}
function vl(e) {
  return e;
}
function Sl(e) {
  let {
    min: t,
    max: r,
    comma: n
  } = e;
  return t === 0 && r === 0 ? n ? "#?" : "*" : t === 0 && r === 1 ? "?" : t === 1 && r === 0 ? n ? "#" : "+" : t === 1 && r === 1 ? "" : (n ? "#" : "") + (t === r ? "{" + t + "}" : "{" + t + "," + (r !== 0 ? r : "") + "}");
}
function Cl(e) {
  switch (e.type) {
    case "Range":
      return " [" + (e.min === null ? "-\u221E" : e.min) + "," + (e.max === null ? "\u221E" : e.max) + "]";
    default:
      throw new Error("Unknown node type `" + e.type + "`");
  }
}
function Tl(e, t, r, n) {
  let i = e.combinator === " " || n ? e.combinator : " " + e.combinator + " ",
    o = e.terms.map(s => yr(s, t, r, n)).join(i);
  return e.explicit || r ? (n || o[0] === "," ? "[" : "[ ") + o + (n ? "]" : " ]") : o;
}
function yr(e, t, r, n) {
  let i;
  switch (e.type) {
    case "Group":
      i = Tl(e, t, r, n) + (e.disallowEmpty ? "!" : "");
      break;
    case "Multiplier":
      return yr(e.term, t, r, n) + t(Sl(e), e);
    case "Type":
      i = "<" + e.name + (e.opts ? t(Cl(e.opts), e.opts) : "") + ">";
      break;
    case "Property":
      i = "<'" + e.name + "'>";
      break;
    case "Keyword":
      i = e.name;
      break;
    case "AtKeyword":
      i = "@" + e.name;
      break;
    case "Function":
      i = e.name + "(";
      break;
    case "String":
    case "Token":
      i = e.value;
      break;
    case "Comma":
      i = ",";
      break;
    default:
      throw new Error("Unknown node type `" + e.type + "`");
  }
  return t(i, e);
}
function Ie(e, t) {
  let r = vl,
    n = !1,
    i = !1;
  return typeof t == "function" ? r = t : t && (n = Boolean(t.forceBraces), i = Boolean(t.compact), typeof t.decorate == "function" && (r = t.decorate)), yr(e, r, n, i);
}
var Vo = {
  offset: 0,
  line: 1,
  column: 1
};
function Al(e, t) {
  let r = e.tokens,
    n = e.longestMatch,
    i = n < r.length && r[n].node || null,
    o = i !== t ? i : null,
    s = 0,
    u = 0,
    l = 0,
    a = "",
    c,
    h;
  for (let m = 0; m < r.length; m++) {
    let f = r[m].value;
    m === n && (u = f.length, s = a.length), o !== null && r[m].node === o && (m <= n ? l++ : l = 0), a += f;
  }
  return n === r.length || l > 1 ? (c = Nt(o || t, "end") || at(Vo, a), h = at(c)) : (c = Nt(o, "start") || at(Nt(t, "start") || Vo, a.slice(0, s)), h = Nt(o, "end") || at(c, a.substr(s, u))), {
    css: a,
    mismatchOffset: s,
    mismatchLength: u,
    start: c,
    end: h
  };
}
function Nt(e, t) {
  let r = e && e.loc && e.loc[t];
  return r ? "line" in r ? at(r) : r : null;
}
function at({
  offset: e,
  line: t,
  column: r
}, n) {
  let i = {
    offset: e,
    line: t,
    column: r
  };
  if (n) {
    let o = n.split(/\n|\r\n?|\f/);
    i.offset += n.length, i.line += o.length - 1, i.column = o.length === 1 ? i.column + n.length : o.pop().length + 1;
  }
  return i;
}
var Ue = function (e, t) {
    let r = Le("SyntaxReferenceError", e + (t ? " `" + t + "`" : ""));
    return r.reference = t, r;
  },
  Ko = function (e, t, r, n) {
    let i = Le("SyntaxMatchError", e),
      {
        css: o,
        mismatchOffset: s,
        mismatchLength: u,
        start: l,
        end: a
      } = Al(n, r);
    return i.rawMessage = e, i.syntax = t ? Ie(t) : "<generic>", i.css = o, i.mismatchOffset = s, i.mismatchLength = u, i.message = e + `
  syntax: ` + i.syntax + `
   value: ` + (o || "<empty string>") + `
  --------` + new Array(i.mismatchOffset + 1).join("-") + "^", Object.assign(i, l), i.loc = {
      source: r && r.loc && r.loc.source || "<unknown>",
      start: l,
      end: a
    }, i;
  };
var Ot = new Map(),
  We = new Map(),
  zt = 45,
  Ft = exports.keyword = El,
  kr = exports.property = Ll,
  Zf = exports.vendorPrefix = wr;
function Rt(e, t) {
  return t = t || 0, e.length - t >= 2 && e.charCodeAt(t) === zt && e.charCodeAt(t + 1) === zt;
}
function wr(e, t) {
  if (t = t || 0, e.length - t >= 3 && e.charCodeAt(t) === zt && e.charCodeAt(t + 1) !== zt) {
    let r = e.indexOf("-", t + 2);
    if (r !== -1) return e.substring(t, r + 1);
  }
  return "";
}
function El(e) {
  if (Ot.has(e)) return Ot.get(e);
  let t = e.toLowerCase(),
    r = Ot.get(t);
  if (r === void 0) {
    let n = Rt(t, 0),
      i = n ? "" : wr(t, 0);
    r = Object.freeze({
      basename: t.substr(i.length),
      name: t,
      prefix: i,
      vendor: i,
      custom: n
    });
  }
  return Ot.set(e, r), r;
}
function Ll(e) {
  if (We.has(e)) return We.get(e);
  let t = e,
    r = e[0];
  r === "/" ? r = e[1] === "/" ? "//" : "/" : r !== "_" && r !== "*" && r !== "$" && r !== "#" && r !== "+" && r !== "&" && (r = "");
  let n = Rt(t, r.length);
  if (!n && (t = t.toLowerCase(), We.has(t))) {
    let u = We.get(t);
    return We.set(e, u), u;
  }
  let i = n ? "" : wr(t, r.length),
    o = t.substr(0, r.length + i.length),
    s = Object.freeze({
      basename: t.substr(o.length),
      name: t.substr(r.length),
      hack: r,
      vendor: i,
      prefix: o,
      custom: n
    });
  return We.set(e, s), s;
}
var Mt = ["initial", "inherit", "unset", "revert", "revert-layer"];
var lt = 43,
  fe = 45,
  vr = 110,
  He = !0,
  Il = !1;
function Cr(e, t) {
  return e !== null && e.type === 9 && e.value.charCodeAt(0) === t;
}
function st(e, t, r) {
  for (; e !== null && (e.type === 13 || e.type === 25);) e = r(++t);
  return t;
}
function Ce(e, t, r, n) {
  if (!e) return 0;
  let i = e.value.charCodeAt(t);
  if (i === lt || i === fe) {
    if (r) return 0;
    t++;
  }
  for (; t < e.value.length; t++) if (!W(e.value.charCodeAt(t))) return 0;
  return n + 1;
}
function Sr(e, t, r) {
  let n = !1,
    i = st(e, t, r);
  if (e = r(i), e === null) return t;
  if (e.type !== 10) if (Cr(e, lt) || Cr(e, fe)) {
    if (n = !0, i = st(r(++i), i, r), e = r(i), e === null || e.type !== 10) return 0;
  } else return t;
  if (!n) {
    let o = e.value.charCodeAt(0);
    if (o !== lt && o !== fe) return 0;
  }
  return Ce(e, n ? 0 : 1, n, i);
}
function Tr(e, t) {
  let r = 0;
  if (!e) return 0;
  if (e.type === 10) return Ce(e, 0, Il, r);
  if (e.type === 1 && e.value.charCodeAt(0) === fe) {
    if (!be(e.value, 1, vr)) return 0;
    switch (e.value.length) {
      case 2:
        return Sr(t(++r), r, t);
      case 3:
        return e.value.charCodeAt(2) !== fe ? 0 : (r = st(t(++r), r, t), e = t(r), Ce(e, 0, He, r));
      default:
        return e.value.charCodeAt(2) !== fe ? 0 : Ce(e, 3, He, r);
    }
  } else if (e.type === 1 || Cr(e, lt) && t(r + 1).type === 1) {
    if (e.type !== 1 && (e = t(++r)), e === null || !be(e.value, 0, vr)) return 0;
    switch (e.value.length) {
      case 1:
        return Sr(t(++r), r, t);
      case 2:
        return e.value.charCodeAt(1) !== fe ? 0 : (r = st(t(++r), r, t), e = t(r), Ce(e, 0, He, r));
      default:
        return e.value.charCodeAt(1) !== fe ? 0 : Ce(e, 2, He, r);
    }
  } else if (e.type === 12) {
    let n = e.value.charCodeAt(0),
      i = n === lt || n === fe ? 1 : 0,
      o = i;
    for (; o < e.value.length && W(e.value.charCodeAt(o)); o++);
    return o === i || !be(e.value, o, vr) ? 0 : o + 1 === e.value.length ? Sr(t(++r), r, t) : e.value.charCodeAt(o + 1) !== fe ? 0 : o + 2 === e.value.length ? (r = st(t(++r), r, t), e = t(r), Ce(e, 0, He, r)) : Ce(e, o + 2, He, r);
  }
  return 0;
}
var Dl = 43,
  Qo = 45,
  Xo = 63,
  Nl = 117;
function Ar(e, t) {
  return e !== null && e.type === 9 && e.value.charCodeAt(0) === t;
}
function Ol(e, t) {
  return e.value.charCodeAt(0) === t;
}
function ct(e, t, r) {
  let n = 0;
  for (let i = t; i < e.value.length; i++) {
    let o = e.value.charCodeAt(i);
    if (o === Qo && r && n !== 0) return ct(e, t + n + 1, !1), 6;
    if (!te(o) || ++n > 6) return 0;
  }
  return n;
}
function Bt(e, t, r) {
  if (!e) return 0;
  for (; Ar(r(t), Xo);) {
    if (++e > 6) return 0;
    t++;
  }
  return t;
}
function Er(e, t) {
  let r = 0;
  if (e === null || e.type !== 1 || !be(e.value, 0, Nl) || (e = t(++r), e === null)) return 0;
  if (Ar(e, Dl)) return e = t(++r), e === null ? 0 : e.type === 1 ? Bt(ct(e, 0, !0), ++r, t) : Ar(e, Xo) ? Bt(1, ++r, t) : 0;
  if (e.type === 10) {
    let n = ct(e, 1, !0);
    return n === 0 ? 0 : (e = t(++r), e === null ? r : e.type === 12 || e.type === 10 ? !Ol(e, Qo) || !ct(e, 1, !1) ? 0 : r + 1 : Bt(n, r, t));
  }
  return e.type === 12 ? Bt(ct(e, 1, !0), ++r, t) : 0;
}
var zl = ["calc(", "-moz-calc(", "-webkit-calc("],
  Lr = new Map([[2, 22], [21, 22], [19, 20], [23, 24]]);
function ce(e, t) {
  return t < e.length ? e.charCodeAt(t) : 0;
}
function $o(e, t) {
  return xe(e, 0, e.length, t);
}
function Zo(e, t) {
  for (let r = 0; r < t.length; r++) if ($o(e, t[r])) return !0;
  return !1;
}
function Jo(e, t) {
  return t !== e.length - 2 ? !1 : ce(e, t) === 92 && W(ce(e, t + 1));
}
function _t(e, t, r) {
  if (e && e.type === "Range") {
    let n = Number(r !== void 0 && r !== t.length ? t.substr(0, r) : t);
    if (isNaN(n) || e.min !== null && n < e.min && typeof e.min != "string" || e.max !== null && n > e.max && typeof e.max != "string") return !0;
  }
  return !1;
}
function Fl(e, t) {
  let r = 0,
    n = [],
    i = 0;
  e: do {
    switch (e.type) {
      case 24:
      case 22:
      case 20:
        if (e.type !== r) break e;
        if (r = n.pop(), n.length === 0) {
          i++;
          break e;
        }
        break;
      case 2:
      case 21:
      case 19:
      case 23:
        n.push(r), r = Lr.get(e.type);
        break;
    }
    i++;
  } while (e = t(i));
  return i;
}
function ae(e) {
  return function (t, r, n) {
    return t === null ? 0 : t.type === 2 && Zo(t.value, zl) ? Fl(t, r) : e(t, r, n);
  };
}
function z(e) {
  return function (t) {
    return t === null || t.type !== e ? 0 : 1;
  };
}
function Rl(e) {
  if (e === null || e.type !== 1) return 0;
  let t = e.value.toLowerCase();
  return Zo(t, Mt) || $o(t, "default") ? 0 : 1;
}
function ea(e) {
  return e === null || e.type !== 1 || ce(e.value, 0) !== 45 || ce(e.value, 1) !== 45 ? 0 : 1;
}
function Ml(e) {
  return !ea(e) || e.value === "--" ? 0 : 1;
}
function Bl(e) {
  if (e === null || e.type !== 4) return 0;
  let t = e.value.length;
  if (t !== 4 && t !== 5 && t !== 7 && t !== 9) return 0;
  for (let r = 1; r < t; r++) if (!te(ce(e.value, r))) return 0;
  return 1;
}
function _l(e) {
  return e === null || e.type !== 4 || !Fe(ce(e.value, 1), ce(e.value, 2), ce(e.value, 3)) ? 0 : 1;
}
function jl(e, t) {
  if (!e) return 0;
  let r = 0,
    n = [],
    i = 0;
  e: do {
    switch (e.type) {
      case 6:
      case 8:
        break e;
      case 24:
      case 22:
      case 20:
        if (e.type !== r) break e;
        r = n.pop();
        break;
      case 17:
        if (r === 0) break e;
        break;
      case 9:
        if (r === 0 && e.value === "!") break e;
        break;
      case 2:
      case 21:
      case 19:
      case 23:
        n.push(r), r = Lr.get(e.type);
        break;
    }
    i++;
  } while (e = t(i));
  return i;
}
function ql(e, t) {
  if (!e) return 0;
  let r = 0,
    n = [],
    i = 0;
  e: do {
    switch (e.type) {
      case 6:
      case 8:
        break e;
      case 24:
      case 22:
      case 20:
        if (e.type !== r) break e;
        r = n.pop();
        break;
      case 2:
      case 21:
      case 19:
      case 23:
        n.push(r), r = Lr.get(e.type);
        break;
    }
    i++;
  } while (e = t(i));
  return i;
}
function we(e) {
  return e && (e = new Set(e)), function (t, r, n) {
    if (t === null || t.type !== 12) return 0;
    let i = Ee(t.value, 0);
    if (e !== null) {
      let o = t.value.indexOf("\\", i),
        s = o === -1 || !Jo(t.value, o) ? t.value.substr(i) : t.value.substring(i, o);
      if (e.has(s.toLowerCase()) === !1) return 0;
    }
    return _t(n, t.value, i) ? 0 : 1;
  };
}
function Ul(e, t, r) {
  return e === null || e.type !== 11 || _t(r, e.value, e.value.length - 1) ? 0 : 1;
}
function ta(e) {
  return typeof e != "function" && (e = function () {
    return 0;
  }), function (t, r, n) {
    return t !== null && t.type === 10 && Number(t.value) === 0 ? 1 : e(t, r, n);
  };
}
function Wl(e, t, r) {
  if (e === null) return 0;
  let n = Ee(e.value, 0);
  return !(n === e.value.length) && !Jo(e.value, n) || _t(r, e.value, n) ? 0 : 1;
}
function Hl(e, t, r) {
  if (e === null || e.type !== 10) return 0;
  let n = ce(e.value, 0) === 43 || ce(e.value, 0) === 45 ? 1 : 0;
  for (; n < e.value.length; n++) if (!W(ce(e.value, n))) return 0;
  return _t(r, e.value, n) ? 0 : 1;
}
var Gl = {
    "ident-token": z(1),
    "function-token": z(2),
    "at-keyword-token": z(3),
    "hash-token": z(4),
    "string-token": z(5),
    "bad-string-token": z(6),
    "url-token": z(7),
    "bad-url-token": z(8),
    "delim-token": z(9),
    "number-token": z(10),
    "percentage-token": z(11),
    "dimension-token": z(12),
    "whitespace-token": z(13),
    "CDO-token": z(14),
    "CDC-token": z(15),
    "colon-token": z(16),
    "semicolon-token": z(17),
    "comma-token": z(18),
    "[-token": z(19),
    "]-token": z(20),
    "(-token": z(21),
    ")-token": z(22),
    "{-token": z(23),
    "}-token": z(24)
  },
  Yl = {
    string: z(5),
    ident: z(1),
    percentage: ae(Ul),
    zero: ta(),
    number: ae(Wl),
    integer: ae(Hl),
    "custom-ident": Rl,
    "dashed-ident": ea,
    "custom-property-name": Ml,
    "hex-color": Bl,
    "id-selector": _l,
    "an-plus-b": Tr,
    urange: Er,
    "declaration-value": jl,
    "any-value": ql
  };
function Vl(e) {
  let {
    angle: t,
    decibel: r,
    frequency: n,
    flex: i,
    length: o,
    resolution: s,
    semitones: u,
    time: l
  } = e || {};
  return {
    dimension: ae(we(null)),
    angle: ae(we(t)),
    decibel: ae(we(r)),
    frequency: ae(we(n)),
    flex: ae(we(i)),
    length: ae(ta(we(o))),
    resolution: ae(we(s)),
    semitones: ae(we(u)),
    time: ae(we(l))
  };
}
function ra(e) {
  return {
    ...Gl,
    ...Yl,
    ...Vl(e)
  };
}
var jt = {};
x(jt, {
  angle: () => Ql,
  decibel: () => ec,
  flex: () => Jl,
  frequency: () => $l,
  length: () => Kl,
  resolution: () => Zl,
  semitones: () => tc,
  time: () => Xl
});
var Kl = ["cm", "mm", "q", "in", "pt", "pc", "px", "em", "rem", "ex", "rex", "cap", "rcap", "ch", "rch", "ic", "ric", "lh", "rlh", "vw", "svw", "lvw", "dvw", "vh", "svh", "lvh", "dvh", "vi", "svi", "lvi", "dvi", "vb", "svb", "lvb", "dvb", "vmin", "svmin", "lvmin", "dvmin", "vmax", "svmax", "lvmax", "dvmax", "cqw", "cqh", "cqi", "cqb", "cqmin", "cqmax"],
  Ql = ["deg", "grad", "rad", "turn"],
  Xl = ["s", "ms"],
  $l = ["hz", "khz"],
  Zl = ["dpi", "dpcm", "dppx", "x"],
  Jl = ["fr"],
  ec = ["db"],
  tc = ["st"];
var ga = exports.definitionSyntax = {};
x(ga, {
  SyntaxError: () => qt,
  generate: () => Ie,
  parse: () => Ve,
  walk: () => Kt
});
function qt(e, t, r) {
  return Object.assign(Le("SyntaxError", e), {
    input: t,
    offset: r,
    rawMessage: e,
    message: e + `
  ` + t + `
--` + new Array((r || t.length) + 1).join("-") + "^"
  });
}
var rc = 9,
  nc = 10,
  ic = 12,
  oc = 13,
  ac = 32,
  Ut = class {
    constructor(t) {
      this.str = t, this.pos = 0;
    }
    charCodeAt(t) {
      return t < this.str.length ? this.str.charCodeAt(t) : 0;
    }
    charCode() {
      return this.charCodeAt(this.pos);
    }
    nextCharCode() {
      return this.charCodeAt(this.pos + 1);
    }
    nextNonWsCode(t) {
      return this.charCodeAt(this.findWsEnd(t));
    }
    skipWs() {
      this.pos = this.findWsEnd(this.pos);
    }
    findWsEnd(t) {
      for (; t < this.str.length; t++) {
        let r = this.str.charCodeAt(t);
        if (r !== oc && r !== nc && r !== ic && r !== ac && r !== rc) break;
      }
      return t;
    }
    substringToPos(t) {
      return this.str.substring(this.pos, this.pos = t);
    }
    eat(t) {
      this.charCode() !== t && this.error("Expect `" + String.fromCharCode(t) + "`"), this.pos++;
    }
    peek() {
      return this.pos < this.str.length ? this.str.charAt(this.pos++) : "";
    }
    error(t) {
      throw new qt(t, this.str, this.pos);
    }
  };
var sc = 9,
  lc = 10,
  cc = 12,
  uc = 13,
  pc = 32,
  ua = 33,
  Dr = 35,
  na = 38,
  Wt = 39,
  pa = 40,
  hc = 41,
  ha = 42,
  Nr = 43,
  Or = 44,
  ia = 45,
  zr = 60,
  ma = 62,
  Ir = 63,
  mc = 64,
  Vt = 91,
  Fr = 93,
  Ht = 123,
  oa = 124,
  aa = 125,
  sa = 8734,
  ut = new Uint8Array(128).map((e, t) => /[a-zA-Z0-9\-]/.test(String.fromCharCode(t)) ? 1 : 0),
  la = {
    " ": 1,
    "&&": 2,
    "||": 3,
    "|": 4
  };
function Gt(e) {
  return e.substringToPos(e.findWsEnd(e.pos));
}
function Ge(e) {
  let t = e.pos;
  for (; t < e.str.length; t++) {
    let r = e.str.charCodeAt(t);
    if (r >= 128 || ut[r] === 0) break;
  }
  return e.pos === t && e.error("Expect a keyword"), e.substringToPos(t);
}
function Yt(e) {
  let t = e.pos;
  for (; t < e.str.length; t++) {
    let r = e.str.charCodeAt(t);
    if (r < 48 || r > 57) break;
  }
  return e.pos === t && e.error("Expect a number"), e.substringToPos(t);
}
function fc(e) {
  let t = e.str.indexOf("'", e.pos + 1);
  return t === -1 && (e.pos = e.str.length, e.error("Expect an apostrophe")), e.substringToPos(t + 1);
}
function ca(e) {
  let t = null,
    r = null;
  return e.eat(Ht), e.skipWs(), t = Yt(e), e.skipWs(), e.charCode() === Or ? (e.pos++, e.skipWs(), e.charCode() !== aa && (r = Yt(e), e.skipWs())) : r = t, e.eat(aa), {
    min: Number(t),
    max: r ? Number(r) : 0
  };
}
function dc(e) {
  let t = null,
    r = !1;
  switch (e.charCode()) {
    case ha:
      e.pos++, t = {
        min: 0,
        max: 0
      };
      break;
    case Nr:
      e.pos++, t = {
        min: 1,
        max: 0
      };
      break;
    case Ir:
      e.pos++, t = {
        min: 0,
        max: 1
      };
      break;
    case Dr:
      e.pos++, r = !0, e.charCode() === Ht ? t = ca(e) : e.charCode() === Ir ? (e.pos++, t = {
        min: 0,
        max: 0
      }) : t = {
        min: 1,
        max: 0
      };
      break;
    case Ht:
      t = ca(e);
      break;
    default:
      return null;
  }
  return {
    type: "Multiplier",
    comma: r,
    min: t.min,
    max: t.max,
    term: null
  };
}
function Ye(e, t) {
  let r = dc(e);
  return r !== null ? (r.term = t, e.charCode() === Dr && e.charCodeAt(e.pos - 1) === Nr ? Ye(e, r) : r) : t;
}
function Pr(e) {
  let t = e.peek();
  return t === "" ? null : {
    type: "Token",
    value: t
  };
}
function gc(e) {
  let t;
  return e.eat(zr), e.eat(Wt), t = Ge(e), e.eat(Wt), e.eat(ma), Ye(e, {
    type: "Property",
    name: t
  });
}
function bc(e) {
  let t = null,
    r = null,
    n = 1;
  return e.eat(Vt), e.charCode() === ia && (e.peek(), n = -1), n == -1 && e.charCode() === sa ? e.peek() : (t = n * Number(Yt(e)), ut[e.charCode()] !== 0 && (t += Ge(e))), Gt(e), e.eat(Or), Gt(e), e.charCode() === sa ? e.peek() : (n = 1, e.charCode() === ia && (e.peek(), n = -1), r = n * Number(Yt(e)), ut[e.charCode()] !== 0 && (r += Ge(e))), e.eat(Fr), {
    type: "Range",
    min: t,
    max: r
  };
}
function xc(e) {
  let t,
    r = null;
  return e.eat(zr), t = Ge(e), e.charCode() === pa && e.nextCharCode() === hc && (e.pos += 2, t += "()"), e.charCodeAt(e.findWsEnd(e.pos)) === Vt && (Gt(e), r = bc(e)), e.eat(ma), Ye(e, {
    type: "Type",
    name: t,
    opts: r
  });
}
function yc(e) {
  let t = Ge(e);
  return e.charCode() === pa ? (e.pos++, {
    type: "Function",
    name: t
  }) : Ye(e, {
    type: "Keyword",
    name: t
  });
}
function kc(e, t) {
  function r(i, o) {
    return {
      type: "Group",
      terms: i,
      combinator: o,
      disallowEmpty: !1,
      explicit: !1
    };
  }
  let n;
  for (t = Object.keys(t).sort((i, o) => la[i] - la[o]); t.length > 0;) {
    n = t.shift();
    let i = 0,
      o = 0;
    for (; i < e.length; i++) {
      let s = e[i];
      s.type === "Combinator" && (s.value === n ? (o === -1 && (o = i - 1), e.splice(i, 1), i--) : (o !== -1 && i - o > 1 && (e.splice(o, i - o, r(e.slice(o, i), n)), i = o + 1), o = -1));
    }
    o !== -1 && t.length && e.splice(o, i - o, r(e.slice(o, i), n));
  }
  return n;
}
function fa(e) {
  let t = [],
    r = {},
    n,
    i = null,
    o = e.pos;
  for (; n = vc(e);) n.type !== "Spaces" && (n.type === "Combinator" ? ((i === null || i.type === "Combinator") && (e.pos = o, e.error("Unexpected combinator")), r[n.value] = !0) : i !== null && i.type !== "Combinator" && (r[" "] = !0, t.push({
    type: "Combinator",
    value: " "
  })), t.push(n), i = n, o = e.pos);
  return i !== null && i.type === "Combinator" && (e.pos -= o, e.error("Unexpected combinator")), {
    type: "Group",
    terms: t,
    combinator: kc(t, r) || " ",
    disallowEmpty: !1,
    explicit: !1
  };
}
function wc(e) {
  let t;
  return e.eat(Vt), t = fa(e), e.eat(Fr), t.explicit = !0, e.charCode() === ua && (e.pos++, t.disallowEmpty = !0), t;
}
function vc(e) {
  let t = e.charCode();
  if (t < 128 && ut[t] === 1) return yc(e);
  switch (t) {
    case Fr:
      break;
    case Vt:
      return Ye(e, wc(e));
    case zr:
      return e.nextCharCode() === Wt ? gc(e) : xc(e);
    case oa:
      return {
        type: "Combinator",
        value: e.substringToPos(e.pos + (e.nextCharCode() === oa ? 2 : 1))
      };
    case na:
      return e.pos++, e.eat(na), {
        type: "Combinator",
        value: "&&"
      };
    case Or:
      return e.pos++, {
        type: "Comma"
      };
    case Wt:
      return Ye(e, {
        type: "String",
        value: fc(e)
      });
    case pc:
    case sc:
    case lc:
    case uc:
    case cc:
      return {
        type: "Spaces",
        value: Gt(e)
      };
    case mc:
      return t = e.nextCharCode(), t < 128 && ut[t] === 1 ? (e.pos++, {
        type: "AtKeyword",
        name: Ge(e)
      }) : Pr(e);
    case ha:
    case Nr:
    case Ir:
    case Dr:
    case ua:
      break;
    case Ht:
      if (t = e.nextCharCode(), t < 48 || t > 57) return Pr(e);
      break;
    default:
      return Pr(e);
  }
}
function Ve(e) {
  let t = new Ut(e),
    r = fa(t);
  return t.pos !== e.length && t.error("Unexpected input"), r.terms.length === 1 && r.terms[0].type === "Group" ? r.terms[0] : r;
}
var pt = function () {};
function da(e) {
  return typeof e == "function" ? e : pt;
}
function Kt(e, t, r) {
  function n(s) {
    switch (i.call(r, s), s.type) {
      case "Group":
        s.terms.forEach(n);
        break;
      case "Multiplier":
        n(s.term);
        break;
      case "Type":
      case "Property":
      case "Keyword":
      case "AtKeyword":
      case "Function":
      case "String":
      case "Token":
      case "Comma":
        break;
      default:
        throw new Error("Unknown type: " + s.type);
    }
    o.call(r, s);
  }
  let i = pt,
    o = pt;
  if (typeof t == "function" ? i = t : t && (i = da(t.enter), o = da(t.leave)), i === pt && o === pt) throw new Error("Neither `enter` nor `leave` walker handler is set or both aren't a function");
  n(e, r);
}
var Sc = {
  decorator(e) {
    let t = [],
      r = null;
    return {
      ...e,
      node(n) {
        let i = r;
        r = n, e.node.call(this, n), r = i;
      },
      emit(n, i, o) {
        t.push({
          type: i,
          value: n,
          node: o ? null : r
        });
      },
      result() {
        return t;
      }
    };
  }
};
function Cc(e) {
  let t = [];
  return Se(e, (r, n, i) => t.push({
    type: r,
    value: e.slice(n, i),
    node: null
  })), t;
}
function ba(e, t) {
  return typeof e == "string" ? Cc(e) : t.generate(e, Sc);
}
var A = {
    type: "Match"
  },
  I = {
    type: "Mismatch"
  },
  Qt = {
    type: "DisallowEmpty"
  },
  Tc = 40,
  Ac = 41;
function J(e, t, r) {
  return t === A && r === I || e === A && t === A && r === A ? e : (e.type === "If" && e.else === I && t === A && (t = e.then, e = e.match), {
    type: "If",
    match: e,
    then: t,
    else: r
  });
}
function ya(e) {
  return e.length > 2 && e.charCodeAt(e.length - 2) === Tc && e.charCodeAt(e.length - 1) === Ac;
}
function xa(e) {
  return e.type === "Keyword" || e.type === "AtKeyword" || e.type === "Function" || e.type === "Type" && ya(e.name);
}
function Rr(e, t, r) {
  switch (e) {
    case " ":
      {
        let n = A;
        for (let i = t.length - 1; i >= 0; i--) {
          let o = t[i];
          n = J(o, n, I);
        }
        return n;
      }
    case "|":
      {
        let n = I,
          i = null;
        for (let o = t.length - 1; o >= 0; o--) {
          let s = t[o];
          if (xa(s) && (i === null && o > 0 && xa(t[o - 1]) && (i = Object.create(null), n = J({
            type: "Enum",
            map: i
          }, A, n)), i !== null)) {
            let u = (ya(s.name) ? s.name.slice(0, -1) : s.name).toLowerCase();
            if (!(u in i)) {
              i[u] = s;
              continue;
            }
          }
          i = null, n = J(s, A, n);
        }
        return n;
      }
    case "&&":
      {
        if (t.length > 5) return {
          type: "MatchOnce",
          terms: t,
          all: !0
        };
        let n = I;
        for (let i = t.length - 1; i >= 0; i--) {
          let o = t[i],
            s;
          t.length > 1 ? s = Rr(e, t.filter(function (u) {
            return u !== o;
          }), !1) : s = A, n = J(o, s, n);
        }
        return n;
      }
    case "||":
      {
        if (t.length > 5) return {
          type: "MatchOnce",
          terms: t,
          all: !1
        };
        let n = r ? A : I;
        for (let i = t.length - 1; i >= 0; i--) {
          let o = t[i],
            s;
          t.length > 1 ? s = Rr(e, t.filter(function (u) {
            return u !== o;
          }), !0) : s = A, n = J(o, s, n);
        }
        return n;
      }
  }
}
function Ec(e) {
  let t = A,
    r = Mr(e.term);
  if (e.max === 0) r = J(r, Qt, I), t = J(r, null, I), t.then = J(A, A, t), e.comma && (t.then.else = J({
    type: "Comma",
    syntax: e
  }, t, I));else for (let n = e.min || 1; n <= e.max; n++) e.comma && t !== A && (t = J({
    type: "Comma",
    syntax: e
  }, t, I)), t = J(r, J(A, A, t), I);
  if (e.min === 0) t = J(A, A, t);else for (let n = 0; n < e.min - 1; n++) e.comma && t !== A && (t = J({
    type: "Comma",
    syntax: e
  }, t, I)), t = J(r, t, I);
  return t;
}
function Mr(e) {
  if (typeof e == "function") return {
    type: "Generic",
    fn: e
  };
  switch (e.type) {
    case "Group":
      {
        let t = Rr(e.combinator, e.terms.map(Mr), !1);
        return e.disallowEmpty && (t = J(t, Qt, I)), t;
      }
    case "Multiplier":
      return Ec(e);
    case "Type":
    case "Property":
      return {
        type: e.type,
        name: e.name,
        syntax: e
      };
    case "Keyword":
      return {
        type: e.type,
        name: e.name.toLowerCase(),
        syntax: e
      };
    case "AtKeyword":
      return {
        type: e.type,
        name: "@" + e.name.toLowerCase(),
        syntax: e
      };
    case "Function":
      return {
        type: e.type,
        name: e.name.toLowerCase() + "(",
        syntax: e
      };
    case "String":
      return e.value.length === 3 ? {
        type: "Token",
        value: e.value.charAt(1),
        syntax: e
      } : {
        type: e.type,
        value: e.value.substr(1, e.value.length - 2).replace(/\\'/g, "'"),
        syntax: e
      };
    case "Token":
      return {
        type: e.type,
        value: e.value,
        syntax: e
      };
    case "Comma":
      return {
        type: e.type,
        syntax: e
      };
    default:
      throw new Error("Unknown node type:", e.type);
  }
}
function ht(e, t) {
  return typeof e == "string" && (e = Ve(e)), {
    type: "MatchGraph",
    match: Mr(e),
    syntax: t || null,
    source: e
  };
}
var {
    hasOwnProperty: ka
  } = Object.prototype,
  Lc = 0,
  Pc = 1,
  _r = 2,
  Ta = 3,
  wa = "Match",
  Ic = "Mismatch",
  Dc = "Maximum iteration number exceeded (please fill an issue on https://github.com/csstree/csstree/issues)",
  va = 15e3,
  Nc = 0;
function Oc(e) {
  let t = null,
    r = null,
    n = e;
  for (; n !== null;) r = n.prev, n.prev = t, t = n, n = r;
  return t;
}
function Br(e, t) {
  if (e.length !== t.length) return !1;
  for (let r = 0; r < e.length; r++) {
    let n = t.charCodeAt(r),
      i = e.charCodeAt(r);
    if (i >= 65 && i <= 90 && (i = i | 32), i !== n) return !1;
  }
  return !0;
}
function zc(e) {
  return e.type !== 9 ? !1 : e.value !== "?";
}
function Sa(e) {
  return e === null ? !0 : e.type === 18 || e.type === 2 || e.type === 21 || e.type === 19 || e.type === 23 || zc(e);
}
function Ca(e) {
  return e === null ? !0 : e.type === 22 || e.type === 20 || e.type === 24 || e.type === 9 && e.value === "/";
}
function Fc(e, t, r) {
  function n() {
    do B++, C = B < e.length ? e[B] : null; while (C !== null && (C.type === 13 || C.type === 25));
  }
  function i(se) {
    let ge = B + se;
    return ge < e.length ? e[ge] : null;
  }
  function o(se, ge) {
    return {
      nextState: se,
      matchStack: F,
      syntaxStack: h,
      thenStack: m,
      tokenIndex: B,
      prev: ge
    };
  }
  function s(se) {
    m = {
      nextState: se,
      matchStack: F,
      syntaxStack: h,
      prev: m
    };
  }
  function u(se) {
    f = o(se, f);
  }
  function l() {
    F = {
      type: Pc,
      syntax: t.syntax,
      token: C,
      prev: F
    }, n(), S = null, B > ve && (ve = B);
  }
  function a() {
    h = {
      syntax: t.syntax,
      opts: t.syntax.opts || h !== null && h.opts || null,
      prev: h
    }, F = {
      type: _r,
      syntax: t.syntax,
      token: F.token,
      prev: F
    };
  }
  function c() {
    F.type === _r ? F = F.prev : F = {
      type: Ta,
      syntax: h.syntax,
      token: F.token,
      prev: F
    }, h = h.prev;
  }
  let h = null,
    m = null,
    f = null,
    S = null,
    ee = 0,
    Y = null,
    C = null,
    B = -1,
    ve = 0,
    F = {
      type: Lc,
      syntax: null,
      token: null,
      prev: null
    };
  for (n(); Y === null && ++ee < va;) switch (t.type) {
    case "Match":
      if (m === null) {
        if (C !== null && (B !== e.length - 1 || C.value !== "\\0" && C.value !== "\\9")) {
          t = I;
          break;
        }
        Y = wa;
        break;
      }
      if (t = m.nextState, t === Qt) if (m.matchStack === F) {
        t = I;
        break;
      } else t = A;
      for (; m.syntaxStack !== h;) c();
      m = m.prev;
      break;
    case "Mismatch":
      if (S !== null && S !== !1) (f === null || B > f.tokenIndex) && (f = S, S = !1);else if (f === null) {
        Y = Ic;
        break;
      }
      t = f.nextState, m = f.thenStack, h = f.syntaxStack, F = f.matchStack, B = f.tokenIndex, C = B < e.length ? e[B] : null, f = f.prev;
      break;
    case "MatchGraph":
      t = t.match;
      break;
    case "If":
      t.else !== I && u(t.else), t.then !== A && s(t.then), t = t.match;
      break;
    case "MatchOnce":
      t = {
        type: "MatchOnceBuffer",
        syntax: t,
        index: 0,
        mask: 0
      };
      break;
    case "MatchOnceBuffer":
      {
        let X = t.syntax.terms;
        if (t.index === X.length) {
          if (t.mask === 0 || t.syntax.all) {
            t = I;
            break;
          }
          t = A;
          break;
        }
        if (t.mask === (1 << X.length) - 1) {
          t = A;
          break;
        }
        for (; t.index < X.length; t.index++) {
          let $ = 1 << t.index;
          if ((t.mask & $) === 0) {
            u(t), s({
              type: "AddMatchOnce",
              syntax: t.syntax,
              mask: t.mask | $
            }), t = X[t.index++];
            break;
          }
        }
        break;
      }
    case "AddMatchOnce":
      t = {
        type: "MatchOnceBuffer",
        syntax: t.syntax,
        index: 0,
        mask: t.mask
      };
      break;
    case "Enum":
      if (C !== null) {
        let X = C.value.toLowerCase();
        if (X.indexOf("\\") !== -1 && (X = X.replace(/\\[09].*$/, "")), ka.call(t.map, X)) {
          t = t.map[X];
          break;
        }
      }
      t = I;
      break;
    case "Generic":
      {
        let X = h !== null ? h.opts : null,
          $ = B + Math.floor(t.fn(C, i, X));
        if (!isNaN($) && $ > B) {
          for (; B < $;) l();
          t = A;
        } else t = I;
        break;
      }
    case "Type":
    case "Property":
      {
        let X = t.type === "Type" ? "types" : "properties",
          $ = ka.call(r, X) ? r[X][t.name] : null;
        if (!$ || !$.match) throw new Error("Bad syntax reference: " + (t.type === "Type" ? "<" + t.name + ">" : "<'" + t.name + "'>"));
        if (S !== !1 && C !== null && t.type === "Type" && (t.name === "custom-ident" && C.type === 1 || t.name === "length" && C.value === "0")) {
          S === null && (S = o(t, f)), t = I;
          break;
        }
        a(), t = $.matchRef || $.match;
        break;
      }
    case "Keyword":
      {
        let X = t.name;
        if (C !== null) {
          let $ = C.value;
          if ($.indexOf("\\") !== -1 && ($ = $.replace(/\\[09].*$/, "")), Br($, X)) {
            l(), t = A;
            break;
          }
        }
        t = I;
        break;
      }
    case "AtKeyword":
    case "Function":
      if (C !== null && Br(C.value, t.name)) {
        l(), t = A;
        break;
      }
      t = I;
      break;
    case "Token":
      if (C !== null && C.value === t.value) {
        l(), t = A;
        break;
      }
      t = I;
      break;
    case "Comma":
      C !== null && C.type === 18 ? Sa(F.token) ? t = I : (l(), t = Ca(C) ? I : A) : t = Sa(F.token) || Ca(C) ? A : I;
      break;
    case "String":
      let se = "",
        ge = B;
      for (; ge < e.length && se.length < t.value.length; ge++) se += e[ge].value;
      if (Br(se, t.value)) {
        for (; B < ge;) l();
        t = A;
      } else t = I;
      break;
    default:
      throw new Error("Unknown node type: " + t.type);
  }
  switch (Nc += ee, Y) {
    case null:
      console.warn("[csstree-match] BREAK after " + va + " iterations"), Y = Dc, F = null;
      break;
    case wa:
      for (; h !== null;) c();
      break;
    default:
      F = null;
  }
  return {
    tokens: e,
    reason: Y,
    iterations: ee,
    match: F,
    longestMatch: ve
  };
}
function jr(e, t, r) {
  let n = Fc(e, t, r || {});
  if (n.match === null) return n;
  let i = n.match,
    o = n.match = {
      syntax: t.syntax || null,
      match: []
    },
    s = [o];
  for (i = Oc(i).prev; i !== null;) {
    switch (i.type) {
      case _r:
        o.match.push(o = {
          syntax: i.syntax,
          match: []
        }), s.push(o);
        break;
      case Ta:
        s.pop(), o = s[s.length - 1];
        break;
      default:
        o.match.push({
          syntax: i.syntax || null,
          token: i.token.value,
          node: i.token.node
        });
    }
    i = i.prev;
  }
  return n;
}
var Ur = {};
x(Ur, {
  getTrace: () => Aa,
  isKeyword: () => Bc,
  isProperty: () => Mc,
  isType: () => Rc
});
function Aa(e) {
  function t(i) {
    return i === null ? !1 : i.type === "Type" || i.type === "Property" || i.type === "Keyword";
  }
  function r(i) {
    if (Array.isArray(i.match)) {
      for (let o = 0; o < i.match.length; o++) if (r(i.match[o])) return t(i.syntax) && n.unshift(i.syntax), !0;
    } else if (i.node === e) return n = t(i.syntax) ? [i.syntax] : [], !0;
    return !1;
  }
  let n = null;
  return this.matched !== null && r(this.matched), n;
}
function Rc(e, t) {
  return qr(this, e, r => r.type === "Type" && r.name === t);
}
function Mc(e, t) {
  return qr(this, e, r => r.type === "Property" && r.name === t);
}
function Bc(e) {
  return qr(this, e, t => t.type === "Keyword");
}
function qr(e, t, r) {
  let n = Aa.call(e, t);
  return n === null ? !1 : n.some(r);
}
function Ea(e) {
  return "node" in e ? e.node : Ea(e.match[0]);
}
function La(e) {
  return "node" in e ? e.node : La(e.match[e.match.length - 1]);
}
function Wr(e, t, r, n, i) {
  function o(u) {
    if (u.syntax !== null && u.syntax.type === n && u.syntax.name === i) {
      let l = Ea(u),
        a = La(u);
      e.syntax.walk(t, function (c, h, m) {
        if (c === l) {
          let f = new N();
          do {
            if (f.appendData(h.data), h.data === a) break;
            h = h.next;
          } while (h !== null);
          s.push({
            parent: m,
            nodes: f
          });
        }
      });
    }
    Array.isArray(u.match) && u.match.forEach(o);
  }
  let s = [];
  return r.matched !== null && o(r.matched), s;
}
var {
  hasOwnProperty: mt
} = Object.prototype;
function Hr(e) {
  return typeof e == "number" && isFinite(e) && Math.floor(e) === e && e >= 0;
}
function Pa(e) {
  return Boolean(e) && Hr(e.offset) && Hr(e.line) && Hr(e.column);
}
function _c(e, t) {
  return function (n, i) {
    if (!n || n.constructor !== Object) return i(n, "Type of node should be an Object");
    for (let o in n) {
      let s = !0;
      if (mt.call(n, o) !== !1) {
        if (o === "type") n.type !== e && i(n, "Wrong node type `" + n.type + "`, expected `" + e + "`");else if (o === "loc") {
          if (n.loc === null) continue;
          if (n.loc && n.loc.constructor === Object) if (typeof n.loc.source != "string") o += ".source";else if (!Pa(n.loc.start)) o += ".start";else if (!Pa(n.loc.end)) o += ".end";else continue;
          s = !1;
        } else if (t.hasOwnProperty(o)) {
          s = !1;
          for (let u = 0; !s && u < t[o].length; u++) {
            let l = t[o][u];
            switch (l) {
              case String:
                s = typeof n[o] == "string";
                break;
              case Boolean:
                s = typeof n[o] == "boolean";
                break;
              case null:
                s = n[o] === null;
                break;
              default:
                typeof l == "string" ? s = n[o] && n[o].type === l : Array.isArray(l) && (s = n[o] instanceof N);
            }
          }
        } else i(n, "Unknown field `" + o + "` for " + e + " node type");
        s || i(n, "Bad value for `" + e + "." + o + "`");
      }
    }
    for (let o in t) mt.call(t, o) && mt.call(n, o) === !1 && i(n, "Field `" + e + "." + o + "` is missed");
  };
}
function Ia(e, t) {
  let r = [];
  for (let n = 0; n < e.length; n++) {
    let i = e[n];
    if (i === String || i === Boolean) r.push(i.name.toLowerCase());else if (i === null) r.push("null");else if (typeof i == "string") r.push(i);else if (Array.isArray(i)) r.push("List<" + (Ia(i, t) || "any") + ">");else throw new Error("Wrong value `" + i + "` in `" + t + "` structure definition");
  }
  return r.join(" | ");
}
function jc(e, t) {
  let r = t.structure,
    n = {
      type: String,
      loc: !0
    },
    i = {
      type: '"' + e + '"'
    };
  for (let o in r) {
    if (mt.call(r, o) === !1) continue;
    let s = n[o] = Array.isArray(r[o]) ? r[o].slice() : [r[o]];
    i[o] = Ia(s, e + "." + o);
  }
  return {
    docs: i,
    check: _c(e, n)
  };
}
function Da(e) {
  let t = {};
  if (e.node) {
    for (let r in e.node) if (mt.call(e.node, r)) {
      let n = e.node[r];
      if (n.structure) t[r] = jc(r, n);else throw new Error("Missed `structure` field in `" + r + "` node type definition");
    }
  }
  return t;
}
var qc = ht(Mt.join(" | "));
function Gr(e, t, r) {
  let n = {};
  for (let i in e) e[i].syntax && (n[i] = r ? e[i].syntax : Ie(e[i].syntax, {
    compact: t
  }));
  return n;
}
function Uc(e, t, r) {
  let n = {};
  for (let [i, o] of Object.entries(e)) n[i] = {
    prelude: o.prelude && (r ? o.prelude.syntax : Ie(o.prelude.syntax, {
      compact: t
    })),
    descriptors: o.descriptors && Gr(o.descriptors, t, r)
  };
  return n;
}
function Wc(e) {
  for (let t = 0; t < e.length; t++) if (e[t].value.toLowerCase() === "var(") return !0;
  return !1;
}
function Hc(e) {
  let t = e.terms[0];
  return e.explicit === !1 && e.terms.length === 1 && t.type === "Multiplier" && t.comma === !0;
}
function ue(e, t, r) {
  return {
    matched: e,
    iterations: r,
    error: t,
    ...Ur
  };
}
function Ke(e, t, r, n) {
  let i = ba(r, e.syntax),
    o;
  return Wc(i) ? ue(null, new Error("Matching for a tree with var() is not supported")) : (n && (o = jr(i, e.cssWideKeywordsSyntax, e)), (!n || !o.match) && (o = jr(i, t.match, e), !o.match) ? ue(null, new Ko(o.reason, t.syntax, r, o), o.iterations) : ue(o.match, null, o.iterations));
}
var Qe = class {
  constructor(t, r, n) {
    if (this.cssWideKeywordsSyntax = qc, this.syntax = r, this.generic = !1, this.units = {
      ...jt
    }, this.atrules = Object.create(null), this.properties = Object.create(null), this.types = Object.create(null), this.structure = n || Da(t), t) {
      if (t.units) for (let i of Object.keys(jt)) Array.isArray(t.units[i]) && (this.units[i] = t.units[i]);
      if (t.types) for (let [i, o] of Object.entries(t.types)) this.addType_(i, o);
      if (t.generic) {
        this.generic = !0;
        for (let [i, o] of Object.entries(ra(this.units))) this.addType_(i, o);
      }
      if (t.atrules) for (let [i, o] of Object.entries(t.atrules)) this.addAtrule_(i, o);
      if (t.properties) for (let [i, o] of Object.entries(t.properties)) this.addProperty_(i, o);
    }
  }
  checkStructure(t) {
    function r(o, s) {
      i.push({
        node: o,
        message: s
      });
    }
    let n = this.structure,
      i = [];
    return this.syntax.walk(t, function (o) {
      n.hasOwnProperty(o.type) ? n[o.type].check(o, r) : r(o, "Unknown node type `" + o.type + "`");
    }), i.length ? i : !1;
  }
  createDescriptor(t, r, n, i = null) {
    let o = {
        type: r,
        name: n
      },
      s = {
        type: r,
        name: n,
        parent: i,
        serializable: typeof t == "string" || t && typeof t.type == "string",
        syntax: null,
        match: null,
        matchRef: null
      };
    return typeof t == "function" ? s.match = ht(t, o) : (typeof t == "string" ? Object.defineProperty(s, "syntax", {
      get() {
        return Object.defineProperty(s, "syntax", {
          value: Ve(t)
        }), s.syntax;
      }
    }) : s.syntax = t, Object.defineProperty(s, "match", {
      get() {
        return Object.defineProperty(s, "match", {
          value: ht(s.syntax, o)
        }), s.match;
      }
    }), r === "Property" && Object.defineProperty(s, "matchRef", {
      get() {
        let u = s.syntax,
          l = Hc(u) ? ht({
            ...u,
            terms: [u.terms[0].term]
          }, o) : null;
        return Object.defineProperty(s, "matchRef", {
          value: l
        }), l;
      }
    })), s;
  }
  addAtrule_(t, r) {
    !r || (this.atrules[t] = {
      type: "Atrule",
      name: t,
      prelude: r.prelude ? this.createDescriptor(r.prelude, "AtrulePrelude", t) : null,
      descriptors: r.descriptors ? Object.keys(r.descriptors).reduce((n, i) => (n[i] = this.createDescriptor(r.descriptors[i], "AtruleDescriptor", i, t), n), Object.create(null)) : null
    });
  }
  addProperty_(t, r) {
    !r || (this.properties[t] = this.createDescriptor(r, "Property", t));
  }
  addType_(t, r) {
    !r || (this.types[t] = this.createDescriptor(r, "Type", t));
  }
  checkAtruleName(t) {
    if (!this.getAtrule(t)) return new Ue("Unknown at-rule", "@" + t);
  }
  checkAtrulePrelude(t, r) {
    let n = this.checkAtruleName(t);
    if (n) return n;
    let i = this.getAtrule(t);
    if (!i.prelude && r) return new SyntaxError("At-rule `@" + t + "` should not contain a prelude");
    if (i.prelude && !r && !Ke(this, i.prelude, "", !1).matched) return new SyntaxError("At-rule `@" + t + "` should contain a prelude");
  }
  checkAtruleDescriptorName(t, r) {
    let n = this.checkAtruleName(t);
    if (n) return n;
    let i = this.getAtrule(t),
      o = Ft(r);
    if (!i.descriptors) return new SyntaxError("At-rule `@" + t + "` has no known descriptors");
    if (!i.descriptors[o.name] && !i.descriptors[o.basename]) return new Ue("Unknown at-rule descriptor", r);
  }
  checkPropertyName(t) {
    if (!this.getProperty(t)) return new Ue("Unknown property", t);
  }
  matchAtrulePrelude(t, r) {
    let n = this.checkAtrulePrelude(t, r);
    if (n) return ue(null, n);
    let i = this.getAtrule(t);
    return i.prelude ? Ke(this, i.prelude, r || "", !1) : ue(null, null);
  }
  matchAtruleDescriptor(t, r, n) {
    let i = this.checkAtruleDescriptorName(t, r);
    if (i) return ue(null, i);
    let o = this.getAtrule(t),
      s = Ft(r);
    return Ke(this, o.descriptors[s.name] || o.descriptors[s.basename], n, !1);
  }
  matchDeclaration(t) {
    return t.type !== "Declaration" ? ue(null, new Error("Not a Declaration node")) : this.matchProperty(t.property, t.value);
  }
  matchProperty(t, r) {
    if (kr(t).custom) return ue(null, new Error("Lexer matching doesn't applicable for custom properties"));
    let n = this.checkPropertyName(t);
    return n ? ue(null, n) : Ke(this, this.getProperty(t), r, !0);
  }
  matchType(t, r) {
    let n = this.getType(t);
    return n ? Ke(this, n, r, !1) : ue(null, new Ue("Unknown type", t));
  }
  match(t, r) {
    return typeof t != "string" && (!t || !t.type) ? ue(null, new Ue("Bad syntax")) : ((typeof t == "string" || !t.match) && (t = this.createDescriptor(t, "Type", "anonymous")), Ke(this, t, r, !1));
  }
  findValueFragments(t, r, n, i) {
    return Wr(this, r, this.matchProperty(t, r), n, i);
  }
  findDeclarationValueFragments(t, r, n) {
    return Wr(this, t.value, this.matchDeclaration(t), r, n);
  }
  findAllFragments(t, r, n) {
    let i = [];
    return this.syntax.walk(t, {
      visit: "Declaration",
      enter: o => {
        i.push.apply(i, this.findDeclarationValueFragments(o, r, n));
      }
    }), i;
  }
  getAtrule(t, r = !0) {
    let n = Ft(t);
    return (n.vendor && r ? this.atrules[n.name] || this.atrules[n.basename] : this.atrules[n.name]) || null;
  }
  getAtrulePrelude(t, r = !0) {
    let n = this.getAtrule(t, r);
    return n && n.prelude || null;
  }
  getAtruleDescriptor(t, r) {
    return this.atrules.hasOwnProperty(t) && this.atrules.declarators && this.atrules[t].declarators[r] || null;
  }
  getProperty(t, r = !0) {
    let n = kr(t);
    return (n.vendor && r ? this.properties[n.name] || this.properties[n.basename] : this.properties[n.name]) || null;
  }
  getType(t) {
    return hasOwnProperty.call(this.types, t) ? this.types[t] : null;
  }
  validate() {
    function t(i, o, s, u) {
      if (s.has(o)) return s.get(o);
      s.set(o, !1), u.syntax !== null && Kt(u.syntax, function (l) {
        if (l.type !== "Type" && l.type !== "Property") return;
        let a = l.type === "Type" ? i.types : i.properties,
          c = l.type === "Type" ? r : n;
        (!hasOwnProperty.call(a, l.name) || t(i, l.name, c, a[l.name])) && s.set(o, !0);
      }, this);
    }
    let r = new Map(),
      n = new Map();
    for (let i in this.types) t(this, i, r, this.types[i]);
    for (let i in this.properties) t(this, i, n, this.properties[i]);
    return r = [...r.keys()].filter(i => r.get(i)), n = [...n.keys()].filter(i => n.get(i)), r.length || n.length ? {
      types: r,
      properties: n
    } : null;
  }
  dump(t, r) {
    return {
      generic: this.generic,
      units: this.units,
      types: Gr(this.types, !r, t),
      properties: Gr(this.properties, !r, t),
      atrules: Uc(this.atrules, !r, t)
    };
  }
  toString() {
    return JSON.stringify(this.dump());
  }
};
exports.Lexer = Qe;
function Yr(e, t) {
  return typeof t == "string" && /^\s*\|/.test(t) ? typeof e == "string" ? e + t : t.replace(/^\s*\|\s*/, "") : t || null;
}
function Na(e, t) {
  let r = Object.create(null);
  for (let [n, i] of Object.entries(e)) if (i) {
    r[n] = {};
    for (let o of Object.keys(i)) t.includes(o) && (r[n][o] = i[o]);
  }
  return r;
}
function ft(e, t) {
  let r = {
    ...e
  };
  for (let [n, i] of Object.entries(t)) switch (n) {
    case "generic":
      r[n] = Boolean(i);
      break;
    case "units":
      r[n] = {
        ...e[n]
      };
      for (let [o, s] of Object.entries(i)) r[n][o] = Array.isArray(s) ? s : [];
      break;
    case "atrules":
      r[n] = {
        ...e[n]
      };
      for (let [o, s] of Object.entries(i)) {
        let u = r[n][o] || {},
          l = r[n][o] = {
            prelude: u.prelude || null,
            descriptors: {
              ...u.descriptors
            }
          };
        if (!!s) {
          l.prelude = s.prelude ? Yr(l.prelude, s.prelude) : l.prelude || null;
          for (let [a, c] of Object.entries(s.descriptors || {})) l.descriptors[a] = c ? Yr(l.descriptors[a], c) : null;
          Object.keys(l.descriptors).length || (l.descriptors = null);
        }
      }
      break;
    case "types":
    case "properties":
      r[n] = {
        ...e[n]
      };
      for (let [o, s] of Object.entries(i)) r[n][o] = Yr(r[n][o], s);
      break;
    case "scope":
    case "features":
      r[n] = {
        ...e[n]
      };
      for (let [o, s] of Object.entries(i)) r[n][o] = {
        ...r[n][o],
        ...s
      };
      break;
    case "parseContext":
      r[n] = {
        ...e[n],
        ...i
      };
      break;
    case "atrule":
    case "pseudo":
      r[n] = {
        ...e[n],
        ...Na(i, ["parse"])
      };
      break;
    case "node":
      r[n] = {
        ...e[n],
        ...Na(i, ["name", "structure", "parse", "generate", "walkContext"])
      };
      break;
  }
  return r;
}
function Oa(e) {
  let t = fo(e),
    r = Yo(e),
    n = jo(e),
    {
      fromPlainObject: i,
      toPlainObject: o
    } = qo(r),
    s = {
      lexer: null,
      createLexer: u => new Qe(u, s, s.lexer.structure),
      tokenize: Se,
      parse: t,
      generate: n,
      walk: r,
      find: r.find,
      findLast: r.findLast,
      findAll: r.findAll,
      fromPlainObject: i,
      toPlainObject: o,
      fork(u) {
        let l = ft({}, e);
        return Oa(typeof u == "function" ? u(l, Object.assign) : ft(l, u));
      }
    };
  return s.lexer = new Qe({
    generic: e.generic,
    units: e.units,
    types: e.types,
    atrules: e.atrules,
    properties: e.properties,
    node: e.node
  }, s), s;
}
var Vr = e => Oa(ft({}, e));
exports.createSyntax = Vr;
var za = {
  generic: !0,
  units: {
    angle: ["deg", "grad", "rad", "turn"],
    decibel: ["db"],
    flex: ["fr"],
    frequency: ["hz", "khz"],
    length: ["cm", "mm", "q", "in", "pt", "pc", "px", "em", "rem", "ex", "rex", "cap", "rcap", "ch", "rch", "ic", "ric", "lh", "rlh", "vw", "svw", "lvw", "dvw", "vh", "svh", "lvh", "dvh", "vi", "svi", "lvi", "dvi", "vb", "svb", "lvb", "dvb", "vmin", "svmin", "lvmin", "dvmin", "vmax", "svmax", "lvmax", "dvmax", "cqw", "cqh", "cqi", "cqb", "cqmin", "cqmax"],
    resolution: ["dpi", "dpcm", "dppx", "x"],
    semitones: ["st"],
    time: ["s", "ms"]
  },
  types: {
    "abs()": "abs( <calc-sum> )",
    "absolute-size": "xx-small|x-small|small|medium|large|x-large|xx-large|xxx-large",
    "acos()": "acos( <calc-sum> )",
    "alpha-value": "<number>|<percentage>",
    "angle-percentage": "<angle>|<percentage>",
    "angular-color-hint": "<angle-percentage>",
    "angular-color-stop": "<color>&&<color-stop-angle>?",
    "angular-color-stop-list": "[<angular-color-stop> [, <angular-color-hint>]?]# , <angular-color-stop>",
    "animateable-feature": "scroll-position|contents|<custom-ident>",
    "asin()": "asin( <calc-sum> )",
    "atan()": "atan( <calc-sum> )",
    "atan2()": "atan2( <calc-sum> , <calc-sum> )",
    attachment: "scroll|fixed|local",
    "attr()": "attr( <attr-name> <type-or-unit>? [, <attr-fallback>]? )",
    "attr-matcher": "['~'|'|'|'^'|'$'|'*']? '='",
    "attr-modifier": "i|s",
    "attribute-selector": "'[' <wq-name> ']'|'[' <wq-name> <attr-matcher> [<string-token>|<ident-token>] <attr-modifier>? ']'",
    "auto-repeat": "repeat( [auto-fill|auto-fit] , [<line-names>? <fixed-size>]+ <line-names>? )",
    "auto-track-list": "[<line-names>? [<fixed-size>|<fixed-repeat>]]* <line-names>? <auto-repeat> [<line-names>? [<fixed-size>|<fixed-repeat>]]* <line-names>?",
    axis: "block|inline|vertical|horizontal",
    "baseline-position": "[first|last]? baseline",
    "basic-shape": "<inset()>|<circle()>|<ellipse()>|<polygon()>|<path()>",
    "bg-image": "none|<image>",
    "bg-layer": "<bg-image>||<bg-position> [/ <bg-size>]?||<repeat-style>||<attachment>||<box>||<box>",
    "bg-position": "[[left|center|right|top|bottom|<length-percentage>]|[left|center|right|<length-percentage>] [top|center|bottom|<length-percentage>]|[center|[left|right] <length-percentage>?]&&[center|[top|bottom] <length-percentage>?]]",
    "bg-size": "[<length-percentage>|auto]{1,2}|cover|contain",
    "blur()": "blur( <length> )",
    "blend-mode": "normal|multiply|screen|overlay|darken|lighten|color-dodge|color-burn|hard-light|soft-light|difference|exclusion|hue|saturation|color|luminosity",
    box: "border-box|padding-box|content-box",
    "brightness()": "brightness( <number-percentage> )",
    "calc()": "calc( <calc-sum> )",
    "calc-sum": "<calc-product> [['+'|'-'] <calc-product>]*",
    "calc-product": "<calc-value> ['*' <calc-value>|'/' <number>]*",
    "calc-value": "<number>|<dimension>|<percentage>|<calc-constant>|( <calc-sum> )",
    "calc-constant": "e|pi|infinity|-infinity|NaN",
    "cf-final-image": "<image>|<color>",
    "cf-mixing-image": "<percentage>?&&<image>",
    "circle()": "circle( [<shape-radius>]? [at <position>]? )",
    "clamp()": "clamp( <calc-sum>#{3} )",
    "class-selector": "'.' <ident-token>",
    "clip-source": "<url>",
    color: "<color-base>|currentColor|<system-color>|<device-cmyk()>|<light-dark()>|<-non-standard-color>",
    "color-stop": "<color-stop-length>|<color-stop-angle>",
    "color-stop-angle": "<angle-percentage>{1,2}",
    "color-stop-length": "<length-percentage>{1,2}",
    "color-stop-list": "[<linear-color-stop> [, <linear-color-hint>]?]# , <linear-color-stop>",
    combinator: "'>'|'+'|'~'|['|' '|']",
    "common-lig-values": "[common-ligatures|no-common-ligatures]",
    "compat-auto": "searchfield|textarea|push-button|slider-horizontal|checkbox|radio|square-button|menulist|listbox|meter|progress-bar|button",
    "composite-style": "clear|copy|source-over|source-in|source-out|source-atop|destination-over|destination-in|destination-out|destination-atop|xor",
    "compositing-operator": "add|subtract|intersect|exclude",
    "compound-selector": "[<type-selector>? <subclass-selector>*]!",
    "compound-selector-list": "<compound-selector>#",
    "complex-selector": "<complex-selector-unit> [<combinator>? <complex-selector-unit>]*",
    "complex-selector-list": "<complex-selector>#",
    "conic-gradient()": "conic-gradient( [from <angle>]? [at <position>]? , <angular-color-stop-list> )",
    "contextual-alt-values": "[contextual|no-contextual]",
    "content-distribution": "space-between|space-around|space-evenly|stretch",
    "content-list": "[<string>|contents|<image>|<counter>|<quote>|<target>|<leader()>|<attr()>]+",
    "content-position": "center|start|end|flex-start|flex-end",
    "content-replacement": "<image>",
    "contrast()": "contrast( [<number-percentage>] )",
    "cos()": "cos( <calc-sum> )",
    counter: "<counter()>|<counters()>",
    "counter()": "counter( <counter-name> , <counter-style>? )",
    "counter-name": "<custom-ident>",
    "counter-style": "<counter-style-name>|symbols( )",
    "counter-style-name": "<custom-ident>",
    "counters()": "counters( <counter-name> , <string> , <counter-style>? )",
    "cross-fade()": "cross-fade( <cf-mixing-image> , <cf-final-image>? )",
    "cubic-bezier-timing-function": "ease|ease-in|ease-out|ease-in-out|cubic-bezier( <number [0,1]> , <number> , <number [0,1]> , <number> )",
    "deprecated-system-color": "ActiveBorder|ActiveCaption|AppWorkspace|Background|ButtonFace|ButtonHighlight|ButtonShadow|ButtonText|CaptionText|GrayText|Highlight|HighlightText|InactiveBorder|InactiveCaption|InactiveCaptionText|InfoBackground|InfoText|Menu|MenuText|Scrollbar|ThreeDDarkShadow|ThreeDFace|ThreeDHighlight|ThreeDLightShadow|ThreeDShadow|Window|WindowFrame|WindowText",
    "discretionary-lig-values": "[discretionary-ligatures|no-discretionary-ligatures]",
    "display-box": "contents|none",
    "display-inside": "flow|flow-root|table|flex|grid|ruby",
    "display-internal": "table-row-group|table-header-group|table-footer-group|table-row|table-cell|table-column-group|table-column|table-caption|ruby-base|ruby-text|ruby-base-container|ruby-text-container",
    "display-legacy": "inline-block|inline-list-item|inline-table|inline-flex|inline-grid",
    "display-listitem": "<display-outside>?&&[flow|flow-root]?&&list-item",
    "display-outside": "block|inline|run-in",
    "drop-shadow()": "drop-shadow( <length>{2,3} <color>? )",
    "east-asian-variant-values": "[jis78|jis83|jis90|jis04|simplified|traditional]",
    "east-asian-width-values": "[full-width|proportional-width]",
    "element()": "element( <custom-ident> , [first|start|last|first-except]? )|element( <id-selector> )",
    "ellipse()": "ellipse( [<shape-radius>{2}]? [at <position>]? )",
    "ending-shape": "circle|ellipse",
    "env()": "env( <custom-ident> , <declaration-value>? )",
    "exp()": "exp( <calc-sum> )",
    "explicit-track-list": "[<line-names>? <track-size>]+ <line-names>?",
    "family-name": "<string>|<custom-ident>+",
    "feature-tag-value": "<string> [<integer>|on|off]?",
    "feature-type": "@stylistic|@historical-forms|@styleset|@character-variant|@swash|@ornaments|@annotation",
    "feature-value-block": "<feature-type> '{' <feature-value-declaration-list> '}'",
    "feature-value-block-list": "<feature-value-block>+",
    "feature-value-declaration": "<custom-ident> : <integer>+ ;",
    "feature-value-declaration-list": "<feature-value-declaration>",
    "feature-value-name": "<custom-ident>",
    "fill-rule": "nonzero|evenodd",
    "filter-function": "<blur()>|<brightness()>|<contrast()>|<drop-shadow()>|<grayscale()>|<hue-rotate()>|<invert()>|<opacity()>|<saturate()>|<sepia()>",
    "filter-function-list": "[<filter-function>|<url>]+",
    "final-bg-layer": "<'background-color'>||<bg-image>||<bg-position> [/ <bg-size>]?||<repeat-style>||<attachment>||<box>||<box>",
    "fixed-breadth": "<length-percentage>",
    "fixed-repeat": "repeat( [<integer [1,\u221E]>] , [<line-names>? <fixed-size>]+ <line-names>? )",
    "fixed-size": "<fixed-breadth>|minmax( <fixed-breadth> , <track-breadth> )|minmax( <inflexible-breadth> , <fixed-breadth> )",
    "font-stretch-absolute": "normal|ultra-condensed|extra-condensed|condensed|semi-condensed|semi-expanded|expanded|extra-expanded|ultra-expanded|<percentage>",
    "font-variant-css21": "[normal|small-caps]",
    "font-weight-absolute": "normal|bold|<number [1,1000]>",
    "frequency-percentage": "<frequency>|<percentage>",
    "general-enclosed": "[<function-token> <any-value>? )]|[( <any-value>? )]",
    "generic-family": "<generic-script-specific>|<generic-complete>|<generic-incomplete>|<-non-standard-generic-family>",
    "generic-name": "serif|sans-serif|cursive|fantasy|monospace",
    "geometry-box": "<shape-box>|fill-box|stroke-box|view-box",
    gradient: "<linear-gradient()>|<repeating-linear-gradient()>|<radial-gradient()>|<repeating-radial-gradient()>|<conic-gradient()>|<repeating-conic-gradient()>|<-legacy-gradient>",
    "grayscale()": "grayscale( <number-percentage> )",
    "grid-line": "auto|<custom-ident>|[<integer>&&<custom-ident>?]|[span&&[<integer>||<custom-ident>]]",
    "historical-lig-values": "[historical-ligatures|no-historical-ligatures]",
    "hsl()": "hsl( <hue> <percentage> <percentage> [/ <alpha-value>]? )|hsl( <hue> , <percentage> , <percentage> , <alpha-value>? )",
    "hsla()": "hsla( <hue> <percentage> <percentage> [/ <alpha-value>]? )|hsla( <hue> , <percentage> , <percentage> , <alpha-value>? )",
    hue: "<number>|<angle>",
    "hue-rotate()": "hue-rotate( <angle> )",
    "hwb()": "hwb( [<hue>|none] [<percentage>|none] [<percentage>|none] [/ [<alpha-value>|none]]? )",
    "hypot()": "hypot( <calc-sum># )",
    image: "<url>|<image()>|<image-set()>|<element()>|<paint()>|<cross-fade()>|<gradient>",
    "image()": "image( <image-tags>? [<image-src>? , <color>?]! )",
    "image-set()": "image-set( <image-set-option># )",
    "image-set-option": "[<image>|<string>] [<resolution>||type( <string> )]",
    "image-src": "<url>|<string>",
    "image-tags": "ltr|rtl",
    "inflexible-breadth": "<length-percentage>|min-content|max-content|auto",
    "inset()": "inset( <length-percentage>{1,4} [round <'border-radius'>]? )",
    "invert()": "invert( <number-percentage> )",
    "keyframes-name": "<custom-ident>|<string>",
    "keyframe-block": "<keyframe-selector># { <declaration-list> }",
    "keyframe-block-list": "<keyframe-block>+",
    "keyframe-selector": "from|to|<percentage>|<timeline-range-name> <percentage>",
    "lab()": "lab( [<percentage>|<number>|none] [<percentage>|<number>|none] [<percentage>|<number>|none] [/ [<alpha-value>|none]]? )",
    "layer()": "layer( <layer-name> )",
    "layer-name": "<ident> ['.' <ident>]*",
    "lch()": "lch( [<percentage>|<number>|none] [<percentage>|<number>|none] [<hue>|none] [/ [<alpha-value>|none]]? )",
    "leader()": "leader( <leader-type> )",
    "leader-type": "dotted|solid|space|<string>",
    "length-percentage": "<length>|<percentage>",
    "light-dark()": "light-dark( <color> , <color> )",
    "line-names": "'[' <custom-ident>* ']'",
    "line-name-list": "[<line-names>|<name-repeat>]+",
    "line-style": "none|hidden|dotted|dashed|solid|double|groove|ridge|inset|outset",
    "line-width": "<length>|thin|medium|thick",
    "linear-color-hint": "<length-percentage>",
    "linear-color-stop": "<color> <color-stop-length>?",
    "linear-gradient()": "linear-gradient( [<angle>|to <side-or-corner>]? , <color-stop-list> )",
    "log()": "log( <calc-sum> , <calc-sum>? )",
    "mask-layer": "<mask-reference>||<position> [/ <bg-size>]?||<repeat-style>||<geometry-box>||[<geometry-box>|no-clip]||<compositing-operator>||<masking-mode>",
    "mask-position": "[<length-percentage>|left|center|right] [<length-percentage>|top|center|bottom]?",
    "mask-reference": "none|<image>|<mask-source>",
    "mask-source": "<url>",
    "masking-mode": "alpha|luminance|match-source",
    "matrix()": "matrix( <number>#{6} )",
    "matrix3d()": "matrix3d( <number>#{16} )",
    "max()": "max( <calc-sum># )",
    "media-and": "<media-in-parens> [and <media-in-parens>]+",
    "media-condition": "<media-not>|<media-and>|<media-or>|<media-in-parens>",
    "media-condition-without-or": "<media-not>|<media-and>|<media-in-parens>",
    "media-feature": "( [<mf-plain>|<mf-boolean>|<mf-range>] )",
    "media-in-parens": "( <media-condition> )|<media-feature>|<general-enclosed>",
    "media-not": "not <media-in-parens>",
    "media-or": "<media-in-parens> [or <media-in-parens>]+",
    "media-query": "<media-condition>|[not|only]? <media-type> [and <media-condition-without-or>]?",
    "media-query-list": "<media-query>#",
    "media-type": "<ident>",
    "mf-boolean": "<mf-name>",
    "mf-name": "<ident>",
    "mf-plain": "<mf-name> : <mf-value>",
    "mf-range": "<mf-name> ['<'|'>']? '='? <mf-value>|<mf-value> ['<'|'>']? '='? <mf-name>|<mf-value> '<' '='? <mf-name> '<' '='? <mf-value>|<mf-value> '>' '='? <mf-name> '>' '='? <mf-value>",
    "mf-value": "<number>|<dimension>|<ident>|<ratio>",
    "min()": "min( <calc-sum># )",
    "minmax()": "minmax( [<length-percentage>|min-content|max-content|auto] , [<length-percentage>|<flex>|min-content|max-content|auto] )",
    "mod()": "mod( <calc-sum> , <calc-sum> )",
    "name-repeat": "repeat( [<integer [1,\u221E]>|auto-fill] , <line-names>+ )",
    "named-color": "transparent|aliceblue|antiquewhite|aqua|aquamarine|azure|beige|bisque|black|blanchedalmond|blue|blueviolet|brown|burlywood|cadetblue|chartreuse|chocolate|coral|cornflowerblue|cornsilk|crimson|cyan|darkblue|darkcyan|darkgoldenrod|darkgray|darkgreen|darkgrey|darkkhaki|darkmagenta|darkolivegreen|darkorange|darkorchid|darkred|darksalmon|darkseagreen|darkslateblue|darkslategray|darkslategrey|darkturquoise|darkviolet|deeppink|deepskyblue|dimgray|dimgrey|dodgerblue|firebrick|floralwhite|forestgreen|fuchsia|gainsboro|ghostwhite|gold|goldenrod|gray|green|greenyellow|grey|honeydew|hotpink|indianred|indigo|ivory|khaki|lavender|lavenderblush|lawngreen|lemonchiffon|lightblue|lightcoral|lightcyan|lightgoldenrodyellow|lightgray|lightgreen|lightgrey|lightpink|lightsalmon|lightseagreen|lightskyblue|lightslategray|lightslategrey|lightsteelblue|lightyellow|lime|limegreen|linen|magenta|maroon|mediumaquamarine|mediumblue|mediumorchid|mediumpurple|mediumseagreen|mediumslateblue|mediumspringgreen|mediumturquoise|mediumvioletred|midnightblue|mintcream|mistyrose|moccasin|navajowhite|navy|oldlace|olive|olivedrab|orange|orangered|orchid|palegoldenrod|palegreen|paleturquoise|palevioletred|papayawhip|peachpuff|peru|pink|plum|powderblue|purple|rebeccapurple|red|rosybrown|royalblue|saddlebrown|salmon|sandybrown|seagreen|seashell|sienna|silver|skyblue|slateblue|slategray|slategrey|snow|springgreen|steelblue|tan|teal|thistle|tomato|turquoise|violet|wheat|white|whitesmoke|yellow|yellowgreen",
    "namespace-prefix": "<ident>",
    "ns-prefix": "[<ident-token>|'*']? '|'",
    "number-percentage": "<number>|<percentage>",
    "numeric-figure-values": "[lining-nums|oldstyle-nums]",
    "numeric-fraction-values": "[diagonal-fractions|stacked-fractions]",
    "numeric-spacing-values": "[proportional-nums|tabular-nums]",
    nth: "<an-plus-b>|even|odd",
    "opacity()": "opacity( [<number-percentage>] )",
    "overflow-position": "unsafe|safe",
    "outline-radius": "<length>|<percentage>",
    "page-body": "<declaration>? [; <page-body>]?|<page-margin-box> <page-body>",
    "page-margin-box": "<page-margin-box-type> '{' <declaration-list> '}'",
    "page-margin-box-type": "@top-left-corner|@top-left|@top-center|@top-right|@top-right-corner|@bottom-left-corner|@bottom-left|@bottom-center|@bottom-right|@bottom-right-corner|@left-top|@left-middle|@left-bottom|@right-top|@right-middle|@right-bottom",
    "page-selector-list": "[<page-selector>#]?",
    "page-selector": "<pseudo-page>+|<ident> <pseudo-page>*",
    "page-size": "A5|A4|A3|B5|B4|JIS-B5|JIS-B4|letter|legal|ledger",
    "path()": "path( [<fill-rule> ,]? <string> )",
    "paint()": "paint( <ident> , <declaration-value>? )",
    "perspective()": "perspective( [<length [0,\u221E]>|none] )",
    "polygon()": "polygon( <fill-rule>? , [<length-percentage> <length-percentage>]# )",
    position: "[[left|center|right]||[top|center|bottom]|[left|center|right|<length-percentage>] [top|center|bottom|<length-percentage>]?|[[left|right] <length-percentage>]&&[[top|bottom] <length-percentage>]]",
    "pow()": "pow( <calc-sum> , <calc-sum> )",
    "pseudo-class-selector": "':' <ident-token>|':' <function-token> <any-value> ')'",
    "pseudo-element-selector": "':' <pseudo-class-selector>|<legacy-pseudo-element-selector>",
    "pseudo-page": ": [left|right|first|blank]",
    quote: "open-quote|close-quote|no-open-quote|no-close-quote",
    "radial-gradient()": "radial-gradient( [<ending-shape>||<size>]? [at <position>]? , <color-stop-list> )",
    ratio: "<number [0,\u221E]> [/ <number [0,\u221E]>]?",
    "ray()": "ray( <angle>&&<ray-size>?&&contain?&&[at <position>]? )",
    "ray-size": "closest-side|closest-corner|farthest-side|farthest-corner|sides",
    "relative-selector": "<combinator>? <complex-selector>",
    "relative-selector-list": "<relative-selector>#",
    "relative-size": "larger|smaller",
    "rem()": "rem( <calc-sum> , <calc-sum> )",
    "repeat-style": "repeat-x|repeat-y|[repeat|space|round|no-repeat]{1,2}",
    "repeating-conic-gradient()": "repeating-conic-gradient( [from <angle>]? [at <position>]? , <angular-color-stop-list> )",
    "repeating-linear-gradient()": "repeating-linear-gradient( [<angle>|to <side-or-corner>]? , <color-stop-list> )",
    "repeating-radial-gradient()": "repeating-radial-gradient( [<ending-shape>||<size>]? [at <position>]? , <color-stop-list> )",
    "reversed-counter-name": "reversed( <counter-name> )",
    "rgb()": "rgb( <percentage>{3} [/ <alpha-value>]? )|rgb( <number>{3} [/ <alpha-value>]? )|rgb( <percentage>#{3} , <alpha-value>? )|rgb( <number>#{3} , <alpha-value>? )",
    "rgba()": "rgba( <percentage>{3} [/ <alpha-value>]? )|rgba( <number>{3} [/ <alpha-value>]? )|rgba( <percentage>#{3} , <alpha-value>? )|rgba( <number>#{3} , <alpha-value>? )",
    "rotate()": "rotate( [<angle>|<zero>] )",
    "rotate3d()": "rotate3d( <number> , <number> , <number> , [<angle>|<zero>] )",
    "rotateX()": "rotateX( [<angle>|<zero>] )",
    "rotateY()": "rotateY( [<angle>|<zero>] )",
    "rotateZ()": "rotateZ( [<angle>|<zero>] )",
    "round()": "round( <rounding-strategy>? , <calc-sum> , <calc-sum> )",
    "rounding-strategy": "nearest|up|down|to-zero",
    "saturate()": "saturate( <number-percentage> )",
    "scale()": "scale( [<number>|<percentage>]#{1,2} )",
    "scale3d()": "scale3d( [<number>|<percentage>]#{3} )",
    "scaleX()": "scaleX( [<number>|<percentage>] )",
    "scaleY()": "scaleY( [<number>|<percentage>] )",
    "scaleZ()": "scaleZ( [<number>|<percentage>] )",
    "scroll()": "scroll( [<axis>||<scroller>]? )",
    scroller: "root|nearest",
    "self-position": "center|start|end|self-start|self-end|flex-start|flex-end",
    "shape-radius": "<length-percentage>|closest-side|farthest-side",
    "sign()": "sign( <calc-sum> )",
    "skew()": "skew( [<angle>|<zero>] , [<angle>|<zero>]? )",
    "skewX()": "skewX( [<angle>|<zero>] )",
    "skewY()": "skewY( [<angle>|<zero>] )",
    "sepia()": "sepia( <number-percentage> )",
    shadow: "inset?&&<length>{2,4}&&<color>?",
    "shadow-t": "[<length>{2,3}&&<color>?]",
    shape: "rect( <top> , <right> , <bottom> , <left> )|rect( <top> <right> <bottom> <left> )",
    "shape-box": "<box>|margin-box",
    "side-or-corner": "[left|right]||[top|bottom]",
    "sin()": "sin( <calc-sum> )",
    "single-animation": "<'animation-duration'>||<easing-function>||<'animation-delay'>||<single-animation-iteration-count>||<single-animation-direction>||<single-animation-fill-mode>||<single-animation-play-state>||[none|<keyframes-name>]||<single-animation-timeline>",
    "single-animation-direction": "normal|reverse|alternate|alternate-reverse",
    "single-animation-fill-mode": "none|forwards|backwards|both",
    "single-animation-iteration-count": "infinite|<number>",
    "single-animation-play-state": "running|paused",
    "single-animation-timeline": "auto|none|<dashed-ident>|<scroll()>|<view()>",
    "single-transition": "[none|<single-transition-property>]||<time>||<easing-function>||<time>||<transition-behavior-value>",
    "single-transition-property": "all|<custom-ident>",
    size: "closest-side|farthest-side|closest-corner|farthest-corner|<length>|<length-percentage>{2}",
    "sqrt()": "sqrt( <calc-sum> )",
    "step-position": "jump-start|jump-end|jump-none|jump-both|start|end",
    "step-timing-function": "step-start|step-end|steps( <integer> [, <step-position>]? )",
    "subclass-selector": "<id-selector>|<class-selector>|<attribute-selector>|<pseudo-class-selector>",
    "supports-condition": "not <supports-in-parens>|<supports-in-parens> [and <supports-in-parens>]*|<supports-in-parens> [or <supports-in-parens>]*",
    "supports-in-parens": "( <supports-condition> )|<supports-feature>|<general-enclosed>",
    "supports-feature": "<supports-decl>|<supports-selector-fn>",
    "supports-decl": "( <declaration> )",
    "supports-selector-fn": "selector( <complex-selector> )",
    symbol: "<string>|<image>|<custom-ident>",
    "tan()": "tan( <calc-sum> )",
    target: "<target-counter()>|<target-counters()>|<target-text()>",
    "target-counter()": "target-counter( [<string>|<url>] , <custom-ident> , <counter-style>? )",
    "target-counters()": "target-counters( [<string>|<url>] , <custom-ident> , <string> , <counter-style>? )",
    "target-text()": "target-text( [<string>|<url>] , [content|before|after|first-letter]? )",
    "time-percentage": "<time>|<percentage>",
    "timeline-range-name": "cover|contain|entry|exit|entry-crossing|exit-crossing",
    "easing-function": "linear|<cubic-bezier-timing-function>|<step-timing-function>",
    "track-breadth": "<length-percentage>|<flex>|min-content|max-content|auto",
    "track-list": "[<line-names>? [<track-size>|<track-repeat>]]+ <line-names>?",
    "track-repeat": "repeat( [<integer [1,\u221E]>] , [<line-names>? <track-size>]+ <line-names>? )",
    "track-size": "<track-breadth>|minmax( <inflexible-breadth> , <track-breadth> )|fit-content( <length-percentage> )",
    "transform-function": "<matrix()>|<translate()>|<translateX()>|<translateY()>|<scale()>|<scaleX()>|<scaleY()>|<rotate()>|<skew()>|<skewX()>|<skewY()>|<matrix3d()>|<translate3d()>|<translateZ()>|<scale3d()>|<scaleZ()>|<rotate3d()>|<rotateX()>|<rotateY()>|<rotateZ()>|<perspective()>",
    "transform-list": "<transform-function>+",
    "transition-behavior-value": "normal|allow-discrete",
    "translate()": "translate( <length-percentage> , <length-percentage>? )",
    "translate3d()": "translate3d( <length-percentage> , <length-percentage> , <length> )",
    "translateX()": "translateX( <length-percentage> )",
    "translateY()": "translateY( <length-percentage> )",
    "translateZ()": "translateZ( <length> )",
    "type-or-unit": "string|color|url|integer|number|length|angle|time|frequency|cap|ch|em|ex|ic|lh|rlh|rem|vb|vi|vw|vh|vmin|vmax|mm|Q|cm|in|pt|pc|px|deg|grad|rad|turn|ms|s|Hz|kHz|%",
    "type-selector": "<wq-name>|<ns-prefix>? '*'",
    "var()": "var( <custom-property-name> , <declaration-value>? )",
    "view()": "view( [<axis>||<'view-timeline-inset'>]? )",
    "viewport-length": "auto|<length-percentage>",
    "visual-box": "content-box|padding-box|border-box",
    "wq-name": "<ns-prefix>? <ident-token>",
    "-legacy-gradient": "<-webkit-gradient()>|<-legacy-linear-gradient>|<-legacy-repeating-linear-gradient>|<-legacy-radial-gradient>|<-legacy-repeating-radial-gradient>",
    "-legacy-linear-gradient": "-moz-linear-gradient( <-legacy-linear-gradient-arguments> )|-webkit-linear-gradient( <-legacy-linear-gradient-arguments> )|-o-linear-gradient( <-legacy-linear-gradient-arguments> )",
    "-legacy-repeating-linear-gradient": "-moz-repeating-linear-gradient( <-legacy-linear-gradient-arguments> )|-webkit-repeating-linear-gradient( <-legacy-linear-gradient-arguments> )|-o-repeating-linear-gradient( <-legacy-linear-gradient-arguments> )",
    "-legacy-linear-gradient-arguments": "[<angle>|<side-or-corner>]? , <color-stop-list>",
    "-legacy-radial-gradient": "-moz-radial-gradient( <-legacy-radial-gradient-arguments> )|-webkit-radial-gradient( <-legacy-radial-gradient-arguments> )|-o-radial-gradient( <-legacy-radial-gradient-arguments> )",
    "-legacy-repeating-radial-gradient": "-moz-repeating-radial-gradient( <-legacy-radial-gradient-arguments> )|-webkit-repeating-radial-gradient( <-legacy-radial-gradient-arguments> )|-o-repeating-radial-gradient( <-legacy-radial-gradient-arguments> )",
    "-legacy-radial-gradient-arguments": "[<position> ,]? [[[<-legacy-radial-gradient-shape>||<-legacy-radial-gradient-size>]|[<length>|<percentage>]{2}] ,]? <color-stop-list>",
    "-legacy-radial-gradient-size": "closest-side|closest-corner|farthest-side|farthest-corner|contain|cover",
    "-legacy-radial-gradient-shape": "circle|ellipse",
    "-non-standard-font": "-apple-system-body|-apple-system-headline|-apple-system-subheadline|-apple-system-caption1|-apple-system-caption2|-apple-system-footnote|-apple-system-short-body|-apple-system-short-headline|-apple-system-short-subheadline|-apple-system-short-caption1|-apple-system-short-footnote|-apple-system-tall-body",
    "-non-standard-color": "-moz-ButtonDefault|-moz-ButtonHoverFace|-moz-ButtonHoverText|-moz-CellHighlight|-moz-CellHighlightText|-moz-Combobox|-moz-ComboboxText|-moz-Dialog|-moz-DialogText|-moz-dragtargetzone|-moz-EvenTreeRow|-moz-Field|-moz-FieldText|-moz-html-CellHighlight|-moz-html-CellHighlightText|-moz-mac-accentdarkestshadow|-moz-mac-accentdarkshadow|-moz-mac-accentface|-moz-mac-accentlightesthighlight|-moz-mac-accentlightshadow|-moz-mac-accentregularhighlight|-moz-mac-accentregularshadow|-moz-mac-chrome-active|-moz-mac-chrome-inactive|-moz-mac-focusring|-moz-mac-menuselect|-moz-mac-menushadow|-moz-mac-menutextselect|-moz-MenuHover|-moz-MenuHoverText|-moz-MenuBarText|-moz-MenuBarHoverText|-moz-nativehyperlinktext|-moz-OddTreeRow|-moz-win-communicationstext|-moz-win-mediatext|-moz-activehyperlinktext|-moz-default-background-color|-moz-default-color|-moz-hyperlinktext|-moz-visitedhyperlinktext|-webkit-activelink|-webkit-focus-ring-color|-webkit-link|-webkit-text",
    "-non-standard-image-rendering": "optimize-contrast|-moz-crisp-edges|-o-crisp-edges|-webkit-optimize-contrast",
    "-non-standard-overflow": "overlay|-moz-scrollbars-none|-moz-scrollbars-horizontal|-moz-scrollbars-vertical|-moz-hidden-unscrollable",
    "-non-standard-size": "intrinsic|min-intrinsic|-webkit-fill-available|-webkit-fit-content|-webkit-min-content|-webkit-max-content|-moz-available|-moz-fit-content|-moz-min-content|-moz-max-content",
    "-webkit-gradient()": "-webkit-gradient( <-webkit-gradient-type> , <-webkit-gradient-point> [, <-webkit-gradient-point>|, <-webkit-gradient-radius> , <-webkit-gradient-point>] [, <-webkit-gradient-radius>]? [, <-webkit-gradient-color-stop>]* )",
    "-webkit-gradient-color-stop": "from( <color> )|color-stop( [<number-zero-one>|<percentage>] , <color> )|to( <color> )",
    "-webkit-gradient-point": "[left|center|right|<length-percentage>] [top|center|bottom|<length-percentage>]",
    "-webkit-gradient-radius": "<length>|<percentage>",
    "-webkit-gradient-type": "linear|radial",
    "-webkit-mask-box-repeat": "repeat|stretch|round",
    "-ms-filter-function-list": "<-ms-filter-function>+",
    "-ms-filter-function": "<-ms-filter-function-progid>|<-ms-filter-function-legacy>",
    "-ms-filter-function-progid": "'progid:' [<ident-token> '.']* [<ident-token>|<function-token> <any-value>? )]",
    "-ms-filter-function-legacy": "<ident-token>|<function-token> <any-value>? )",
    "absolute-color-base": "<hex-color>|<absolute-color-function>|<named-color>|transparent",
    "absolute-color-function": "rgb( ) >|<rgba()>|<hsl()>|<hsla()>|<hwb()>|<lab()>|<lch()>|<oklab()>|<oklch()>|<color()>",
    age: "child|young|old",
    "attr-name": "<wq-name>",
    "attr-fallback": "<any-value>",
    "bg-clip": "<box>|border|text",
    bottom: "<length>|auto",
    "container-name": "<custom-ident>",
    "container-condition": "not <query-in-parens>|<query-in-parens> [[and <query-in-parens>]*|[or <query-in-parens>]*]",
    "coord-box": "content-box|padding-box|border-box|fill-box|stroke-box|view-box",
    "generic-voice": "[<age>? <gender> <integer>?]",
    gender: "male|female|neutral",
    "generic-script-specific": "generic( kai )|generic( fangsong )|generic( nastaliq )",
    "generic-complete": "serif|sans-serif|system-ui|cursive|fantasy|math|monospace",
    "generic-incomplete": "ui-serif|ui-sans-serif|ui-monospace|ui-rounded",
    "-non-standard-generic-family": "-apple-system|BlinkMacSystemFont",
    left: "<length>|auto",
    "color-base": "<hex-color>|<color-function>|<named-color>|<color-mix()>|transparent",
    "color-function": "<rgb()>|<rgba()>|<hsl()>|<hsla()>|<hwb()>|<lab()>|<lch()>|<oklab()>|<oklch()>|<color()>",
    "system-color": "AccentColor|AccentColorText|ActiveText|ButtonBorder|ButtonFace|ButtonText|Canvas|CanvasText|Field|FieldText|GrayText|Highlight|HighlightText|LinkText|Mark|MarkText|SelectedItem|SelectedItemText|VisitedText",
    "device-cmyk()": "<legacy-device-cmyk-syntax>|<modern-device-cmyk-syntax>",
    "legacy-device-cmyk-syntax": "device-cmyk( <number>#{4} )",
    "modern-device-cmyk-syntax": "device-cmyk( <cmyk-component>{4} [/ [<alpha-value>|none]]? )",
    "cmyk-component": "<number>|<percentage>|none",
    "color-mix()": "color-mix( <color-interpolation-method> , [<color>&&<percentage [0,100]>?]#{2} )",
    "color-interpolation-method": "in [<rectangular-color-space>|<polar-color-space> <hue-interpolation-method>?|<custom-color-space>]",
    "color-space": "<rectangular-color-space>|<polar-color-space>|<custom-color-space>",
    "rectangular-color-space": "srgb|srgb-linear|display-p3|a98-rgb|prophoto-rgb|rec2020|lab|oklab|xyz|xyz-d50|xyz-d65",
    "polar-color-space": "hsl|hwb|lch|oklch",
    "custom-color-space": "<dashed-ident>",
    "hue-interpolation-method": "[shorter|longer|increasing|decreasing] hue",
    paint: "none|<color>|<url> [none|<color>]?|context-fill|context-stroke",
    "palette-identifier": "<dashed-ident>",
    right: "<length>|auto",
    "scope-start": "<forgiving-selector-list>",
    "scope-end": "<forgiving-selector-list>",
    "forgiving-selector-list": "<complex-real-selector-list>",
    "forgiving-relative-selector-list": "<relative-real-selector-list>",
    "selector-list": "<complex-selector-list>",
    "complex-real-selector-list": "<complex-real-selector>#",
    "simple-selector-list": "<simple-selector>#",
    "relative-real-selector-list": "<relative-real-selector>#",
    "complex-selector-unit": "[<compound-selector>? <pseudo-compound-selector>*]!",
    "complex-real-selector": "<compound-selector> [<combinator>? <compound-selector>]*",
    "relative-real-selector": "<combinator>? <complex-real-selector>",
    "pseudo-compound-selector": "<pseudo-element-selector> <pseudo-class-selector>*",
    "simple-selector": "<type-selector>|<subclass-selector>",
    "legacy-pseudo-element-selector": "':' [before|after|first-line|first-letter]",
    "single-animation-composition": "replace|add|accumulate",
    "svg-length": "<percentage>|<length>|<number>",
    "svg-writing-mode": "lr-tb|rl-tb|tb-rl|lr|rl|tb",
    top: "<length>|auto",
    x: "<number>",
    y: "<number>",
    declaration: "<ident-token> : <declaration-value>? ['!' important]?",
    "declaration-list": "[<declaration>? ';']* <declaration>?",
    url: "url( <string> <url-modifier>* )|<url-token>",
    "url-modifier": "<ident>|<function-token> <any-value> )",
    "number-zero-one": "<number [0,1]>",
    "number-one-or-greater": "<number [1,\u221E]>",
    "color()": "color( <colorspace-params> [/ [<alpha-value>|none]]? )",
    "colorspace-params": "[<predefined-rgb-params>|<xyz-params>]",
    "predefined-rgb-params": "<predefined-rgb> [<number>|<percentage>|none]{3}",
    "predefined-rgb": "srgb|srgb-linear|display-p3|a98-rgb|prophoto-rgb|rec2020",
    "xyz-params": "<xyz-space> [<number>|<percentage>|none]{3}",
    "xyz-space": "xyz|xyz-d50|xyz-d65",
    "oklab()": "oklab( [<percentage>|<number>|none] [<percentage>|<number>|none] [<percentage>|<number>|none] [/ [<alpha-value>|none]]? )",
    "oklch()": "oklch( [<percentage>|<number>|none] [<percentage>|<number>|none] [<hue>|none] [/ [<alpha-value>|none]]? )",
    "offset-path": "<ray()>|<url>|<basic-shape>",
    "query-in-parens": "( <container-condition> )|( <size-feature> )|style( <style-query> )|<general-enclosed>",
    "size-feature": "<mf-plain>|<mf-boolean>|<mf-range>",
    "style-feature": "<declaration>",
    "style-query": "<style-condition>|<style-feature>",
    "style-condition": "not <style-in-parens>|<style-in-parens> [[and <style-in-parens>]*|[or <style-in-parens>]*]",
    "style-in-parens": "( <style-condition> )|( <style-feature> )|<general-enclosed>",
    "-non-standard-display": "-ms-inline-flexbox|-ms-grid|-ms-inline-grid|-webkit-flex|-webkit-inline-flex|-webkit-box|-webkit-inline-box|-moz-inline-stack|-moz-box|-moz-inline-box",
    "inset-area": "[[left|center|right|span-left|span-right|x-start|x-end|span-x-start|span-x-end|x-self-start|x-self-end|span-x-self-start|span-x-self-end|span-all]||[top|center|bottom|span-top|span-bottom|y-start|y-end|span-y-start|span-y-end|y-self-start|y-self-end|span-y-self-start|span-y-self-end|span-all]|[block-start|center|block-end|span-block-start|span-block-end|span-all]||[inline-start|center|inline-end|span-inline-start|span-inline-end|span-all]|[self-block-start|self-block-end|span-self-block-start|span-self-block-end|span-all]||[self-inline-start|self-inline-end|span-self-inline-start|span-self-inline-end|span-all]|[start|center|end|span-start|span-end|span-all]{1,2}|[self-start|center|self-end|span-self-start|span-self-end|span-all]{1,2}]",
    "position-area": "[[left|center|right|span-left|span-right|x-start|x-end|span-x-start|span-x-end|x-self-start|x-self-end|span-x-self-start|span-x-self-end|span-all]||[top|center|bottom|span-top|span-bottom|y-start|y-end|span-y-start|span-y-end|y-self-start|y-self-end|span-y-self-start|span-y-self-end|span-all]|[block-start|center|block-end|span-block-start|span-block-end|span-all]||[inline-start|center|inline-end|span-inline-start|span-inline-end|span-all]|[self-block-start|center|self-block-end|span-self-block-start|span-self-block-end|span-all]||[self-inline-start|center|self-inline-end|span-self-inline-start|span-self-inline-end|span-all]|[start|center|end|span-start|span-end|span-all]{1,2}|[self-start|center|self-end|span-self-start|span-self-end|span-all]{1,2}]",
    "anchor()": "anchor( <anchor-element>?&&<anchor-side> , <length-percentage>? )",
    "anchor-side": "inside|outside|top|left|right|bottom|start|end|self-start|self-end|<percentage>|center",
    "anchor-size()": "anchor-size( [<anchor-element>||<anchor-size>]? , <length-percentage>? )",
    "anchor-size": "width|height|block|inline|self-block|self-inline",
    "anchor-element": "<dashed-ident>",
    "try-size": "most-width|most-height|most-block-size|most-inline-size",
    "try-tactic": "flip-block||flip-inline||flip-start",
    "font-variant-css2": "normal|small-caps",
    "font-width-css3": "normal|ultra-condensed|extra-condensed|condensed|semi-condensed|semi-expanded|expanded|extra-expanded|ultra-expanded",
    "system-family-name": "caption|icon|menu|message-box|small-caption|status-bar"
  },
  properties: {
    "--*": "<declaration-value>",
    "-ms-accelerator": "false|true",
    "-ms-block-progression": "tb|rl|bt|lr",
    "-ms-content-zoom-chaining": "none|chained",
    "-ms-content-zooming": "none|zoom",
    "-ms-content-zoom-limit": "<'-ms-content-zoom-limit-min'> <'-ms-content-zoom-limit-max'>",
    "-ms-content-zoom-limit-max": "<percentage>",
    "-ms-content-zoom-limit-min": "<percentage>",
    "-ms-content-zoom-snap": "<'-ms-content-zoom-snap-type'>||<'-ms-content-zoom-snap-points'>",
    "-ms-content-zoom-snap-points": "snapInterval( <percentage> , <percentage> )|snapList( <percentage># )",
    "-ms-content-zoom-snap-type": "none|proximity|mandatory",
    "-ms-filter": "<string>",
    "-ms-flow-from": "[none|<custom-ident>]#",
    "-ms-flow-into": "[none|<custom-ident>]#",
    "-ms-grid-columns": "none|<track-list>|<auto-track-list>",
    "-ms-grid-rows": "none|<track-list>|<auto-track-list>",
    "-ms-high-contrast-adjust": "auto|none",
    "-ms-hyphenate-limit-chars": "auto|<integer>{1,3}",
    "-ms-hyphenate-limit-lines": "no-limit|<integer>",
    "-ms-hyphenate-limit-zone": "<percentage>|<length>",
    "-ms-ime-align": "auto|after",
    "-ms-overflow-style": "auto|none|scrollbar|-ms-autohiding-scrollbar",
    "-ms-scrollbar-3dlight-color": "<color>",
    "-ms-scrollbar-arrow-color": "<color>",
    "-ms-scrollbar-base-color": "<color>",
    "-ms-scrollbar-darkshadow-color": "<color>",
    "-ms-scrollbar-face-color": "<color>",
    "-ms-scrollbar-highlight-color": "<color>",
    "-ms-scrollbar-shadow-color": "<color>",
    "-ms-scrollbar-track-color": "<color>",
    "-ms-scroll-chaining": "chained|none",
    "-ms-scroll-limit": "<'-ms-scroll-limit-x-min'> <'-ms-scroll-limit-y-min'> <'-ms-scroll-limit-x-max'> <'-ms-scroll-limit-y-max'>",
    "-ms-scroll-limit-x-max": "auto|<length>",
    "-ms-scroll-limit-x-min": "<length>",
    "-ms-scroll-limit-y-max": "auto|<length>",
    "-ms-scroll-limit-y-min": "<length>",
    "-ms-scroll-rails": "none|railed",
    "-ms-scroll-snap-points-x": "snapInterval( <length-percentage> , <length-percentage> )|snapList( <length-percentage># )",
    "-ms-scroll-snap-points-y": "snapInterval( <length-percentage> , <length-percentage> )|snapList( <length-percentage># )",
    "-ms-scroll-snap-type": "none|proximity|mandatory",
    "-ms-scroll-snap-x": "<'-ms-scroll-snap-type'> <'-ms-scroll-snap-points-x'>",
    "-ms-scroll-snap-y": "<'-ms-scroll-snap-type'> <'-ms-scroll-snap-points-y'>",
    "-ms-scroll-translation": "none|vertical-to-horizontal",
    "-ms-text-autospace": "none|ideograph-alpha|ideograph-numeric|ideograph-parenthesis|ideograph-space",
    "-ms-touch-select": "grippers|none",
    "-ms-user-select": "none|element|text",
    "-ms-wrap-flow": "auto|both|start|end|maximum|clear",
    "-ms-wrap-margin": "<length>",
    "-ms-wrap-through": "wrap|none",
    "-moz-appearance": "none|button|button-arrow-down|button-arrow-next|button-arrow-previous|button-arrow-up|button-bevel|button-focus|caret|checkbox|checkbox-container|checkbox-label|checkmenuitem|dualbutton|groupbox|listbox|listitem|menuarrow|menubar|menucheckbox|menuimage|menuitem|menuitemtext|menulist|menulist-button|menulist-text|menulist-textfield|menupopup|menuradio|menuseparator|meterbar|meterchunk|progressbar|progressbar-vertical|progresschunk|progresschunk-vertical|radio|radio-container|radio-label|radiomenuitem|range|range-thumb|resizer|resizerpanel|scale-horizontal|scalethumbend|scalethumb-horizontal|scalethumbstart|scalethumbtick|scalethumb-vertical|scale-vertical|scrollbarbutton-down|scrollbarbutton-left|scrollbarbutton-right|scrollbarbutton-up|scrollbarthumb-horizontal|scrollbarthumb-vertical|scrollbartrack-horizontal|scrollbartrack-vertical|searchfield|separator|sheet|spinner|spinner-downbutton|spinner-textfield|spinner-upbutton|splitter|statusbar|statusbarpanel|tab|tabpanel|tabpanels|tab-scroll-arrow-back|tab-scroll-arrow-forward|textfield|textfield-multiline|toolbar|toolbarbutton|toolbarbutton-dropdown|toolbargripper|toolbox|tooltip|treeheader|treeheadercell|treeheadersortarrow|treeitem|treeline|treetwisty|treetwistyopen|treeview|-moz-mac-unified-toolbar|-moz-win-borderless-glass|-moz-win-browsertabbar-toolbox|-moz-win-communicationstext|-moz-win-communications-toolbox|-moz-win-exclude-glass|-moz-win-glass|-moz-win-mediatext|-moz-win-media-toolbox|-moz-window-button-box|-moz-window-button-box-maximized|-moz-window-button-close|-moz-window-button-maximize|-moz-window-button-minimize|-moz-window-button-restore|-moz-window-frame-bottom|-moz-window-frame-left|-moz-window-frame-right|-moz-window-titlebar|-moz-window-titlebar-maximized",
    "-moz-binding": "<url>|none",
    "-moz-border-bottom-colors": "<color>+|none",
    "-moz-border-left-colors": "<color>+|none",
    "-moz-border-right-colors": "<color>+|none",
    "-moz-border-top-colors": "<color>+|none",
    "-moz-context-properties": "none|[fill|fill-opacity|stroke|stroke-opacity]#",
    "-moz-float-edge": "border-box|content-box|margin-box|padding-box",
    "-moz-force-broken-image-icon": "0|1",
    "-moz-image-region": "<shape>|auto",
    "-moz-orient": "inline|block|horizontal|vertical",
    "-moz-outline-radius": "<outline-radius>{1,4} [/ <outline-radius>{1,4}]?",
    "-moz-outline-radius-bottomleft": "<outline-radius>",
    "-moz-outline-radius-bottomright": "<outline-radius>",
    "-moz-outline-radius-topleft": "<outline-radius>",
    "-moz-outline-radius-topright": "<outline-radius>",
    "-moz-stack-sizing": "ignore|stretch-to-fit",
    "-moz-text-blink": "none|blink",
    "-moz-user-focus": "ignore|normal|select-after|select-before|select-menu|select-same|select-all|none",
    "-moz-user-input": "auto|none|enabled|disabled",
    "-moz-user-modify": "read-only|read-write|write-only",
    "-moz-window-dragging": "drag|no-drag",
    "-moz-window-shadow": "default|menu|tooltip|sheet|none",
    "-webkit-appearance": "none|button|button-bevel|caps-lock-indicator|caret|checkbox|default-button|inner-spin-button|listbox|listitem|media-controls-background|media-controls-fullscreen-background|media-current-time-display|media-enter-fullscreen-button|media-exit-fullscreen-button|media-fullscreen-button|media-mute-button|media-overlay-play-button|media-play-button|media-seek-back-button|media-seek-forward-button|media-slider|media-sliderthumb|media-time-remaining-display|media-toggle-closed-captions-button|media-volume-slider|media-volume-slider-container|media-volume-sliderthumb|menulist|menulist-button|menulist-text|menulist-textfield|meter|progress-bar|progress-bar-value|push-button|radio|scrollbarbutton-down|scrollbarbutton-left|scrollbarbutton-right|scrollbarbutton-up|scrollbargripper-horizontal|scrollbargripper-vertical|scrollbarthumb-horizontal|scrollbarthumb-vertical|scrollbartrack-horizontal|scrollbartrack-vertical|searchfield|searchfield-cancel-button|searchfield-decoration|searchfield-results-button|searchfield-results-decoration|slider-horizontal|slider-vertical|sliderthumb-horizontal|sliderthumb-vertical|square-button|textarea|textfield|-apple-pay-button",
    "-webkit-border-before": "<'border-width'>||<'border-style'>||<color>",
    "-webkit-border-before-color": "<color>",
    "-webkit-border-before-style": "<'border-style'>",
    "-webkit-border-before-width": "<'border-width'>",
    "-webkit-box-reflect": "[above|below|right|left]? <length>? <image>?",
    "-webkit-line-clamp": "none|<integer>",
    "-webkit-mask": "[<mask-reference>||<position> [/ <bg-size>]?||<repeat-style>||[<box>|border|padding|content|text]||[<box>|border|padding|content]]#",
    "-webkit-mask-attachment": "<attachment>#",
    "-webkit-mask-clip": "[<box>|border|padding|content|text]#",
    "-webkit-mask-composite": "<composite-style>#",
    "-webkit-mask-image": "<mask-reference>#",
    "-webkit-mask-origin": "[<box>|border|padding|content]#",
    "-webkit-mask-position": "<position>#",
    "-webkit-mask-position-x": "[<length-percentage>|left|center|right]#",
    "-webkit-mask-position-y": "[<length-percentage>|top|center|bottom]#",
    "-webkit-mask-repeat": "<repeat-style>#",
    "-webkit-mask-repeat-x": "repeat|no-repeat|space|round",
    "-webkit-mask-repeat-y": "repeat|no-repeat|space|round",
    "-webkit-mask-size": "<bg-size>#",
    "-webkit-overflow-scrolling": "auto|touch",
    "-webkit-tap-highlight-color": "<color>",
    "-webkit-text-fill-color": "<color>",
    "-webkit-text-stroke": "<length>||<color>",
    "-webkit-text-stroke-color": "<color>",
    "-webkit-text-stroke-width": "<length>",
    "-webkit-touch-callout": "default|none",
    "-webkit-user-modify": "read-only|read-write|read-write-plaintext-only",
    "accent-color": "auto|<color>",
    "align-content": "normal|<baseline-position>|<content-distribution>|<overflow-position>? <content-position>",
    "align-items": "normal|stretch|<baseline-position>|[<overflow-position>? <self-position>]",
    "align-self": "auto|normal|stretch|<baseline-position>|<overflow-position>? <self-position>",
    "align-tracks": "[normal|<baseline-position>|<content-distribution>|<overflow-position>? <content-position>]#",
    all: "initial|inherit|unset|revert|revert-layer",
    "anchor-name": "none|<dashed-ident>#",
    "anchor-scope": "none|all|<dashed-ident>#",
    animation: "<single-animation>#",
    "animation-composition": "<single-animation-composition>#",
    "animation-delay": "<time>#",
    "animation-direction": "<single-animation-direction>#",
    "animation-duration": "<time>#",
    "animation-fill-mode": "<single-animation-fill-mode>#",
    "animation-iteration-count": "<single-animation-iteration-count>#",
    "animation-name": "[none|<keyframes-name>]#",
    "animation-play-state": "<single-animation-play-state>#",
    "animation-range": "[<'animation-range-start'> <'animation-range-end'>?]#",
    "animation-range-end": "[normal|<length-percentage>|<timeline-range-name> <length-percentage>?]#",
    "animation-range-start": "[normal|<length-percentage>|<timeline-range-name> <length-percentage>?]#",
    "animation-timing-function": "<easing-function>#",
    "animation-timeline": "<single-animation-timeline>#",
    appearance: "none|auto|textfield|menulist-button|<compat-auto>",
    "aspect-ratio": "auto|<ratio>",
    azimuth: "<angle>|[[left-side|far-left|left|center-left|center|center-right|right|far-right|right-side]||behind]|leftwards|rightwards",
    "backdrop-filter": "none|<filter-function-list>",
    "backface-visibility": "visible|hidden",
    background: "[<bg-layer> ,]* <final-bg-layer>",
    "background-attachment": "<attachment>#",
    "background-blend-mode": "<blend-mode>#",
    "background-clip": "<bg-clip>#",
    "background-color": "<color>",
    "background-image": "<bg-image>#",
    "background-origin": "<box>#",
    "background-position": "<bg-position>#",
    "background-position-x": "[center|[[left|right|x-start|x-end]? <length-percentage>?]!]#",
    "background-position-y": "[center|[[top|bottom|y-start|y-end]? <length-percentage>?]!]#",
    "background-repeat": "<repeat-style>#",
    "background-size": "<bg-size>#",
    "block-size": "<'width'>",
    border: "<line-width>||<line-style>||<color>",
    "border-block": "<'border-top-width'>||<'border-top-style'>||<color>",
    "border-block-color": "<'border-top-color'>{1,2}",
    "border-block-style": "<'border-top-style'>",
    "border-block-width": "<'border-top-width'>",
    "border-block-end": "<'border-top-width'>||<'border-top-style'>||<color>",
    "border-block-end-color": "<'border-top-color'>",
    "border-block-end-style": "<'border-top-style'>",
    "border-block-end-width": "<'border-top-width'>",
    "border-block-start": "<'border-top-width'>||<'border-top-style'>||<color>",
    "border-block-start-color": "<'border-top-color'>",
    "border-block-start-style": "<'border-top-style'>",
    "border-block-start-width": "<'border-top-width'>",
    "border-bottom": "<line-width>||<line-style>||<color>",
    "border-bottom-color": "<'border-top-color'>",
    "border-bottom-left-radius": "<length-percentage>{1,2}",
    "border-bottom-right-radius": "<length-percentage>{1,2}",
    "border-bottom-style": "<line-style>",
    "border-bottom-width": "<line-width>",
    "border-collapse": "collapse|separate",
    "border-color": "<color>{1,4}",
    "border-end-end-radius": "<length-percentage>{1,2}",
    "border-end-start-radius": "<length-percentage>{1,2}",
    "border-image": "<'border-image-source'>||<'border-image-slice'> [/ <'border-image-width'>|/ <'border-image-width'>? / <'border-image-outset'>]?||<'border-image-repeat'>",
    "border-image-outset": "[<length>|<number>]{1,4}",
    "border-image-repeat": "[stretch|repeat|round|space]{1,2}",
    "border-image-slice": "<number-percentage>{1,4}&&fill?",
    "border-image-source": "none|<image>",
    "border-image-width": "[<length-percentage>|<number>|auto]{1,4}",
    "border-inline": "<'border-top-width'>||<'border-top-style'>||<color>",
    "border-inline-end": "<'border-top-width'>||<'border-top-style'>||<color>",
    "border-inline-color": "<'border-top-color'>{1,2}",
    "border-inline-style": "<'border-top-style'>",
    "border-inline-width": "<'border-top-width'>",
    "border-inline-end-color": "<'border-top-color'>",
    "border-inline-end-style": "<'border-top-style'>",
    "border-inline-end-width": "<'border-top-width'>",
    "border-inline-start": "<'border-top-width'>||<'border-top-style'>||<color>",
    "border-inline-start-color": "<'border-top-color'>",
    "border-inline-start-style": "<'border-top-style'>",
    "border-inline-start-width": "<'border-top-width'>",
    "border-left": "<line-width>||<line-style>||<color>",
    "border-left-color": "<color>",
    "border-left-style": "<line-style>",
    "border-left-width": "<line-width>",
    "border-radius": "<length-percentage>{1,4} [/ <length-percentage>{1,4}]?",
    "border-right": "<line-width>||<line-style>||<color>",
    "border-right-color": "<color>",
    "border-right-style": "<line-style>",
    "border-right-width": "<line-width>",
    "border-spacing": "<length> <length>?",
    "border-start-end-radius": "<length-percentage>{1,2}",
    "border-start-start-radius": "<length-percentage>{1,2}",
    "border-style": "<line-style>{1,4}",
    "border-top": "<line-width>||<line-style>||<color>",
    "border-top-color": "<color>",
    "border-top-left-radius": "<length-percentage>{1,2}",
    "border-top-right-radius": "<length-percentage>{1,2}",
    "border-top-style": "<line-style>",
    "border-top-width": "<line-width>",
    "border-width": "<line-width>{1,4}",
    bottom: "<length>|<percentage>|auto",
    "box-align": "start|center|end|baseline|stretch",
    "box-decoration-break": "slice|clone",
    "box-direction": "normal|reverse|inherit",
    "box-flex": "<number>",
    "box-flex-group": "<integer>",
    "box-lines": "single|multiple",
    "box-ordinal-group": "<integer>",
    "box-orient": "horizontal|vertical|inline-axis|block-axis|inherit",
    "box-pack": "start|center|end|justify",
    "box-shadow": "none|<shadow>#",
    "box-sizing": "content-box|border-box",
    "break-after": "auto|avoid|always|all|avoid-page|page|left|right|recto|verso|avoid-column|column|avoid-region|region",
    "break-before": "auto|avoid|always|all|avoid-page|page|left|right|recto|verso|avoid-column|column|avoid-region|region",
    "break-inside": "auto|avoid|avoid-page|avoid-column|avoid-region",
    "caption-side": "top|bottom|block-start|block-end|inline-start|inline-end",
    caret: "<'caret-color'>||<'caret-shape'>",
    "caret-color": "auto|<color>",
    "caret-shape": "auto|bar|block|underscore",
    clear: "none|left|right|both|inline-start|inline-end",
    clip: "<shape>|auto",
    "clip-path": "<clip-source>|[<basic-shape>||<geometry-box>]|none",
    "clip-rule": "nonzero|evenodd",
    color: "<color>",
    "color-interpolation-filters": "auto|sRGB|linearRGB",
    "color-scheme": "normal|[light|dark|<custom-ident>]+&&only?",
    "column-count": "<integer>|auto",
    "column-fill": "auto|balance|balance-all",
    "column-gap": "normal|<length-percentage>",
    "column-rule": "<'column-rule-width'>||<'column-rule-style'>||<'column-rule-color'>",
    "column-rule-color": "<color>",
    "column-rule-style": "<'border-style'>",
    "column-rule-width": "<'border-width'>",
    "column-span": "none|all",
    "column-width": "<length>|auto",
    columns: "<'column-width'>||<'column-count'>",
    contain: "none|strict|content|[[size||inline-size]||layout||style||paint]",
    "contain-intrinsic-size": "[auto? [none|<length>]]{1,2}",
    "contain-intrinsic-block-size": "auto? [none|<length>]",
    "contain-intrinsic-height": "auto? [none|<length>]",
    "contain-intrinsic-inline-size": "auto? [none|<length>]",
    "contain-intrinsic-width": "auto? [none|<length>]",
    container: "<'container-name'> [/ <'container-type'>]?",
    "container-name": "none|<custom-ident>+",
    "container-type": "normal||[size|inline-size]",
    content: "normal|none|[<content-replacement>|<content-list>] [/ [<string>|<counter>]+]?",
    "content-visibility": "visible|auto|hidden",
    "counter-increment": "[<counter-name> <integer>?]+|none",
    "counter-reset": "[<counter-name> <integer>?|<reversed-counter-name> <integer>?]+|none",
    "counter-set": "[<counter-name> <integer>?]+|none",
    cursor: "[[<url> [<x> <y>]? ,]* [auto|default|none|context-menu|help|pointer|progress|wait|cell|crosshair|text|vertical-text|alias|copy|move|no-drop|not-allowed|e-resize|n-resize|ne-resize|nw-resize|s-resize|se-resize|sw-resize|w-resize|ew-resize|ns-resize|nesw-resize|nwse-resize|col-resize|row-resize|all-scroll|zoom-in|zoom-out|grab|grabbing|hand|-webkit-grab|-webkit-grabbing|-webkit-zoom-in|-webkit-zoom-out|-moz-grab|-moz-grabbing|-moz-zoom-in|-moz-zoom-out]]",
    d: "none|path( <string> )",
    cx: "<length>|<percentage>",
    cy: "<length>|<percentage>",
    direction: "ltr|rtl",
    display: "[<display-outside>||<display-inside>]|<display-listitem>|<display-internal>|<display-box>|<display-legacy>|<-non-standard-display>",
    "dominant-baseline": "auto|use-script|no-change|reset-size|ideographic|alphabetic|hanging|mathematical|central|middle|text-after-edge|text-before-edge",
    "empty-cells": "show|hide",
    "field-sizing": "content|fixed",
    fill: "<paint>",
    "fill-opacity": "<number-zero-one>",
    "fill-rule": "nonzero|evenodd",
    filter: "none|<filter-function-list>|<-ms-filter-function-list>",
    flex: "none|[<'flex-grow'> <'flex-shrink'>?||<'flex-basis'>]",
    "flex-basis": "content|<'width'>",
    "flex-direction": "row|row-reverse|column|column-reverse",
    "flex-flow": "<'flex-direction'>||<'flex-wrap'>",
    "flex-grow": "<number>",
    "flex-shrink": "<number>",
    "flex-wrap": "nowrap|wrap|wrap-reverse",
    float: "left|right|none|inline-start|inline-end",
    font: "[[<'font-style'>||<font-variant-css2>||<'font-weight'>||<font-width-css3>]? <'font-size'> [/ <'line-height'>]? <'font-family'>#]|<system-family-name>|<-non-standard-font>",
    "font-family": "[<family-name>|<generic-family>]#",
    "font-feature-settings": "normal|<feature-tag-value>#",
    "font-kerning": "auto|normal|none",
    "font-language-override": "normal|<string>",
    "font-optical-sizing": "auto|none",
    "font-palette": "normal|light|dark|<palette-identifier>",
    "font-variation-settings": "normal|[<string> <number>]#",
    "font-size": "<absolute-size>|<relative-size>|<length-percentage>",
    "font-size-adjust": "none|[ex-height|cap-height|ch-width|ic-width|ic-height]? [from-font|<number>]",
    "font-smooth": "auto|never|always|<absolute-size>|<length>",
    "font-stretch": "<font-stretch-absolute>",
    "font-style": "normal|italic|oblique <angle>?",
    "font-synthesis": "none|[weight||style||small-caps||position]",
    "font-synthesis-position": "auto|none",
    "font-synthesis-small-caps": "auto|none",
    "font-synthesis-style": "auto|none",
    "font-synthesis-weight": "auto|none",
    "font-variant": "normal|none|[<common-lig-values>||<discretionary-lig-values>||<historical-lig-values>||<contextual-alt-values>||stylistic( <feature-value-name> )||historical-forms||styleset( <feature-value-name># )||character-variant( <feature-value-name># )||swash( <feature-value-name> )||ornaments( <feature-value-name> )||annotation( <feature-value-name> )||[small-caps|all-small-caps|petite-caps|all-petite-caps|unicase|titling-caps]||<numeric-figure-values>||<numeric-spacing-values>||<numeric-fraction-values>||ordinal||slashed-zero||<east-asian-variant-values>||<east-asian-width-values>||ruby]",
    "font-variant-alternates": "normal|[stylistic( <feature-value-name> )||historical-forms||styleset( <feature-value-name># )||character-variant( <feature-value-name># )||swash( <feature-value-name> )||ornaments( <feature-value-name> )||annotation( <feature-value-name> )]",
    "font-variant-caps": "normal|small-caps|all-small-caps|petite-caps|all-petite-caps|unicase|titling-caps",
    "font-variant-east-asian": "normal|[<east-asian-variant-values>||<east-asian-width-values>||ruby]",
    "font-variant-emoji": "normal|text|emoji|unicode",
    "font-variant-ligatures": "normal|none|[<common-lig-values>||<discretionary-lig-values>||<historical-lig-values>||<contextual-alt-values>]",
    "font-variant-numeric": "normal|[<numeric-figure-values>||<numeric-spacing-values>||<numeric-fraction-values>||ordinal||slashed-zero]",
    "font-variant-position": "normal|sub|super",
    "font-weight": "<font-weight-absolute>|bolder|lighter",
    "forced-color-adjust": "auto|none",
    gap: "<'row-gap'> <'column-gap'>?",
    grid: "<'grid-template'>|<'grid-template-rows'> / [auto-flow&&dense?] <'grid-auto-columns'>?|[auto-flow&&dense?] <'grid-auto-rows'>? / <'grid-template-columns'>",
    "grid-area": "<grid-line> [/ <grid-line>]{0,3}",
    "grid-auto-columns": "<track-size>+",
    "grid-auto-flow": "[row|column]||dense",
    "grid-auto-rows": "<track-size>+",
    "grid-column": "<grid-line> [/ <grid-line>]?",
    "grid-column-end": "<grid-line>",
    "grid-column-gap": "<length-percentage>",
    "grid-column-start": "<grid-line>",
    "grid-gap": "<'grid-row-gap'> <'grid-column-gap'>?",
    "grid-row": "<grid-line> [/ <grid-line>]?",
    "grid-row-end": "<grid-line>",
    "grid-row-gap": "<length-percentage>",
    "grid-row-start": "<grid-line>",
    "grid-template": "none|[<'grid-template-rows'> / <'grid-template-columns'>]|[<line-names>? <string> <track-size>? <line-names>?]+ [/ <explicit-track-list>]?",
    "grid-template-areas": "none|<string>+",
    "grid-template-columns": "none|<track-list>|<auto-track-list>|subgrid <line-name-list>?",
    "grid-template-rows": "none|<track-list>|<auto-track-list>|subgrid <line-name-list>?",
    "hanging-punctuation": "none|[first||[force-end|allow-end]||last]",
    height: "auto|<length>|<percentage>|min-content|max-content|fit-content|fit-content( <length-percentage> )|stretch|<-non-standard-size>",
    "hyphenate-character": "auto|<string>",
    "hyphenate-limit-chars": "[auto|<integer>]{1,3}",
    hyphens: "none|manual|auto",
    "image-orientation": "from-image|<angle>|[<angle>? flip]",
    "image-rendering": "auto|crisp-edges|pixelated|optimizeSpeed|optimizeQuality|<-non-standard-image-rendering>",
    "image-resolution": "[from-image||<resolution>]&&snap?",
    "ime-mode": "auto|normal|active|inactive|disabled",
    "initial-letter": "normal|[<number> <integer>?]",
    "initial-letter-align": "[auto|alphabetic|hanging|ideographic]",
    "inline-size": "<'width'>",
    "input-security": "auto|none",
    inset: "<'top'>{1,4}",
    "inset-area": "none|<inset-area>",
    "inset-block": "<'top'>{1,2}",
    "inset-block-end": "<'top'>",
    "inset-block-start": "<'top'>",
    "inset-inline": "<'top'>{1,2}",
    "inset-inline-end": "<'top'>",
    "inset-inline-start": "<'top'>",
    isolation: "auto|isolate",
    "justify-content": "normal|<content-distribution>|<overflow-position>? [<content-position>|left|right]",
    "justify-items": "normal|stretch|<baseline-position>|<overflow-position>? [<self-position>|left|right]|legacy|legacy&&[left|right|center]",
    "justify-self": "auto|normal|stretch|<baseline-position>|<overflow-position>? [<self-position>|left|right]",
    "justify-tracks": "[normal|<content-distribution>|<overflow-position>? [<content-position>|left|right]]#",
    left: "<length>|<percentage>|auto",
    "letter-spacing": "normal|<length-percentage>",
    "line-break": "auto|loose|normal|strict|anywhere",
    "line-clamp": "none|<integer>",
    "line-height": "normal|<number>|<length>|<percentage>",
    "line-height-step": "<length>",
    "list-style": "<'list-style-type'>||<'list-style-position'>||<'list-style-image'>",
    "list-style-image": "<image>|none",
    "list-style-position": "inside|outside",
    "list-style-type": "<counter-style>|<string>|none",
    margin: "[<length>|<percentage>|auto]{1,4}",
    "margin-block": "<'margin-left'>{1,2}",
    "margin-block-end": "<'margin-left'>",
    "margin-block-start": "<'margin-left'>",
    "margin-bottom": "<length>|<percentage>|auto",
    "margin-inline": "<'margin-left'>{1,2}",
    "margin-inline-end": "<'margin-left'>",
    "margin-inline-start": "<'margin-left'>",
    "margin-left": "<length>|<percentage>|auto",
    "margin-right": "<length>|<percentage>|auto",
    "margin-top": "<length>|<percentage>|auto",
    "margin-trim": "none|in-flow|all",
    marker: "none|<url>",
    "marker-end": "none|<url>",
    "marker-mid": "none|<url>",
    "marker-start": "none|<url>",
    mask: "<mask-layer>#",
    "mask-border": "<'mask-border-source'>||<'mask-border-slice'> [/ <'mask-border-width'>? [/ <'mask-border-outset'>]?]?||<'mask-border-repeat'>||<'mask-border-mode'>",
    "mask-border-mode": "luminance|alpha",
    "mask-border-outset": "[<length>|<number>]{1,4}",
    "mask-border-repeat": "[stretch|repeat|round|space]{1,2}",
    "mask-border-slice": "<number-percentage>{1,4} fill?",
    "mask-border-source": "none|<image>",
    "mask-border-width": "[<length-percentage>|<number>|auto]{1,4}",
    "mask-clip": "[<geometry-box>|no-clip]#",
    "mask-composite": "<compositing-operator>#",
    "mask-image": "<mask-reference>#",
    "mask-mode": "<masking-mode>#",
    "mask-origin": "<geometry-box>#",
    "mask-position": "<position>#",
    "mask-repeat": "<repeat-style>#",
    "mask-size": "<bg-size>#",
    "mask-type": "luminance|alpha",
    "masonry-auto-flow": "[pack|next]||[definite-first|ordered]",
    "math-depth": "auto-add|add( <integer> )|<integer>",
    "math-shift": "normal|compact",
    "math-style": "normal|compact",
    "max-block-size": "<'max-width'>",
    "max-height": "none|<length-percentage>|min-content|max-content|fit-content|fit-content( <length-percentage> )|stretch|<-non-standard-size>",
    "max-inline-size": "<'max-width'>",
    "max-lines": "none|<integer>",
    "max-width": "none|<length-percentage>|min-content|max-content|fit-content|fit-content( <length-percentage> )|stretch|<-non-standard-size>",
    "min-block-size": "<'min-width'>",
    "min-height": "auto|<length>|<percentage>|min-content|max-content|fit-content|fit-content( <length-percentage> )|stretch|<-non-standard-size>",
    "min-inline-size": "<'min-width'>",
    "min-width": "auto|<length>|<percentage>|min-content|max-content|fit-content|fit-content( <length-percentage> )|stretch|<-non-standard-size>",
    "mix-blend-mode": "<blend-mode>|plus-lighter",
    "object-fit": "fill|contain|cover|none|scale-down",
    "object-position": "<position>",
    offset: "[<'offset-position'>? [<'offset-path'> [<'offset-distance'>||<'offset-rotate'>]?]?]! [/ <'offset-anchor'>]?",
    "offset-anchor": "auto|<position>",
    "offset-distance": "<length-percentage>",
    "offset-path": "none|<offset-path>||<coord-box>",
    "offset-position": "normal|auto|<position>",
    "offset-rotate": "[auto|reverse]||<angle>",
    opacity: "<alpha-value>",
    order: "<integer>",
    orphans: "<integer>",
    outline: "[<'outline-width'>||<'outline-style'>||<'outline-color'>]",
    "outline-color": "auto|<color>",
    "outline-offset": "<length>",
    "outline-style": "auto|<'border-style'>",
    "outline-width": "<line-width>",
    overflow: "[visible|hidden|clip|scroll|auto]{1,2}|<-non-standard-overflow>",
    "overflow-anchor": "auto|none",
    "overflow-block": "visible|hidden|clip|scroll|auto",
    "overflow-clip-box": "padding-box|content-box",
    "overflow-clip-margin": "<visual-box>||<length [0,\u221E]>",
    "overflow-inline": "visible|hidden|clip|scroll|auto",
    "overflow-wrap": "normal|break-word|anywhere",
    "overflow-x": "visible|hidden|clip|scroll|auto",
    "overflow-y": "visible|hidden|clip|scroll|auto",
    overlay: "none|auto",
    "overscroll-behavior": "[contain|none|auto]{1,2}",
    "overscroll-behavior-block": "contain|none|auto",
    "overscroll-behavior-inline": "contain|none|auto",
    "overscroll-behavior-x": "contain|none|auto",
    "overscroll-behavior-y": "contain|none|auto",
    padding: "[<length>|<percentage>]{1,4}",
    "padding-block": "<'padding-left'>{1,2}",
    "padding-block-end": "<'padding-left'>",
    "padding-block-start": "<'padding-left'>",
    "padding-bottom": "<length>|<percentage>",
    "padding-inline": "<'padding-left'>{1,2}",
    "padding-inline-end": "<'padding-left'>",
    "padding-inline-start": "<'padding-left'>",
    "padding-left": "<length>|<percentage>",
    "padding-right": "<length>|<percentage>",
    "padding-top": "<length>|<percentage>",
    page: "auto|<custom-ident>",
    "page-break-after": "auto|always|avoid|left|right|recto|verso",
    "page-break-before": "auto|always|avoid|left|right|recto|verso",
    "page-break-inside": "auto|avoid",
    "paint-order": "normal|[fill||stroke||markers]",
    perspective: "none|<length>",
    "perspective-origin": "<position>",
    "place-content": "<'align-content'> <'justify-content'>?",
    "place-items": "<'align-items'> <'justify-items'>?",
    "place-self": "<'align-self'> <'justify-self'>?",
    "pointer-events": "auto|none|visiblePainted|visibleFill|visibleStroke|visible|painted|fill|stroke|all|inherit",
    position: "static|relative|absolute|sticky|fixed|-webkit-sticky",
    "position-anchor": "<anchor-element>",
    "position-try": "<'position-try-order'>? <'position-try-fallbacks'>",
    "position-try-fallbacks": "none|[[<dashed-ident>||<try-tactic>]|<'position-area'>]#",
    "position-try-order": "normal|<try-size>",
    "position-visibility": "always|[anchors-valid||anchors-visible||no-overflow]",
    "print-color-adjust": "economy|exact",
    quotes: "none|auto|[<string> <string>]+",
    r: "<length>|<percentage>",
    resize: "none|both|horizontal|vertical|block|inline",
    right: "<length>|<percentage>|auto",
    rotate: "none|<angle>|[x|y|z|<number>{3}]&&<angle>",
    "row-gap": "normal|<length-percentage>",
    "ruby-align": "start|center|space-between|space-around",
    "ruby-merge": "separate|collapse|auto",
    "ruby-position": "[alternate||[over|under]]|inter-character",
    rx: "<length>|<percentage>",
    ry: "<length>|<percentage>",
    scale: "none|<number>{1,3}",
    "scrollbar-color": "auto|<color>{2}",
    "scrollbar-gutter": "auto|stable&&both-edges?",
    "scrollbar-width": "auto|thin|none",
    "scroll-behavior": "auto|smooth",
    "scroll-margin": "<length>{1,4}",
    "scroll-margin-block": "<length>{1,2}",
    "scroll-margin-block-start": "<length>",
    "scroll-margin-block-end": "<length>",
    "scroll-margin-bottom": "<length>",
    "scroll-margin-inline": "<length>{1,2}",
    "scroll-margin-inline-start": "<length>",
    "scroll-margin-inline-end": "<length>",
    "scroll-margin-left": "<length>",
    "scroll-margin-right": "<length>",
    "scroll-margin-top": "<length>",
    "scroll-padding": "[auto|<length-percentage>]{1,4}",
    "scroll-padding-block": "[auto|<length-percentage>]{1,2}",
    "scroll-padding-block-start": "auto|<length-percentage>",
    "scroll-padding-block-end": "auto|<length-percentage>",
    "scroll-padding-bottom": "auto|<length-percentage>",
    "scroll-padding-inline": "[auto|<length-percentage>]{1,2}",
    "scroll-padding-inline-start": "auto|<length-percentage>",
    "scroll-padding-inline-end": "auto|<length-percentage>",
    "scroll-padding-left": "auto|<length-percentage>",
    "scroll-padding-right": "auto|<length-percentage>",
    "scroll-padding-top": "auto|<length-percentage>",
    "scroll-snap-align": "[none|start|end|center]{1,2}",
    "scroll-snap-coordinate": "none|<position>#",
    "scroll-snap-destination": "<position>",
    "scroll-snap-points-x": "none|repeat( <length-percentage> )",
    "scroll-snap-points-y": "none|repeat( <length-percentage> )",
    "scroll-snap-stop": "normal|always",
    "scroll-snap-type": "none|[x|y|block|inline|both] [mandatory|proximity]?",
    "scroll-snap-type-x": "none|mandatory|proximity",
    "scroll-snap-type-y": "none|mandatory|proximity",
    "scroll-timeline": "[<'scroll-timeline-name'>||<'scroll-timeline-axis'>]#",
    "scroll-timeline-axis": "[block|inline|x|y]#",
    "scroll-timeline-name": "[none|<dashed-ident>]#",
    "shape-image-threshold": "<alpha-value>",
    "shape-margin": "<length-percentage>",
    "shape-outside": "none|[<shape-box>||<basic-shape>]|<image>",
    "shape-rendering": "auto|optimizeSpeed|crispEdges|geometricPrecision",
    "tab-size": "<integer>|<length>",
    "table-layout": "auto|fixed",
    "text-align": "start|end|left|right|center|justify|match-parent",
    "text-align-last": "auto|start|end|left|right|center|justify",
    "text-anchor": "start|middle|end",
    "text-combine-upright": "none|all|[digits <integer>?]",
    "text-decoration": "<'text-decoration-line'>||<'text-decoration-style'>||<'text-decoration-color'>||<'text-decoration-thickness'>",
    "text-decoration-color": "<color>",
    "text-decoration-line": "none|[underline||overline||line-through||blink]|spelling-error|grammar-error",
    "text-decoration-skip": "none|[objects||[spaces|[leading-spaces||trailing-spaces]]||edges||box-decoration]",
    "text-decoration-skip-ink": "auto|all|none",
    "text-decoration-style": "solid|double|dotted|dashed|wavy",
    "text-decoration-thickness": "auto|from-font|<length>|<percentage>",
    "text-emphasis": "<'text-emphasis-style'>||<'text-emphasis-color'>",
    "text-emphasis-color": "<color>",
    "text-emphasis-position": "[over|under]&&[right|left]",
    "text-emphasis-style": "none|[[filled|open]||[dot|circle|double-circle|triangle|sesame]]|<string>",
    "text-indent": "<length-percentage>&&hanging?&&each-line?",
    "text-justify": "auto|inter-character|inter-word|none",
    "text-orientation": "mixed|upright|sideways",
    "text-overflow": "[clip|ellipsis|<string>]{1,2}",
    "text-rendering": "auto|optimizeSpeed|optimizeLegibility|geometricPrecision",
    "text-shadow": "none|<shadow-t>#",
    "text-size-adjust": "none|auto|<percentage>",
    "text-spacing-trim": "space-all|normal|space-first|trim-start|trim-both|trim-all|auto",
    "text-transform": "none|capitalize|uppercase|lowercase|full-width|full-size-kana",
    "text-underline-offset": "auto|<length>|<percentage>",
    "text-underline-position": "auto|from-font|[under||[left|right]]",
    "text-wrap": "wrap|nowrap|balance|stable|pretty",
    "text-wrap-mode": "auto|wrap|nowrap",
    "text-wrap-style": "auto|balance|stable|pretty",
    "timeline-scope": "none|<dashed-ident>#",
    top: "<length>|<percentage>|auto",
    "touch-action": "auto|none|[[pan-x|pan-left|pan-right]||[pan-y|pan-up|pan-down]||pinch-zoom]|manipulation",
    transform: "none|<transform-list>",
    "transform-box": "content-box|border-box|fill-box|stroke-box|view-box",
    "transform-origin": "[<length-percentage>|left|center|right|top|bottom]|[[<length-percentage>|left|center|right]&&[<length-percentage>|top|center|bottom]] <length>?",
    "transform-style": "flat|preserve-3d",
    transition: "<single-transition>#",
    "transition-behavior": "<transition-behavior-value>#",
    "transition-delay": "<time>#",
    "transition-duration": "<time>#",
    "transition-property": "none|<single-transition-property>#",
    "transition-timing-function": "<easing-function>#",
    translate: "none|<length-percentage> [<length-percentage> <length>?]?",
    "unicode-bidi": "normal|embed|isolate|bidi-override|isolate-override|plaintext|-moz-isolate|-moz-isolate-override|-moz-plaintext|-webkit-isolate|-webkit-isolate-override|-webkit-plaintext",
    "user-select": "auto|text|none|contain|all",
    "vector-effect": "none|non-scaling-stroke|non-scaling-size|non-rotation|fixed-position",
    "vertical-align": "baseline|sub|super|text-top|text-bottom|middle|top|bottom|<percentage>|<length>",
    "view-timeline": "[<'view-timeline-name'> <'view-timeline-axis'>?]#",
    "view-timeline-axis": "[block|inline|x|y]#",
    "view-timeline-inset": "[[auto|<length-percentage>]{1,2}]#",
    "view-timeline-name": "none|<dashed-ident>#",
    "view-transition-name": "none|<custom-ident>",
    visibility: "visible|hidden|collapse",
    "white-space": "normal|pre|nowrap|pre-wrap|pre-line|break-spaces|[<'white-space-collapse'>||<'text-wrap'>||<'white-space-trim'>]",
    "white-space-collapse": "collapse|discard|preserve|preserve-breaks|preserve-spaces|break-spaces",
    widows: "<integer>",
    width: "auto|<length>|<percentage>|min-content|max-content|fit-content|fit-content( <length-percentage> )|stretch|<-non-standard-size>",
    "will-change": "auto|<animateable-feature>#",
    "word-break": "normal|break-all|keep-all|break-word|auto-phrase",
    "word-spacing": "normal|<length>",
    "word-wrap": "normal|break-word",
    "writing-mode": "horizontal-tb|vertical-rl|vertical-lr|sideways-rl|sideways-lr|<svg-writing-mode>",
    x: "<length>|<percentage>",
    y: "<length>|<percentage>",
    "z-index": "auto|<integer>",
    zoom: "normal|reset|<number>|<percentage>",
    "-moz-background-clip": "padding|border",
    "-moz-border-radius-bottomleft": "<'border-bottom-left-radius'>",
    "-moz-border-radius-bottomright": "<'border-bottom-right-radius'>",
    "-moz-border-radius-topleft": "<'border-top-left-radius'>",
    "-moz-border-radius-topright": "<'border-bottom-right-radius'>",
    "-moz-control-character-visibility": "visible|hidden",
    "-moz-osx-font-smoothing": "auto|grayscale",
    "-moz-user-select": "none|text|all|-moz-none",
    "-ms-flex-align": "start|end|center|baseline|stretch",
    "-ms-flex-item-align": "auto|start|end|center|baseline|stretch",
    "-ms-flex-line-pack": "start|end|center|justify|distribute|stretch",
    "-ms-flex-negative": "<'flex-shrink'>",
    "-ms-flex-pack": "start|end|center|justify|distribute",
    "-ms-flex-order": "<integer>",
    "-ms-flex-positive": "<'flex-grow'>",
    "-ms-flex-preferred-size": "<'flex-basis'>",
    "-ms-interpolation-mode": "nearest-neighbor|bicubic",
    "-ms-grid-column-align": "start|end|center|stretch",
    "-ms-grid-row-align": "start|end|center|stretch",
    "-ms-hyphenate-limit-last": "none|always|column|page|spread",
    "-webkit-background-clip": "[<box>|border|padding|content|text]#",
    "-webkit-column-break-after": "always|auto|avoid",
    "-webkit-column-break-before": "always|auto|avoid",
    "-webkit-column-break-inside": "always|auto|avoid",
    "-webkit-font-smoothing": "auto|none|antialiased|subpixel-antialiased",
    "-webkit-mask-box-image": "[<url>|<gradient>|none] [<length-percentage>{4} <-webkit-mask-box-repeat>{2}]?",
    "-webkit-print-color-adjust": "economy|exact",
    "-webkit-text-security": "none|circle|disc|square",
    "-webkit-user-drag": "none|element|auto",
    "-webkit-user-select": "auto|none|text|all",
    "alignment-baseline": "auto|baseline|before-edge|text-before-edge|middle|central|after-edge|text-after-edge|ideographic|alphabetic|hanging|mathematical",
    "baseline-shift": "baseline|sub|super|<svg-length>",
    behavior: "<url>+",
    cue: "<'cue-before'> <'cue-after'>?",
    "cue-after": "<url> <decibel>?|none",
    "cue-before": "<url> <decibel>?|none",
    "glyph-orientation-horizontal": "<angle>",
    "glyph-orientation-vertical": "<angle>",
    kerning: "auto|<svg-length>",
    pause: "<'pause-before'> <'pause-after'>?",
    "pause-after": "<time>|none|x-weak|weak|medium|strong|x-strong",
    "pause-before": "<time>|none|x-weak|weak|medium|strong|x-strong",
    rest: "<'rest-before'> <'rest-after'>?",
    "rest-after": "<time>|none|x-weak|weak|medium|strong|x-strong",
    "rest-before": "<time>|none|x-weak|weak|medium|strong|x-strong",
    src: "[<url> [format( <string># )]?|local( <family-name> )]#",
    speak: "auto|never|always",
    "speak-as": "normal|spell-out||digits||[literal-punctuation|no-punctuation]",
    stroke: "<paint>",
    "stroke-dasharray": "none|[<svg-length>+]#",
    "stroke-dashoffset": "<svg-length>",
    "stroke-linecap": "butt|round|square",
    "stroke-linejoin": "miter|round|bevel",
    "stroke-miterlimit": "<number-one-or-greater>",
    "stroke-opacity": "<number-zero-one>",
    "stroke-width": "<svg-length>",
    "unicode-range": "<urange>#",
    "voice-balance": "<number>|left|center|right|leftwards|rightwards",
    "voice-duration": "auto|<time>",
    "voice-family": "[[<family-name>|<generic-voice>] ,]* [<family-name>|<generic-voice>]|preserve",
    "voice-pitch": "<frequency>&&absolute|[[x-low|low|medium|high|x-high]||[<frequency>|<semitones>|<percentage>]]",
    "voice-range": "<frequency>&&absolute|[[x-low|low|medium|high|x-high]||[<frequency>|<semitones>|<percentage>]]",
    "voice-rate": "[normal|x-slow|slow|medium|fast|x-fast]||<percentage>",
    "voice-stress": "normal|strong|moderate|none|reduced",
    "voice-volume": "silent|[[x-soft|soft|medium|loud|x-loud]||<decibel>]",
    "white-space-trim": "none|discard-before||discard-after||discard-inner",
    "position-area": "none|<position-area>"
  },
  atrules: {
    charset: {
      prelude: "<string>",
      descriptors: null
    },
    "counter-style": {
      prelude: "<counter-style-name>",
      descriptors: {
        "additive-symbols": "[<integer>&&<symbol>]#",
        fallback: "<counter-style-name>",
        negative: "<symbol> <symbol>?",
        pad: "<integer>&&<symbol>",
        prefix: "<symbol>",
        range: "[[<integer>|infinite]{2}]#|auto",
        "speak-as": "auto|bullets|numbers|words|spell-out|<counter-style-name>",
        suffix: "<symbol>",
        symbols: "<symbol>+",
        system: "cyclic|numeric|alphabetic|symbolic|additive|[fixed <integer>?]|[extends <counter-style-name>]"
      }
    },
    document: {
      prelude: "[<url>|url-prefix( <string> )|domain( <string> )|media-document( <string> )|regexp( <string> )]#",
      descriptors: null
    },
    "font-palette-values": {
      prelude: "<dashed-ident>",
      descriptors: {
        "base-palette": "light|dark|<integer [0,\u221E]>",
        "font-family": "<family-name>#",
        "override-colors": "[<integer [0,\u221E]> <absolute-color-base>]#"
      }
    },
    "font-face": {
      prelude: null,
      descriptors: {
        "ascent-override": "normal|<percentage>",
        "descent-override": "normal|<percentage>",
        "font-display": "[auto|block|swap|fallback|optional]",
        "font-family": "<family-name>",
        "font-feature-settings": "normal|<feature-tag-value>#",
        "font-variation-settings": "normal|[<string> <number>]#",
        "font-stretch": "<font-stretch-absolute>{1,2}",
        "font-style": "normal|italic|oblique <angle>{0,2}",
        "font-weight": "<font-weight-absolute>{1,2}",
        "line-gap-override": "normal|<percentage>",
        "size-adjust": "<percentage>",
        src: "[<url> [format( <string># )]?|local( <family-name> )]#",
        "unicode-range": "<urange>#"
      }
    },
    "font-feature-values": {
      prelude: "<family-name>#",
      descriptors: null
    },
    import: {
      prelude: "[<string>|<url>] [layer|layer( <layer-name> )]? [supports( [<supports-condition>|<declaration>] )]? <media-query-list>?",
      descriptors: null
    },
    keyframes: {
      prelude: "<keyframes-name>",
      descriptors: null
    },
    layer: {
      prelude: "[<layer-name>#|<layer-name>?]",
      descriptors: null
    },
    media: {
      prelude: "<media-query-list>",
      descriptors: null
    },
    namespace: {
      prelude: "<namespace-prefix>? [<string>|<url>]",
      descriptors: null
    },
    page: {
      prelude: "<page-selector-list>",
      descriptors: {
        bleed: "auto|<length>",
        marks: "none|[crop||cross]",
        "page-orientation": "upright|rotate-left|rotate-right",
        size: "<length>{1,2}|auto|[<page-size>||[portrait|landscape]]"
      }
    },
    "position-try": {
      prelude: "<dashed-ident>",
      descriptors: {
        top: "<'top'>",
        left: "<'left'>",
        bottom: "<'bottom'>",
        right: "<'right'>",
        "inset-block-start": "<'inset-block-start'>",
        "inset-block-end": "<'inset-block-end'>",
        "inset-inline-start": "<'inset-inline-start'>",
        "inset-inline-end": "<'inset-inline-end'>",
        "inset-block": "<'inset-block'>",
        "inset-inline": "<'inset-inline'>",
        inset: "<'inset'>",
        "margin-top": "<'margin-top'>",
        "margin-left": "<'margin-left'>",
        "margin-bottom": "<'margin-bottom'>",
        "margin-right": "<'margin-right'>",
        "margin-block-start": "<'margin-block-start'>",
        "margin-block-end": "<'margin-block-end'>",
        "margin-inline-start": "<'margin-inline-start'>",
        "margin-inline-end": "<'margin-inline-end'>",
        margin: "<'margin'>",
        "margin-block": "<'margin-block'>",
        "margin-inline": "<'margin-inline'>",
        width: "<'width'>",
        height: "<'height'>",
        "min-width": "<'min-width'>",
        "min-height": "<'min-height'>",
        "max-width": "<'max-width'>",
        "max-height": "<'max-height'>",
        "block-size": "<'block-size'>",
        "inline-size": "<'inline-size'>",
        "min-block-size": "<'min-block-size'>",
        "min-inline-size": "<'min-inline-size'>",
        "max-block-size": "<'max-block-size'>",
        "max-inline-size": "<'max-inline-size'>",
        "align-self": "<'align-self'>|anchor-center",
        "justify-self": "<'justify-self'>|anchor-center"
      }
    },
    property: {
      prelude: "<custom-property-name>",
      descriptors: {
        syntax: "<string>",
        inherits: "true|false",
        "initial-value": "<declaration-value>?"
      }
    },
    scope: {
      prelude: "[( <scope-start> )]? [to ( <scope-end> )]?",
      descriptors: null
    },
    "starting-style": {
      prelude: null,
      descriptors: null
    },
    supports: {
      prelude: "<supports-condition>",
      descriptors: null
    },
    container: {
      prelude: "[<container-name>]? <container-condition>",
      descriptors: null
    },
    nest: {
      prelude: "<complex-selector-list>",
      descriptors: null
    }
  }
};
var bt = {};
x(bt, {
  AnPlusB: () => Xr,
  Atrule: () => Zr,
  AtrulePrelude: () => en,
  AttributeSelector: () => nn,
  Block: () => an,
  Brackets: () => ln,
  CDC: () => un,
  CDO: () => hn,
  ClassSelector: () => fn,
  Combinator: () => gn,
  Comment: () => xn,
  Condition: () => kn,
  Declaration: () => vn,
  DeclarationList: () => Tn,
  Dimension: () => En,
  Feature: () => Pn,
  FeatureFunction: () => Dn,
  FeatureRange: () => zn,
  Function: () => Rn,
  GeneralEnclosed: () => Bn,
  Hash: () => jn,
  IdSelector: () => Hn,
  Identifier: () => Un,
  Layer: () => Yn,
  LayerList: () => Kn,
  MediaQuery: () => Xn,
  MediaQueryList: () => Zn,
  NestingSelector: () => ei,
  Nth: () => ri,
  Number: () => ii,
  Operator: () => ai,
  Parentheses: () => li,
  Percentage: () => ui,
  PseudoClassSelector: () => hi,
  PseudoElementSelector: () => fi,
  Ratio: () => gi,
  Raw: () => xi,
  Rule: () => ki,
  Scope: () => vi,
  Selector: () => Ci,
  SelectorList: () => Ai,
  String: () => Di,
  StyleSheet: () => Oi,
  SupportsDeclaration: () => Fi,
  TypeSelector: () => Bi,
  UnicodeRange: () => qi,
  Url: () => Vi,
  Value: () => Qi,
  WhiteSpace: () => $i
});
var Xr = {};
x(Xr, {
  generate: () => Kc,
  name: () => Yc,
  parse: () => Qr,
  structure: () => Vc
});
var de = 43,
  re = 45,
  Xt = 110,
  De = !0,
  Gc = !1;
function $t(e, t) {
  let r = this.tokenStart + e,
    n = this.charCodeAt(r);
  for ((n === de || n === re) && (t && this.error("Number sign is not allowed"), r++); r < this.tokenEnd; r++) W(this.charCodeAt(r)) || this.error("Integer is expected", r);
}
function Xe(e) {
  return $t.call(this, 0, e);
}
function Te(e, t) {
  if (!this.cmpChar(this.tokenStart + e, t)) {
    let r = "";
    switch (t) {
      case Xt:
        r = "N is expected";
        break;
      case re:
        r = "HyphenMinus is expected";
        break;
    }
    this.error(r, this.tokenStart + e);
  }
}
function Kr() {
  let e = 0,
    t = 0,
    r = this.tokenType;
  for (; r === 13 || r === 25;) r = this.lookupType(++e);
  if (r !== 10) if (this.isDelim(de, e) || this.isDelim(re, e)) {
    t = this.isDelim(de, e) ? de : re;
    do r = this.lookupType(++e); while (r === 13 || r === 25);
    r !== 10 && (this.skip(e), Xe.call(this, De));
  } else return null;
  return e > 0 && this.skip(e), t === 0 && (r = this.charCodeAt(this.tokenStart), r !== de && r !== re && this.error("Number sign is expected")), Xe.call(this, t !== 0), t === re ? "-" + this.consume(10) : this.consume(10);
}
var Yc = "AnPlusB",
  Vc = {
    a: [String, null],
    b: [String, null]
  };
function Qr() {
  let e = this.tokenStart,
    t = null,
    r = null;
  if (this.tokenType === 10) Xe.call(this, Gc), r = this.consume(10);else if (this.tokenType === 1 && this.cmpChar(this.tokenStart, re)) switch (t = "-1", Te.call(this, 1, Xt), this.tokenEnd - this.tokenStart) {
    case 2:
      this.next(), r = Kr.call(this);
      break;
    case 3:
      Te.call(this, 2, re), this.next(), this.skipSC(), Xe.call(this, De), r = "-" + this.consume(10);
      break;
    default:
      Te.call(this, 2, re), $t.call(this, 3, De), this.next(), r = this.substrToCursor(e + 2);
  } else if (this.tokenType === 1 || this.isDelim(de) && this.lookupType(1) === 1) {
    let n = 0;
    switch (t = "1", this.isDelim(de) && (n = 1, this.next()), Te.call(this, 0, Xt), this.tokenEnd - this.tokenStart) {
      case 1:
        this.next(), r = Kr.call(this);
        break;
      case 2:
        Te.call(this, 1, re), this.next(), this.skipSC(), Xe.call(this, De), r = "-" + this.consume(10);
        break;
      default:
        Te.call(this, 1, re), $t.call(this, 2, De), this.next(), r = this.substrToCursor(e + n + 1);
    }
  } else if (this.tokenType === 12) {
    let n = this.charCodeAt(this.tokenStart),
      i = n === de || n === re,
      o = this.tokenStart + i;
    for (; o < this.tokenEnd && W(this.charCodeAt(o)); o++);
    o === this.tokenStart + i && this.error("Integer is expected", this.tokenStart + i), Te.call(this, o - this.tokenStart, Xt), t = this.substring(e, o), o + 1 === this.tokenEnd ? (this.next(), r = Kr.call(this)) : (Te.call(this, o - this.tokenStart + 1, re), o + 2 === this.tokenEnd ? (this.next(), this.skipSC(), Xe.call(this, De), r = "-" + this.consume(10)) : ($t.call(this, o - this.tokenStart + 2, De), this.next(), r = this.substrToCursor(o + 1)));
  } else this.error();
  return t !== null && t.charCodeAt(0) === de && (t = t.substr(1)), r !== null && r.charCodeAt(0) === de && (r = r.substr(1)), {
    type: "AnPlusB",
    loc: this.getLocation(e, this.tokenStart),
    a: t,
    b: r
  };
}
function Kc(e) {
  if (e.a) {
    let t = e.a === "+1" && "n" || e.a === "1" && "n" || e.a === "-1" && "-n" || e.a + "n";
    if (e.b) {
      let r = e.b[0] === "-" || e.b[0] === "+" ? e.b : "+" + e.b;
      this.tokenize(t + r);
    } else this.tokenize(t);
  } else this.tokenize(e.b);
}
var Zr = {};
x(Zr, {
  generate: () => Jc,
  name: () => Xc,
  parse: () => $r,
  structure: () => Zc,
  walkContext: () => $c
});
function Fa() {
  return this.Raw(this.consumeUntilLeftCurlyBracketOrSemicolon, !0);
}
function Qc() {
  for (let e = 1, t; t = this.lookupType(e); e++) {
    if (t === 24) return !0;
    if (t === 23 || t === 3) return !1;
  }
  return !1;
}
var Xc = "Atrule",
  $c = "atrule",
  Zc = {
    name: String,
    prelude: ["AtrulePrelude", "Raw", null],
    block: ["Block", null]
  };
function $r(e = !1) {
  let t = this.tokenStart,
    r,
    n,
    i = null,
    o = null;
  switch (this.eat(3), r = this.substrToCursor(t + 1), n = r.toLowerCase(), this.skipSC(), this.eof === !1 && this.tokenType !== 23 && this.tokenType !== 17 && (this.parseAtrulePrelude ? i = this.parseWithFallback(this.AtrulePrelude.bind(this, r, e), Fa) : i = Fa.call(this, this.tokenIndex), this.skipSC()), this.tokenType) {
    case 17:
      this.next();
      break;
    case 23:
      this.eat(23), hasOwnProperty.call(this.atrule, n) && typeof this.atrule[n].block == "function" ? o = this.atrule[n].block.call(this, e) : o = this.Block(Qc.call(this)), this.eof || this.eat(24);
      break;
  }
  return {
    type: "Atrule",
    loc: this.getLocation(t, this.tokenStart),
    name: r,
    prelude: i,
    block: o
  };
}
function Jc(e) {
  this.token(3, "@" + e.name), e.prelude !== null && this.node(e.prelude), e.block ? (this.token(23, "{"), this.node(e.block), this.token(24, "}")) : this.token(17, ";");
}
var en = {};
x(en, {
  generate: () => nu,
  name: () => eu,
  parse: () => Jr,
  structure: () => ru,
  walkContext: () => tu
});
var eu = "AtrulePrelude",
  tu = "atrulePrelude",
  ru = {
    children: [[]]
  };
function Jr(e) {
  let t = null;
  return e !== null && (e = e.toLowerCase()), this.skipSC(), hasOwnProperty.call(this.atrule, e) && typeof this.atrule[e].prelude == "function" ? t = this.atrule[e].prelude.call(this) : t = this.readSequence(this.scope.AtrulePrelude), this.skipSC(), this.eof !== !0 && this.tokenType !== 23 && this.tokenType !== 17 && this.error("Semicolon or block is expected"), {
    type: "AtrulePrelude",
    loc: this.getLocationFromList(t),
    children: t
  };
}
function nu(e) {
  this.children(e);
}
var nn = {};
x(nn, {
  generate: () => pu,
  name: () => cu,
  parse: () => rn,
  structure: () => uu
});
var iu = 36,
  Ra = 42,
  Zt = 61,
  ou = 94,
  tn = 124,
  au = 126;
function su() {
  this.eof && this.error("Unexpected end of input");
  let e = this.tokenStart,
    t = !1;
  return this.isDelim(Ra) ? (t = !0, this.next()) : this.isDelim(tn) || this.eat(1), this.isDelim(tn) ? this.charCodeAt(this.tokenStart + 1) !== Zt ? (this.next(), this.eat(1)) : t && this.error("Identifier is expected", this.tokenEnd) : t && this.error("Vertical line is expected"), {
    type: "Identifier",
    loc: this.getLocation(e, this.tokenStart),
    name: this.substrToCursor(e)
  };
}
function lu() {
  let e = this.tokenStart,
    t = this.charCodeAt(e);
  return t !== Zt && t !== au && t !== ou && t !== iu && t !== Ra && t !== tn && this.error("Attribute selector (=, ~=, ^=, $=, *=, |=) is expected"), this.next(), t !== Zt && (this.isDelim(Zt) || this.error("Equal sign is expected"), this.next()), this.substrToCursor(e);
}
var cu = "AttributeSelector",
  uu = {
    name: "Identifier",
    matcher: [String, null],
    value: ["String", "Identifier", null],
    flags: [String, null]
  };
function rn() {
  let e = this.tokenStart,
    t,
    r = null,
    n = null,
    i = null;
  return this.eat(19), this.skipSC(), t = su.call(this), this.skipSC(), this.tokenType !== 20 && (this.tokenType !== 1 && (r = lu.call(this), this.skipSC(), n = this.tokenType === 5 ? this.String() : this.Identifier(), this.skipSC()), this.tokenType === 1 && (i = this.consume(1), this.skipSC())), this.eat(20), {
    type: "AttributeSelector",
    loc: this.getLocation(e, this.tokenStart),
    name: t,
    matcher: r,
    value: n,
    flags: i
  };
}
function pu(e) {
  this.token(9, "["), this.node(e.name), e.matcher !== null && (this.tokenize(e.matcher), this.node(e.value)), e.flags !== null && this.token(1, e.flags), this.token(9, "]");
}
var an = {};
x(an, {
  generate: () => bu,
  name: () => fu,
  parse: () => on,
  structure: () => gu,
  walkContext: () => du
});
var hu = 38;
function _a() {
  return this.Raw(null, !0);
}
function Ma() {
  return this.parseWithFallback(this.Rule, _a);
}
function Ba() {
  return this.Raw(this.consumeUntilSemicolonIncluded, !0);
}
function mu() {
  if (this.tokenType === 17) return Ba.call(this, this.tokenIndex);
  let e = this.parseWithFallback(this.Declaration, Ba);
  return this.tokenType === 17 && this.next(), e;
}
var fu = "Block",
  du = "block",
  gu = {
    children: [["Atrule", "Rule", "Declaration"]]
  };
function on(e) {
  let t = e ? mu : Ma,
    r = this.tokenStart,
    n = this.createList();
  e: for (; !this.eof;) switch (this.tokenType) {
    case 24:
      break e;
    case 13:
    case 25:
      this.next();
      break;
    case 3:
      n.push(this.parseWithFallback(this.Atrule.bind(this, e), _a));
      break;
    default:
      e && this.isDelim(hu) ? n.push(Ma.call(this)) : n.push(t.call(this));
  }
  return {
    type: "Block",
    loc: this.getLocation(r, this.tokenStart),
    children: n
  };
}
function bu(e) {
  this.children(e, t => {
    t.type === "Declaration" && this.token(17, ";");
  });
}
var ln = {};
x(ln, {
  generate: () => ku,
  name: () => xu,
  parse: () => sn,
  structure: () => yu
});
var xu = "Brackets",
  yu = {
    children: [[]]
  };
function sn(e, t) {
  let r = this.tokenStart,
    n = null;
  return this.eat(19), n = e.call(this, t), this.eof || this.eat(20), {
    type: "Brackets",
    loc: this.getLocation(r, this.tokenStart),
    children: n
  };
}
function ku(e) {
  this.token(9, "["), this.children(e), this.token(9, "]");
}
var un = {};
x(un, {
  generate: () => Su,
  name: () => wu,
  parse: () => cn,
  structure: () => vu
});
var wu = "CDC",
  vu = [];
function cn() {
  let e = this.tokenStart;
  return this.eat(15), {
    type: "CDC",
    loc: this.getLocation(e, this.tokenStart)
  };
}
function Su() {
  this.token(15, "-->");
}
var hn = {};
x(hn, {
  generate: () => Au,
  name: () => Cu,
  parse: () => pn,
  structure: () => Tu
});
var Cu = "CDO",
  Tu = [];
function pn() {
  let e = this.tokenStart;
  return this.eat(14), {
    type: "CDO",
    loc: this.getLocation(e, this.tokenStart)
  };
}
function Au() {
  this.token(14, "<!--");
}
var fn = {};
x(fn, {
  generate: () => Iu,
  name: () => Lu,
  parse: () => mn,
  structure: () => Pu
});
var Eu = 46,
  Lu = "ClassSelector",
  Pu = {
    name: String
  };
function mn() {
  return this.eatDelim(Eu), {
    type: "ClassSelector",
    loc: this.getLocation(this.tokenStart - 1, this.tokenEnd),
    name: this.consume(1)
  };
}
function Iu(e) {
  this.token(9, "."), this.token(1, e.name);
}
var gn = {};
x(gn, {
  generate: () => Ru,
  name: () => zu,
  parse: () => dn,
  structure: () => Fu
});
var Du = 43,
  ja = 47,
  Nu = 62,
  Ou = 126,
  zu = "Combinator",
  Fu = {
    name: String
  };
function dn() {
  let e = this.tokenStart,
    t;
  switch (this.tokenType) {
    case 13:
      t = " ";
      break;
    case 9:
      switch (this.charCodeAt(this.tokenStart)) {
        case Nu:
        case Du:
        case Ou:
          this.next();
          break;
        case ja:
          this.next(), this.eatIdent("deep"), this.eatDelim(ja);
          break;
        default:
          this.error("Combinator is expected");
      }
      t = this.substrToCursor(e);
      break;
  }
  return {
    type: "Combinator",
    loc: this.getLocation(e, this.tokenStart),
    name: t
  };
}
function Ru(e) {
  this.tokenize(e.name);
}
var xn = {};
x(xn, {
  generate: () => qu,
  name: () => _u,
  parse: () => bn,
  structure: () => ju
});
var Mu = 42,
  Bu = 47,
  _u = "Comment",
  ju = {
    value: String
  };
function bn() {
  let e = this.tokenStart,
    t = this.tokenEnd;
  return this.eat(25), t - e + 2 >= 2 && this.charCodeAt(t - 2) === Mu && this.charCodeAt(t - 1) === Bu && (t -= 2), {
    type: "Comment",
    loc: this.getLocation(e, this.tokenStart),
    value: this.substring(e + 2, t)
  };
}
function qu(e) {
  this.token(25, "/*" + e.value + "*/");
}
var kn = {};
x(kn, {
  generate: () => Yu,
  name: () => Wu,
  parse: () => yn,
  structure: () => Hu
});
var Uu = new Set([16, 22, 0]),
  Wu = "Condition",
  Hu = {
    kind: String,
    children: [["Identifier", "Feature", "FeatureFunction", "FeatureRange", "SupportsDeclaration"]]
  };
function qa(e) {
  return this.lookupTypeNonSC(1) === 1 && Uu.has(this.lookupTypeNonSC(2)) ? this.Feature(e) : this.FeatureRange(e);
}
var Gu = {
  media: qa,
  container: qa,
  supports() {
    return this.SupportsDeclaration();
  }
};
function yn(e = "media") {
  let t = this.createList();
  e: for (; !this.eof;) switch (this.tokenType) {
    case 25:
    case 13:
      this.next();
      continue;
    case 1:
      t.push(this.Identifier());
      break;
    case 21:
      {
        let r = this.parseWithFallback(() => Gu[e].call(this, e), () => null);
        r || (r = this.parseWithFallback(() => {
          this.eat(21);
          let n = this.Condition(e);
          return this.eat(22), n;
        }, () => this.GeneralEnclosed(e))), t.push(r);
        break;
      }
    case 2:
      {
        let r = this.parseWithFallback(() => this.FeatureFunction(e), () => null);
        r || (r = this.GeneralEnclosed(e)), t.push(r);
        break;
      }
    default:
      break e;
  }
  return t.isEmpty && this.error("Condition is expected"), {
    type: "Condition",
    loc: this.getLocationFromList(t),
    kind: e,
    children: t
  };
}
function Yu(e) {
  e.children.forEach(t => {
    t.type === "Condition" ? (this.token(21, "("), this.node(t), this.token(22, ")")) : this.node(t);
  });
}
var vn = {};
x(vn, {
  generate: () => ip,
  name: () => tp,
  parse: () => wn,
  structure: () => np,
  walkContext: () => rp
});
var Wa = 33,
  Vu = 35,
  Ku = 36,
  Qu = 38,
  Xu = 42,
  $u = 43,
  Ua = 47;
function Zu() {
  return this.Raw(this.consumeUntilExclamationMarkOrSemicolon, !0);
}
function Ju() {
  return this.Raw(this.consumeUntilExclamationMarkOrSemicolon, !1);
}
function ep() {
  let e = this.tokenIndex,
    t = this.Value();
  return t.type !== "Raw" && this.eof === !1 && this.tokenType !== 17 && this.isDelim(Wa) === !1 && this.isBalanceEdge(e) === !1 && this.error(), t;
}
var tp = "Declaration",
  rp = "declaration",
  np = {
    important: [Boolean, String],
    property: String,
    value: ["Value", "Raw"]
  };
function wn() {
  let e = this.tokenStart,
    t = this.tokenIndex,
    r = op.call(this),
    n = Rt(r),
    i = n ? this.parseCustomProperty : this.parseValue,
    o = n ? Ju : Zu,
    s = !1,
    u;
  this.skipSC(), this.eat(16);
  let l = this.tokenIndex;
  if (n || this.skipSC(), i ? u = this.parseWithFallback(ep, o) : u = o.call(this, this.tokenIndex), n && u.type === "Value" && u.children.isEmpty) {
    for (let a = l - this.tokenIndex; a <= 0; a++) if (this.lookupType(a) === 13) {
      u.children.appendData({
        type: "WhiteSpace",
        loc: null,
        value: " "
      });
      break;
    }
  }
  return this.isDelim(Wa) && (s = ap.call(this), this.skipSC()), this.eof === !1 && this.tokenType !== 17 && this.isBalanceEdge(t) === !1 && this.error(), {
    type: "Declaration",
    loc: this.getLocation(e, this.tokenStart),
    important: s,
    property: r,
    value: u
  };
}
function ip(e) {
  this.token(1, e.property), this.token(16, ":"), this.node(e.value), e.important && (this.token(9, "!"), this.token(1, e.important === !0 ? "important" : e.important));
}
function op() {
  let e = this.tokenStart;
  if (this.tokenType === 9) switch (this.charCodeAt(this.tokenStart)) {
    case Xu:
    case Ku:
    case $u:
    case Vu:
    case Qu:
      this.next();
      break;
    case Ua:
      this.next(), this.isDelim(Ua) && this.next();
      break;
  }
  return this.tokenType === 4 ? this.eat(4) : this.eat(1), this.substrToCursor(e);
}
function ap() {
  this.eat(9), this.skipSC();
  let e = this.consume(1);
  return e === "important" ? !0 : e;
}
var Tn = {};
x(Tn, {
  generate: () => up,
  name: () => lp,
  parse: () => Cn,
  structure: () => cp
});
var sp = 38;
function Sn() {
  return this.Raw(this.consumeUntilSemicolonIncluded, !0);
}
var lp = "DeclarationList",
  cp = {
    children: [["Declaration", "Atrule", "Rule"]]
  };
function Cn() {
  let e = this.createList();
  e: for (; !this.eof;) switch (this.tokenType) {
    case 13:
    case 25:
    case 17:
      this.next();
      break;
    case 3:
      e.push(this.parseWithFallback(this.Atrule.bind(this, !0), Sn));
      break;
    default:
      this.isDelim(sp) ? e.push(this.parseWithFallback(this.Rule, Sn)) : e.push(this.parseWithFallback(this.Declaration, Sn));
  }
  return {
    type: "DeclarationList",
    loc: this.getLocationFromList(e),
    children: e
  };
}
function up(e) {
  this.children(e, t => {
    t.type === "Declaration" && this.token(17, ";");
  });
}
var En = {};
x(En, {
  generate: () => mp,
  name: () => pp,
  parse: () => An,
  structure: () => hp
});
var pp = "Dimension",
  hp = {
    value: String,
    unit: String
  };
function An() {
  let e = this.tokenStart,
    t = this.consumeNumber(12);
  return {
    type: "Dimension",
    loc: this.getLocation(e, this.tokenStart),
    value: t,
    unit: this.substring(e + t.length, this.tokenStart)
  };
}
function mp(e) {
  this.token(12, e.value + e.unit);
}
var Pn = {};
x(Pn, {
  generate: () => bp,
  name: () => dp,
  parse: () => Ln,
  structure: () => gp
});
var fp = 47,
  dp = "Feature",
  gp = {
    kind: String,
    name: String,
    value: ["Identifier", "Number", "Dimension", "Ratio", "Function", null]
  };
function Ln(e) {
  let t = this.tokenStart,
    r,
    n = null;
  if (this.eat(21), this.skipSC(), r = this.consume(1), this.skipSC(), this.tokenType !== 22) {
    switch (this.eat(16), this.skipSC(), this.tokenType) {
      case 10:
        this.lookupNonWSType(1) === 9 ? n = this.Ratio() : n = this.Number();
        break;
      case 12:
        n = this.Dimension();
        break;
      case 1:
        n = this.Identifier();
        break;
      case 2:
        n = this.parseWithFallback(() => {
          let i = this.Function(this.readSequence, this.scope.Value);
          return this.skipSC(), this.isDelim(fp) && this.error(), i;
        }, () => this.Ratio());
        break;
      default:
        this.error("Number, dimension, ratio or identifier is expected");
    }
    this.skipSC();
  }
  return this.eof || this.eat(22), {
    type: "Feature",
    loc: this.getLocation(t, this.tokenStart),
    kind: e,
    name: r,
    value: n
  };
}
function bp(e) {
  this.token(21, "("), this.token(1, e.name), e.value !== null && (this.token(16, ":"), this.node(e.value)), this.token(22, ")");
}
var Dn = {};
x(Dn, {
  generate: () => wp,
  name: () => xp,
  parse: () => In,
  structure: () => yp
});
var xp = "FeatureFunction",
  yp = {
    kind: String,
    feature: String,
    value: ["Declaration", "Selector"]
  };
function kp(e, t) {
  let n = (this.features[e] || {})[t];
  return typeof n != "function" && this.error(`Unknown feature ${t}()`), n;
}
function In(e = "unknown") {
  let t = this.tokenStart,
    r = this.consumeFunctionName(),
    n = kp.call(this, e, r.toLowerCase());
  this.skipSC();
  let i = this.parseWithFallback(() => {
    let o = this.tokenIndex,
      s = n.call(this);
    return this.eof === !1 && this.isBalanceEdge(o) === !1 && this.error(), s;
  }, () => this.Raw(null, !1));
  return this.eof || this.eat(22), {
    type: "FeatureFunction",
    loc: this.getLocation(t, this.tokenStart),
    kind: e,
    feature: r,
    value: i
  };
}
function wp(e) {
  this.token(2, e.feature + "("), this.node(e.value), this.token(22, ")");
}
var zn = {};
x(zn, {
  generate: () => Ap,
  name: () => Cp,
  parse: () => On,
  structure: () => Tp
});
var Ha = 47,
  vp = 60,
  Ga = 61,
  Sp = 62,
  Cp = "FeatureRange",
  Tp = {
    kind: String,
    left: ["Identifier", "Number", "Dimension", "Ratio", "Function"],
    leftComparison: String,
    middle: ["Identifier", "Number", "Dimension", "Ratio", "Function"],
    rightComparison: [String, null],
    right: ["Identifier", "Number", "Dimension", "Ratio", "Function", null]
  };
function Nn() {
  switch (this.skipSC(), this.tokenType) {
    case 10:
      return this.isDelim(Ha, this.lookupOffsetNonSC(1)) ? this.Ratio() : this.Number();
    case 12:
      return this.Dimension();
    case 1:
      return this.Identifier();
    case 2:
      return this.parseWithFallback(() => {
        let e = this.Function(this.readSequence, this.scope.Value);
        return this.skipSC(), this.isDelim(Ha) && this.error(), e;
      }, () => this.Ratio());
    default:
      this.error("Number, dimension, ratio or identifier is expected");
  }
}
function Ya(e) {
  if (this.skipSC(), this.isDelim(vp) || this.isDelim(Sp)) {
    let t = this.source[this.tokenStart];
    return this.next(), this.isDelim(Ga) ? (this.next(), t + "=") : t;
  }
  if (this.isDelim(Ga)) return "=";
  this.error(`Expected ${e ? '":", ' : ""}"<", ">", "=" or ")"`);
}
function On(e = "unknown") {
  let t = this.tokenStart;
  this.skipSC(), this.eat(21);
  let r = Nn.call(this),
    n = Ya.call(this, r.type === "Identifier"),
    i = Nn.call(this),
    o = null,
    s = null;
  return this.lookupNonWSType(0) !== 22 && (o = Ya.call(this), s = Nn.call(this)), this.skipSC(), this.eat(22), {
    type: "FeatureRange",
    loc: this.getLocation(t, this.tokenStart),
    kind: e,
    left: r,
    leftComparison: n,
    middle: i,
    rightComparison: o,
    right: s
  };
}
function Ap(e) {
  this.token(21, "("), this.node(e.left), this.tokenize(e.leftComparison), this.node(e.middle), e.right && (this.tokenize(e.rightComparison), this.node(e.right)), this.token(22, ")");
}
var Rn = {};
x(Rn, {
  generate: () => Ip,
  name: () => Ep,
  parse: () => Fn,
  structure: () => Pp,
  walkContext: () => Lp
});
var Ep = "Function",
  Lp = "function",
  Pp = {
    name: String,
    children: [[]]
  };
function Fn(e, t) {
  let r = this.tokenStart,
    n = this.consumeFunctionName(),
    i = n.toLowerCase(),
    o;
  return o = t.hasOwnProperty(i) ? t[i].call(this, t) : e.call(this, t), this.eof || this.eat(22), {
    type: "Function",
    loc: this.getLocation(r, this.tokenStart),
    name: n,
    children: o
  };
}
function Ip(e) {
  this.token(2, e.name + "("), this.children(e), this.token(22, ")");
}
var Bn = {};
x(Bn, {
  generate: () => Op,
  name: () => Dp,
  parse: () => Mn,
  structure: () => Np
});
var Dp = "GeneralEnclosed",
  Np = {
    kind: String,
    function: [String, null],
    children: [[]]
  };
function Mn(e) {
  let t = this.tokenStart,
    r = null;
  this.tokenType === 2 ? r = this.consumeFunctionName() : this.eat(21);
  let n = this.parseWithFallback(() => {
    let i = this.tokenIndex,
      o = this.readSequence(this.scope.Value);
    return this.eof === !1 && this.isBalanceEdge(i) === !1 && this.error(), o;
  }, () => this.createSingleNodeList(this.Raw(null, !1)));
  return this.eof || this.eat(22), {
    type: "GeneralEnclosed",
    loc: this.getLocation(t, this.tokenStart),
    kind: e,
    function: r,
    children: n
  };
}
function Op(e) {
  e.function ? this.token(2, e.function + "(") : this.token(21, "("), this.children(e), this.token(22, ")");
}
var jn = {};
x(jn, {
  generate: () => Mp,
  name: () => Fp,
  parse: () => _n,
  structure: () => Rp,
  xxx: () => zp
});
var zp = "XXX",
  Fp = "Hash",
  Rp = {
    value: String
  };
function _n() {
  let e = this.tokenStart;
  return this.eat(4), {
    type: "Hash",
    loc: this.getLocation(e, this.tokenStart),
    value: this.substrToCursor(e + 1)
  };
}
function Mp(e) {
  this.token(4, "#" + e.value);
}
var Un = {};
x(Un, {
  generate: () => jp,
  name: () => Bp,
  parse: () => qn,
  structure: () => _p
});
var Bp = "Identifier",
  _p = {
    name: String
  };
function qn() {
  return {
    type: "Identifier",
    loc: this.getLocation(this.tokenStart, this.tokenEnd),
    name: this.consume(1)
  };
}
function jp(e) {
  this.token(1, e.name);
}
var Hn = {};
x(Hn, {
  generate: () => Wp,
  name: () => qp,
  parse: () => Wn,
  structure: () => Up
});
var qp = "IdSelector",
  Up = {
    name: String
  };
function Wn() {
  let e = this.tokenStart;
  return this.eat(4), {
    type: "IdSelector",
    loc: this.getLocation(e, this.tokenStart),
    name: this.substrToCursor(e + 1)
  };
}
function Wp(e) {
  this.token(9, "#" + e.name);
}
var Yn = {};
x(Yn, {
  generate: () => Vp,
  name: () => Gp,
  parse: () => Gn,
  structure: () => Yp
});
var Hp = 46,
  Gp = "Layer",
  Yp = {
    name: String
  };
function Gn() {
  let e = this.consume(1);
  for (; this.isDelim(Hp);) this.eat(9), e += "." + this.consume(1);
  return {
    type: "Layer",
    loc: this.getLocation(this.tokenStart, this.tokenEnd),
    name: e
  };
}
function Vp(e) {
  this.tokenize(e.name);
}
var Kn = {};
x(Kn, {
  generate: () => Xp,
  name: () => Kp,
  parse: () => Vn,
  structure: () => Qp
});
var Kp = "LayerList",
  Qp = {
    children: [["Layer"]]
  };
function Vn() {
  let e = this.createList();
  for (this.skipSC(); !this.eof && (e.push(this.Layer()), this.lookupTypeNonSC(0) === 18);) this.skipSC(), this.next(), this.skipSC();
  return {
    type: "LayerList",
    loc: this.getLocationFromList(e),
    children: e
  };
}
function Xp(e) {
  this.children(e, () => this.token(18, ","));
}
var Xn = {};
x(Xn, {
  generate: () => Jp,
  name: () => $p,
  parse: () => Qn,
  structure: () => Zp
});
var $p = "MediaQuery",
  Zp = {
    modifier: [String, null],
    mediaType: [String, null],
    condition: ["Condition", null]
  };
function Qn() {
  let e = this.tokenStart,
    t = null,
    r = null,
    n = null;
  if (this.skipSC(), this.tokenType === 1 && this.lookupTypeNonSC(1) !== 21) {
    let i = this.consume(1),
      o = i.toLowerCase();
    switch (o === "not" || o === "only" ? (this.skipSC(), t = o, r = this.consume(1)) : r = i, this.lookupTypeNonSC(0)) {
      case 1:
        {
          this.skipSC(), this.eatIdent("and"), n = this.Condition("media");
          break;
        }
      case 23:
      case 17:
      case 18:
      case 0:
        break;
      default:
        this.error("Identifier or parenthesis is expected");
    }
  } else switch (this.tokenType) {
    case 1:
    case 21:
    case 2:
      {
        n = this.Condition("media");
        break;
      }
    case 23:
    case 17:
    case 0:
      break;
    default:
      this.error("Identifier or parenthesis is expected");
  }
  return {
    type: "MediaQuery",
    loc: this.getLocation(e, this.tokenStart),
    modifier: t,
    mediaType: r,
    condition: n
  };
}
function Jp(e) {
  e.mediaType ? (e.modifier && this.token(1, e.modifier), this.token(1, e.mediaType), e.condition && (this.token(1, "and"), this.node(e.condition))) : e.condition && this.node(e.condition);
}
var Zn = {};
x(Zn, {
  generate: () => rh,
  name: () => eh,
  parse: () => $n,
  structure: () => th
});
var eh = "MediaQueryList",
  th = {
    children: [["MediaQuery"]]
  };
function $n() {
  let e = this.createList();
  for (this.skipSC(); !this.eof && (e.push(this.MediaQuery()), this.tokenType === 18);) this.next();
  return {
    type: "MediaQueryList",
    loc: this.getLocationFromList(e),
    children: e
  };
}
function rh(e) {
  this.children(e, () => this.token(18, ","));
}
var ei = {};
x(ei, {
  generate: () => ah,
  name: () => ih,
  parse: () => Jn,
  structure: () => oh
});
var nh = 38,
  ih = "NestingSelector",
  oh = {};
function Jn() {
  let e = this.tokenStart;
  return this.eatDelim(nh), {
    type: "NestingSelector",
    loc: this.getLocation(e, this.tokenStart)
  };
}
function ah() {
  this.token(9, "&");
}
var ri = {};
x(ri, {
  generate: () => ch,
  name: () => sh,
  parse: () => ti,
  structure: () => lh
});
var sh = "Nth",
  lh = {
    nth: ["AnPlusB", "Identifier"],
    selector: ["SelectorList", null]
  };
function ti() {
  this.skipSC();
  let e = this.tokenStart,
    t = e,
    r = null,
    n;
  return this.lookupValue(0, "odd") || this.lookupValue(0, "even") ? n = this.Identifier() : n = this.AnPlusB(), t = this.tokenStart, this.skipSC(), this.lookupValue(0, "of") && (this.next(), r = this.SelectorList(), t = this.tokenStart), {
    type: "Nth",
    loc: this.getLocation(e, t),
    nth: n,
    selector: r
  };
}
function ch(e) {
  this.node(e.nth), e.selector !== null && (this.token(1, "of"), this.node(e.selector));
}
var ii = {};
x(ii, {
  generate: () => hh,
  name: () => uh,
  parse: () => ni,
  structure: () => ph
});
var uh = "Number",
  ph = {
    value: String
  };
function ni() {
  return {
    type: "Number",
    loc: this.getLocation(this.tokenStart, this.tokenEnd),
    value: this.consume(10)
  };
}
function hh(e) {
  this.token(10, e.value);
}
var ai = {};
x(ai, {
  generate: () => dh,
  name: () => mh,
  parse: () => oi,
  structure: () => fh
});
var mh = "Operator",
  fh = {
    value: String
  };
function oi() {
  let e = this.tokenStart;
  return this.next(), {
    type: "Operator",
    loc: this.getLocation(e, this.tokenStart),
    value: this.substrToCursor(e)
  };
}
function dh(e) {
  this.tokenize(e.value);
}
var li = {};
x(li, {
  generate: () => xh,
  name: () => gh,
  parse: () => si,
  structure: () => bh
});
var gh = "Parentheses",
  bh = {
    children: [[]]
  };
function si(e, t) {
  let r = this.tokenStart,
    n = null;
  return this.eat(21), n = e.call(this, t), this.eof || this.eat(22), {
    type: "Parentheses",
    loc: this.getLocation(r, this.tokenStart),
    children: n
  };
}
function xh(e) {
  this.token(21, "("), this.children(e), this.token(22, ")");
}
var ui = {};
x(ui, {
  generate: () => wh,
  name: () => yh,
  parse: () => ci,
  structure: () => kh
});
var yh = "Percentage",
  kh = {
    value: String
  };
function ci() {
  return {
    type: "Percentage",
    loc: this.getLocation(this.tokenStart, this.tokenEnd),
    value: this.consumeNumber(11)
  };
}
function wh(e) {
  this.token(11, e.value + "%");
}
var hi = {};
x(hi, {
  generate: () => Th,
  name: () => vh,
  parse: () => pi,
  structure: () => Ch,
  walkContext: () => Sh
});
var vh = "PseudoClassSelector",
  Sh = "function",
  Ch = {
    name: String,
    children: [["Raw"], null]
  };
function pi() {
  let e = this.tokenStart,
    t = null,
    r,
    n;
  return this.eat(16), this.tokenType === 2 ? (r = this.consumeFunctionName(), n = r.toLowerCase(), this.lookupNonWSType(0) == 22 ? t = this.createList() : hasOwnProperty.call(this.pseudo, n) ? (this.skipSC(), t = this.pseudo[n].call(this), this.skipSC()) : (t = this.createList(), t.push(this.Raw(null, !1))), this.eat(22)) : r = this.consume(1), {
    type: "PseudoClassSelector",
    loc: this.getLocation(e, this.tokenStart),
    name: r,
    children: t
  };
}
function Th(e) {
  this.token(16, ":"), e.children === null ? this.token(1, e.name) : (this.token(2, e.name + "("), this.children(e), this.token(22, ")"));
}
var fi = {};
x(fi, {
  generate: () => Ph,
  name: () => Ah,
  parse: () => mi,
  structure: () => Lh,
  walkContext: () => Eh
});
var Ah = "PseudoElementSelector",
  Eh = "function",
  Lh = {
    name: String,
    children: [["Raw"], null]
  };
function mi() {
  let e = this.tokenStart,
    t = null,
    r,
    n;
  return this.eat(16), this.eat(16), this.tokenType === 2 ? (r = this.consumeFunctionName(), n = r.toLowerCase(), this.lookupNonWSType(0) == 22 ? t = this.createList() : hasOwnProperty.call(this.pseudo, n) ? (this.skipSC(), t = this.pseudo[n].call(this), this.skipSC()) : (t = this.createList(), t.push(this.Raw(null, !1))), this.eat(22)) : r = this.consume(1), {
    type: "PseudoElementSelector",
    loc: this.getLocation(e, this.tokenStart),
    name: r,
    children: t
  };
}
function Ph(e) {
  this.token(16, ":"), this.token(16, ":"), e.children === null ? this.token(1, e.name) : (this.token(2, e.name + "("), this.children(e), this.token(22, ")"));
}
var gi = {};
x(gi, {
  generate: () => Nh,
  name: () => Ih,
  parse: () => di,
  structure: () => Dh
});
var Va = 47;
function Ka() {
  switch (this.skipSC(), this.tokenType) {
    case 10:
      return this.Number();
    case 2:
      return this.Function(this.readSequence, this.scope.Value);
    default:
      this.error("Number of function is expected");
  }
}
var Ih = "Ratio",
  Dh = {
    left: ["Number", "Function"],
    right: ["Number", "Function", null]
  };
function di() {
  let e = this.tokenStart,
    t = Ka.call(this),
    r = null;
  return this.skipSC(), this.isDelim(Va) && (this.eatDelim(Va), r = Ka.call(this)), {
    type: "Ratio",
    loc: this.getLocation(e, this.tokenStart),
    left: t,
    right: r
  };
}
function Nh(e) {
  this.node(e.left), this.token(9, "/"), e.right ? this.node(e.right) : this.node(10, 1);
}
var xi = {};
x(xi, {
  generate: () => Rh,
  name: () => zh,
  parse: () => bi,
  structure: () => Fh
});
function Oh() {
  return this.tokenIndex > 0 && this.lookupType(-1) === 13 ? this.tokenIndex > 1 ? this.getTokenStart(this.tokenIndex - 1) : this.firstCharOffset : this.tokenStart;
}
var zh = "Raw",
  Fh = {
    value: String
  };
function bi(e, t) {
  let r = this.getTokenStart(this.tokenIndex),
    n;
  return this.skipUntilBalanced(this.tokenIndex, e || this.consumeUntilBalanceEnd), t && this.tokenStart > r ? n = Oh.call(this) : n = this.tokenStart, {
    type: "Raw",
    loc: this.getLocation(r, n),
    value: this.substring(r, n)
  };
}
function Rh(e) {
  this.tokenize(e.value);
}
var ki = {};
x(ki, {
  generate: () => qh,
  name: () => Bh,
  parse: () => yi,
  structure: () => jh,
  walkContext: () => _h
});
function Qa() {
  return this.Raw(this.consumeUntilLeftCurlyBracket, !0);
}
function Mh() {
  let e = this.SelectorList();
  return e.type !== "Raw" && this.eof === !1 && this.tokenType !== 23 && this.error(), e;
}
var Bh = "Rule",
  _h = "rule",
  jh = {
    prelude: ["SelectorList", "Raw"],
    block: ["Block"]
  };
function yi() {
  let e = this.tokenIndex,
    t = this.tokenStart,
    r,
    n;
  return this.parseRulePrelude ? r = this.parseWithFallback(Mh, Qa) : r = Qa.call(this, e), this.skipSC(), this.eat(23), n = this.Block(!0), this.eof || this.eat(24), {
    type: "Rule",
    loc: this.getLocation(t, this.tokenStart),
    prelude: r,
    block: n
  };
}
function qh(e) {
  this.node(e.prelude), this.token(23, "{"), this.node(e.block), this.token(24, "}");
}
var vi = {};
x(vi, {
  generate: () => Hh,
  name: () => Uh,
  parse: () => wi,
  structure: () => Wh
});
var Uh = "Scope",
  Wh = {
    root: ["SelectorList", "Raw", null],
    limit: ["SelectorList", "Raw", null]
  };
function wi() {
  let e = null,
    t = null;
  this.skipSC();
  let r = this.tokenStart;
  return this.tokenType === 21 && (this.next(), this.skipSC(), e = this.parseWithFallback(this.SelectorList, () => this.Raw(!1, !0)), this.skipSC(), this.eat(22)), this.lookupNonWSType(0) === 1 && (this.skipSC(), this.eatIdent("to"), this.skipSC(), this.eat(21), this.skipSC(), t = this.parseWithFallback(this.SelectorList, () => this.Raw(!1, !0)), this.skipSC(), this.eat(22)), {
    type: "Scope",
    loc: this.getLocation(r, this.tokenStart),
    root: e,
    limit: t
  };
}
function Hh(e) {
  e.root && (this.token(21, "("), this.node(e.root), this.token(22, ")")), e.limit && (this.token(1, "to"), this.token(21, "("), this.node(e.limit), this.token(22, ")"));
}
var Ci = {};
x(Ci, {
  generate: () => Vh,
  name: () => Gh,
  parse: () => Si,
  structure: () => Yh
});
var Gh = "Selector",
  Yh = {
    children: [["TypeSelector", "IdSelector", "ClassSelector", "AttributeSelector", "PseudoClassSelector", "PseudoElementSelector", "Combinator"]]
  };
function Si() {
  let e = this.readSequence(this.scope.Selector);
  return this.getFirstListNode(e) === null && this.error("Selector is expected"), {
    type: "Selector",
    loc: this.getLocationFromList(e),
    children: e
  };
}
function Vh(e) {
  this.children(e);
}
var Ai = {};
x(Ai, {
  generate: () => $h,
  name: () => Kh,
  parse: () => Ti,
  structure: () => Xh,
  walkContext: () => Qh
});
var Kh = "SelectorList",
  Qh = "selector",
  Xh = {
    children: [["Selector", "Raw"]]
  };
function Ti() {
  let e = this.createList();
  for (; !this.eof;) {
    if (e.push(this.Selector()), this.tokenType === 18) {
      this.next();
      continue;
    }
    break;
  }
  return {
    type: "SelectorList",
    loc: this.getLocationFromList(e),
    children: e
  };
}
function $h(e) {
  this.children(e, () => this.token(18, ","));
}
var Di = {};
x(Di, {
  generate: () => em,
  name: () => Zh,
  parse: () => Ii,
  structure: () => Jh
});
var Pi = exports.string = {};
x(Pi, {
  decode: () => dt,
  encode: () => Li
});
var Ei = 92,
  Xa = 34,
  $a = 39;
function dt(e) {
  let t = e.length,
    r = e.charCodeAt(0),
    n = r === Xa || r === $a ? 1 : 0,
    i = n === 1 && t > 1 && e.charCodeAt(t - 1) === r ? t - 2 : t - 1,
    o = "";
  for (let s = n; s <= i; s++) {
    let u = e.charCodeAt(s);
    if (u === Ei) {
      if (s === i) {
        s !== t - 1 && (o = e.substr(s + 1));
        break;
      }
      if (u = e.charCodeAt(++s), Z(Ei, u)) {
        let l = s - 1,
          a = le(e, l);
        s = a - 1, o += Me(e.substring(l + 1, a));
      } else u === 13 && e.charCodeAt(s + 1) === 10 && s++;
    } else o += e[s];
  }
  return o;
}
function Li(e, t) {
  let r = t ? "'" : '"',
    n = t ? $a : Xa,
    i = "",
    o = !1;
  for (let s = 0; s < e.length; s++) {
    let u = e.charCodeAt(s);
    if (u === 0) {
      i += "\uFFFD";
      continue;
    }
    if (u <= 31 || u === 127) {
      i += "\\" + u.toString(16), o = !0;
      continue;
    }
    u === n || u === Ei ? (i += "\\" + e.charAt(s), o = !1) : (o && (te(u) || he(u)) && (i += " "), i += e.charAt(s), o = !1);
  }
  return r + i + r;
}
var Zh = "String",
  Jh = {
    value: String
  };
function Ii() {
  return {
    type: "String",
    loc: this.getLocation(this.tokenStart, this.tokenEnd),
    value: dt(this.consume(5))
  };
}
function em(e) {
  this.token(5, Li(e.value));
}
var Oi = {};
x(Oi, {
  generate: () => om,
  name: () => rm,
  parse: () => Ni,
  structure: () => im,
  walkContext: () => nm
});
var tm = 33;
function Za() {
  return this.Raw(null, !1);
}
var rm = "StyleSheet",
  nm = "stylesheet",
  im = {
    children: [["Comment", "CDO", "CDC", "Atrule", "Rule", "Raw"]]
  };
function Ni() {
  let e = this.tokenStart,
    t = this.createList(),
    r;
  e: for (; !this.eof;) {
    switch (this.tokenType) {
      case 13:
        this.next();
        continue;
      case 25:
        if (this.charCodeAt(this.tokenStart + 2) !== tm) {
          this.next();
          continue;
        }
        r = this.Comment();
        break;
      case 14:
        r = this.CDO();
        break;
      case 15:
        r = this.CDC();
        break;
      case 3:
        r = this.parseWithFallback(this.Atrule, Za);
        break;
      default:
        r = this.parseWithFallback(this.Rule, Za);
    }
    t.push(r);
  }
  return {
    type: "StyleSheet",
    loc: this.getLocation(e, this.tokenStart),
    children: t
  };
}
function om(e) {
  this.children(e);
}
var Fi = {};
x(Fi, {
  generate: () => lm,
  name: () => am,
  parse: () => zi,
  structure: () => sm
});
var am = "SupportsDeclaration",
  sm = {
    declaration: "Declaration"
  };
function zi() {
  let e = this.tokenStart;
  this.eat(21), this.skipSC();
  let t = this.Declaration();
  return this.eof || this.eat(22), {
    type: "SupportsDeclaration",
    loc: this.getLocation(e, this.tokenStart),
    declaration: t
  };
}
function lm(e) {
  this.token(21, "("), this.node(e.declaration), this.token(22, ")");
}
var Bi = {};
x(Bi, {
  generate: () => hm,
  name: () => um,
  parse: () => Mi,
  structure: () => pm
});
var cm = 42,
  Ja = 124;
function Ri() {
  this.tokenType !== 1 && this.isDelim(cm) === !1 && this.error("Identifier or asterisk is expected"), this.next();
}
var um = "TypeSelector",
  pm = {
    name: String
  };
function Mi() {
  let e = this.tokenStart;
  return this.isDelim(Ja) ? (this.next(), Ri.call(this)) : (Ri.call(this), this.isDelim(Ja) && (this.next(), Ri.call(this))), {
    type: "TypeSelector",
    loc: this.getLocation(e, this.tokenStart),
    name: this.substrToCursor(e)
  };
}
function hm(e) {
  this.tokenize(e.name);
}
var qi = {};
x(qi, {
  generate: () => bm,
  name: () => dm,
  parse: () => ji,
  structure: () => gm
});
var es = 43,
  ts = 45,
  _i = 63;
function gt(e, t) {
  let r = 0;
  for (let n = this.tokenStart + e; n < this.tokenEnd; n++) {
    let i = this.charCodeAt(n);
    if (i === ts && t && r !== 0) return gt.call(this, e + r + 1, !1), -1;
    te(i) || this.error(t && r !== 0 ? "Hyphen minus" + (r < 6 ? " or hex digit" : "") + " is expected" : r < 6 ? "Hex digit is expected" : "Unexpected input", n), ++r > 6 && this.error("Too many hex digits", n);
  }
  return this.next(), r;
}
function Jt(e) {
  let t = 0;
  for (; this.isDelim(_i);) ++t > e && this.error("Too many question marks"), this.next();
}
function mm(e) {
  this.charCodeAt(this.tokenStart) !== e && this.error((e === es ? "Plus sign" : "Hyphen minus") + " is expected");
}
function fm() {
  let e = 0;
  switch (this.tokenType) {
    case 10:
      if (e = gt.call(this, 1, !0), this.isDelim(_i)) {
        Jt.call(this, 6 - e);
        break;
      }
      if (this.tokenType === 12 || this.tokenType === 10) {
        mm.call(this, ts), gt.call(this, 1, !1);
        break;
      }
      break;
    case 12:
      e = gt.call(this, 1, !0), e > 0 && Jt.call(this, 6 - e);
      break;
    default:
      if (this.eatDelim(es), this.tokenType === 1) {
        e = gt.call(this, 0, !0), e > 0 && Jt.call(this, 6 - e);
        break;
      }
      if (this.isDelim(_i)) {
        this.next(), Jt.call(this, 5);
        break;
      }
      this.error("Hex digit or question mark is expected");
  }
}
var dm = "UnicodeRange",
  gm = {
    value: String
  };
function ji() {
  let e = this.tokenStart;
  return this.eatIdent("u"), fm.call(this), {
    type: "UnicodeRange",
    loc: this.getLocation(e, this.tokenStart),
    value: this.substrToCursor(e)
  };
}
function bm(e) {
  this.tokenize(e.value);
}
var Vi = {};
x(Vi, {
  generate: () => Cm,
  name: () => vm,
  parse: () => Yi,
  structure: () => Sm
});
var Gi = exports.url = {};
x(Gi, {
  decode: () => Wi,
  encode: () => Hi
});
var xm = 32,
  Ui = 92,
  ym = 34,
  km = 39,
  wm = 40,
  rs = 41;
function Wi(e) {
  let t = e.length,
    r = 4,
    n = e.charCodeAt(t - 1) === rs ? t - 2 : t - 1,
    i = "";
  for (; r < n && he(e.charCodeAt(r));) r++;
  for (; r < n && he(e.charCodeAt(n));) n--;
  for (let o = r; o <= n; o++) {
    let s = e.charCodeAt(o);
    if (s === Ui) {
      if (o === n) {
        o !== t - 1 && (i = e.substr(o + 1));
        break;
      }
      if (s = e.charCodeAt(++o), Z(Ui, s)) {
        let u = o - 1,
          l = le(e, u);
        o = l - 1, i += Me(e.substring(u + 1, l));
      } else s === 13 && e.charCodeAt(o + 1) === 10 && o++;
    } else i += e[o];
  }
  return i;
}
function Hi(e) {
  let t = "",
    r = !1;
  for (let n = 0; n < e.length; n++) {
    let i = e.charCodeAt(n);
    if (i === 0) {
      t += "\uFFFD";
      continue;
    }
    if (i <= 31 || i === 127) {
      t += "\\" + i.toString(16), r = !0;
      continue;
    }
    i === xm || i === Ui || i === ym || i === km || i === wm || i === rs ? (t += "\\" + e.charAt(n), r = !1) : (r && te(i) && (t += " "), t += e.charAt(n), r = !1);
  }
  return "url(" + t + ")";
}
var vm = "Url",
  Sm = {
    value: String
  };
function Yi() {
  let e = this.tokenStart,
    t;
  switch (this.tokenType) {
    case 7:
      t = Wi(this.consume(7));
      break;
    case 2:
      this.cmpStr(this.tokenStart, this.tokenEnd, "url(") || this.error("Function name must be `url`"), this.eat(2), this.skipSC(), t = dt(this.consume(5)), this.skipSC(), this.eof || this.eat(22);
      break;
    default:
      this.error("Url or Function is expected");
  }
  return {
    type: "Url",
    loc: this.getLocation(e, this.tokenStart),
    value: t
  };
}
function Cm(e) {
  this.token(7, Hi(e.value));
}
var Qi = {};
x(Qi, {
  generate: () => Em,
  name: () => Tm,
  parse: () => Ki,
  structure: () => Am
});
var Tm = "Value",
  Am = {
    children: [[]]
  };
function Ki() {
  let e = this.tokenStart,
    t = this.readSequence(this.scope.Value);
  return {
    type: "Value",
    loc: this.getLocation(e, this.tokenStart),
    children: t
  };
}
function Em(e) {
  this.children(e);
}
var $i = {};
x($i, {
  generate: () => Dm,
  name: () => Pm,
  parse: () => Xi,
  structure: () => Im
});
var Lm = Object.freeze({
    type: "WhiteSpace",
    loc: null,
    value: " "
  }),
  Pm = "WhiteSpace",
  Im = {
    value: String
  };
function Xi() {
  return this.eat(13), Lm;
}
function Dm(e) {
  this.token(13, e.value);
}
var ns = {
  generic: !0,
  ...za,
  node: bt
};
var Zi = {};
x(Zi, {
  AtrulePrelude: () => os,
  Selector: () => ss,
  Value: () => ps
});
var Nm = 35,
  Om = 42,
  is = 43,
  zm = 45,
  Fm = 47,
  Rm = 117;
function xt(e) {
  switch (this.tokenType) {
    case 4:
      return this.Hash();
    case 18:
      return this.Operator();
    case 21:
      return this.Parentheses(this.readSequence, e.recognizer);
    case 19:
      return this.Brackets(this.readSequence, e.recognizer);
    case 5:
      return this.String();
    case 12:
      return this.Dimension();
    case 11:
      return this.Percentage();
    case 10:
      return this.Number();
    case 2:
      return this.cmpStr(this.tokenStart, this.tokenEnd, "url(") ? this.Url() : this.Function(this.readSequence, e.recognizer);
    case 7:
      return this.Url();
    case 1:
      return this.cmpChar(this.tokenStart, Rm) && this.cmpChar(this.tokenStart + 1, is) ? this.UnicodeRange() : this.Identifier();
    case 9:
      {
        let t = this.charCodeAt(this.tokenStart);
        if (t === Fm || t === Om || t === is || t === zm) return this.Operator();
        t === Nm && this.error("Hex or identifier is expected", this.tokenStart + 1);
        break;
      }
  }
}
var os = {
  getNode: xt
};
var Mm = 35,
  Bm = 38,
  _m = 42,
  jm = 43,
  qm = 47,
  as = 46,
  Um = 62,
  Wm = 124,
  Hm = 126;
function Gm(e, t) {
  t.last !== null && t.last.type !== "Combinator" && e !== null && e.type !== "Combinator" && t.push({
    type: "Combinator",
    loc: null,
    name: " "
  });
}
function Ym() {
  switch (this.tokenType) {
    case 19:
      return this.AttributeSelector();
    case 4:
      return this.IdSelector();
    case 16:
      return this.lookupType(1) === 16 ? this.PseudoElementSelector() : this.PseudoClassSelector();
    case 1:
      return this.TypeSelector();
    case 10:
    case 11:
      return this.Percentage();
    case 12:
      this.charCodeAt(this.tokenStart) === as && this.error("Identifier is expected", this.tokenStart + 1);
      break;
    case 9:
      {
        switch (this.charCodeAt(this.tokenStart)) {
          case jm:
          case Um:
          case Hm:
          case qm:
            return this.Combinator();
          case as:
            return this.ClassSelector();
          case _m:
          case Wm:
            return this.TypeSelector();
          case Mm:
            return this.IdSelector();
          case Bm:
            return this.NestingSelector();
        }
        break;
      }
  }
}
var ss = {
  onWhiteSpace: Gm,
  getNode: Ym
};
function ls() {
  return this.createSingleNodeList(this.Raw(null, !1));
}
function cs() {
  let e = this.createList();
  if (this.skipSC(), e.push(this.Identifier()), this.skipSC(), this.tokenType === 18) {
    e.push(this.Operator());
    let t = this.tokenIndex,
      r = this.parseCustomProperty ? this.Value(null) : this.Raw(this.consumeUntilExclamationMarkOrSemicolon, !1);
    if (r.type === "Value" && r.children.isEmpty) {
      for (let n = t - this.tokenIndex; n <= 0; n++) if (this.lookupType(n) === 13) {
        r.children.appendData({
          type: "WhiteSpace",
          loc: null,
          value: " "
        });
        break;
      }
    }
    e.push(r);
  }
  return e;
}
function us(e) {
  return e !== null && e.type === "Operator" && (e.value[e.value.length - 1] === "-" || e.value[e.value.length - 1] === "+");
}
var ps = {
  getNode: xt,
  onWhiteSpace(e, t) {
    us(e) && (e.value = " " + e.value), us(t.last) && (t.last.value += " ");
  },
  expression: ls,
  var: cs
};
var Vm = new Set(["none", "and", "not", "or"]),
  hs = {
    parse: {
      prelude() {
        let e = this.createList();
        if (this.tokenType === 1) {
          let t = this.substring(this.tokenStart, this.tokenEnd);
          Vm.has(t.toLowerCase()) || e.push(this.Identifier());
        }
        return e.push(this.Condition("container")), e;
      },
      block(e = !1) {
        return this.Block(e);
      }
    }
  };
var ms = {
  parse: {
    prelude: null,
    block() {
      return this.Block(!0);
    }
  }
};
function Ji(e, t) {
  return this.parseWithFallback(() => {
    try {
      return e.call(this);
    } finally {
      this.skipSC(), this.lookupNonWSType(0) !== 22 && this.error();
    }
  }, t || (() => this.Raw(null, !0)));
}
var fs = {
    layer() {
      this.skipSC();
      let e = this.createList(),
        t = Ji.call(this, this.Layer);
      return (t.type !== "Raw" || t.value !== "") && e.push(t), e;
    },
    supports() {
      this.skipSC();
      let e = this.createList(),
        t = Ji.call(this, this.Declaration, () => Ji.call(this, () => this.Condition("supports")));
      return (t.type !== "Raw" || t.value !== "") && e.push(t), e;
    }
  },
  ds = {
    parse: {
      prelude() {
        let e = this.createList();
        switch (this.tokenType) {
          case 5:
            e.push(this.String());
            break;
          case 7:
          case 2:
            e.push(this.Url());
            break;
          default:
            this.error("String or url() is expected");
        }
        return this.skipSC(), this.tokenType === 1 && this.cmpStr(this.tokenStart, this.tokenEnd, "layer") ? e.push(this.Identifier()) : this.tokenType === 2 && this.cmpStr(this.tokenStart, this.tokenEnd, "layer(") && e.push(this.Function(null, fs)), this.skipSC(), this.tokenType === 2 && this.cmpStr(this.tokenStart, this.tokenEnd, "supports(") && e.push(this.Function(null, fs)), (this.lookupNonWSType(0) === 1 || this.lookupNonWSType(0) === 21) && e.push(this.MediaQueryList()), e;
      },
      block: null
    }
  };
var gs = {
  parse: {
    prelude() {
      return this.createSingleNodeList(this.LayerList());
    },
    block() {
      return this.Block(!1);
    }
  }
};
var bs = {
  parse: {
    prelude() {
      return this.createSingleNodeList(this.MediaQueryList());
    },
    block(e = !1) {
      return this.Block(e);
    }
  }
};
var xs = {
  parse: {
    prelude() {
      return this.createSingleNodeList(this.SelectorList());
    },
    block() {
      return this.Block(!0);
    }
  }
};
var ys = {
  parse: {
    prelude() {
      return this.createSingleNodeList(this.SelectorList());
    },
    block() {
      return this.Block(!0);
    }
  }
};
var ks = {
  parse: {
    prelude() {
      return this.createSingleNodeList(this.Scope());
    },
    block(e = !1) {
      return this.Block(e);
    }
  }
};
var ws = {
  parse: {
    prelude: null,
    block(e = !1) {
      return this.Block(e);
    }
  }
};
var vs = {
  parse: {
    prelude() {
      return this.createSingleNodeList(this.Condition("supports"));
    },
    block(e = !1) {
      return this.Block(e);
    }
  }
};
var Ss = {
  container: hs,
  "font-face": ms,
  import: ds,
  layer: gs,
  media: bs,
  nest: xs,
  page: ys,
  scope: ks,
  "starting-style": ws,
  supports: vs
};
function Cs() {
  let e = this.createList();
  this.skipSC();
  e: for (; !this.eof;) {
    switch (this.tokenType) {
      case 1:
        e.push(this.Identifier());
        break;
      case 5:
        e.push(this.String());
        break;
      case 18:
        e.push(this.Operator());
        break;
      case 22:
        break e;
      default:
        this.error("Identifier, string or comma is expected");
    }
    this.skipSC();
  }
  return e;
}
var Ne = {
    parse() {
      return this.createSingleNodeList(this.SelectorList());
    }
  },
  eo = {
    parse() {
      return this.createSingleNodeList(this.Selector());
    }
  },
  Km = {
    parse() {
      return this.createSingleNodeList(this.Identifier());
    }
  },
  Qm = {
    parse: Cs
  },
  er = {
    parse() {
      return this.createSingleNodeList(this.Nth());
    }
  },
  Ts = {
    dir: Km,
    has: Ne,
    lang: Qm,
    matches: Ne,
    is: Ne,
    "-moz-any": Ne,
    "-webkit-any": Ne,
    where: Ne,
    not: Ne,
    "nth-child": er,
    "nth-last-child": er,
    "nth-last-of-type": er,
    "nth-of-type": er,
    slotted: eo,
    host: eo,
    "host-context": eo
  };
var to = {};
x(to, {
  AnPlusB: () => Qr,
  Atrule: () => $r,
  AtrulePrelude: () => Jr,
  AttributeSelector: () => rn,
  Block: () => on,
  Brackets: () => sn,
  CDC: () => cn,
  CDO: () => pn,
  ClassSelector: () => mn,
  Combinator: () => dn,
  Comment: () => bn,
  Condition: () => yn,
  Declaration: () => wn,
  DeclarationList: () => Cn,
  Dimension: () => An,
  Feature: () => Ln,
  FeatureFunction: () => In,
  FeatureRange: () => On,
  Function: () => Fn,
  GeneralEnclosed: () => Mn,
  Hash: () => _n,
  IdSelector: () => Wn,
  Identifier: () => qn,
  Layer: () => Gn,
  LayerList: () => Vn,
  MediaQuery: () => Qn,
  MediaQueryList: () => $n,
  NestingSelector: () => Jn,
  Nth: () => ti,
  Number: () => ni,
  Operator: () => oi,
  Parentheses: () => si,
  Percentage: () => ci,
  PseudoClassSelector: () => pi,
  PseudoElementSelector: () => mi,
  Ratio: () => di,
  Raw: () => bi,
  Rule: () => yi,
  Scope: () => wi,
  Selector: () => Si,
  SelectorList: () => Ti,
  String: () => Ii,
  StyleSheet: () => Ni,
  SupportsDeclaration: () => zi,
  TypeSelector: () => Mi,
  UnicodeRange: () => ji,
  Url: () => Yi,
  Value: () => Ki,
  WhiteSpace: () => Xi
});
var As = {
  parseContext: {
    default: "StyleSheet",
    stylesheet: "StyleSheet",
    atrule: "Atrule",
    atrulePrelude(e) {
      return this.AtrulePrelude(e.atrule ? String(e.atrule) : null);
    },
    mediaQueryList: "MediaQueryList",
    mediaQuery: "MediaQuery",
    condition(e) {
      return this.Condition(e.kind);
    },
    rule: "Rule",
    selectorList: "SelectorList",
    selector: "Selector",
    block() {
      return this.Block(!0);
    },
    declarationList: "DeclarationList",
    declaration: "Declaration",
    value: "Value"
  },
  features: {
    supports: {
      selector() {
        return this.Selector();
      }
    },
    container: {
      style() {
        return this.Declaration();
      }
    }
  },
  scope: Zi,
  atrule: Ss,
  pseudo: Ts,
  node: to
};
var Es = {
  node: bt
};
var Ls = Vr({
  ...ns,
  ...As,
  ...Es
});
var qx = exports.version = "3.0.0";
function ro(e) {
  let t = {};
  for (let r of Object.keys(e)) {
    let n = e[r];
    n && (Array.isArray(n) || n instanceof N ? n = n.map(ro) : n.constructor === Object && (n = ro(n))), t[r] = n;
  }
  return t;
}
var Is = exports.ident = {};
x(Is, {
  decode: () => Xm,
  encode: () => $m
});
var Ps = 92;
function Xm(e) {
  let t = e.length - 1,
    r = "";
  for (let n = 0; n < e.length; n++) {
    let i = e.charCodeAt(n);
    if (i === Ps) {
      if (n === t) break;
      if (i = e.charCodeAt(++n), Z(Ps, i)) {
        let o = n - 1,
          s = le(e, o);
        n = s - 1, r += Me(e.substring(o + 1, s));
      } else i === 13 && e.charCodeAt(n + 1) === 10 && n++;
    } else r += e[n];
  }
  return r;
}
function $m(e) {
  let t = "";
  if (e.length === 1 && e.charCodeAt(0) === 45) return "\\-";
  for (let r = 0; r < e.length; r++) {
    let n = e.charCodeAt(r);
    if (n === 0) {
      t += "\uFFFD";
      continue;
    }
    if (n <= 31 || n === 127 || n >= 48 && n <= 57 && (r === 0 || r === 1 && e.charCodeAt(0) === 45)) {
      t += "\\" + n.toString(16) + " ";
      continue;
    }
    ze(n) ? t += e.charAt(r) : t += "\\" + e.charAt(r);
  }
  return t;
}
var {
  tokenize: Vx,
  parse: Kx,
  generate: Qx,
  lexer: Xx,
  createLexer: $x,
  walk: Zx,
  find: Jx,
  findLast: ey,
  findAll: ty,
  toPlainObject: ry,
  fromPlainObject: ny,
  fork: iy
} = Ls;
exports.fork = iy;
exports.fromPlainObject = ny;
exports.toPlainObject = ry;
exports.findAll = ty;
exports.findLast = ey;
exports.find = Jx;
exports.walk = Zx;
exports.createLexer = $x;
exports.lexer = Xx;
exports.generate = Qx;
exports.parse = Kx;
exports.tokenize = Vx;