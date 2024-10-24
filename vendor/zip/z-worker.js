"use strict";

!function () {
  "use strict";

  const {
      Array: e,
      Object: t,
      Number: n,
      Math: s,
      Error: r,
      Uint8Array: a,
      Uint16Array: i,
      Uint32Array: o,
      Int32Array: l,
      Map: c,
      DataView: h,
      Promise: f,
      TextEncoder: u,
      crypto: p,
      postMessage: d,
      TransformStream: g,
      ReadableStream: w,
      WritableStream: y,
      CompressionStream: v,
      DecompressionStream: b
    } = self,
    m = void 0,
    _ = "undefined",
    S = "function";
  class k {
    constructor(e) {
      return class extends g {
        constructor(t, n) {
          const s = new e(n);
          super({
            transform(e, t) {
              t.enqueue(s.append(e));
            },
            flush(e) {
              const t = s.flush();
              t && e.enqueue(t);
            }
          });
        }
      };
    }
  }
  const z = [];
  for (let e = 0; 256 > e; e++) {
    let t = e;
    for (let e = 0; 8 > e; e++) 1 & t ? t = t >>> 1 ^ 3988292384 : t >>>= 1;
    z[e] = t;
  }
  class D {
    constructor(e) {
      this.crc = e || -1;
    }
    append(e) {
      let t = 0 | this.crc;
      for (let n = 0, s = 0 | e.length; s > n; n++) t = t >>> 8 ^ z[255 & (t ^ e[n])];
      this.crc = t;
    }
    get() {
      return ~this.crc;
    }
  }
  class C extends g {
    constructor() {
      let e;
      const t = new D();
      super({
        transform(e, n) {
          t.append(e), n.enqueue(e);
        },
        flush() {
          const n = new a(4);
          new h(n.buffer).setUint32(0, t.get()), e.value = n;
        }
      }), e = this;
    }
  }
  const x = {
      concat(e, t) {
        if (0 === e.length || 0 === t.length) return e.concat(t);
        const n = e[e.length - 1],
          s = x.getPartial(n);
        return 32 === s ? e.concat(t) : x._shiftRight(t, s, 0 | n, e.slice(0, e.length - 1));
      },
      bitLength(e) {
        const t = e.length;
        if (0 === t) return 0;
        const n = e[t - 1];
        return 32 * (t - 1) + x.getPartial(n);
      },
      clamp(e, t) {
        if (32 * e.length < t) return e;
        const n = (e = e.slice(0, s.ceil(t / 32))).length;
        return t &= 31, n > 0 && t && (e[n - 1] = x.partial(t, e[n - 1] & 2147483648 >> t - 1, 1)), e;
      },
      partial: (e, t, n) => 32 === e ? t : (n ? 0 | t : t << 32 - e) + 1099511627776 * e,
      getPartial: e => s.round(e / 1099511627776) || 32,
      _shiftRight(e, t, n, s) {
        for (void 0 === s && (s = []); t >= 32; t -= 32) s.push(n), n = 0;
        if (0 === t) return s.concat(e);
        for (let r = 0; r < e.length; r++) s.push(n | e[r] >>> t), n = e[r] << 32 - t;
        const r = e.length ? e[e.length - 1] : 0,
          a = x.getPartial(r);
        return s.push(x.partial(t + a & 31, t + a > 32 ? n : s.pop(), 1)), s;
      }
    },
    I = {
      bytes: {
        fromBits(e) {
          const t = x.bitLength(e) / 8,
            n = new a(t);
          let s;
          for (let r = 0; t > r; r++) 3 & r || (s = e[r / 4]), n[r] = s >>> 24, s <<= 8;
          return n;
        },
        toBits(e) {
          const t = [];
          let n,
            s = 0;
          for (n = 0; n < e.length; n++) s = s << 8 | e[n], 3 & ~n || (t.push(s), s = 0);
          return 3 & n && t.push(x.partial(8 * (3 & n), s)), t;
        }
      }
    },
    T = class {
      constructor(e) {
        const t = this;
        t.blockSize = 512, t._init = [1732584193, 4023233417, 2562383102, 271733878, 3285377520], t._key = [1518500249, 1859775393, 2400959708, 3395469782], e ? (t._h = e._h.slice(0), t._buffer = e._buffer.slice(0), t._length = e._length) : t.reset();
      }
      reset() {
        const e = this;
        return e._h = e._init.slice(0), e._buffer = [], e._length = 0, e;
      }
      update(e) {
        const t = this;
        "string" == typeof e && (e = I.utf8String.toBits(e));
        const n = t._buffer = x.concat(t._buffer, e),
          s = t._length,
          a = t._length = s + x.bitLength(e);
        if (a > 9007199254740991) throw new r("Cannot hash more than 2^53 - 1 bits");
        const i = new o(n);
        let l = 0;
        for (let e = t.blockSize + s - (t.blockSize + s & t.blockSize - 1); a >= e; e += t.blockSize) t._block(i.subarray(16 * l, 16 * (l + 1))), l += 1;
        return n.splice(0, 16 * l), t;
      }
      finalize() {
        const e = this;
        let t = e._buffer;
        const n = e._h;
        t = x.concat(t, [x.partial(1, 1)]);
        for (let e = t.length + 2; 15 & e; e++) t.push(0);
        for (t.push(s.floor(e._length / 4294967296)), t.push(0 | e._length); t.length;) e._block(t.splice(0, 16));
        return e.reset(), n;
      }
      _f(e, t, n, s) {
        return e > 19 ? e > 39 ? e > 59 ? e > 79 ? void 0 : t ^ n ^ s : t & n | t & s | n & s : t ^ n ^ s : t & n | ~t & s;
      }
      _S(e, t) {
        return t << e | t >>> 32 - e;
      }
      _block(t) {
        const n = this,
          r = n._h,
          a = e(80);
        for (let e = 0; 16 > e; e++) a[e] = t[e];
        let i = r[0],
          o = r[1],
          l = r[2],
          c = r[3],
          h = r[4];
        for (let e = 0; 79 >= e; e++) {
          16 > e || (a[e] = n._S(1, a[e - 3] ^ a[e - 8] ^ a[e - 14] ^ a[e - 16]));
          const t = n._S(5, i) + n._f(e, o, l, c) + h + a[e] + n._key[s.floor(e / 20)] | 0;
          h = c, c = l, l = n._S(30, o), o = i, i = t;
        }
        r[0] = r[0] + i | 0, r[1] = r[1] + o | 0, r[2] = r[2] + l | 0, r[3] = r[3] + c | 0, r[4] = r[4] + h | 0;
      }
    },
    A = {
      getRandomValues(e) {
        const t = new o(e.buffer),
          n = e => {
            let t = 987654321;
            const n = 4294967295;
            return () => (t = 36969 * (65535 & t) + (t >> 16) & n, (((t << 16) + (e = 18e3 * (65535 & e) + (e >> 16) & n) & n) / 4294967296 + .5) * (s.random() > .5 ? 1 : -1));
          };
        for (let r, a = 0; a < e.length; a += 4) {
          const e = n(4294967296 * (r || s.random()));
          r = 987654071 * e(), t[a / 4] = 4294967296 * e() | 0;
        }
        return e;
      }
    },
    q = {
      importKey: e => new q.hmacSha1(I.bytes.toBits(e)),
      pbkdf2(e, t, n, s) {
        if (n = n || 1e4, 0 > s || 0 > n) throw new r("invalid params to pbkdf2");
        const a = 1 + (s >> 5) << 2;
        let i, o, l, c, f;
        const u = new ArrayBuffer(a),
          p = new h(u);
        let d = 0;
        const g = x;
        for (t = I.bytes.toBits(t), f = 1; (a || 1) > d; f++) {
          for (i = o = e.encrypt(g.concat(t, [f])), l = 1; n > l; l++) for (o = e.encrypt(o), c = 0; c < o.length; c++) i[c] ^= o[c];
          for (l = 0; (a || 1) > d && l < i.length; l++) p.setInt32(d, i[l]), d += 4;
        }
        return u.slice(0, s / 8);
      },
      hmacSha1: class {
        constructor(e) {
          const t = this,
            n = t._hash = T,
            s = [[], []];
          t._baseHash = [new n(), new n()];
          const r = t._baseHash[0].blockSize / 32;
          e.length > r && (e = new n().update(e).finalize());
          for (let t = 0; r > t; t++) s[0][t] = 909522486 ^ e[t], s[1][t] = 1549556828 ^ e[t];
          t._baseHash[0].update(s[0]), t._baseHash[1].update(s[1]), t._resultHash = new n(t._baseHash[0]);
        }
        reset() {
          const e = this;
          e._resultHash = new e._hash(e._baseHash[0]), e._updated = !1;
        }
        update(e) {
          this._updated = !0, this._resultHash.update(e);
        }
        digest() {
          const e = this,
            t = e._resultHash.finalize(),
            n = new e._hash(e._baseHash[1]).update(t).finalize();
          return e.reset(), n;
        }
        encrypt(e) {
          if (this._updated) throw new r("encrypt on already updated hmac called!");
          return this.update(e), this.digest(e);
        }
      }
    },
    R = typeof p != _ && typeof p.getRandomValues == S,
    H = "Invalid password",
    P = "Invalid signature",
    B = "zipjs-abort-check-password";
  function K(e) {
    return R ? p.getRandomValues(e) : A.getRandomValues(e);
  }
  const V = 16,
    E = {
      name: "PBKDF2"
    },
    U = t.assign({
      hash: {
        name: "HMAC"
      }
    }, E),
    W = t.assign({
      iterations: 1e3,
      hash: {
        name: "SHA-1"
      }
    }, E),
    M = ["deriveBits"],
    N = [8, 12, 16],
    O = [16, 24, 32],
    F = 10,
    L = [0, 0, 0, 0],
    j = typeof p != _,
    G = j && p.subtle,
    X = j && typeof G != _,
    J = I.bytes,
    Q = class {
      constructor(e) {
        const t = this;
        t._tables = [[[], [], [], [], []], [[], [], [], [], []]], t._tables[0][0][0] || t._precompute();
        const n = t._tables[0][4],
          s = t._tables[1],
          a = e.length;
        let i,
          o,
          l,
          c = 1;
        if (4 !== a && 6 !== a && 8 !== a) throw new r("invalid aes key size");
        for (t._key = [o = e.slice(0), l = []], i = a; 4 * a + 28 > i; i++) {
          let e = o[i - 1];
          (i % a == 0 || 8 === a && i % a == 4) && (e = n[e >>> 24] << 24 ^ n[e >> 16 & 255] << 16 ^ n[e >> 8 & 255] << 8 ^ n[255 & e], i % a == 0 && (e = e << 8 ^ e >>> 24 ^ c << 24, c = c << 1 ^ 283 * (c >> 7))), o[i] = o[i - a] ^ e;
        }
        for (let e = 0; i; e++, i--) {
          const t = o[3 & e ? i : i - 4];
          l[e] = 4 >= i || 4 > e ? t : s[0][n[t >>> 24]] ^ s[1][n[t >> 16 & 255]] ^ s[2][n[t >> 8 & 255]] ^ s[3][n[255 & t]];
        }
      }
      encrypt(e) {
        return this._crypt(e, 0);
      }
      decrypt(e) {
        return this._crypt(e, 1);
      }
      _precompute() {
        const e = this._tables[0],
          t = this._tables[1],
          n = e[4],
          s = t[4],
          r = [],
          a = [];
        let i, o, l, c;
        for (let e = 0; 256 > e; e++) a[(r[e] = e << 1 ^ 283 * (e >> 7)) ^ e] = e;
        for (let h = i = 0; !n[h]; h ^= o || 1, i = a[i] || 1) {
          let a = i ^ i << 1 ^ i << 2 ^ i << 3 ^ i << 4;
          a = a >> 8 ^ 255 & a ^ 99, n[h] = a, s[a] = h, c = r[l = r[o = r[h]]];
          let f = 16843009 * c ^ 65537 * l ^ 257 * o ^ 16843008 * h,
            u = 257 * r[a] ^ 16843008 * a;
          for (let n = 0; 4 > n; n++) e[n][h] = u = u << 24 ^ u >>> 8, t[n][a] = f = f << 24 ^ f >>> 8;
        }
        for (let n = 0; 5 > n; n++) e[n] = e[n].slice(0), t[n] = t[n].slice(0);
      }
      _crypt(e, t) {
        if (4 !== e.length) throw new r("invalid aes block size");
        const n = this._key[t],
          s = n.length / 4 - 2,
          a = [0, 0, 0, 0],
          i = this._tables[t],
          o = i[0],
          l = i[1],
          c = i[2],
          h = i[3],
          f = i[4];
        let u,
          p,
          d,
          g = e[0] ^ n[0],
          w = e[t ? 3 : 1] ^ n[1],
          y = e[2] ^ n[2],
          v = e[t ? 1 : 3] ^ n[3],
          b = 4;
        for (let e = 0; s > e; e++) u = o[g >>> 24] ^ l[w >> 16 & 255] ^ c[y >> 8 & 255] ^ h[255 & v] ^ n[b], p = o[w >>> 24] ^ l[y >> 16 & 255] ^ c[v >> 8 & 255] ^ h[255 & g] ^ n[b + 1], d = o[y >>> 24] ^ l[v >> 16 & 255] ^ c[g >> 8 & 255] ^ h[255 & w] ^ n[b + 2], v = o[v >>> 24] ^ l[g >> 16 & 255] ^ c[w >> 8 & 255] ^ h[255 & y] ^ n[b + 3], b += 4, g = u, w = p, y = d;
        for (let e = 0; 4 > e; e++) a[t ? 3 & -e : e] = f[g >>> 24] << 24 ^ f[w >> 16 & 255] << 16 ^ f[y >> 8 & 255] << 8 ^ f[255 & v] ^ n[b++], u = g, g = w, w = y, y = v, v = u;
        return a;
      }
    },
    Y = class {
      constructor(e, t) {
        this._prf = e, this._initIv = t, this._iv = t;
      }
      reset() {
        this._iv = this._initIv;
      }
      update(e) {
        return this.calculate(this._prf, e, this._iv);
      }
      incWord(e) {
        if (255 & ~(e >> 24)) e += 1 << 24;else {
          let t = e >> 16 & 255,
            n = e >> 8 & 255,
            s = 255 & e;
          255 === t ? (t = 0, 255 === n ? (n = 0, 255 === s ? s = 0 : ++s) : ++n) : ++t, e = 0, e += t << 16, e += n << 8, e += s;
        }
        return e;
      }
      incCounter(e) {
        0 === (e[0] = this.incWord(e[0])) && (e[1] = this.incWord(e[1]));
      }
      calculate(e, t, n) {
        let s;
        if (!(s = t.length)) return [];
        const r = x.bitLength(t);
        for (let r = 0; s > r; r += 4) {
          this.incCounter(n);
          const s = e.encrypt(n);
          t[r] ^= s[0], t[r + 1] ^= s[1], t[r + 2] ^= s[2], t[r + 3] ^= s[3];
        }
        return x.clamp(t, r);
      }
    },
    Z = q.hmacSha1;
  let $ = j && X && typeof G.importKey == S,
    ee = j && X && typeof G.deriveBits == S;
  class te extends g {
    constructor({
      password: e,
      rawPassword: n,
      signed: s,
      encryptionStrength: i,
      checkPasswordOnly: o
    }) {
      super({
        start() {
          t.assign(this, {
            ready: new f(e => this.resolveReady = e),
            password: ae(e, n),
            signed: s,
            strength: i - 1,
            pending: new a()
          });
        },
        async transform(e, t) {
          const n = this,
            {
              password: s,
              strength: i,
              resolveReady: l,
              ready: c
            } = n;
          s ? (await (async (e, t, n, s) => {
            const a = await re(e, t, n, oe(s, 0, N[t])),
              i = oe(s, N[t]);
            if (a[0] != i[0] || a[1] != i[1]) throw new r(H);
          })(n, i, s, oe(e, 0, N[i] + 2)), e = oe(e, N[i] + 2), o ? t.error(new r(B)) : l()) : await c;
          const h = new a(e.length - F - (e.length - F) % V);
          t.enqueue(se(n, e, h, 0, F, !0));
        },
        async flush(e) {
          const {
            signed: t,
            ctr: n,
            hmac: s,
            pending: i,
            ready: o
          } = this;
          if (s && n) {
            await o;
            const l = oe(i, 0, i.length - F),
              c = oe(i, i.length - F);
            let h = new a();
            if (l.length) {
              const e = ce(J, l);
              s.update(e);
              const t = n.update(e);
              h = le(J, t);
            }
            if (t) {
              const e = oe(le(J, s.digest()), 0, F);
              for (let t = 0; F > t; t++) if (e[t] != c[t]) throw new r(P);
            }
            e.enqueue(h);
          }
        }
      });
    }
  }
  class ne extends g {
    constructor({
      password: e,
      rawPassword: n,
      encryptionStrength: s
    }) {
      let r;
      super({
        start() {
          t.assign(this, {
            ready: new f(e => this.resolveReady = e),
            password: ae(e, n),
            strength: s - 1,
            pending: new a()
          });
        },
        async transform(e, t) {
          const n = this,
            {
              password: s,
              strength: r,
              resolveReady: i,
              ready: o
            } = n;
          let l = new a();
          s ? (l = await (async (e, t, n) => {
            const s = K(new a(N[t]));
            return ie(s, await re(e, t, n, s));
          })(n, r, s), i()) : await o;
          const c = new a(l.length + e.length - e.length % V);
          c.set(l, 0), t.enqueue(se(n, e, c, l.length, 0));
        },
        async flush(e) {
          const {
            ctr: t,
            hmac: n,
            pending: s,
            ready: i
          } = this;
          if (n && t) {
            await i;
            let o = new a();
            if (s.length) {
              const e = t.update(ce(J, s));
              n.update(e), o = le(J, e);
            }
            r.signature = le(J, n.digest()).slice(0, F), e.enqueue(ie(o, r.signature));
          }
        }
      }), r = this;
    }
  }
  function se(e, t, n, s, r, i) {
    const {
        ctr: o,
        hmac: l,
        pending: c
      } = e,
      h = t.length - r;
    let f;
    for (c.length && (t = ie(c, t), n = ((e, t) => {
      if (t && t > e.length) {
        const n = e;
        (e = new a(t)).set(n, 0);
      }
      return e;
    })(n, h - h % V)), f = 0; h - V >= f; f += V) {
      const e = ce(J, oe(t, f, f + V));
      i && l.update(e);
      const r = o.update(e);
      i || l.update(r), n.set(le(J, r), f + s);
    }
    return e.pending = oe(t, f), n;
  }
  async function re(n, s, r, i) {
    n.password = null;
    const o = await (async (e, t, n, s, r) => {
        if (!$) return q.importKey(t);
        try {
          return await G.importKey("raw", t, n, !1, r);
        } catch (e) {
          return $ = !1, q.importKey(t);
        }
      })(0, r, U, 0, M),
      l = await (async (e, t, n) => {
        if (!ee) return q.pbkdf2(t, e.salt, W.iterations, n);
        try {
          return await G.deriveBits(e, t, n);
        } catch (s) {
          return ee = !1, q.pbkdf2(t, e.salt, W.iterations, n);
        }
      })(t.assign({
        salt: i
      }, W), o, 8 * (2 * O[s] + 2)),
      c = new a(l),
      h = ce(J, oe(c, 0, O[s])),
      f = ce(J, oe(c, O[s], 2 * O[s])),
      u = oe(c, 2 * O[s]);
    return t.assign(n, {
      keys: {
        key: h,
        authentication: f,
        passwordVerification: u
      },
      ctr: new Y(new Q(h), e.from(L)),
      hmac: new Z(f)
    }), u;
  }
  function ae(e, t) {
    return t === m ? (e => {
      if (typeof u == _) {
        const t = new a((e = unescape(encodeURIComponent(e))).length);
        for (let n = 0; n < t.length; n++) t[n] = e.charCodeAt(n);
        return t;
      }
      return new u().encode(e);
    })(e) : t;
  }
  function ie(e, t) {
    let n = e;
    return e.length + t.length && (n = new a(e.length + t.length), n.set(e, 0), n.set(t, e.length)), n;
  }
  function oe(e, t, n) {
    return e.subarray(t, n);
  }
  function le(e, t) {
    return e.fromBits(t);
  }
  function ce(e, t) {
    return e.toBits(t);
  }
  class he extends g {
    constructor({
      password: e,
      passwordVerification: n,
      checkPasswordOnly: s
    }) {
      super({
        start() {
          t.assign(this, {
            password: e,
            passwordVerification: n
          }), de(this, e);
        },
        transform(e, t) {
          const n = this;
          if (n.password) {
            const t = ue(n, e.subarray(0, 12));
            if (n.password = null, t[11] != n.passwordVerification) throw new r(H);
            e = e.subarray(12);
          }
          s ? t.error(new r(B)) : t.enqueue(ue(n, e));
        }
      });
    }
  }
  class fe extends g {
    constructor({
      password: e,
      passwordVerification: n
    }) {
      super({
        start() {
          t.assign(this, {
            password: e,
            passwordVerification: n
          }), de(this, e);
        },
        transform(e, t) {
          const n = this;
          let s, r;
          if (n.password) {
            n.password = null;
            const t = K(new a(12));
            t[11] = n.passwordVerification, s = new a(e.length + t.length), s.set(pe(n, t), 0), r = 12;
          } else s = new a(e.length), r = 0;
          s.set(pe(n, e), r), t.enqueue(s);
        }
      });
    }
  }
  function ue(e, t) {
    const n = new a(t.length);
    for (let s = 0; s < t.length; s++) n[s] = we(e) ^ t[s], ge(e, n[s]);
    return n;
  }
  function pe(e, t) {
    const n = new a(t.length);
    for (let s = 0; s < t.length; s++) n[s] = we(e) ^ t[s], ge(e, t[s]);
    return n;
  }
  function de(e, n) {
    const s = [305419896, 591751049, 878082192];
    t.assign(e, {
      keys: s,
      crcKey0: new D(s[0]),
      crcKey2: new D(s[2])
    });
    for (let t = 0; t < n.length; t++) ge(e, n.charCodeAt(t));
  }
  function ge(e, t) {
    let [n, r, a] = e.keys;
    e.crcKey0.append([t]), n = ~e.crcKey0.get(), r = ve(s.imul(ve(r + ye(n)), 134775813) + 1), e.crcKey2.append([r >>> 24]), a = ~e.crcKey2.get(), e.keys = [n, r, a];
  }
  function we(e) {
    const t = 2 | e.keys[2];
    return ye(s.imul(t, 1 ^ t) >>> 8);
  }
  function ye(e) {
    return 255 & e;
  }
  function ve(e) {
    return 4294967295 & e;
  }
  const be = "deflate-raw";
  class me extends g {
    constructor(e, {
      chunkSize: t,
      CompressionStream: n,
      CompressionStreamNative: s
    }) {
      super({});
      const {
          compressed: r,
          encrypted: a,
          useCompressionStream: i,
          zipCrypto: o,
          signed: l,
          level: c
        } = e,
        f = this;
      let u,
        p,
        d = Se(super.readable);
      a && !o || !l || (u = new C(), d = De(d, u)), r && (d = ze(d, i, {
        level: c,
        chunkSize: t
      }, s, n)), a && (o ? d = De(d, new fe(e)) : (p = new ne(e), d = De(d, p))), ke(f, d, () => {
        let e;
        a && !o && (e = p.signature), a && !o || !l || (e = new h(u.value.buffer).getUint32(0)), f.signature = e;
      });
    }
  }
  class _e extends g {
    constructor(e, {
      chunkSize: t,
      DecompressionStream: n,
      DecompressionStreamNative: s
    }) {
      super({});
      const {
        zipCrypto: a,
        encrypted: i,
        signed: o,
        signature: l,
        compressed: c,
        useCompressionStream: f
      } = e;
      let u,
        p,
        d = Se(super.readable);
      i && (a ? d = De(d, new he(e)) : (p = new te(e), d = De(d, p))), c && (d = ze(d, f, {
        chunkSize: t
      }, s, n)), i && !a || !o || (u = new C(), d = De(d, u)), ke(this, d, () => {
        if ((!i || a) && o) {
          const e = new h(u.value.buffer);
          if (l != e.getUint32(0, !1)) throw new r(P);
        }
      });
    }
  }
  function Se(e) {
    return De(e, new g({
      transform(e, t) {
        e && e.length && t.enqueue(e);
      }
    }));
  }
  function ke(e, n, s) {
    n = De(n, new g({
      flush: s
    })), t.defineProperty(e, "readable", {
      get: () => n
    });
  }
  function ze(e, t, n, s, r) {
    try {
      e = De(e, new (t && s ? s : r)(be, n));
    } catch (s) {
      if (!t) return e;
      try {
        e = De(e, new r(be, n));
      } catch (t) {
        return e;
      }
    }
    return e;
  }
  function De(e, t) {
    return e.pipeThrough(t);
  }
  const Ce = "data",
    xe = "close";
  class Ie extends g {
    constructor(e, n) {
      super({});
      const s = this,
        {
          codecType: r
        } = e;
      let a;
      r.startsWith("deflate") ? a = me : r.startsWith("inflate") && (a = _e);
      let i = 0,
        o = 0;
      const l = new a(e, n),
        c = super.readable,
        h = new g({
          transform(e, t) {
            e && e.length && (o += e.length, t.enqueue(e));
          },
          flush() {
            t.assign(s, {
              inputSize: o
            });
          }
        }),
        f = new g({
          transform(e, t) {
            e && e.length && (i += e.length, t.enqueue(e));
          },
          flush() {
            const {
              signature: e
            } = l;
            t.assign(s, {
              signature: e,
              outputSize: i,
              inputSize: o
            });
          }
        });
      t.defineProperty(s, "readable", {
        get: () => c.pipeThrough(h).pipeThrough(l).pipeThrough(f)
      });
    }
  }
  class Te extends g {
    constructor(e) {
      let t;
      super({
        transform: function n(s, r) {
          if (t) {
            const e = new a(t.length + s.length);
            e.set(t), e.set(s, t.length), s = e, t = null;
          }
          s.length > e ? (r.enqueue(s.slice(0, e)), n(s.slice(e), r)) : t = s;
        },
        flush(e) {
          t && t.length && e.enqueue(t);
        }
      });
    }
  }
  const Ae = new c(),
    qe = new c();
  let Re,
    He = 0,
    Pe = !0;
  async function Be(e) {
    try {
      const {
        options: t,
        scripts: s,
        config: r
      } = e;
      if (s && s.length) try {
        Pe ? importScripts.apply(m, s) : await Ke(s);
      } catch (e) {
        Pe = !1, await Ke(s);
      }
      self.initCodec && self.initCodec(), r.CompressionStreamNative = self.CompressionStream, r.DecompressionStreamNative = self.DecompressionStream, self.Deflate && (r.CompressionStream = new k(self.Deflate)), self.Inflate && (r.DecompressionStream = new k(self.Inflate));
      const a = {
          highWaterMark: 1
        },
        i = e.readable || new w({
          async pull(e) {
            const t = new f(e => Ae.set(He, e));
            Ve({
              type: "pull",
              messageId: He
            }), He = (He + 1) % n.MAX_SAFE_INTEGER;
            const {
              value: s,
              done: r
            } = await t;
            e.enqueue(s), r && e.close();
          }
        }, a),
        o = e.writable || new y({
          async write(e) {
            let t;
            const s = new f(e => t = e);
            qe.set(He, t), Ve({
              type: Ce,
              value: e,
              messageId: He
            }), He = (He + 1) % n.MAX_SAFE_INTEGER, await s;
          }
        }, a),
        l = new Ie(t, r);
      Re = new AbortController();
      const {
        signal: c
      } = Re;
      await i.pipeThrough(l).pipeThrough(new Te(r.chunkSize)).pipeTo(o, {
        signal: c,
        preventClose: !0,
        preventAbort: !0
      }), await o.getWriter().close();
      const {
        signature: h,
        inputSize: u,
        outputSize: p
      } = l;
      Ve({
        type: xe,
        result: {
          signature: h,
          inputSize: u,
          outputSize: p
        }
      });
    } catch (e) {
      Ee(e);
    }
  }
  async function Ke(e) {
    for (const t of e) await import(t);
  }
  function Ve(e) {
    let {
      value: t
    } = e;
    if (t) {
      if (t.length) try {
        t = new a(t), e.value = t.buffer, d(e, [e.value]);
      } catch (t) {
        d(e);
      } else d(e);
    } else d(e);
  }
  function Ee(e = new r("Unknown error")) {
    const {
      message: t,
      stack: n,
      code: s,
      name: a
    } = e;
    d({
      error: {
        message: t,
        stack: n,
        code: s,
        name: a
      }
    });
  }
  addEventListener("message", ({
    data: e
  }) => {
    const {
      type: t,
      messageId: n,
      value: s,
      done: r
    } = e;
    try {
      if ("start" == t && Be(e), t == Ce) {
        const e = Ae.get(n);
        Ae.delete(n), e({
          value: new a(s),
          done: r
        });
      }
      if ("ack" == t) {
        const e = qe.get(n);
        qe.delete(n), e();
      }
      t == xe && Re.abort();
    } catch (e) {
      Ee(e);
    }
  });
  var Ue = a,
    We = i,
    Me = l,
    Ne = new Ue([0, 0, 0, 0, 0, 0, 0, 0, 1, 1, 1, 1, 2, 2, 2, 2, 3, 3, 3, 3, 4, 4, 4, 4, 5, 5, 5, 5, 0, 0, 0, 0]),
    Oe = new Ue([0, 0, 0, 0, 1, 1, 2, 2, 3, 3, 4, 4, 5, 5, 6, 6, 7, 7, 8, 8, 9, 9, 10, 10, 11, 11, 12, 12, 13, 13, 0, 0]),
    Fe = new Ue([16, 17, 18, 0, 8, 7, 9, 6, 10, 5, 11, 4, 12, 3, 13, 2, 14, 1, 15]),
    Le = (e, t) => {
      for (var n = new We(31), s = 0; 31 > s; ++s) n[s] = t += 1 << e[s - 1];
      var r = new Me(n[30]);
      for (s = 1; 30 > s; ++s) for (var a = n[s]; a < n[s + 1]; ++a) r[a] = a - n[s] << 5 | s;
      return {
        b: n,
        r: r
      };
    },
    je = Le(Ne, 2),
    Ge = je.b,
    Xe = je.r;
  Ge[28] = 258, Xe[258] = 28;
  for (var Je = Le(Oe, 0), Qe = Je.b, Ye = Je.r, Ze = new We(32768), $e = 0; 32768 > $e; ++$e) {
    var et = (43690 & $e) >> 1 | (21845 & $e) << 1;
    et = (61680 & (et = (52428 & et) >> 2 | (13107 & et) << 2)) >> 4 | (3855 & et) << 4, Ze[$e] = ((65280 & et) >> 8 | (255 & et) << 8) >> 1;
  }
  var tt = (e, t, n) => {
      for (var s = e.length, r = 0, a = new We(t); s > r; ++r) e[r] && ++a[e[r] - 1];
      var i,
        o = new We(t);
      for (r = 1; t > r; ++r) o[r] = o[r - 1] + a[r - 1] << 1;
      if (n) {
        i = new We(1 << t);
        var l = 15 - t;
        for (r = 0; s > r; ++r) if (e[r]) for (var c = r << 4 | e[r], h = t - e[r], f = o[e[r] - 1]++ << h, u = f | (1 << h) - 1; u >= f; ++f) i[Ze[f] >> l] = c;
      } else for (i = new We(s), r = 0; s > r; ++r) e[r] && (i[r] = Ze[o[e[r] - 1]++] >> 15 - e[r]);
      return i;
    },
    nt = new Ue(288);
  for ($e = 0; 144 > $e; ++$e) nt[$e] = 8;
  for ($e = 144; 256 > $e; ++$e) nt[$e] = 9;
  for ($e = 256; 280 > $e; ++$e) nt[$e] = 7;
  for ($e = 280; 288 > $e; ++$e) nt[$e] = 8;
  var st = new Ue(32);
  for ($e = 0; 32 > $e; ++$e) st[$e] = 5;
  var rt = tt(nt, 9, 0),
    at = tt(nt, 9, 1),
    it = tt(st, 5, 0),
    ot = tt(st, 5, 1),
    lt = e => {
      for (var t = e[0], n = 1; n < e.length; ++n) e[n] > t && (t = e[n]);
      return t;
    },
    ct = (e, t, n) => {
      var s = t / 8 | 0;
      return (e[s] | e[s + 1] << 8) >> (7 & t) & n;
    },
    ht = (e, t) => {
      var n = t / 8 | 0;
      return (e[n] | e[n + 1] << 8 | e[n + 2] << 16) >> (7 & t);
    },
    ft = e => (e + 7) / 8 | 0,
    ut = (e, t, n) => ((null == t || 0 > t) && (t = 0), (null == n || n > e.length) && (n = e.length), new Ue(e.subarray(t, n))),
    pt = ["unexpected EOF", "invalid block type", "invalid length/literal", "invalid distance", "stream finished", "no stream handler",, "no callback", "invalid UTF-8 data", "extra field too long", "date not in range 1980-2099", "filename too long", "stream finishing", "invalid zip data"],
    dt = (e, t, n) => {
      var s = new r(t || pt[e]);
      if (s.code = e, r.captureStackTrace && r.captureStackTrace(s, dt), !n) throw s;
      return s;
    },
    gt = (e, t, n) => {
      n <<= 7 & t;
      var s = t / 8 | 0;
      e[s] |= n, e[s + 1] |= n >> 8;
    },
    wt = (e, t, n) => {
      n <<= 7 & t;
      var s = t / 8 | 0;
      e[s] |= n, e[s + 1] |= n >> 8, e[s + 2] |= n >> 16;
    },
    yt = (e, t) => {
      for (var n = [], s = 0; s < e.length; ++s) e[s] && n.push({
        s: s,
        f: e[s]
      });
      var r = n.length,
        a = n.slice();
      if (!r) return {
        t: zt,
        l: 0
      };
      if (1 == r) {
        var i = new Ue(n[0].s + 1);
        return i[n[0].s] = 1, {
          t: i,
          l: 1
        };
      }
      n.sort((e, t) => e.f - t.f), n.push({
        s: -1,
        f: 25001
      });
      var o = n[0],
        l = n[1],
        c = 0,
        h = 1,
        f = 2;
      for (n[0] = {
        s: -1,
        f: o.f + l.f,
        l: o,
        r: l
      }; h != r - 1;) o = n[n[c].f < n[f].f ? c++ : f++], l = n[c != h && n[c].f < n[f].f ? c++ : f++], n[h++] = {
        s: -1,
        f: o.f + l.f,
        l: o,
        r: l
      };
      var u = a[0].s;
      for (s = 1; r > s; ++s) a[s].s > u && (u = a[s].s);
      var p = new We(u + 1),
        d = vt(n[h - 1], p, 0);
      if (d > t) {
        s = 0;
        var g = 0,
          w = d - t,
          y = 1 << w;
        for (a.sort((e, t) => p[t.s] - p[e.s] || e.f - t.f); r > s; ++s) {
          var v = a[s].s;
          if (p[v] <= t) break;
          g += y - (1 << d - p[v]), p[v] = t;
        }
        for (g >>= w; g > 0;) {
          var b = a[s].s;
          p[b] < t ? g -= 1 << t - p[b]++ - 1 : ++s;
        }
        for (; s >= 0 && g; --s) {
          var m = a[s].s;
          p[m] == t && (--p[m], ++g);
        }
        d = t;
      }
      return {
        t: new Ue(p),
        l: d
      };
    },
    vt = (e, t, n) => -1 == e.s ? s.max(vt(e.l, t, n + 1), vt(e.r, t, n + 1)) : t[e.s] = n,
    bt = e => {
      for (var t = e.length; t && !e[--t];);
      for (var n = new We(++t), s = 0, r = e[0], a = 1, i = e => {
          n[s++] = e;
        }, o = 1; t >= o; ++o) if (e[o] == r && o != t) ++a;else {
        if (!r && a > 2) {
          for (; a > 138; a -= 138) i(32754);
          a > 2 && (i(a > 10 ? a - 11 << 5 | 28690 : a - 3 << 5 | 12305), a = 0);
        } else if (a > 3) {
          for (i(r), --a; a > 6; a -= 6) i(8304);
          a > 2 && (i(a - 3 << 5 | 8208), a = 0);
        }
        for (; a--;) i(r);
        a = 1, r = e[o];
      }
      return {
        c: n.subarray(0, s),
        n: t
      };
    },
    mt = (e, t) => {
      for (var n = 0, s = 0; s < t.length; ++s) n += e[s] * t[s];
      return n;
    },
    _t = (e, t, n) => {
      var s = n.length,
        r = ft(t + 2);
      e[r] = 255 & s, e[r + 1] = s >> 8, e[r + 2] = 255 ^ e[r], e[r + 3] = 255 ^ e[r + 1];
      for (var a = 0; s > a; ++a) e[r + a + 4] = n[a];
      return 8 * (r + 4 + s);
    },
    St = (e, t, n, s, r, a, i, o, l, c, h) => {
      gt(t, h++, n), ++r[256];
      for (var f = yt(r, 15), u = f.t, p = f.l, d = yt(a, 15), g = d.t, w = d.l, y = bt(u), v = y.c, b = y.n, m = bt(g), _ = m.c, S = m.n, k = new We(19), z = 0; z < v.length; ++z) ++k[31 & v[z]];
      for (z = 0; z < _.length; ++z) ++k[31 & _[z]];
      for (var D = yt(k, 7), C = D.t, x = D.l, I = 19; I > 4 && !C[Fe[I - 1]]; --I);
      var T,
        A,
        q,
        R,
        H = c + 5 << 3,
        P = mt(r, nt) + mt(a, st) + i,
        B = mt(r, u) + mt(a, g) + i + 14 + 3 * I + mt(k, C) + 2 * k[16] + 3 * k[17] + 7 * k[18];
      if (l >= 0 && P >= H && B >= H) return _t(t, h, e.subarray(l, l + c));
      if (gt(t, h, 1 + (P > B)), h += 2, P > B) {
        T = tt(u, p, 0), A = u, q = tt(g, w, 0), R = g;
        var K = tt(C, x, 0);
        for (gt(t, h, b - 257), gt(t, h + 5, S - 1), gt(t, h + 10, I - 4), h += 14, z = 0; I > z; ++z) gt(t, h + 3 * z, C[Fe[z]]);
        h += 3 * I;
        for (var V = [v, _], E = 0; 2 > E; ++E) {
          var U = V[E];
          for (z = 0; z < U.length; ++z) {
            var W = 31 & U[z];
            gt(t, h, K[W]), h += C[W], W > 15 && (gt(t, h, U[z] >> 5 & 127), h += U[z] >> 12);
          }
        }
      } else T = rt, A = nt, q = it, R = st;
      for (z = 0; o > z; ++z) {
        var M = s[z];
        if (M > 255) {
          wt(t, h, T[257 + (W = M >> 18 & 31)]), h += A[W + 257], W > 7 && (gt(t, h, M >> 23 & 31), h += Ne[W]);
          var N = 31 & M;
          wt(t, h, q[N]), h += R[N], N > 3 && (wt(t, h, M >> 5 & 8191), h += Oe[N]);
        } else wt(t, h, T[M]), h += A[M];
      }
      return wt(t, h, T[256]), h + A[256];
    },
    kt = new Me([65540, 131080, 131088, 131104, 262176, 1048704, 1048832, 2114560, 2117632]),
    zt = new Ue(0),
    Dt = function () {
      function e(e, t) {
        if ("function" == typeof e && (t = e, e = {}), this.ondata = t, this.o = e || {}, this.s = {
          l: 0,
          i: 32768,
          w: 32768,
          z: 32768
        }, this.b = new Ue(98304), this.o.dictionary) {
          var n = this.o.dictionary.subarray(-32768);
          this.b.set(n, 32768 - n.length), this.s.i = 32768 - n.length;
        }
      }
      return e.prototype.p = function (e, t) {
        this.ondata(((e, t, n, r, a) => {
          if (!a && (a = {
            l: 1
          }, t.dictionary)) {
            var i = t.dictionary.subarray(-32768),
              o = new Ue(i.length + e.length);
            o.set(i), o.set(e, i.length), e = o, a.w = i.length;
          }
          return ((e, t, n, r, a, i) => {
            var o = i.z || e.length,
              l = new Ue(0 + o + 5 * (1 + s.ceil(o / 7e3)) + 0),
              c = l.subarray(0, l.length - 0),
              h = i.l,
              f = 7 & (i.r || 0);
            if (t) {
              f && (c[0] = i.r >> 3);
              for (var u = kt[t - 1], p = u >> 13, d = 8191 & u, g = (1 << n) - 1, w = i.p || new We(32768), y = i.h || new We(g + 1), v = s.ceil(n / 3), b = 2 * v, m = t => (e[t] ^ e[t + 1] << v ^ e[t + 2] << b) & g, _ = new Me(25e3), S = new We(288), k = new We(32), z = 0, D = 0, C = i.i || 0, x = 0, I = i.w || 0, T = 0; o > C + 2; ++C) {
                var A = m(C),
                  q = 32767 & C,
                  R = y[A];
                if (w[q] = R, y[A] = q, C >= I) {
                  var H = o - C;
                  if ((z > 7e3 || x > 24576) && (H > 423 || !h)) {
                    f = St(e, c, 0, _, S, k, D, x, T, C - T, f), x = z = D = 0, T = C;
                    for (var P = 0; 286 > P; ++P) S[P] = 0;
                    for (P = 0; 30 > P; ++P) k[P] = 0;
                  }
                  var B = 2,
                    K = 0,
                    V = d,
                    E = q - R & 32767;
                  if (H > 2 && A == m(C - E)) for (var U = s.min(p, H) - 1, W = s.min(32767, C), M = s.min(258, H); W >= E && --V && q != R;) {
                    if (e[C + B] == e[C + B - E]) {
                      for (var N = 0; M > N && e[C + N] == e[C + N - E]; ++N);
                      if (N > B) {
                        if (B = N, K = E, N > U) break;
                        var O = s.min(E, N - 2),
                          F = 0;
                        for (P = 0; O > P; ++P) {
                          var L = C - E + P & 32767,
                            j = L - w[L] & 32767;
                          j > F && (F = j, R = L);
                        }
                      }
                    }
                    E += (q = R) - (R = w[q]) & 32767;
                  }
                  if (K) {
                    _[x++] = 268435456 | Xe[B] << 18 | Ye[K];
                    var G = 31 & Xe[B],
                      X = 31 & Ye[K];
                    D += Ne[G] + Oe[X], ++S[257 + G], ++k[X], I = C + B, ++z;
                  } else _[x++] = e[C], ++S[e[C]];
                }
              }
              for (C = s.max(C, I); o > C; ++C) _[x++] = e[C], ++S[e[C]];
              f = St(e, c, h, _, S, k, D, x, T, C - T, f), h || (i.r = 7 & f | c[f / 8 | 0] << 3, f -= 7, i.h = y, i.p = w, i.i = C, i.w = I);
            } else {
              for (C = i.w || 0; o + h > C; C += 65535) {
                var J = C + 65535;
                o > J || (c[f / 8 | 0] = h, J = o), f = _t(c, f + 1, e.subarray(C, J));
              }
              i.i = o;
            }
            return ut(l, 0, 0 + ft(f) + 0);
          })(e, null == t.level ? 6 : t.level, null == t.mem ? a.l ? s.ceil(1.5 * s.max(8, s.min(13, s.log(e.length)))) : 20 : 12 + t.mem, 0, 0, a);
        })(e, this.o, 0, 0, this.s), t);
      }, e.prototype.push = function (e, t) {
        this.ondata || dt(5), this.s.l && dt(4);
        var n = e.length + this.s.z;
        if (n > this.b.length) {
          if (n > 2 * this.b.length - 32768) {
            var s = new Ue(-32768 & n);
            s.set(this.b.subarray(0, this.s.z)), this.b = s;
          }
          var r = this.b.length - this.s.z;
          this.b.set(e.subarray(0, r), this.s.z), this.s.z = this.b.length, this.p(this.b, !1), this.b.set(this.b.subarray(-32768)), this.b.set(e.subarray(r), 32768), this.s.z = e.length - r + 32768, this.s.i = 32766, this.s.w = 32768;
        } else this.b.set(e, this.s.z), this.s.z += e.length;
        this.s.l = 1 & t, (this.s.z > this.s.w + 8191 || t) && (this.p(this.b, t || !1), this.s.w = this.s.i, this.s.i -= 2);
      }, e.prototype.flush = function () {
        this.ondata || dt(5), this.s.l && dt(4), this.p(this.b, !1), this.s.w = this.s.i, this.s.i -= 2;
      }, e;
    }(),
    Ct = function () {
      function e(e, t) {
        "function" == typeof e && (t = e, e = {}), this.ondata = t;
        var n = e && e.dictionary && e.dictionary.subarray(-32768);
        this.s = {
          i: 0,
          b: n ? n.length : 0
        }, this.o = new Ue(32768), this.p = new Ue(0), n && this.o.set(n);
      }
      return e.prototype.e = function (e) {
        if (this.ondata || dt(5), this.d && dt(4), this.p.length) {
          if (e.length) {
            var t = new Ue(this.p.length + e.length);
            t.set(this.p), t.set(e, this.p.length), this.p = t;
          }
        } else this.p = e;
      }, e.prototype.c = function (e) {
        this.s.i = +(this.d = e || !1);
        var t = this.s.b,
          n = ((e, t, n) => {
            var r = e.length;
            if (!r || t.f && !t.l) return n || new Ue(0);
            var a = !n,
              i = a || 2 != t.i,
              o = t.i;
            a && (n = new Ue(3 * r));
            var l = e => {
                var t = n.length;
                if (e > t) {
                  var r = new Ue(s.max(2 * t, e));
                  r.set(n), n = r;
                }
              },
              c = t.f || 0,
              h = t.p || 0,
              f = t.b || 0,
              u = t.l,
              p = t.d,
              d = t.m,
              g = t.n,
              w = 8 * r;
            do {
              if (!u) {
                c = ct(e, h, 1);
                var y = ct(e, h + 1, 3);
                if (h += 3, !y) {
                  var v = e[(T = ft(h) + 4) - 4] | e[T - 3] << 8,
                    b = T + v;
                  if (b > r) {
                    o && dt(0);
                    break;
                  }
                  i && l(f + v), n.set(e.subarray(T, b), f), t.b = f += v, t.p = h = 8 * b, t.f = c;
                  continue;
                }
                if (1 == y) u = at, p = ot, d = 9, g = 5;else if (2 == y) {
                  var m = ct(e, h, 31) + 257,
                    _ = ct(e, h + 10, 15) + 4,
                    S = m + ct(e, h + 5, 31) + 1;
                  h += 14;
                  for (var k = new Ue(S), z = new Ue(19), D = 0; _ > D; ++D) z[Fe[D]] = ct(e, h + 3 * D, 7);
                  h += 3 * _;
                  var C = lt(z),
                    x = (1 << C) - 1,
                    I = tt(z, C, 1);
                  for (D = 0; S > D;) {
                    var T,
                      A = I[ct(e, h, x)];
                    if (h += 15 & A, 16 > (T = A >> 4)) k[D++] = T;else {
                      var q = 0,
                        R = 0;
                      for (16 == T ? (R = 3 + ct(e, h, 3), h += 2, q = k[D - 1]) : 17 == T ? (R = 3 + ct(e, h, 7), h += 3) : 18 == T && (R = 11 + ct(e, h, 127), h += 7); R--;) k[D++] = q;
                    }
                  }
                  var H = k.subarray(0, m),
                    P = k.subarray(m);
                  d = lt(H), g = lt(P), u = tt(H, d, 1), p = tt(P, g, 1);
                } else dt(1);
                if (h > w) {
                  o && dt(0);
                  break;
                }
              }
              i && l(f + 131072);
              for (var B = (1 << d) - 1, K = (1 << g) - 1, V = h;; V = h) {
                var E = (q = u[ht(e, h) & B]) >> 4;
                if ((h += 15 & q) > w) {
                  o && dt(0);
                  break;
                }
                if (q || dt(2), 256 > E) n[f++] = E;else {
                  if (256 == E) {
                    V = h, u = null;
                    break;
                  }
                  var U = E - 254;
                  if (E > 264) {
                    var W = Ne[D = E - 257];
                    U = ct(e, h, (1 << W) - 1) + Ge[D], h += W;
                  }
                  var M = p[ht(e, h) & K],
                    N = M >> 4;
                  if (M || dt(3), h += 15 & M, P = Qe[N], N > 3 && (W = Oe[N], P += ht(e, h) & (1 << W) - 1, h += W), h > w) {
                    o && dt(0);
                    break;
                  }
                  i && l(f + 131072);
                  var O = f + U;
                  if (P > f) {
                    var F = 0 - P,
                      L = s.min(P, O);
                    for (0 > F + f && dt(3); L > f; ++f) n[f] = (void 0)[F + f];
                  }
                  for (; O > f; ++f) n[f] = n[f - P];
                }
              }
              t.l = u, t.p = V, t.b = f, t.f = c, u && (c = 1, t.m = d, t.d = p, t.n = g);
            } while (!c);
            return f != n.length && a ? ut(n, 0, f) : n.subarray(0, f);
          })(this.p, this.s, this.o);
        this.ondata(ut(n, t, this.s.b), this.d), this.o = ut(n, this.s.b - 32768), this.s.b = this.o.length, this.p = ut(this.p, this.s.p / 8 | 0), this.s.p &= 7;
      }, e.prototype.push = function (e, t) {
        this.e(e), this.c(t);
      }, e;
    }(),
    xt = "undefined" != typeof TextDecoder && new TextDecoder();
  try {
    xt.decode(zt, {
      stream: !0
    });
  } catch (e) {}
  function It(e, n, s) {
    return class {
      constructor(r) {
        const i = this;
        var o, l;
        o = r, l = "level", (typeof t.hasOwn === S ? t.hasOwn(o, l) : o.hasOwnProperty(l)) && r.level === m && delete r.level, i.codec = new e(t.assign({}, n, r)), s(i.codec, e => {
          if (i.pendingData) {
            const t = i.pendingData;
            i.pendingData = new a(t.length + e.length);
            const {
              pendingData: n
            } = i;
            n.set(t, 0), n.set(e, t.length);
          } else i.pendingData = new a(e);
        });
      }
      append(e) {
        return this.codec.push(e), r(this);
      }
      flush() {
        return this.codec.push(new a(), !0), r(this);
      }
    };
    function r(e) {
      if (e.pendingData) {
        const t = e.pendingData;
        return e.pendingData = null, t;
      }
      return new a();
    }
  }
  const {
    Deflate: Tt,
    Inflate: At
  } = ((e, t = {}, n) => ({
    Deflate: It(e.Deflate, t.deflate, n),
    Inflate: It(e.Inflate, t.inflate, n)
  }))({
    Deflate: Dt,
    Inflate: Ct
  }, m, (e, t) => e.ondata = t);
  self.initCodec = () => {
    self.Deflate = Tt, self.Inflate = At;
  };
}();