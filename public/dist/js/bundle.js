"use strict";

var _typeof = "function" == typeof Symbol 
    && "symbol" == typeof Symbol.iterator ? 
    function (e) { return typeof e } :
    function (e) { return e && "function" == typeof Symbol && e.constructor === Symbol && e !== Symbol.prototype ? "symbol" : typeof e };
!function e(t, r, i) {
    function o(a, s) {
        if (!r[a]) {
            if (!t[a]) {
                var l = "function" == typeof require && require;
                if (!s && l) return l(a, !0);
                if (n) return n(a, !0);

                var u = new Error("Cannot find module '" + a + "'");
                throw u.code = "MODULE_NOT_FOUND", u
            }
            var h = r[a] = { exports: {} };
            t[a][0].call(h.exports, function (e) {
                var r = t[a][1][e];
                return o(r || e)
            }, h, h.exports, e, t, r, i)
        } return r[a].exports
    } for (
        var n = "function" == typeof require && require, a = 0;
        a < i.length;
        a++)o(i[a]);
    return o
}({
    1: [function (e, t, r) {
        var i = "player.", 
        o = {
            isProd: !0, isDebug: !1, serverPort: 8001, game: { worldWidth: 2300, worldHeight: 2300 },
            eventName:
            {
                player:
                {
                    ping: i + "ping",
                    ready: i + "ready",
                    message: i + "message",
                    move: i + "move",
                    rotate: i + "rotate",
                    fire: i + "fire",
                    isDamaged: i + "isDamaged", isDamagedItSelf: i + "isDamagedItSelf", 
                    isRecovered: i + "isRecovered", isRecoveredItSelf: i + "isRecoveredItSelf",
                    isDied: i + "isDied", isDiedItSelf: i + "isDiedItSelf", 
                    isRespawn: i + "isRespawn", isRespawnItSelf: i + "isRespawnItSelf",
                    attackZombie: i + "attackZombie", attackMachine: i + "attackMachine", 
                    attackBat: i + "attackBat", killZombie: i + "killZombie",
                    killMachine: i + "killMachine", killBat: i + "killBat", 
                    respawnZombie: i + "respawnZombie", respawnMachine: i + "respawnMachine",
                    respawnBat: i + "respawnBat", attackEnemy: i + "attackEnemy", 
                    killEnemy: i + "killEnemy", respawnEnemy: i + "respawnEnemy"
                },
                server: {
                    newPlayer: "server.new player", 
                    disconnectedPlayer: "server.disconnected player", 
                    machineFire: i + "machineFire", 
                    zombieMove: i + "zombieMove",
                    batMove: i + "batMove"
                }
            }
        };
        t.exports = o
    }, {}]
    , 2: [function (e, t, r) {
        var i = e("./util"), o = e("./module").Position
        , n = {
            getRandomRotation: function () { return i.getRandomArbitrary(-Math.PI, Math.PI) }, 
            convertTileIndexToPoint: function (e, t, r, i, n) {
                void 0 === r && (r = 46), void 0 === i && (i = 46), void 0 === n && (n = !1);
                var a = void 0, s = new o(e * r, t * i);
                if (n) { a = new o(s.x + r / 2, s.y + i / 2) } else a = s;
                return a
            }, 
            convertPointToTileIndex: function (e, t, r, i) {
                void 0 === r && (r = 46), void 0 === i && (i = 46);
                var n = Math.round(e / r), a = Math.round(t / i);
                return new o(n, a)
            }
        };
        t.exports = n
    }, { "./module": 3, "./util": 4 }]
    , 3: [function (e, t, r) {
        var i = e("./util"), 
        o = function (e, t) { this.x = e, this.y = t }, 
        n = function (e, t, r) { void 0 === r && (r = 0), o.call(this, e, t), this.rotation = r };
        (n.prototype = Object.create(o.prototype)).constructor = n, 
        n.prototype.toJson = function () { return { x: this.x, y: this.y, rotation: this.rotation } },
        n.prototype.update = function (e, t, r) { this.x = e, this.y = t, this.rotation = r }, 
        n.prototype.updateByJson = function (e) { this.x = e.x, this.y = e.y, this.rotation = e.rotation };
        var a = function (e, t, r) { this.info = e, this.phrInfo = t, this.misc = r, this.label = {}, 
            this.shadow = {}, this.weapon = {}, this.bubble = {}, this.bullet = {} };
        a.prototype.updateLastDamageTimestamp = function () { this.info.lastDamageTimestamp = i.getCurrentUtcTimestamp() }, 
        a.prototype.updateLastRecoverTimestamp = function () { this.info.lastRecoverTimestamp = i.getCurrentUtcTimestamp() }, 
        a.prototype.reset = function () { this.misc.isImmortal = !1, this.misc.isTyping = !1, this.misc.lastEnterTimestamp = 0 }, 
        a.prototype.updateLastMessageTimestamp = function (e) { void 0 === e && (e = i.getCurrentUtcTimestamp()), this.info.lastMessageTimestamp = e }, 
        a.prototype.updateLastMessage = function (e) { this.info.lastMessage = e }, 
        a.prototype.updateLastEnterTimestamp = function (e) { void 0 === e && (e = i.getCurrentUtcTimestamp()), this.misc.lastEnterTimestamp = e };

        var s = function (e) {
            a.call(this, e, { spriteName: "", width: 0, height: 0, bodyOffset: 0, bodyMass: 100 },
                { isImmortal: !1, fireRate: 500, nextFireTimestamp: 0, nBullets: 40, bulletSpeed: 500, isTyping: !1, lastEnterTimestamp: 0 })
        };
        (s.prototype = Object.create(a.prototype)).constructor = s;

        var l = function (e) {
            a.call(this, e, { spriteName: "zombie", width: 46, height: 46, bodyOffset: 6, bodyMass: 0 },
                { isImmortal: !1, isTyping: !1, lastEnterTimestamp: 0 })
        };
        (l.prototype = Object.create(a.prototype)).constructor = l;

        var u = function (e) {
            a.call(this, e, { spriteName: "machine", width: 46, height: 46, bodyOffset: 6, bodyMass: 20 },
                { isImmortal: !1, fireRate: 1e3, nextFireTimestamp: 0, nBullets: 40, bulletSpeed: 500, isTyping: !1, lastEnterTimestamp: 0 })
        };
        (u.prototype = Object.create(a.prototype)).constructor = u;

        var h = function (e) { a.call(this, e, 
            { spriteName: "bat", width: 46, height: 46, bodyOffset: 8, bodyMass: 0 }, 
            { isImmortal: !1, isTyping: !1, lastEnterTimestamp: 0 }) };
        (h.prototype = Object.create(a.prototype)).constructor = h, 
            t.exports = {
            Position: o, Vector: n, CreatureInfo:
                function (e, t, r, i, o, n) {
                    this.id = e, this.type = t, this.initialLife = o, this.maxLife = n, 
                    this.immortalDelay = 800, this.velocitySpeed = i,
                    this.startVector = r, this.life = o, this.lastVector = r, 
                    this.lastMessage = "", this.lastMessageTimestamp = 0, this.lastDamageTimestamp = 0,
                    this.lastRecoverTimestamp = 0, this.autoMove = {}
                }, Hero: s, Zombie: l, Machine: u, Bat: h
            }
    }, { "./util": 4 }]
    , 4: [function (e, t, r) {
        var i = {
            isEmpty: function (e) { return !e || 0 === e.length }, isEmptyObject: function (e) {
                for (
                    var t in e) if (e.hasOwnProperty(t)) return !1;
                return JSON.stringify(e) === JSON.stringify({})
            }, getRandomArbitrary: function (e, t) { return Math.random() * (t - e) + e }, getRandomInt:
                function (e, t) { return Math.floor(Math.random() * (t - e + 1)) + e }, getRandomId: function (e) {
                    void 0 === e && (e = 8);
                    for (
                        var t = "", r = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789", i = 0;
                        i < e;
                        i++)t += r.charAt(Math.floor(Math.random() * r.length));
                    return t
                }, getDistance: function (e, t, r, i) {
                    var o = e - r, n = t - i;
                    return Math.sqrt(o * o + n * n)
                }, getDistanceBetween: function (e, t) { return this.getDistance(e.x, e.y, t.x, t.y) }, getRotationBetween:
                function (e, t) { return Math.atan2(t.y - e.y, t.x - e.x) }, getDegreeBetween:
                function (e, t) { return 180 * this.getRotationBetween(e, t) / Math.PI }, creature2DArray:
                function (e, t, r) {
                    for (
                        var i = [], o = 0;
                        o < e;
                        o++) {
                        i.push([]), i[o].push(new Array(t));
                        for (
                            var n = 0;
                            n < t;
                            n++)i[o][n] = r
                    } return i
                }, getCurrentUtcTimestamp: function () { return Date.now() }, convertTimestampToLocaleString:
                function (e) { return new Date(e).toLocaleString() }, removeElement:
                function (e) { e.parentNode.removeChild(e) }, serverLog: function (e, t) {
                    void 0 === t && (t = "");

                    var r = this.getCurrentUtcTimestamp() + " " + e;
                    console.log(r, t)
                }, serverBugLog: function (e, t, r) {
                    void 0 === r && (r = "");

                    var i = "BUG - " + e + ", " + t;
                    this.serverLog(i, r)
                }, clientLog: function (e, t) {
                    void 0 === t && (t = "");

                    var r = e;
                    console.log(r, t)
                }, clientBugLog: function (e, t) { void 0 === t && (t = ""), console.error(e, t) }
        };
        t.exports = i
    }, {}]
    , 5: [function (e, t, r) {
        function i(e) {
            var t = e.length;
            if (t % 4 > 0) throw new Error("Invalid string. Length must be a multiple of 4");
            return "=" === e[t - 2] ? 2 : "=" === e[t - 1] ? 1 : 0
        } function o(e) { return a[e >> 18 & 63] + a[e >> 12 & 63] + a[e >> 6 & 63] + a[63 & e] } function n(e, t, r) {
            for (
                var i, n = [], a = t;
                a < r;
                a += 3)i = (e[a] << 16) + (e[a + 1] << 8) + e[a + 2], n.push(o(i));
            return n.join("")
        } r.byteLength = function (e) { return 3 * e.length / 4 - i(e) }, r.toByteArray = function (e) {
            var t, r, o, n, a, u = e.length;
            n = i(e), a = new l(3 * u / 4 - n), r = n > 0 ? u - 4 : u;

            var h = 0;
            for (t = 0;
                t < r;
                t += 4)o = s[e.charCodeAt(t)] << 18 | s[e.charCodeAt(t + 1)] << 12 | s[e.charCodeAt(t + 2)] << 6 | s[e.charCodeAt(t + 3)], 
                a[h++] = o >> 16 & 255, a[h++] = o >> 8 & 255, a[h++] = 255 & o;
            return 2 === n ? (o = s[e.charCodeAt(t)] << 2 | s[e.charCodeAt(t + 1)] >> 4, 
                a[h++] = 255 & o) : 1 === n && (o = s[e.charCodeAt(t)] << 10 | s[e.charCodeAt(t + 1)] << 4 | s[e.charCodeAt(t + 2)] >> 2, 
                a[h++] = o >> 8 & 255, a[h++] = 255 & o), a
        }, r.fromByteArray = function (e) {
            for (
                var t, r = e.length, i = r % 3, o = "", s = [], l = 0, u = r - i;
                l < u;
                l += 16383)s.push(n(e, l, l + 16383 > u ? u : l + 16383));
            return 1 === i ? (t = e[r - 1], o += a[t >> 2], o += a[t << 4 & 63], o += "==") : 2 === i && (t = (e[r - 2] << 8) + e[r - 1], 
                o += a[t >> 10], o += a[t >> 4 & 63], o += a[t << 2 & 63], o += "="), s.push(o), s.join("")
        };
        for (
            var a = [], s = [], l = "undefined" != typeof Uint8Array ? Uint8Array : Array, u = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789+/", h = 0, p = u.length;
            h < p;
            ++h)a[h] = u[h], s[u.charCodeAt(h)] = h;
        s["-".charCodeAt(0)] = 62, s["_".charCodeAt(0)] = 63
    }, {}]
    , 6: [function (e, t, r) {
        function i(e) {
            if (e > D) throw new RangeError("Invalid typed array length");

            var t = new Uint8Array(e);
            return t.__proto__ = o.prototype, t
        }
        function o(e, t, r) {
            if ("number" == typeof e) {
                if ("string" == typeof t) throw new Error("If encoding is specified then the first argument must be a string");
                return s(e)
            } return n(e, t, r)
        }
        function n(e, t, r) {
            if ("number" == typeof e) throw new TypeError('"value" argument must not be a number');
            return S(e) ? function (e, t, r) {
                if (t < 0 || e.byteLength < t) throw new RangeError("'offset' is out of bounds");
                if (e.byteLength < t + (r || 0)) throw new RangeError("'length' is out of bounds");

                var i;
                i = void 0 === t && void 0 === r ? new Uint8Array(e) : void 0 === r ? new Uint8Array(e, t) : new Uint8Array(e, t, r);
                return i.__proto__ = o.prototype, i
            }(e, t, r) : "string" == typeof e ? function (e, t) {
                "string" == typeof t && "" !== t || (t = "utf8");
                if (!o.isEncoding(t)) throw new TypeError('"encoding" must be a valid string encoding');

                var r = 0 | h(e, t), n = i(r), a = n.write(e, t);
                a !== r && (n = n.slice(0, a));
                return n
            }(e, t) : function (e) {
                if (o.isBuffer(e)) {
                    var t = 0 | u(e.length), r = i(t);
                    return 0 === r.length ? r : (e.copy(r, 0, 0, t), r)
                } if (e) {
                    if (x(e) || "length" in e) return "number" != typeof e.length || O(e.length) ? i(0) : l(e);
                    if ("Buffer" === e.type && Array.isArray(e.data)) return l(e.data)
                } throw new TypeError("First argument must be a string, Buffer, ArrayBuffer, Array, or array-like object.")
            }(e)
        } function a(e) {
            if ("number" != typeof e) throw new TypeError('"size" argument must be a number');
            if (e < 0) throw new RangeError('"size" argument must not be negative')
        } function s(e) { return a(e), i(e < 0 ? 0 : 0 | u(e)) } function l(e) {
            for (
                var t = e.length < 0 ? 0 : 0 | u(e.length), r = i(t), o = 0;
                o < t;
                o += 1)r[o] = 255 & e[o];
            return r
        } function u(e) {
            if (e >= D) throw new RangeError("Attempt to allocate Buffer larger than maximum size: 0x" + D.toString(16) + " bytes");
            return 0 | e
        } function h(e, t) {
            if (o.isBuffer(e)) return e.length;
            if (x(e) || S(e)) return e.byteLength;
            "string" != typeof e && (e = "" + e);

            var r = e.length;
            if (0 === r) return 0;
            for (
                var i = !1;
                ;
            )switch (t) {
                case "ascii": case "latin1": case "binary": return r;
                case "utf8": case "utf-8": case void 0: return C(e).length;
                case "ucs2": case "ucs-2": case "utf16le": case "utf-16le": return 2 * r;
                case "hex": return r >>> 1;
                case "base64": return P(e).length;
                default: if (i) return C(e).length;
                    t = ("" + t).toLowerCase(), i = !0
            }
        } function p(e, t, r) {
            var i = !1;
            if ((void 0 === t || t < 0) && (t = 0), t > this.length) return "";
            if ((void 0 === r || r > this.length) && (r = this.length), r <= 0) return "";
            if (r >>>= 0, t >>>= 0, r <= t) return "";
            for (e || (e = "utf8");
                ;
            )switch (e) {
                case "hex": return function (e, t, r) {
                    var i = e.length;
                    (!t || t < 0) && (t = 0);
                    (!r || r < 0 || r > i) && (r = i);
                    for (
                        var o = "", n = t;
                        n < r;
                        ++n)o += function (e) { return e < 16 ? "0" + e.toString(16) : e.toString(16) }(e[n]);
                    return o
                }(this, t, r);
                case "utf8": case "utf-8": return M(this, t, r);
                case "ascii": return function (e, t, r) {
                    var i = "";
                    r = Math.min(e.length, r);
                    for (
                        var o = t;
                        o < r;
                        ++o)i += String.fromCharCode(127 & e[o]);
                    return i
                }(this, t, r);
                case "latin1": case "binary": return function (e, t, r) {
                    var i = "";
                    r = Math.min(e.length, r);
                    for (
                        var o = t;
                        o < r;
                        ++o)i += String.fromCharCode(e[o]);
                    return i
                }(this, t, r);
                case "base64": return function (e, t, r) { return 0 === t && r === e.length ? R.fromByteArray(e) : R.fromByteArray(e.slice(t, r)) }(this, t, r);
                case "ucs2": case "ucs-2": case "utf16le": case "utf-16le": return function (e, t, r) {
                    for (
                        var i = e.slice(t, r), o = "", n = 0;
                        n < i.length;
                        n += 2)o += String.fromCharCode(i[n] + 256 * i[n + 1]);
                    return o
                }(this, t, r);
                default: if (i) throw new TypeError("Unknown encoding: " + e);
                    e = (e + "").toLowerCase(), i = !0
            }
        } function c(e, t, r) {
            var i = e[t];
            e[t] = e[r], e[r] = i
        } function d(e, t, r, i, n) {
            if (0 === e.length) return -1;
            if ("string" == typeof r ? (i = r, r = 0) : r > 2147483647 ? r = 2147483647 : r < -2147483648 && (r = -2147483648), r = +r, O(r) && (r = n ? 0 : e.length - 1),
                r < 0 && (r = e.length + r), r >= e.length) {
                if (n) return -1;
                r = e.length - 1
            } else if (r < 0) {
                if (!n) return -1;
                r = 0
            } if ("string" == typeof t && (t = o.from(t, i)), o.isBuffer(t)) return 0 === t.length ? -1 : f(e, t, r, i, n);
            if ("number" == typeof t) 
            return t &= 255, "function" == typeof Uint8Array.prototype.indexOf ? n ? Uint8Array.prototype.indexOf.call(e, t, r) : Uint8Array.prototype.lastIndexOf.call(e, t, r) : f(e, [t], r, i, n);
            throw new TypeError("val must be string, number or Buffer")
        } function f(e, t, r, i, o) {
            function n(e, t) { return 1 === a ? e[t] : e.readUInt16BE(t * a) }
            var a = 1, s = e.length, l = t.length;
            if (void 0 !== i && ("ucs2" === (i = String(i).toLowerCase()) || "ucs-2" === i || "utf16le" === i || "utf-16le" === i)) {
                if (e.length < 2 || t.length < 2) return -1;
                a = 2, s /= 2, l /= 2, r /= 2
            }
            var u;
            if (o) {
                var h = -1;
                for (u = r;
                    u < s;
                    u++)if (n(e, u) === n(t, -1 === h ? 0 : u - h)) { if (-1 === h && (h = u), u - h + 1 === l) return h * a } else -1 !== h && (u -= u - h), h = -1
            } else for (r + l > s && (r = s - l), u = r;
                u >= 0;
                u--) {
                for (
                    var p = !0, c = 0;
                    c < l;
                    c++)if (n(e, u + c) !== n(t, c)) {
                        p = !1;
                        break
                    } if (p) return u
            } return -1
        } function y(e, t, r, i) {
            r = Number(r) || 0;

            var o = e.length - r;
            i ? (i = Number(i)) > o && (i = o) : i = o;

            var n = t.length;
            if (n % 2 != 0) throw new TypeError("Invalid hex string");
            i > n / 2 && (i = n / 2);
            for (
                var a = 0;
                a < i;
                ++a) {
                var s = parseInt(t.substr(2 * a, 2), 16);
                if (O(s)) return a;
                e[r + a] = s
            } return a
        } function m(e, t, r, i) { return B(C(t, e.length - r), e, r, i) } function b(e, t, r, i) {
            return B(function (e) {
                for (
                    var t = [], r = 0;
                    r < e.length;
                    ++r)t.push(255 & e.charCodeAt(r));
                return t
            }(t), e, r, i)
        } function g(e, t, r, i) { return b(e, t, r, i) } function E(e, t, r, i) { return B(P(t), e, r, i) } function v(e, t, r, i) {
            return B(function (e, t) {
                for (
                    var r, i, o, n = [], a = 0;
                    a < e.length && !((t -= 2) < 0);
                    ++a)r = e.charCodeAt(a), i = r >> 8, o = r % 256, n.push(o), n.push(i);
                return n
            }(t, e.length - r), e, r, i)
        } function M(e, t, r) {
            r = Math.min(e.length, r);
            for (
                var i = [], o = t;
                o < r;
            ) {
                var n = e[o], a = null, s = n > 239 ? 4 : n > 223 ? 3 : n > 191 ? 2 : 1;
                if (o + s <= r) {
                    var l, u, h, p;
                    switch (s) {
                        case 1: n < 128 && (a = n);
                            break;
                        case 2: 128 == (192 & (l = e[o + 1])) && (p = (31 & n) << 6 | 63 & l) > 127 && (a = p);
                            break;
                        case 3: l = e[o + 1], u = e[o + 2], 128 == (192 & l) && 128 == (192 & u) && (p = (15 & n) << 12 | (63 & l) << 6 | 63 & u) > 2047
                            && (p < 55296 || p > 57343) && (a = p);
                            break;
                        case 4: l = e[o + 1], u = e[o + 2], h = e[o + 3], 128 == (192 & l) && 128 == (192 & u) && 128 == (192 & h)
                            && (p = (15 & n) << 18 | (63 & l) << 12 | (63 & u) << 6 | 63 & h) > 65535 && p < 1114112 && (a = p)
                    }
                } null === a ? (a = 65533, s = 1) : a > 65535 && (a -= 65536, i.push(a >>> 10 & 1023 | 55296), a = 56320 | 1023 & a), i.push(a), o += s
            } return function (e) {
                var t = e.length;
                if (t <= k) return String.fromCharCode.apply(String, e);

                var r = "", i = 0;
                for (;
                    i < t;
                )r += String.fromCharCode.apply(String, e.slice(i, i += k));
                return r
            }(i)
        } function G(e, t, r) {
            if (e % 1 != 0 || e < 0) throw new RangeError("offset is not uint");
            if (e + t > r) throw new RangeError("Trying to access beyond buffer length")
        } function A(e, t, r, i, n, a) {
            if (!o.isBuffer(e)) throw new TypeError('"buffer" argument must be a Buffer instance');
            if (t > n || t < a) throw new RangeError('"value" argument is out of bounds');
            if (r + i > e.length) throw new RangeError("Index out of range")
        } function w(e, t, r, i, o, n) {
            if (r + i > e.length) throw new RangeError("Index out of range");
            if (r < 0) throw new RangeError("Index out of range")
        } function T(e, t, r, i, o) { return t = +t, r >>>= 0, o || w(e, 0, r, 4), N.write(e, t, r, i, 23, 4), r + 4 } function I(e, t, r, i, o) {
            return t = +t, r >>>= 0, o || w(e, 0, r, 8), N.write(e, t, r, i, 52, 8), r + 8
        } function C(e, t) {
            t = t || 1 / 0;
            for (
                var r, i = e.length, o = null, n = [], a = 0;
                a < i;
                ++a) {
                if ((r = e.charCodeAt(a)) > 55295 && r < 57344) {
                    if (!o) {
                        if (r > 56319) {
                            (t -= 3) > -1 && n.push(239, 191, 189);
                            continue
                        } if (a + 1 === i) {
                            (t -= 3) > -1 && n.push(239, 191, 189);
                            continue
                        } o = r;
                        continue
                    } if (r < 56320) {
                        (t -= 3) > -1 && n.push(239, 191, 189), o = r;
                        continue
                    } r = 65536 + (o - 55296 << 10 | r - 56320)
                } else o && (t -= 3) > -1 && n.push(239, 191, 189);
                if (o = null, r < 128) {
                    if ((t -= 1) < 0) break;
                    n.push(r)
                } else if (r < 2048) {
                    if ((t -= 2) < 0) break;
                    n.push(r >> 6 | 192, 63 & r | 128)
                } else if (r < 65536) {
                    if ((t -= 3) < 0) break;
                    n.push(r >> 12 | 224, r >> 6 & 63 | 128, 63 & r | 128)
                } else {
                    if (!(r < 1114112)) throw new Error("Invalid code point");
                    if ((t -= 4) < 0) break;
                    n.push(r >> 18 | 240, r >> 12 & 63 | 128, r >> 6 & 63 | 128, 63 & r | 128)
                }
            } return n
        } function P(e) {
            return R.toByteArray(function (e) {
                if ((e = e.trim().replace(L, "")).length < 2) return "";
                for (;
                    e.length % 4 != 0;
                )e += "=";
                return e
            }(e))
        } function B(e, t, r, i) {
            for (
                var o = 0;
                o < i && !(o + r >= t.length || o >= e.length);
                ++o)t[o + r] = e[o];
            return o
        }
        function S(e) { return e instanceof ArrayBuffer || null != e && null != e.constructor && "ArrayBuffer" === e.constructor.name && "number" == typeof e.byteLength }
        function x(e) { return "function" == typeof ArrayBuffer.isView && ArrayBuffer.isView(e) } function O(e) { return e != e }
        var R = e("base64-js"), N = e("ieee754");
        r.Buffer = o, r.SlowBuffer = function (e) { return +e != e && (e = 0), o.alloc(+e) }, r.INSPECT_MAX_BYTES = 50;

        var D = 2147483647;
        r.kMaxLength = D, (o.TYPED_ARRAY_SUPPORT = function () {
            try {
                var e = new Uint8Array(1);
                return e.__proto__ = { __proto__: Uint8Array.prototype, foo: function () { return 42 } }, 42 === e.foo()
            } catch (e) { return !1 }
        }()) || "undefined" == typeof console || "function" != typeof console.error ||
            console.error("This browser lacks typed array (Uint8Array) support which is required by `buffer` v5.x. Use `buffer` v4.x if you require old browser support."),
            "undefined" != typeof Symbol && Symbol.species && o[Symbol.species] === o && Object.defineProperty(o,
                Symbol.species, { value: null, configurable: !0, enumerable: !1, writable: !1 }), o.poolSize = 8192, o.from =
            function (e, t, r) { 
                return n(e, t, r) }, o.prototype.__proto__ = Uint8Array.prototype, o.__proto__ = Uint8Array, o.alloc =
            function (e, t, r) { 
                return function (e, t, r) { return a(e), e <= 0 ? i(e) : void 0 !== t ? "string" == typeof r ? i(e).fill(t, r) : i(e).fill(t) : i(e) }(e, t, r) },
            o.allocUnsafe = function (e) { 
                return s(e) }, o.allocUnsafeSlow = function (e) { return s(e) }, o.isBuffer = function (e) { return null != e && !0 === e._isBuffer },
            o.compare = function (e, t) {
                if (!o.isBuffer(e) || !o.isBuffer(t)) throw new TypeError("Arguments must be Buffers");
                if (e === t) return 0;
                for (
                    var r = e.length, i = t.length, n = 0, a = Math.min(r, i);
                    n < a;
                    ++n)if (e[n] !== t[n]) {
                        r = e[n], i = t[n];
                        break
                    } return r < i ? -1 : i < r ? 1 : 0
            }, o.isEncoding = function (e) {
                switch (String(e).toLowerCase()) {
                    case "hex": case "utf8": case "utf-8": case "ascii": case "latin1": case "binary": case "base64": case "ucs2": case "ucs-2":
                    case "utf16le": case "utf-16le": return !0;
                    default: return !1
                }
            }, o.concat = function (e, t) {
                if (!Array.isArray(e)) throw new TypeError('"list" argument must be an Array of Buffers');
                if (0 === e.length) return o.alloc(0);

                var r;
                if (void 0 === t) for (t = 0, r = 0;
                    r < e.length;
                    ++r)t += e[r].length;

                var i = o.allocUnsafe(t), n = 0;
                for (r = 0;
                    r < e.length;
                    ++r) {
                    var a = e[r];
                    if (!o.isBuffer(a)) throw new TypeError('"list" argument must be an Array of Buffers');
                    a.copy(i, n), n += a.length
                } return i
            }, o.byteLength = h, o.prototype._isBuffer = !0, o.prototype.swap16 = function () {
                var e = this.length;
                if (e % 2 != 0) throw new RangeError("Buffer size must be a multiple of 16-bits");
                for (
                    var t = 0;
                    t < e;
                    t += 2)c(this, t, t + 1);
                return this
            }, o.prototype.swap32 = function () {
                var e = this.length;
                if (e % 4 != 0) throw new RangeError("Buffer size must be a multiple of 32-bits");
                for (
                    var t = 0;
                    t < e;
                    t += 4)c(this, t, t + 3), c(this, t + 1, t + 2);
                return this
            }, o.prototype.swap64 = function () {
                var e = this.length;
                if (e % 8 != 0) throw new RangeError("Buffer size must be a multiple of 64-bits");
                for (
                    var t = 0;
                    t < e;
                    t += 8)c(this, t, t + 7), c(this, t + 1, t + 6), c(this, t + 2, t + 5), c(this, t + 3, t + 4);
                return this
            }, o.prototype.toString = function () {
                var e = this.length;
                return 0 === e ? "" : 0 === arguments.length ? M(this, 0, e) : p.apply(this, arguments)
            }, o.prototype.equals = function (e) {
                if (!o.isBuffer(e)) throw new TypeError("Argument must be a Buffer");
                return this === e || 0 === o.compare(this, e)
            }, o.prototype.inspect = function () {
                var e = "", t = r.INSPECT_MAX_BYTES;
                return this.length > 0 && (e = this.toString("hex", 0, t).match(/.{2}/g).join(" "), this.length > t && (e += " ... ")), "<Buffer " + e + ">"
            }, o.prototype.compare = function (e, t, r, i, n) {
                if (!o.isBuffer(e)) throw new TypeError("Argument must be a Buffer");
                if (void 0 === t && (t = 0), void 0 === r && (r = e ? e.length : 0),
                    void 0 === i && (i = 0), void 0 === n && (n = this.length), t < 0 || r > e.length || i < 0 || n > this.length) 
                    throw new RangeError("out of range index");
                if (i >= n && t >= r) return 0;
                if (i >= n) return -1;
                if (t >= r) return 1;
                if (t >>>= 0, r >>>= 0, i >>>= 0, n >>>= 0, this === e) return 0;
                for (
                    var a = n - i, s = r - t, l = Math.min(a, s), u = this.slice(i, n), h = e.slice(t, r), p = 0;
                    p < l;
                    ++p)if (u[p] !== h[p]) {
                        a = u[p], s = h[p];
                        break
                    } return a < s ? -1 : s < a ? 1 : 0
            }, o.prototype.includes = function (e, t, r) { return -1 !== this.indexOf(e, t, r) }, o.prototype.indexOf =
            function (e, t, r) { return d(this, e, t, r, !0) }, o.prototype.lastIndexOf = function (e, t, r) { return d(this, e, t, r, !1) }, o.prototype.write =
            function (e, t, r, i) {
                if (void 0 === t) i = "utf8", r = this.length, t = 0;
                else if (void 0 === r && "string" == typeof t) i = t, r = this.length, t = 0;
                else {
                    if (!isFinite(t)) throw new Error("Buffer.write(string, encoding, offset[, length]) is no longer supported");
                    t >>>= 0, isFinite(r) ? (r >>>= 0, void 0 === i && (i = "utf8")) : (i = r, r = void 0)
                }
                var o = this.length - t;
                if ((void 0 === r || r > o) && (r = o), e.length > 0 && (r < 0 || t < 0) || t > this.length) 
                    throw new RangeError("Attempt to write outside buffer bounds");
                i || (i = "utf8");
                for (
                    var n = !1;
                    ;
                )switch (i) {
                    case "hex": return y(this, e, t, r);
                    case "utf8": case "utf-8": return m(this, e, t, r);
                    case "ascii": return b(this, e, t, r);
                    case "latin1": case "binary": return g(this, e, t, r);
                    case "base64": return E(this, e, t, r);
                    case "ucs2": case "ucs-2": case "utf16le": case "utf-16le": return v(this, e, t, r);
                    default: if (n) throw new TypeError("Unknown encoding: " + i);
                        i = ("" + i).toLowerCase(), n = !0
                }
            }, o.prototype.toJSON = function () { return { type: "Buffer", data: Array.prototype.slice.call(this._arr || this, 0) } };

        var k = 4096;
        o.prototype.slice = function (e, t) {
            var r = this.length;
            e = ~~e, t = void 0 === t ? r : ~~t, e < 0 ? (e += r) < 0 && (e = 0) : e > r
                && (e = r), t < 0 ? (t += r) < 0 && (t = 0) : t > r && (t = r), t < e && (t = e);

            var i = this.subarray(e, t);
            return i.__proto__ = o.prototype, i
        }, o.prototype.readUIntLE = function (e, t, r) {
            e >>>= 0, t >>>= 0, r || G(e, t, this.length);
            for (
                var i = this[e], o = 1, n = 0;
                ++n < t && (o *= 256);
            )i += this[e + n] * o;
            return i
        }, o.prototype.readUIntBE = function (e, t, r) {
            e >>>= 0, t >>>= 0, r || G(e, t, this.length);
            for (
                var i = this[e + --t], o = 1;
                t > 0 && (o *= 256);
            )i += this[e + --t] * o;
            return i
        }, o.prototype.readUInt8 = function (e, t) {
            return e >>>= 0, t || G(e, 1, this.length), this[e]
        }, o.prototype.readUInt16LE = function (e, t) {
            return e >>>= 0, t || G(e, 2, this.length), this[e] | this[e + 1] << 8
        }, o.prototype.readUInt16BE =
            function (e, t) {
                return e >>>= 0, t || G(e, 2, this.length), this[e] << 8 | this[e + 1]
            }, o.prototype.readUInt32LE =
            function (e, t) {
                return e >>>= 0, t || G(e, 4, this.length), (this[e] | this[e + 1] << 8 | this[e + 2] << 16) + 16777216 * this[e + 3]
            }, o.prototype.readUInt32BE =
            function (e, t) {
                return e >>>= 0, t || G(e, 4, this.length), 16777216 * this[e] + (this[e + 1] << 16 | this[e + 2] << 8 | this[e + 3])
            }, o.prototype.readIntLE =
            function (e, t, r) {
                e >>>= 0, t >>>= 0, r || G(e, t, this.length);
                for (var i = this[e], o = 1, n = 0; ++n < t && (o *= 256);)i += this[e + n] * o;
                return o *= 128, i >= o && (i -= Math.pow(2, 8 * t)), i
            }, o.prototype.readIntBE = function (e, t, r) {
                e >>>= 0, t >>>= 0, r || G(e, t, this.length);
                for (
                    var i = t, o = 1, n = this[e + --i];
                    i > 0 && (o *= 256);
                )n += this[e + --i] * o;
                return o *= 128, n >= o && (n -= Math.pow(2, 8 * t)), n
            }, o.prototype.readInt8 = function (e, t) { return e >>>= 0, t || G(e, 1, this.length), 128 & this[e] ? -1 * (255 - this[e] + 1) : this[e] 
            }, o.prototype.readInt16LE =
            function (e, t) {
                e >>>= 0, t || G(e, 2, this.length);

                var r = this[e] | this[e + 1] << 8;
                return 32768 & r ? 4294901760 | r : r
            }, o.prototype.readInt16BE = function (e, t) {
                e >>>= 0, t || G(e, 2, this.length);

                var r = this[e + 1] | this[e] << 8;
                return 32768 & r ? 4294901760 | r : r
            }, o.prototype.readInt32LE = function (e, t) {
                return e >>>= 0, t || G(e, 4, this.length), this[e] | this[e + 1] << 8 | this[e + 2] << 16 | this[e + 3] << 24
            }, o.prototype.readInt32BE = function (e, t) {
                return e >>>= 0, t || G(e, 4, this.length), this[e] << 24 | this[e + 1] << 16 | this[e + 2] << 8 | this[e + 3]
            }, o.prototype.readFloatLE = function (e, t) {
                return e >>>= 0, t || G(e, 4, this.length), N.read(this, e, !0, 23, 4)
            }, o.prototype.readFloatBE =
            function (e, t) { return e >>>= 0, t || G(e, 4, this.length), N.read(this, e, !1, 23, 4) }, o.prototype.readDoubleLE =
            function (e, t) { return e >>>= 0, t || G(e, 8, this.length), N.read(this, e, !0, 52, 8) }, o.prototype.readDoubleBE =
            function (e, t) { return e >>>= 0, t || G(e, 8, this.length), N.read(this, e, !1, 52, 8) }, o.prototype.writeUIntLE = function (e, t, r, i) {
                if (e = +e, t >>>= 0, r >>>= 0, !i) { A(this, e, t, r, Math.pow(2, 8 * r) - 1, 0) }
                var o = 1, n = 0;
                for (this[t] = 255 & e;
                    ++n < r && (o *= 256);
                )this[t + n] = e / o & 255;
                return t + r
            }, o.prototype.writeUIntBE = function (e, t, r, i) {
                if (e = +e, t >>>= 0, r >>>= 0, !i) { A(this, e, t, r, Math.pow(2, 8 * r) - 1, 0) }
                var o = r - 1, n = 1;
                for (this[t + o] = 255 & e;
                    --o >= 0 && (n *= 256);
                )this[t + o] = e / n & 255;
                return t + r
            }, o.prototype.writeUInt8 = function (e, t, r) { return e = +e, t >>>= 0, r || A(this, e, t, 1, 255, 0), this[t] = 255 & e, t + 1 
            }, o.prototype.writeUInt16LE =
            function (e, t, r) { return e = +e, t >>>= 0, r || A(this, e, t, 2, 65535, 0), this[t] = 255 & e, this[t + 1] = e >>> 8, t + 2 
            }, o.prototype.writeUInt16BE =
            function (e, t, r) { return e = +e, t >>>= 0, r || A(this, e, t, 2, 65535, 0), this[t] = e >>> 8, this[t + 1] = 255 & e, t + 2 
            }, o.prototype.writeUInt32LE =
            function (e, t, r) {
                return e = +e, t >>>= 0, r || A(this, e, t, 4, 4294967295, 0), this[t + 3] = e >>> 24, 
                this[t + 2] = e >>> 16, this[t + 1] = e >>> 8, this[t] = 255 & e, t + 4
            }, o.prototype.writeUInt32BE =
            function (e, t, r) {
                return e = +e, t >>>= 0, r || A(this, e, t, 4, 4294967295, 0), this[t] = e >>> 24, 
                this[t + 1] = e >>> 16, this[t + 2] = e >>> 8, this[t + 3] = 255 & e, t + 4
            }, o.prototype.writeIntLE = function (e, t, r, i) {
                if (e = +e, t >>>= 0, !i) {
                    var o = Math.pow(2, 8 * r - 1);
                    A(this, e, t, r, o - 1, -o)
                }
                var n = 0, a = 1, s = 0;
                for (this[t] = 255 & e;
                    ++n < r && (a *= 256);
                )e < 0 && 0 === s && 0 !== this[t + n - 1] && (s = 1), this[t + n] = (e / a >> 0) - s & 255;
                return t + r
            }, o.prototype.writeIntBE = function (e, t, r, i) {
                if (e = +e, t >>>= 0, !i) {
                    var o = Math.pow(2, 8 * r - 1);
                    A(this, e, t, r, o - 1, -o)
                }
                var n = r - 1, a = 1, s = 0;
                for (this[t + n] = 255 & e;
                    --n >= 0 && (a *= 256);
                )e < 0 && 0 === s && 0 !== this[t + n + 1] && (s = 1), this[t + n] = (e / a >> 0) - s & 255;
                return t + r
            }, o.prototype.writeInt8 = function (e, t, r) {
                return e = +e, t >>>= 0, r || A(this, e, t, 1, 127, -128), e < 0 && (e = 255 + e + 1),
                    this[t] = 255 & e, t + 1
            }, o.prototype.writeInt16LE =
            function (e, t, r) {
                return e = +e, t >>>= 0, r || A(this, e, t, 2, 32767, -32768),
                    this[t] = 255 & e, this[t + 1] = e >>> 8, t + 2
            }, o.prototype.writeInt16BE =
            function (e, t, r) {
                return e = +e, t >>>= 0, r || A(this, e, t, 2, 32767, -32768),
                    this[t] = e >>> 8, this[t + 1] = 255 & e, t + 2
            }, o.prototype.writeInt32LE =
            function (e, t, r) {
                return e = +e, t >>>= 0, r || A(this, e, t, 4, 2147483647, -2147483648), this[t] = 255 & e, this[t + 1] = e >>> 8, this[t + 2] = e >>> 16,
                    this[t + 3] = e >>> 24, t + 4
            }, o.prototype.writeInt32BE =
            function (e, t, r) {
                return e = +e, t >>>= 0, r || A(this, e, t, 4, 2147483647, -2147483648), 
                e < 0 && (e = 4294967295 + e + 1), this[t] = e >>> 24, this[t + 1] = e >>> 16,
                    this[t + 2] = e >>> 8, this[t + 3] = 255 & e, t + 4
            }, o.prototype.writeFloatLE =
            function (e, t, r) {
                return T(this, e, t, !0, r)
            }, o.prototype.writeFloatBE = function (e, t, r) {
                return T(this, e, t, !1, r)
            }, o.prototype.writeDoubleLE = function (e, t, r) {
                return I(this, e, t, !0, r)
            }, o.prototype.writeDoubleBE = function (e, t, r) {
                return I(this, e, t, !1, r)
            }, o.prototype.copy = function (e, t, r, i) {
                if (r || (r = 0), i || 0 === i || (i = this.length), t >= e.length
                    && (t = e.length), t || (t = 0), i > 0 && i < r && (i = r), i === r) return 0;
                if (0 === e.length || 0 === this.length) return 0;
                if (t < 0) throw new RangeError("targetStart out of bounds");
                if (r < 0 || r >= this.length) throw new RangeError("sourceStart out of bounds");
                if (i < 0) throw new RangeError("sourceEnd out of bounds");
                i > this.length && (i = this.length), e.length - t < i - r && (i = e.length - t + r);

                var o, n = i - r;
                if (this === e && r < t && t < i) for (o = n - 1;
                    o >= 0;
                    --o)e[o + t] = this[o + r];
                else if (n < 1e3) for (o = 0;
                    o < n;
                    ++o)e[o + t] = this[o + r];
                else Uint8Array.prototype.set.call(e, this.subarray(r, r + n), t);
                return n
            }, o.prototype.fill = function (e, t, r, i) {
                if ("string" == typeof e) {
                    if ("string" == typeof t ? (i = t, t = 0, r = this.length) : "string" == typeof r
                        && (i = r, r = this.length), 1 === e.length) {
                        var n = e.charCodeAt(0);
                        n < 256 && (e = n)
                    } 
                    if (void 0 !== i && "string" != typeof i) throw new TypeError("encoding must be a string");
                    if ("string" == typeof i && !o.isEncoding(i)) throw new TypeError("Unknown encoding: " + i)
                } else "number" == typeof e && (e &= 255);
                if (t < 0 || this.length < t || this.length < r) throw new RangeError("Out of range index");
                if (r <= t) return this;
                t >>>= 0, r = void 0 === r ? this.length : r >>> 0, e || (e = 0);

                var a;
                if ("number" == typeof e) for (a = t;
                    a < r;
                    ++a)this[a] = e;
                else {
                    var s = o.isBuffer(e) ? e : new o(e, i), l = s.length;
                    for (a = 0;
                        a < r - t;
                        ++a)this[a + t] = s[a % l]
                } return this
            };

        var L = /[^+/0-9A-Za-z-_]/g
    }, { "base64-js": 5, ieee754: 7 }]
    , 7: [function (e, t, r) {
        r.read = function (e, t, r, i, o) {
            var n, a, s = 8 * o - i - 1, l = (1 << s) - 1, u = l >> 1,
                h = -7, p = r ? o - 1 : 0, c = r ? -1 : 1, d = e[t + p];
            for (p += c, n = d & (1 << -h) - 1, d >>= -h, h += s;h > 0;n = 256 * n + e[t + p], p += c, h -= 8);
            for (a = n & (1 << -h) - 1, n >>= -h, h += i;h > 0;a = 256 * a + e[t + p], p += c, h -= 8);
            if (0 === n) n = 1 - u;
            else {
                if (n === l) return a ? NaN : 1 / 0 * (d ? -1 : 1);
                a += Math.pow(2, i), n -= u
            } return (d ? -1 : 1) * a * Math.pow(2, n - i)
        }, r.write = function (e, t, r, i, o, n) {
            var a, s, l, u = 8 * n - o - 1, h = (1 << u) - 1, p = h >> 1, c = 23 === o ? Math.pow(2, -24) - Math.pow(2, -77) : 0,
                d = i ? 0 : n - 1, f = i ? 1 : -1, y = t < 0 || 0 === t
                    && 1 / t < 0 ? 1 : 0;
            for (t = Math.abs(t), isNaN(t) || t === 1 / 0 ?
                (s = isNaN(t) ? 1 : 0, a = h) : (a = Math.floor(Math.log(t) / Math.LN2),
                    t * (l = Math.pow(2, -a)) < 1 && (a--, l *= 2), (t += a + p >= 1 ?
                        c / l : c * Math.pow(2, 1 - p)) * l >= 2 && (a++, l /= 2),
                    a + p >= h ? (s = 0, a = h) : a + p >= 1 ?
                        (s = (t * l - 1) * Math.pow(2, o), a += p) : (s = t * Math.pow(2, p - 1) * Math.pow(2, o), a = 0));
                o >= 8;
                e[r + d] = 255 & s, d += f, s /= 256, o -= 8);
            for (a = a << o | s, u += o;u > 0;e[r + d] = 255 & a, d += f, a /= 256, u -= 8);
            e[r + d - f] |= 128 * y
        }
    }, {}]
    , 8: [function (e, t, r) { t.exports = { STRING: 2, BOOLEAN: 4, NUMBER: 8 } }, {}]
    , 9: [function (e, t, r) {
        function i(e) {
            if (null !== e && "object" === (void 0 === e ? "undefined" : _typeof(e))) {
                if (n.isBuffer(e)) return e.length;

                var t = 0;
                for (
                    var r in e) if (Object.hasOwnProperty.call(e, r)) {
                        t += i(r);
                        try { t += i(e[r]) } catch (e) { e instanceof RangeError && (t = 0) }
                    } return t
            } return "string" == typeof e ?
                e.length * o.STRING : "boolean" == typeof e ?
                    o.BOOLEAN : "number" == typeof e ?
                        o.NUMBER : 0
        }
        var o = e("./byte_size"), n = e("buffer").Buffer;
        t.exports = i
    }, { "./byte_size": 8, buffer: 6 }]
    , 10: [function (e, t, r) {
        var i = e("./blocker/boot"), o = e("./blocker/load"), n = e("./blocker/play");
        t.exports = { Boot: i, Load: o, Play: n }
    }, { "./blocker/boot": 11, "./blocker/load": 13, "./blocker/play": 14 }]
    , 11: [function (e, t, r) {
        var i = e("./config"), o = function (e) { };
        o.prototype = {
            init: function () { }, 
            preload: function () {
                GAME.stage.backgroundColor = i.screenColor,
                GAME.load.image("loading", i.assetPath + "/image/loading.png"),
                GAME.load.image("loadingBorder", i.assetPath + "/image/loading-border.png")
            }, 
            create: function () {
                GAME.state.start("Load")
            }
        }, t.exports = o
    }, { "./config": 12 }]
    , 12: [function (e, t, r) {
        t.exports = {
            mainFontFamily: "Roboto", screenColor: "#dedede",
            assetPath: "/public/dist/asset"
        }
    }, {}]
    , 13: [function (e, t, r) {
        var i = e("./config"), 
        o = function (e) { };
        o.prototype = {
            setPreloadingBg: function () { GAME.stage.backgroundColor = i.screenColor },
            setPreloadingImage: function () {
                var e = GAME.add.sprite(WINDOW_WIDTH / 2, WINDOW_HEIGHT / 2 + 30,
                    "loadingBorder");
                e.x -= e.width / 2, e.alpha = .5;

                var t = GAME.add.sprite(WINDOW_WIDTH / 2, WINDOW_HEIGHT / 2 + 30,
                    "loading");
                t.x -= t.width / 2, GAME.load.setPreloadSprite(t)
            }, setPreloadingTitle: function () {
                var e = GAME.add.text(WINDOW_WIDTH / 2, WINDOW_HEIGHT / 2 - 40,
                    "Blocker", { font: "50px " + i.mainFontFamily, fill: "#545454" }),
                    t = GAME.add.text(WINDOW_WIDTH / 2, WINDOW_HEIGHT / 2,
                        "Multiplayer online game using Phaser + WebSocket (Socket.IO)",
                        { font: "16px " + i.mainFontFamily, fill: "#65655b" });
                e.anchor.setTo(.5, 1), 
                t.anchor.setTo(.5, 1)
            }, preload: function () {
                //################################################
                var _user_id        = $("#user_id").val();
                var _user_nick      = $("#user_nick").val();
                var _user_avata     = $("#user_avata").val();
                var _user_preloadImg= $("#user_preloadImg").val();
                //################################################
                let _txtpreload='';
                // _txtpreload=_txtpreload +'';
                _txtpreload=_txtpreload +'this.setPreloadingBg(), this.setPreloadingImage(), this.setPreloadingTitle(),';
                _txtpreload=_txtpreload +'GAME.load.tilemap("mapTile",            i.assetPath + "/image/map.json", null, Phaser.Tilemap.TILED_JSON),';
                _txtpreload=_txtpreload +'GAME.load.image("map",                  i.assetPath + "/image/map.png"              , 46, 46),';
                _txtpreload=_txtpreload +'GAME.load.spritesheet("zombie",         i.assetPath + "/image/monster/zombie.png"   , 46, 46),';
                _txtpreload=_txtpreload +'GAME.load.spritesheet("machine",        i.assetPath + "/image/monster/machine.png"  , 46, 46),';
                _txtpreload=_txtpreload +'GAME.load.spritesheet("bat",            i.assetPath + "/image/monster/bat.png"      , 46, 46),';
//################################################
// GAME.load.spritesheet("hero", i.assetPath + "/image/hero.png", 46, 46), 
// GAME.load.image("hero", "/public/dist/asset/image/upload/"+e.info.id+".png", 46, 46)
_txtpreload=_txtpreload +'(_user_avata=="N"||_user_avata==""||_user_avata==null)? ';
_txtpreload=_txtpreload +'GAME.load.spritesheet("hero", i.assetPath + "/image/hero.png", 20, 20) ';
_txtpreload=_txtpreload +': GAME.load.image("hero", "/public/dist/asset/image/upload/"+_user_id+".png", 20, 20),';
//################################################
_txtpreload=_txtpreload + _user_preloadImg    // 2020-10-18 사용자 아바타
_txtpreload=_txtpreload +'GAME.load.image("dashParticle",         i.assetPath + "/image/particle/dash.png"),';
_txtpreload=_txtpreload +'GAME.load.image("damageParticle",       i.assetPath + "/image/particle/damage.png"),';
_txtpreload=_txtpreload +'GAME.load.image("recoverParticle",      i.assetPath + "/image/particle/recover.png"),';
_txtpreload=_txtpreload +'GAME.load.image("shadow",               i.assetPath + "/image/misc/shadow.png"),';
_txtpreload=_txtpreload +'GAME.load.spritesheet("handsWeapon",    i.assetPath + "/image/weapon/hands.png"     , 80, 70),';
_txtpreload=_txtpreload +'GAME.load.spritesheet("laserTurretWeapon", i.assetPath + "/image/weapon/laser-turret.png", 52, 46),';
_txtpreload=_txtpreload +'GAME.load.spritesheet("wingsWeapon",    i.assetPath + "/image/weapon/wings.png"     , 46, 84),';
// _txtpreload=_txtpreload +'GAME.load.spritesheet("bowWeapon",      i.assetPath + "/image/weapon/bow.png"       , 160, 160),';
_txtpreload=_txtpreload +'GAME.load.spritesheet("bowWeapon",      i.assetPath + "/image/weapon/bow.png"       , 80, 80),';
_txtpreload=_txtpreload +'GAME.load.image("laserBullet",          i.assetPath + "/image/bullet/laser.png"),';
_txtpreload=_txtpreload +'GAME.load.image("arrowBullet",          i.assetPath + "/image/bullet/arrow.png")';
eval(_txtpreload);
            }, create: function () {
                GAME.state.start("Play")
            }
        }, t.exports = o
    }, { "./config": 12 }]
    , 14: [function (e, t, r) {
        function i(e) {
            var t = arguments.length > 1 && void 0 !== arguments[1] ? arguments[1] : null;
            y += 1, m += o(t), SOCKET.emit(e, t)
        }
        var o = e("object-sizeof"), n = e("./config"), 
            a = e("./../../../../common/module"), s = e("./../../../../common/gutil"), 
            l = e("./../../../../common/util"), u = a.Position, 
            h = a.Hero, p = a.Zombie, c = a.Machine, 
            d = a.Bat, f = l.getCurrentUtcTimestamp(), 
            y = 0, m = 0, b = 0, g = 0;
        setInterval(function () { g = l.getCurrentUtcTimestamp(), i(EVENT_NAME.player.ping) }, 1e3);

        var E = function (e) {
            this.isGameReady = !1, this.playerAngularVelocity = 200, this.lastMiniMapUpdatingTimestamp = 0, this.miniMapUpdatingDelay = 250,
                this.enterKeyDelay = 200, this.bubbleDelay = 3e3, this.VTMap = {}, 
                this.player = {}, 
                this.floorGroup = null, this.vtmapDebugGroup = null,
                this.stoneShadowGroup = null, this.stoneGroup = null, this.monsterShadowGroup = null, 
                this.zombieWeaponGroup = null, this.zombieGroup = null,
                this.machineWeaponGroup = null, this.machineGroup = null, this.batWeaponGroup = null, 
                this.batGroup = null, this.heroShadowGroup = null,
                this.enemyWeaponGroup = null, this.enemyGroup = null, this.playerWeaponGroup = null, 
                this.playerGroup = null, this.dashEmitterGroup = null,
                this.damageEmitterGroup = null, this.recoverEmitterGroup = null, this.machineLaserGroup = null, 
                this.enemyArrowGroup = null, this.playerArrowGroup = null,
                this.treeGroup = null, this.miniMapBg = null, this.miniMapUnit = null, this.heroBubbleGroup = null, 
                this.cursors = null, this.spaceKey = null, this.ctrlKey = null, this.enterKey = null
        };
        E.prototype = {
            getRandomWalkablePosition: function () { return this.getCreaturePositionByExclusion([1, 3, 6]) }, 
            getRandomAutoMovePosition: function (e) {
                for (
                    var t = void 0, r = !0;
                    r;
                ) {
                    t = this.getRandomStartedCreaturePosition();
                    GAME.physics.arcade.distanceToXY(e, t.x, t.y) > 600 && (r = !1)
                } return t
            }, updateCreatureLastVector: function (e) { e.blr.info.lastVector = { x: e.x, y: e.y, rotation: e.rotation } 
            }, getRotationBetweenCreatureAndMouse: function (e) {
                return Math.atan2(GAME.input.y - (e.position.y - GAME.camera.y),
                    GAME.input.x - (e.position.x - GAME.camera.x))
            }, updateCreatureRotationByFollowingMouse: function (e) {
                var t = this.getRotationBetweenCreatureAndMouse(e);
                e.rotation = t
            }, isCreatureMove: function (e) { return e.x !== e.blr.info.lastVector.x || e.y !== e.blr.info.lastVector.y 
            }, isCreatureRotate: function (e) { return e.rotation !== e.blr.info.lastVector.rotation 
            }, updateCreatureShadow: function (e, t, r) { void 0 === t && (t = e.x), void 0 === r && (r = e.y), e.blr.shadow.x = t, e.blr.shadow.y = r 
            }, updateCreatureWeapon: function (e, t, r, i) {
                void 0 === t && (t = e.x), void 0 === r && (r = e.y), void 0 === i && (i = e.rotation),
                    e.blr.weapon.x = t, e.blr.weapon.y = r, e.blr.weapon.rotation = i
            }, getEnemyByPlayerId: function (e) {
                var t = !1, r = {}, i = {};
                try { this.enemyGroup.forEach(function (o) { if (o.blr.info.id === e) throw t = !0, r = o, i }, this) } 
                catch (e) { if (e !== i) throw e } return t ||
                    l.clientBugLog("getEnemyByPlayerId", "Not found playerId", e), r
            }, getMonsterByMonsterIdAndGroup: function (e, t) {
                var r = !1, i = {}, o = {};
                try { t.forEach(function (t) { if (t.blr.info.id === e) throw r = !0, i = t, o }, this) } 
                catch (e) { if (e !== o) throw e } return r ||
                    l.clientBugLog("getMonsterByMonsterIdAndGroup", "Not found monsterId", e), i
            }, isPlayer: function (e) { return this.player.blr.info.id === e 
            }, getNearestHero: function (e) {
                var t = this.player, r = l.getDistanceBetween(e, this.player.blr.info.lastVector);
                return this.enemyGroup.forEachAlive(function (i) {
                    var o = l.getDistanceBetween(e, i.blr.info.lastVector);
                    o < r && (t = i, r = o)
                }, this), t
            }, logCreatureRespawning: function (e) {
                var t = e.blr.info.type + " " + e.blr.info.id + " (" + e.blr.info.life + ") is respawn at " + e.x + ", " + e.y;
                UI.addTextToLogList(t)
            }, logCreatureMessage: function (e) {
                var t = e.blr.info.type + " " + e.blr.info.id + ": " + e.blr.info.lastMessage;
                UI.addTextToLogList(t)
            }, logOnPlayerConnect: function (e) {
                var t = "hero " + e.id + " connect";
                UI.addTextToLogList(t)
            }, logOnPlayerDisconnect: function (e) {
                var t = "hero " + e.id + " disconnect";
                UI.addTextToLogList(t)
            }, logOnCreatureIsRecovered: function (e, t) {
                var r = "+1 life " + e.blr.info.type + " " + e.blr.info.id + " (" + e.blr.info.life + ")  was recovered from " + t;
                UI.addTextToLogList(r)
            }, logOnCreatureIsDamaged: function (e, t) {
                var r = "-1 life " + e.blr.info.type + " " + e.blr.info.id + " (" + e.blr.info.life + ")  was damaged from " + t;
                UI.addTextToLogList(r)
            }, logOnCreatureIsDied: function (e, t) {
                var r = e.blr.info.type + " " + e.blr.info.id + " was died by " + t;
                UI.addTextToLogList(r)
            }, setHeroBubble: function (e) {
                var t = { font: "12px " + n.mainFontFamily, fill: "#000", backgroundColor: "#ffffff", align: "center" }, 
                r = GAME.add.text(0, 0, "", t);
                r.anchor.set(.5, 2.4), r.padding.set(0), 
                r.visible = !1, e.blr.bubble = r, 
                this.heroBubbleGroup.add(e.blr.bubble), 
                this.updateCreatureBubble(e)
            }, updateCreatureBubble: function (e) {
                e.blr.bubble.visible && e.blr.info.lastMessage 
                && (this.updateCreatureBubbleText(e), this.updateCreatureBubblePosition(e))
            }, updateCreatureBubbleText: function (e) {
                var t = e.blr.info.lastMessage;
                e.blr.bubble.setText(t)
            }, updateCreatureBubblePosition: function (e) { e.blr.bubble.x = e.x, e.blr.bubble.y = e.y 
            }, updateCreatureBubbleVisibility: function (e) { 
                l.getCurrentUtcTimestamp() - e.blr.info.lastMessageTimestamp > this.bubbleDelay 
                && (e.blr.bubble.visible = !1)
            }, setCreatureLabel: function (e) {
                var t = { font: "13px " + n.mainFontFamily, fill: "#fff", align: "left" }, 
                r = GAME.add.text(0, 0, "", t);
                e.addChild(r), e.blr.label = r, 
                this.updateCreatureLabel(e)
            }, updateCreatureLabel: function (e) { 
                this.updateCreatureLabelText(e), 
                this.updateCreatureLabelPosition(e) 
            }, updateCreatureLabelText: function (e) {
                // 2020-10-18
                // var _user_nick  = $("#user_nick").val();
                var _nickChk    = e.blr.info.nick==null?e.blr.info.id:e.blr.info.nick;
                var t           = _nickChk + " " + e.blr.info.life + "/" + e.blr.info.maxLife;
                // var t = e.blr.info.id + " " + e.blr.info.life + "/" + e.blr.info.maxLife;
                e.blr.label.setText(t)
            }, updateCreatureLabelPosition: function (e) { 
                e.blr.label.x = -e.blr.label.width / 2 - 0, 
                e.blr.label.y = -e.height / 2 - e.blr.label.height / 2 - 10 
            }, spawnZombie: function (e) {
                var t = new p(e), r = this.spawnMonster(this.zombieGroup, t);
                r.animations.add("blink", [0, 1, 0]);

                var i = GAME.add.sprite(r.x, r.y, "handsWeapon");
                i.anchor.set(.5), i.animations.add("attack", [0, 1, 2, 3, 4]), 
                i.animations.play("attack", 10, !0, !1), GAME.physics.enable(i), r.blr.weapon = i,
                this.zombieWeaponGroup.add(r.blr.weapon), r.body.moves = !1
            }, spawnMachine: function (e) {
                var t = new c(e), r = this.spawnMonster(this.machineGroup, t);
                r.animations.add("blink", [0, 1, 0]);

                var i = GAME.add.sprite(r.x, r.y, "laserTurretWeapon");
                i.anchor.set(.5), i.animations.add("attack", [0, 1, 2]), 
                i.animations.play("attack", 10, !0, !1), GAME.physics.enable(i), r.blr.weapon = i,
                this.machineWeaponGroup.add(r.blr.weapon);

                var o = GAME.add.group();
                o.enableBody = !0, o.physicsBodyType = Phaser.Physics.ARCADE, 
                o.createMultiple(r.blr.misc.nBullets, "laserBullet"), o.setAll("anchor.x", .5),
                o.setAll("anchor.y", .5), o.setAll("outOfBoundsKill", !0), 
                o.setAll("checkWorldBounds", !0), r.blr.bullet = o, this.machineLaserGroup.add(r.blr.bullet),
                    r.body.moves = !1
            }, spawnBat: function (e) {
                var t = new d(e), r = this.spawnMonster(this.batGroup, t);
                r.animations.add("blink", [0, 1, 0]);

                var i = GAME.add.sprite(r.x, r.y, "wingsWeapon");
                i.anchor.set(.5), i.animations.add("attack", [0, 1, 2, 3]), 
                i.animations.play("attack", 10, !0, !1), GAME.physics.enable(i), r.blr.weapon = i,
                this.batWeaponGroup.add(r.blr.weapon), r.body.moves = !1, 
                r.scale.setTo(.7, .7), r.blr.shadow.scale.setTo(.5, .5), 
                r.blr.weapon.scale.setTo(.7, .7)
            }, spawnMonster: function (e, t) {
                var r = t.phrInfo, i = t.info.startVector, o = r.spriteName, 
                n = r.bodyOffset, a = r.width - 2 * n, s = r.height - 2 * n
                , l = r.bodyMass, u = e.create(i.x, i.y, o);
                GAME.physics.enable(u), u.anchor.set(.5), u.body.setSize(a, s, n, n), 
                u.body.tilePadding.set(n, n), u.body.mass = l,
                u.body.rotation = i.rotation, u.body.collideWorldBounds = !0, u.blr = t;

                var h = GAME.add.sprite(u.x, u.y, "shadow");
                return h.anchor.set(.1), h.scale.setTo(.7, .7), h.alpha = .3, u.blr.shadow = h, this.monsterShadowGroup.add(u.blr.shadow), 
                    this.setCreatureLabel(u), this.logCreatureRespawning(u), 
                    UI.addCreatureIdToCreatureList(u.blr.info.id, "monster"), u
            }, spawnPlayer: function (e) {
                var t = new h(e);
                this.player = this.spawnHero(t, t.info.lastVector), 
                this.playerGroup.add(this.player), 
                this.playerWeaponGroup.add(this.player.blr.weapon),
                this.playerArrowGroup.add(this.player.blr.bullet), 
                UI.addCreatureIdToCreatureList(this.player.blr.info.id, "player")
            }, spawnEnemy: function (e) {
                var t = new h(e), r = this.spawnHero(t, t.info.lastVector);
                this.enemyGroup.add(r), 
                this.enemyWeaponGroup.add(r.blr.weapon), 
                this.enemyArrowGroup.add(r.blr.bullet), 
                UI.addCreatureIdToCreatureList(r.blr.info.id, "enemy"),
                r.body.moves = !1
            }, 
            //#########################
            spawnHero: function (e, t) {
                var _user_id        = $('#user_id').val();
                // if(e.info.id != _user_id){ alert('e.info.id:'+e.info.id + '/ _user_id : ' + _user_id);}
                void 0 === t && (t = e.info.startVector);
                var r = e.phrInfo.bodyMass, 
                    //i = GAME.add.sprite(t.x, t.y, "hero"); 
                    // ############ 내가 접속한게 아니면 다른 사람 이미지로 표시
                    i = (e.info.id != _user_id) ? GAME.add.sprite(t.x, t.y, "hero_"+e.info.id) : GAME.add.sprite(t.x, t.y, "hero");
                i.rotation = t.rotation, 
                i.blr = e, 
                i.anchor.set(.5), 
                GAME.physics.enable(i), 
                i.body.collideWorldBounds = !0, 
                i.body.setSize(30, 30, 8, 8), 
                i.body.tilePadding.set(8, 8), 
                i.body.mass = r, 
                i.body.maxAngular = 500, 
                i.body.angularDrag = 50;

                var o = GAME.add.sprite(t.x, t.y, "shadow");
                // var o = GAME.add.sprite(t.x, t.y, "heroAva");
                o.anchor.set(.1), o.scale.setTo(.7, .7), o.alpha = .3, 
                i.blr.shadow = o, this.heroShadowGroup.add(i.blr.shadow);

                var n = GAME.add.sprite(t.x, t.y, "bowWeapon");
                n.rotation = t.rotation, 
                n.animations.add("attack", [0, 1, 2, 3, 4, 5, 0]), 
                n.anchor.set(.3, .5), n.scale.setTo(.5), 
                i.blr.weapon = n, 
                i.animations.add("blink", [0, 1, 0]), 
                i.animations.add("recover", [0, 2, 0]);

                var a = GAME.add.group();
                return a.enableBody = !0, 
                    a.physicsBodyType = Phaser.Physics.ARCADE, 
                    a.createMultiple(i.blr.misc.nBullets, "arrowBullet"), 
                    a.setAll("anchor.x", .5),
                    a.setAll("anchor.y", .5), 
                    a.setAll("outOfBoundsKill", !0), 
                    a.setAll("checkWorldBounds", !0), 
                    i.blr.bullet = a, 
                    this.setCreatureLabel(i), 
                    this.setHeroBubble(i),
                    this.logCreatureRespawning(i), 
                    i
            }, respawnMonster: function (e, t) { e.blr.label.revive(), e.blr.shadow.revive(), e.blr.weapon.revive(), e.revive(), 
                e.blr.info = t, e.x = t.startVector.x, e.y = t.startVector.y, e.rotation = t.startVector.rotation, this.updateCreatureWeapon(e), 
                this.updateCreatureShadow(e), this.updateCreatureBubblePosition(e), e.blr.reset(), this.logCreatureRespawning(e) 
            }, 
            //#########################
            respawnHero: function (e, t) { 
                e.blr.label.revive(), e.blr.shadow.revive(), e.blr.weapon.revive(), e.blr.bubble.revive(), 
                e.revive(), e.blr.info = t, e.x = t.startVector.x, 
                e.y = t.startVector.y, e.rotation = t.startVector.rotation, 
                this.updateCreatureWeapon(e), this.updateCreatureShadow(e), 
                this.updateCreatureBubblePosition(e), e.blr.reset(), 
                this.logCreatureRespawning(e) 
            }, debugMap: function () {
                var e = this.VTMap.data, t = this.VTMap.mapTileWidth, r = this.VTMap.mapTileHeight, i = this.VTMap.nTileWidth,
                    o = this.VTMap.nTileHeight, n = t - 8, a = r - 8, s = GAME.add.bitmapData(n, a);
                s.ctx.beginPath(), s.ctx.rect(0, 0, n, a), s.ctx.fillStyle = "rgba(240, 240, 100, .6)", s.ctx.fill();
                for ( var l = 0; l < i; l++)
                    for (var u = 0; u < o; u++) {
                        if (0 !== e[l][u]) {
                            var h = u * r + 4, p = l * t + 4, c = GAME.add.sprite(h, p, s);
                            this.vtmapDebugGroup.add(c)
                        }
                    }
            }, setMiniMap: function () {
                for (
                    var e = GAME.add.bitmapData(5 * this.VTMap.nTileWidth, 5 * this.VTMap.nTileHeight), t = void 0, r = 0;
                    r < this.VTMap.nTileHeight;r++)
                    for ( var i = 0; i < this.VTMap.nTileWidth; i++) {
                        var o = "#686868", n = 5 * i, a = 5 * r; //미니맵배경색
                        switch (this.VTMap.data[r][i]) {
                            case 1: o = "#4ed469"; break;
                            case 3: o = "#b4baaf"; break;
                            case 5: o = "#409fff"; break;
                            case 6: o = "#f07373"
                        }
                        e.ctx.fillStyle = o, e.ctx.fillRect(n, a, 4, 4)
                    } (t = GAME.add.sprite(6, 6, e)).alpha = .6, 
                    t.fixedToCamera = !0, this.miniMapBg.add(t)
            }, updateMinimap: function () {
                var e = l.getCurrentUtcTimestamp();
                if (e - this.lastMiniMapUpdatingTimestamp > this.miniMapUpdatingDelay) {
                    var t = GAME.add.bitmapData(5 * this.VTMap.nTileWidth, 5 * this.VTMap.nTileHeight), 
                        r = void 0;
                    this.miniMapUnit.forEachAlive(function (e) { e.destroy() }), 
                    t = this.addCreatureGroupToMiniMapUnitBmd(t, this.playerGroup, "#fff"),
                    t = this.addCreatureGroupToMiniMapUnitBmd(t, this.enemyGroup, "#60f0ff"), 
                    t = this.addCreatureGroupToMiniMapUnitBmd(t, this.zombieGroup, "#776b9f"),
                    t = this.addCreatureGroupToMiniMapUnitBmd(t, this.machineGroup, "#776b9f"), 
                    t = this.addCreatureGroupToMiniMapUnitBmd(t, this.batGroup, "#776b9f"),
                    (r = GAME.add.sprite(6, 6, t)).fixedToCamera = !0, this.miniMapUnit.add(r), 
                    this.lastMiniMapUpdatingTimestamp = e
                }
            }, addCreatureGroupToMiniMapUnitBmd: function (e, t, r) {
                return t.forEachAlive(function (t) {
                    var i = t.x, o = t.y, n = s.convertPointToTileIndex(i, o), a = 5 * n.x, l = 5 * n.y;
                    e.ctx.fillStyle = r, e.ctx.fillRect(a + 1, l + 1, 2, 2)
                }), e
            }, setDashEmitter: function () {
                this.dashEmitterGroup = GAME.add.emitter(0, 0, 60), 
                this.dashEmitterGroup.makeParticles("dashParticle"),
                this.dashEmitterGroup.gravity = 0, this.dashEmitterGroup.minRotation = 0, 
                this.dashEmitterGroup.maxRotation = 0,
                this.dashEmitterGroup.minParticleSpeed.setTo(-40, -40), 
                this.dashEmitterGroup.maxParticleSpeed.setTo(40, 40),
                this.dashEmitterGroup.bounce.setTo(.5, .5)
            }, setRecoverEmitter: function () {
                this.recoverEmitterGroup = GAME.add.emitter(0, 0, 30),
                    this.recoverEmitterGroup.makeParticles("recoverParticle"), this.recoverEmitterGroup.gravity = 0, 
                    this.recoverEmitterGroup.minParticleSpeed.setTo(-200, -200),
                    this.recoverEmitterGroup.maxParticleSpeed.setTo(200, 200)
            }, setDamageEmitter: function () {
                this.damageEmitterGroup = GAME.add.emitter(0, 0, 30),
                    this.damageEmitterGroup.makeParticles("damageParticle"), this.damageEmitterGroup.gravity = 0, 
                    this.damageEmitterGroup.minParticleSpeed.setTo(-200, -200),
                    this.damageEmitterGroup.maxParticleSpeed.setTo(200, 200)
            }, playDashParticle:
                function (e) { this.dashEmitterGroup.x = e.x, this.dashEmitterGroup.y = e.y, this.dashEmitterGroup.start(!0, 280, null, 20) }, playRecoverParticle:
                function (e) { this.recoverEmitterGroup.x = e.x, this.recoverEmitterGroup.y = e.y, this.recoverEmitterGroup.start(!0, 280, null, 20) }, playDamageParticle:
                function (e) { this.damageEmitterGroup.x = e.x, this.damageEmitterGroup.y = e.y, this.damageEmitterGroup.start(!0, 280, null, 20) }, fadeDashEmitter:
                function () { this.dashEmitterGroup.forEachAlive(function (e) { e.alpha = GAME.math.clamp(e.lifespan / 100, 0, 1) }, this) }, fadeRecoverEmitter:
                function () { this.recoverEmitterGroup.forEachAlive(function (e) { e.alpha = GAME.math.clamp(e.lifespan / 100, 0, 1) }, this) }, fadeDamageEmitter:
                function () { this.damageEmitterGroup.forEachAlive(function (e) { e.alpha = GAME.math.clamp(e.lifespan / 100, 0, 1) }, this) }, fadeAllEmitters:
                function () { this.fadeDashEmitter(), this.fadeRecoverEmitter(), this.fadeDamageEmitter() }, onCreatureOverlapWell:
                function (e, t) { this.onCreatureIsRecovered(e, "well") }, onCreatureOverlapFire: 
                function (e, t) { this.onCreatureIsDamaged(e, "fire") }, onPlayerOverlapZombie:
                function (e, t) { }, onPlayerOverlapMachine: function (e, t) { }, onPlayerOverlapBat: function (e, t) { }, onPlayerOverlapZombieWeapon:
                function (e, t) { this.onCreatureIsDamaged(e, "zombie hands") }, onPlayerOverlapMachineWeapon:
                function (e, t) { this.onCreatureIsDamaged(e, "machine's turret") }, onPlayerOverlapBatWeapon:
                function (e, t) { this.onCreatureIsDamaged(e, "bat wings") }, onMachineLaserOverlapPlayer:
                function (e, t) { e.kill(), this.onCreatureIsDamaged(t, "laser") }, onMachineLaserOverlapEnemy:
                function (e, t) { e.kill() }, onPlayerArrowOverlapStoneGroup: function (e, t) { }, onPlayerArrowOverlapMonster:
                function (e, t) { e.kill(), this.onCreatureIsDamaged(t, "arrow") }, onEnemyArrowOverlapMonster: function (e, t) { e.kill() }, onPlayerArrowOverlapEnemy:
                function (e, t) { e.kill(), this.onCreatureIsDamaged(t, "arrow") }, onPlayerArrowOverlapPlayer: function (e, t) { e.kill() }, onEnemyArrowOverlapPlayer:
                function (e, t) { e.kill() }, onEnemyArrowOverlapEnemy: function (e, t) { e.kill() }, onMonsterCollideStoneGroup: 
                function () { }, onPlayerCollideStoneGroup:
                function () { }, onEnemyCollideStoneGroup: function () { }, onPlayerCollideMonster: 
                function () { }, onEnemyCollideMonster: function () { }, onPlayerCollideEnemy:
                function () { }, onCreatureIsRecovered: function (e, t) {
                    var r = l.getCurrentUtcTimestamp();
                    e.alive && e.blr.info.life < e.blr.info.maxLife && r > e.blr.info.lastRecoverTimestamp + e.blr.info.immortalDelay 
                    && (this.player.blr.updateLastRecoverTimestamp(),
                        this.recoverCreature(e, t))
                }, onCreatureIsDamaged: function (e, t) {
                    var r = l.getCurrentUtcTimestamp();
                    e.blr.info.life <= 0 && this.killCreature(e, t), e.alive && e.blr.info.life > 0 && !e.blr.misc.isImmortal 
                        && r > e.blr.info.lastDamageTimestamp + e.blr.info.immortalDelay
                        && (this.player.blr.updateLastDamageTimestamp(), e.blr.info.life - 1 <= 0 ? this.killCreature(e, t) : this.damageCreature(e, t))
                }, recoverCreature: 
                    function (e, t) { "hero" === e.blr.info.type ? this.recoverHero(e, t) : this.recoverMonster(e, t) 
                }, recoverMonster:
                    function (e, t) { 
                }, recoverHero: function (e, t) {
                        var r = e.blr.info;
                        // i(EVENT_NAME.player.isRecovered, { playerInfo: { id: r.id, life: r.life, lastVector: r.lastVector }, recoveredFrom: t })
                        i(EVENT_NAME.player.isRecovered, { playerInfo: { id: r.id, life: r.life, lastVector: r.lastVector
                            , nick: r.nick, avata: r.avata, level: r.level
                         }, recoveredFrom: t })
                }, damageCreature: 
                    function (e, t) { "hero" === e.blr.info.type ? this.isPlayer(e) ? this.damagePlayer(e, t) : this.damageEnemy(e, t) : this.damageMonster(e, t) 
                }, damageMonster: function (e, t) {
                    var r = "";
                    switch (e.blr.info.type) {
                        case "zombie": r = EVENT_NAME.player.attackZombie; break;
                        case "machine": r = EVENT_NAME.player.attackMachine; break;
                        case "bat": r = EVENT_NAME.player.attackBat
                    }if (!l.isEmpty(r)) {
                        var o = e.blr.info;
                        i(r, { monsterInfo: { id: o.id, life: o.life }, damageFrom: t })
                    }
                }, damagePlayer: function (e, t) { i(EVENT_NAME.player.isDamaged, { playerInfo: e.blr.info, damageFrom: t }) 
                }, damageEnemy:
                    function (e, t) { i(EVENT_NAME.player.attackEnemy, { playerInfo: e.blr.info, damageFrom: t }) 
                }, killCreature:
                    function (e, t) { "hero" === e.blr.info.type ? this.isPlayer(e) ? this.killPlayer(e, t) : this.killEnemy(e, t) : this.killMonster(e, t) 
                }, killMonster:
                    function (e, t) {
                        var r = "";
                        switch (e.blr.info.type) {
                            case "zombie": r = EVENT_NAME.player.killZombie; break;
                            case "machine": r = EVENT_NAME.player.killMachine; break;
                            case "bat": r = EVENT_NAME.player.killBat
                    }
                    l.isEmpty(r) || i(r, { monsterInfo: e.blr.info, damageFrom: t })
            }, killPlayer: function (e, t) { i(EVENT_NAME.player.isDied, { playerInfo: e.blr.info, damageFrom: t }) 
            }, killEnemy:
                function (e, t) { i(EVENT_NAME.player.killEnemy, { playerInfo: e.blr.info, damageFrom: t }) 
            }, playerFireArrow: function (e) {
                    var t = l.getCurrentUtcTimestamp();
                    if (t > e.blr.misc.nextFireTimestamp && e.blr.bullet.countDead() > 0) {
                        this.updateCreatureRotationByFollowingMouse(e),
                        this.updateCreatureWeapon(e),
                        this.updateCreatureLastVector(e), e.blr.misc.nextFireTimestamp = t + e.blr.misc.fireRate;

                        var r = new u(GAME.input.activePointer.worldX, GAME.input.activePointer.worldY);
                        this.heroFireArrow(e, r);

                        var o = this.player.blr.info;
                        i(EVENT_NAME.player.fire, { playerInfo: { id: o.id, life: o.life, lastVector: o.lastVector }, targetPos: r })
                    }
                }, playerFireArrowByKeyboard: function (e) {
                    var t = l.getCurrentUtcTimestamp();
                    if (t > e.blr.misc.nextFireTimestamp && e.blr.bullet.countDead() > 0) {
                        e.blr.misc.nextFireTimestamp = t + e.blr.misc.fireRate;

                        var r = new u(this.player.x + 400 * Math.cos(this.player.rotation), this.player.y + 400 * Math.sin(this.player.rotation));
                        this.heroFireArrow(e, r);

                        var o = this.player.blr.info;
                        i(EVENT_NAME.player.fire, { playerInfo: { id: o.id, life: o.life, lastVector: o.lastVector }, targetPos: r })
                    }
                }, enemyFireArrow: function (e, t) { this.heroFireArrow(e, t) 
                }, heroFireArrow: function (e, t) {
                    this.updateCreatureLastVector(e), e.blr.weapon.animations.play("attack", 14, !1, !1);

                    var r = e.blr.bullet.getFirstExists(!1);
                    r.reset(e.blr.weapon.x + 40 * Math.cos(e.rotation), e.blr.weapon.y + 40 * Math.sin(e.rotation)),
                        r.rotation = GAME.physics.arcade.moveToXY(r, t.x, t.y, e.blr.misc.bulletSpeed)
                }, playerMove: function () {
                    if (GAME.physics.arcade.moveToPointer(this.player, this.player.blr.info.velocitySpeed),
                        Phaser.Rectangle.contains(this.player.body, GAME.input.x, GAME.input.y)) this.player.body.velocity.setTo(0, 0);
                    else {
                        this.updateCreatureRotationByFollowingMouse(this.player),
                        this.updateCreatureWeapon(this.player),
                        this.updateCreatureShadow(this.player),
                        this.playDashParticle(this.player),
                        this.updateCreatureBubblePosition(this.player),
                        this.updateCreatureLastVector(this.player);

                        var e = this.player.blr.info;
                        i(EVENT_NAME.player.move, { id: e.id, life: e.life, lastVector: e.lastVector })
                        // X,Y 좌표 표시
                        try { document.getElementById("dp_Xy").innerHTML = "X:" + Math.round(this.player.x, 1) + ",Y:" + Math.round(this.player.y, 1) + ""; } catch (e) { }
                    }
                }, playerMoveByKeyboard: function () {
                    GAME.physics.arcade.velocityFromAngle(this.player.angle,
                        this.player.blr.info.velocitySpeed,
                        this.player.body.velocity),
                        this.updateCreatureWeapon(this.player),
                        this.updateCreatureShadow(this.player),
                        this.playDashParticle(this.player),
                        this.updateCreatureBubblePosition(this.player),
                        this.updateCreatureLastVector(this.player);

                    var e = this.player.blr.info;
                    i(EVENT_NAME.player.move, { id: e.id, life: e.life, lastVector: e.lastVector })
                    // X,Y 좌표 표시
                    try { document.getElementById("dp_Xy").innerHTML = "X:" + Math.round(this.player.x, 1) + ",Y:" + Math.round(this.player.y, 1) + ""; } catch (e) { }
                }, playerRotateByKeyboard: function (e) {
                    this.player.body.angularVelocity = e,
                        this.updateCreatureWeapon(this.player),
                        this.updateCreatureLastVector(this.player);

                    var t = this.player.blr.info;
                    i(EVENT_NAME.player.rotate, { id: t.id, life: t.life, lastVector: t.lastVector })
                }, playerSendMessage: function () {
                    var e = l.getCurrentUtcTimestamp();
                    if (this.player.blr.misc.isTyping) {
                        this.player.blr.updateLastEnterTimestamp(e),
                        this.player.blr.misc.isTyping = !1;

                        var t = UI.getMessageInput();
                        if (t) {
                            this.player.blr.updateLastMessageTimestamp(e),
                            this.player.blr.info.lastMessage = t,
                            this.player.blr.bubble.setText(t),
                            this.player.blr.bubble.visible = !0,
                            this.logCreatureMessage(this.player);

                            var r = this.player.blr.info;
                            i(EVENT_NAME.player.message,
                                { id: r.id, life: r.life, lastVector: r.lastVector, lastMessage: r.lastMessage
                                    , lastMessageTimestamp: r.lastMessageTimestamp 
                                    , nick: r.nick, avata: r.avata, level: r.level
                                })
                            ////############################################# 2020-10-04 dp_Chat
                            // 다른 사용자 말한 것 화면에 추가
                            var _sender_nick=r.nick;// 2020-10-18
                            if(_sender_nick==null){_sender_nick = r.id;}
                            try { document.getElementById("dp_Chat").innerHTML = "<pre>" + _sender_nick + " : " + t + "</pre>" + document.getElementById("dp_Chat").innerHTML; } catch (e) { }
                            try { document.getElementById("dp_Xy").innerHTML = "X:" + Math.round(this.player.x, 1) + ",Y:" + Math.round(this.player.y, 1) + ""; } catch (e) { }
                        }
                        UI.disableMessageInput()
                    } else this.player.blr.updateLastEnterTimestamp(e), this.player.blr.misc.isTyping = !0, UI.enableMessageInput()
                }, autoMove: function () { 

                }, setSocketHandlers: function () {
                    SOCKET.on(EVENT_NAME.server.newPlayer, this.onPlayerConnect.bind(this)),
                    SOCKET.on(EVENT_NAME.server.disconnectedPlayer, this.onPlayerDisconnect.bind(this)),
                    SOCKET.on(EVENT_NAME.player.ping, this.onPlayerPing.bind(this)),
                    SOCKET.on(EVENT_NAME.player.message, this.onPlayerMessage.bind(this)),
                    SOCKET.on(EVENT_NAME.player.move, this.onPlayerMove.bind(this)),
                    SOCKET.on(EVENT_NAME.player.rotate, this.onPlayerRotate.bind(this)),
                    SOCKET.on(EVENT_NAME.player.fire, this.onPlayerFire.bind(this)),
                    SOCKET.on(EVENT_NAME.player.isDamaged, this.onPlayerIsDamaged.bind(this)),
                    SOCKET.on(EVENT_NAME.player.isDamagedItSelf, this.onPlayerIsDamagedItSelf.bind(this)),
                    SOCKET.on(EVENT_NAME.player.isRecovered, this.onPlayerIsRecovered.bind(this)),
                    SOCKET.on(EVENT_NAME.player.isRecoveredItSelf, this.onPlayerIsRecoveredItSelf.bind(this)),
                    SOCKET.on(EVENT_NAME.player.isDied, this.onPlayerIsDied.bind(this)),
                    SOCKET.on(EVENT_NAME.player.isDiedItSelf, this.onPlayerIsDiedItSelf.bind(this)),
                    SOCKET.on(EVENT_NAME.player.isRespawn, this.onPlayerIsRespawn.bind(this)),
                    SOCKET.on(EVENT_NAME.player.isRespawnItSelf, this.onPlayerIsRespawnItSelf.bind(this)),
                    SOCKET.on(EVENT_NAME.player.attackZombie, this.onPlayerAttackZombie.bind(this)),
                    SOCKET.on(EVENT_NAME.player.attackMachine, this.onPlayerAttackMachine.bind(this)),
                    SOCKET.on(EVENT_NAME.player.attackBat, this.onPlayerAttackBat.bind(this)),
                    SOCKET.on(EVENT_NAME.player.killZombie, this.onPlayerKillZombie.bind(this)),
                    SOCKET.on(EVENT_NAME.player.killMachine, this.onPlayerKillMachine.bind(this)),
                    SOCKET.on(EVENT_NAME.player.killBat, this.onPlayerKillBat.bind(this)),
                    SOCKET.on(EVENT_NAME.player.respawnZombie, this.onRespawnZombie.bind(this)),
                    SOCKET.on(EVENT_NAME.player.respawnMachine, this.onRespawnMachine.bind(this)),
                    SOCKET.on(EVENT_NAME.player.respawnBat, this.onRespawnBat.bind(this)),
                    SOCKET.on(EVENT_NAME.player.attackEnemy, this.onPlayerAttackEnemy.bind(this)),
                    SOCKET.on(EVENT_NAME.player.killEnemy, this.onPlayerKillEnemy.bind(this)),
                    SOCKET.on(EVENT_NAME.player.respawnEnemy, this.onRespawnEnemy.bind(this)),
                    SOCKET.on(EVENT_NAME.server.machineFire, this.onMachineFire.bind(this)),
                    SOCKET.on(EVENT_NAME.server.zombieMove, this.onZombieMove.bind(this)),
                    SOCKET.on(EVENT_NAME.server.batMove, this.onBatMove.bind(this))
                }, onPlayerReady: function (e) {
                    var t = e.zombieInfos, r = e.machineInfos, 
                    i = e.playerInfo, o = e.batInfos, n = e.existingPlayerInfos;
                    this.VTMap = e.VTMap, IS_DEBUG && this.debugMap(), this.setMiniMap();
                    for (var a = t.length, s = 0; s < a; s++)this.spawnZombie(t[s]);
                    for ( var l = r.length, u = 0; u < l; u++)this.spawnMachine(r[u]);
                    for ( var h = o.length, p = 0; p < h; p++)this.spawnBat(o[p]);
                    for ( var c = n.length, d = 0; d < c; d++)this.spawnEnemy(n[d]);
                    this.spawnPlayer(i),
                        GAME.camera.follow(this.player), 
                        GAME.world.bringToTop(this.floorGroup),
                        GAME.world.bringToTop(this.stoneShadowGroup),
                        GAME.world.bringToTop(this.monsterShadowGroup),
                        GAME.world.bringToTop(this.heroShadowGroup),
                        GAME.world.bringToTop(this.stoneGroup),
                        GAME.world.bringToTop(this.vtmapDebugGroup),
                        GAME.world.bringToTop(this.dashEmitterGroup),
                        GAME.world.bringToTop(this.recoverEmitterGroup),
                        GAME.world.bringToTop(this.damageEmitterGroup),
                        GAME.world.bringToTop(this.zombieWeaponGroup),
                        GAME.world.bringToTop(this.zombieGroup),
                        GAME.world.bringToTop(this.machineGroup),
                        GAME.world.bringToTop(this.machineWeaponGroup),
                        GAME.world.bringToTop(this.batWeaponGroup),
                        GAME.world.bringToTop(this.batGroup),
                        GAME.world.bringToTop(this.enemyWeaponGroup),
                        GAME.world.bringToTop(this.enemyGroup),
                        GAME.world.bringToTop(this.playerWeaponGroup),
                        GAME.world.bringToTop(this.playerGroup),
                        GAME.world.bringToTop(this.machineLaserGroup),
                        GAME.world.bringToTop(this.enemyArrowGroup),
                        GAME.world.bringToTop(this.playerArrowGroup),
                        GAME.world.bringToTop(this.treeGroup),
                        GAME.world.bringToTop(this.miniMapBg),
                        GAME.world.bringToTop(this.miniMapUnit),
                        GAME.world.bringToTop(this.heroBubbleGroup), 
                        this.setSocketHandlers(), this.isGameReady = !0
                }, onPlayerConnect: function (e) {
                    var t = e.playerInfo;
                    l.clientLog("Enemy is connected", t), 
                    this.logOnPlayerConnect(t), this.spawnEnemy(t)
                }, onPlayerDisconnect: function (e) {
                    var t = e.playerInfo;
                    l.clientLog("Enemy is disconnected", t), 
                    this.logOnPlayerDisconnect(t);

                    var r = !1;
                    this.enemyGroup.forEach(function (e) {
                        e.blr.info.id === t.id 
                        && (e.blr.bullet.destroy(), e.blr.label.destroy(), e.blr.bullet.destroy(),
                            e.blr.weapon.destroy(), e.blr.shadow.destroy(), e.destroy(), r = !0, 
                            UI.removeCreatureIdFromCreatureList(e.blr.info.id))
                    }, this), r || console.error("not found enemy " + t.id, t)
                }, onPlayerPing: function (e) {
                    var t = l.getCurrentUtcTimestamp();
                    b = t - g
                }, onPlayerMessage: function (e) {
                    var t = e.id, r = e.life, i = e.lastVector, 
                    o = e.lastMessageTimestamp, n = e.lastMessage, 
                    a = this.getEnemyByPlayerId(t);
                    // 다른 사용자 말한 것 화면에 추가
                    var _sender_nick=e.nick;// 2020-10-18
                    if(_sender_nick==null){_sender_nick = t;}
                    try { document.getElementById("dp_Chat").innerHTML = "<pre>" + _sender_nick + " : " + n + "</pre>" + document.getElementById("dp_Chat").innerHTML; } catch (e) { }
                    l.isEmptyObject(a) || (this.forceUpdateEnemyAfterGotSubsequentRequest(a, r, i),
                        a.blr.updateLastMessageTimestamp(o), 
                        a.blr.info.lastMessage = n,
                        a.blr.bubble.setText(n), 
                        a.blr.bubble.visible = !0, 
                        this.logCreatureMessage(a))
                }, onPlayerMove: function (e) {
                    var t = e.id, r = e.life, i = e.lastVector, o = this.getEnemyByPlayerId(t);
                    l.isEmptyObject(o) || (this.forceUpdateEnemyAfterGotSubsequentRequest(o, r, i),
                        this.updateCreatureWeapon(o), 
                        this.updateCreatureShadow(o),
                        this.playDashParticle(o), 
                        this.updateCreatureBubblePosition(o),
                        this.updateCreatureLastVector(o))
                }, onPlayerRotate: function (e) {
                    var t = e.id, r = e.life, i = e.lastVector, o = this.getEnemyByPlayerId(t);
                    l.isEmptyObject(o) || (this.forceUpdateEnemyAfterGotSubsequentRequest(o, r, i),
                        this.updateCreatureWeapon(o), 
                        this.updateCreatureLastVector(o))
                }, onPlayerFire: function (e) {
                    var t = e.playerInfo, r = t.id, i = t.life, o = t.lastVector, n = e.targetPos, a =
                        this.getEnemyByPlayerId(r);
                    l.isEmptyObject(a) || (this.forceUpdateEnemyAfterGotSubsequentRequest(a, i, o),
                        this.updateCreatureWeapon(a), this.enemyFireArrow(a, n))
                }, onPlayerIsDamaged: function (e) {
                    var t = e.playerInfo, r = e.damageFrom, 
                    i = this.getEnemyByPlayerId(t.id);
                    l.isEmptyObject(i) || (this.forceUpdateEnemyAfterGotSubsequentRequest(i, t.life, t.lastVector),
                        this.damageHeroAfterGotSubsequentRequest(i, r))
                }, onPlayerIsDamagedItSelf: function (e) {
                    var t = e.damageFrom;
                    this.damageHeroAfterGotSubsequentRequest(this.player, t)
                }, onPlayerIsRecovered: function (e) {
                    var t = e.playerInfo, r = t.id, i = t.life, o = t.lastVector, 
                    n = e.recoveredFrom, a = this.getEnemyByPlayerId(r);
                    l.isEmptyObject(a) || (this.forceUpdateEnemyAfterGotSubsequentRequest(a, i, o),
                        this.recoverHeroAfterGotSubsequentRequest(a, n))
                }, onPlayerIsRecoveredItSelf: function (e) {
                    var t = e.recoveredFrom;
                    this.recoverHeroAfterGotSubsequentRequest(this.player, t)
                }, onPlayerIsDied: function (e) {
                    var t = e.playerInfo, r = e.damageFrom, i = this.getEnemyByPlayerId(t.id);
                    l.isEmptyObject(i) || (this.forceUpdateEnemyAfterGotSubsequentRequest(i, t.life, t.lastVector),
                        this.killHeroAfterGotSubsequentRequest(i, r))
                }, onPlayerIsDiedItSelf: function (e) {
                    var t = e.damageFrom;
                    this.killHeroAfterGotSubsequentRequest(this.player, t)
                }, onPlayerIsRespawn: function (e) {
                    var t = e.playerInfo, r = this.getEnemyByPlayerId(t.id);
                    l.isEmptyObject(r) || this.respawnHero(r, t)
                }, onPlayerIsRespawnItSelf: function (e) {
                    var t = e.playerInfo;
                    this.respawnHero(this.player, t)
                }, onPlayerAttackZombie: function (e) {
                    var t = e.monsterInfo.id, r = e.damageFrom, 
                    i = this.getMonsterByMonsterIdAndGroup(t, this.zombieGroup);
                    l.isEmptyObject(i) || this.damageMonsterAfterGotSubsequentRequest(i, r)
                }, onPlayerAttackMachine: function (e) {
                    var t = e.monsterInfo.id, r = e.damageFrom, 
                    i = this.getMonsterByMonsterIdAndGroup(t, this.machineGroup);
                    l.isEmptyObject(i) || this.damageMonsterAfterGotSubsequentRequest(i, r)
                }, onPlayerAttackBat: function (e) {
                    var t = e.monsterInfo.id, r = e.damageFrom, 
                    i = this.getMonsterByMonsterIdAndGroup(t, this.batGroup);
                    l.isEmptyObject(i) || this.damageMonsterAfterGotSubsequentRequest(i, r)
                }, onPlayerKillZombie: function (e) {
                    var t = e.monsterInfo, r = e.damageFrom, 
                    i = this.getMonsterByMonsterIdAndGroup(t.id, this.zombieGroup);
                    l.isEmptyObject(i) || this.killMonsterAfterGotSubsequentRequest(i, r)
                }, onPlayerKillMachine: function (e) {
                    var t = e.monsterInfo, r = e.damageFrom, 
                    i = this.getMonsterByMonsterIdAndGroup(t.id, this.machineGroup);
                    l.isEmptyObject(i) || this.killMonsterAfterGotSubsequentRequest(i, r)
                }, onPlayerKillBat: function (e) {
                    var t = e.monsterInfo, r = e.damageFrom, 
                    i = this.getMonsterByMonsterIdAndGroup(t.id, this.batGroup);
                    l.isEmptyObject(i) || this.killMonsterAfterGotSubsequentRequest(i, r)
                }, onRespawnZombie: function (e) {
                    var t = e.monsterInfo, r = this.getMonsterByMonsterIdAndGroup(t.id, this.zombieGroup);
                    l.isEmptyObject(r) || this.respawnMonster(r, t)
                }, onRespawnMachine: function (e) {
                    var t = e.monsterInfo, r = this.getMonsterByMonsterIdAndGroup(t.id, this.machineGroup);
                    l.isEmptyObject(r) || this.respawnMonster(r, t)
                }, onRespawnBat: function (e) {
                    var t = e.monsterInfo, r = this.getMonsterByMonsterIdAndGroup(t.id, this.batGroup);
                    l.isEmptyObject(r) || this.respawnMonster(r, t)
                }, onPlayerAttackEnemy: function (e) {
                    var t = e.playerInfo, r = e.damageFrom;
                    if (this.isPlayer(t.id)) this.damageHeroAfterGotSubsequentRequest(this.player, r);
                    else {
                        var i = this.getEnemyByPlayerId(t.id);
                        this.damageHeroAfterGotSubsequentRequest(i, r)
                    }
                }, onPlayerKillEnemy: function (e) {
                    var t = e.playerInfo, r = e.damageFrom;
                    if (this.isPlayer(t.id)) this.killHeroAfterGotSubsequentRequest(this.player, r);
                    else {
                        var i = this.getEnemyByPlayerId(t.id);
                        this.killHeroAfterGotSubsequentRequest(i, r)
                    }
                }, onRespawnEnemy: function (e) {
                    var t = e.playerInfo;
                    if (this.isPlayer(t.id)) this.respawnHero(this.player, t);
                    else {
                        var r = this.getEnemyByPlayerId(t.id);
                        this.respawnHero(r, t)
                    }
                }, onZombieMove: function (e) { },
            onMachineFire: function (e) {
                for (var t = e.length, r = 0; r < t; r++) {
                    var i = e[r], o = i.monsterInfo.id, n = i.targetVector, 
                        a = this.getMonsterByMonsterIdAndGroup(o, this.machineGroup);
                    if (!l.isEmptyObject(a)) {
                        var s = l.getCurrentUtcTimestamp();
                        if (a.alive && s > a.blr.misc.nextFireTimestamp && a.blr.bullet.countDead() > 0) {
                            a.blr.misc.nextFireTimestamp = s + a.blr.misc.fireRate;
                            var u = a.blr.bullet.getFirstDead();
                            u.reset(a.blr.weapon.x, a.blr.weapon.y),
                            u.rotation = GAME.physics.arcade.moveToXY(u, n.x, n.y, a.blr.misc.bulletSpeed)
                        }
                    }
                }
            }, onBatMove: function (e) { 

            }, killHeroAfterGotSubsequentRequest: function (e, t) {
                e.blr.info.life--, 
                e.blr.updateLastDamageTimestamp(), 
                this.playDamageParticle(e), 
                e.animations.play("blink", 10, !1, !1),
                e.blr.label.kill(), 
                e.blr.shadow.kill(), 
                e.blr.weapon.kill(),
                e.blr.bubble.kill(), e.kill(), 
                this.logOnCreatureIsDied(e, t)
            }, killMonsterAfterGotSubsequentRequest: function (e, t) {
                e.blr.info.life--, 
                e.blr.updateLastDamageTimestamp(), 
                this.playDamageParticle(e), 
                e.animations.play("blink", 10, !1, !1),
                e.blr.label.kill(), 
                e.blr.shadow.kill(), 
                e.blr.weapon.kill(), e.kill(), 
                this.logOnCreatureIsDied(e, t)
            }, recoverHeroAfterGotSubsequentRequest: function (e, t) {
                e.blr.info.life++, this.playRecoverParticle(e), 
                e.animations.play("recover", 10, !1, !1), 
                this.logOnCreatureIsRecovered(e, t)
            }, damageHeroAfterGotSubsequentRequest: function (e, t) {
                e.blr.info.life--, 
                this.playDamageParticle(e), 
                e.animations.play("blink", 10, !1, !1),
                this.logOnCreatureIsDamaged(e, t)
            }, damageMonsterAfterGotSubsequentRequest: function (e, t) {
                e.blr.info.life--, 
                this.playDamageParticle(e), 
                e.animations.play("blink", 10, !1, !1), 
                this.logOnCreatureIsDamaged(e, t)
            }, forceUpdateEnemyAfterGotSubsequentRequest: function (e, t, r) { 
                    this.forceUpdateCreatureAfterGotSubsequentRequest(e, t, r) 
            }, forceUpdateCreatureAfterGotSubsequentRequest: function (e, t, r) {
                    e.blr.info.life = t, 
                    e.x = r.x, 
                    e.y = r.y, 
                    e.rotation = r.rotation
            }, preload:
                function () { 

                }, init: function () {
                    this.floorGroup = GAME.add.group(),
                    this.stoneShadowGroup = GAME.add.group(),
                    this.stoneGroup = GAME.add.group(),
                    this.vtmapDebugGroup = GAME.add.group(),
                    this.monsterShadowGroup = GAME.add.group(),
                    this.zombieWeaponGroup = GAME.add.group(),
                    this.zombieGroup = GAME.add.group(),
                    this.machineWeaponGroup = GAME.add.group(),
                    this.machineGroup = GAME.add.group(),
                    this.batWeaponGroup = GAME.add.group(),
                    this.batGroup = GAME.add.group(),
                    this.heroShadowGroup = GAME.add.group(),
                    this.enemyWeaponGroup = GAME.add.group(),
                    this.enemyGroup = GAME.add.group(),
                    this.playerWeaponGroup = GAME.add.group(),
                    this.playerGroup = GAME.add.group(),
                    this.machineLaserGroup = GAME.add.group(),
                    this.enemyArrowGroup = GAME.add.group(),
                    this.playerArrowGroup = GAME.add.group(),
                    this.treeGroup = GAME.add.group(),
                    this.miniMapBg = GAME.add.group(),
                    this.miniMapUnit = GAME.add.group(),
                    this.heroBubbleGroup = GAME.add.group(),
                    GAME.canvas.oncontextmenu = function (e) { e.preventDefault() },
                    GAME.scale.scaleMode = Phaser.ScaleManager.SHOW_ALL,
                    GAME.scale.pageAlignHorizontally = !0,
                    GAME.scale.pageAlignVertically = !0,
                    GAME.input.mouse.capture = !0,
                    GAME.stage.disableVisibilityChange = !0,
                    GAME.scale.setResizeCallback( function () { GAME.scale.setGameSize(window.innerWidth, window.innerHeight) }),
                    SOCKET.on("connect", function () { l.clientLog("Connected to server") }),
                    SOCKET.on("disconnect", function () { l.clientLog("Disconnected from " + SOCKET_URL) }),
                    SOCKET.on(EVENT_NAME.player.ready, this.onPlayerReady.bind(this)
                    )
                }, create:
                function () {
                    GAME.time.advancedTiming = !0, 
                    GAME.world.setBounds(0, 0, GAME_WORLD_WIDTH, GAME_WORLD_HEIGHT),
                    GAME.physics.startSystem(Phaser.Physics.ARCADE), 
                    GAME.stage.backgroundColor = "#181819",
                    GAME.stage.transparent=true // 2020-10-30 배경 투명
                    ;

                    var e = GAME.add.tilemap("mapTile");
                    e.addTilesetImage("map"), this.floorGroup = e.createLayer(0), this.floorGroup.resizeWorld(),
                    e.setTileIndexCallback(5, this.onCreatureOverlapWell, this, this.floorGroup),
                    e.setTileIndexCallback(6, this.onCreatureOverlapFire, this, this.floorGroup),
                    this.stoneGroup = e.createLayer(1), e.setCollision([1, 3], !0, this.stoneGroup),
                    e.forEach(function (e) {
                        if (1 === e.index || 3 === e.index) {
                            var t = GAME.add.sprite(e.worldX, e.worldY, "shadow");
                            t.scale.setTo(.7, .7), t.alpha = .3, 
                            this.stoneShadowGroup.add(t)
                        }
                    }, this, 0, 0, 50, 50, this.stoneGroup), this.treeGroup = e.createLayer(2),
                    // this.spaceKey = GAME.input.keyboard.addKey(Phaser.Keyboard.SPACEBAR),
                    // CONTROL 키입력으로 화살 발사 Phaser.Keyboard.CONTROL
                    this.ctrlKey  = GAME.input.keyboard.addKey(Phaser.Keyboard.CONTROL),
                    this.enterKey = GAME.input.keyboard.addKey(Phaser.Keyboard.ENTER),
                    this.cursors  = GAME.input.keyboard.createCursorKeys(),
                    this.setDashEmitter(),
                    this.setRecoverEmitter(),
                    this.setDamageEmitter(),
                    i(EVENT_NAME.player.ready, null)
                }, update: function () {
                    if (this.isGameReady) {
                        var e = l.getCurrentUtcTimestamp();
                        if (GAME.physics.arcade.collide(this.playerGroup, this.floorGroup), 
                            GAME.physics.arcade.collide(this.playerGroup, this.stoneGroup,
                            this.onPlayerCollideStoneGroup, null, this), 
                            GAME.physics.arcade.collide(this.enemyGroup, this.stoneGroup, this.onEnemyCollideStoneGroup, null, this),
                            GAME.physics.arcade.collide(this.playerGroup, this.zombieGroup, this.onPlayerCollideMonster, null, this),
                            GAME.physics.arcade.collide(this.playerGroup, this.machineGroup, this.onPlayerCollideMonster, null, this),
                            GAME.physics.arcade.collide(this.playerGroup, this.batGroup, this.onPlayerCollideMonster, null, this),
                            GAME.physics.arcade.collide(this.enemyGroup, this.zombieGroup, this.onEnemyCollideMonster, null, this),
                            GAME.physics.arcade.collide(this.enemyGroup, this.machineGroup, this.onEnemyCollideMonster, null, this),
                            GAME.physics.arcade.collide(this.enemyGroup, this.batGroup, this.onEnemyCollideMonster, null, this),
                            GAME.physics.arcade.collide(this.playerGroup, this.enemyGroup, this.onPlayerCollideEnemy, null, this),
                            GAME.physics.arcade.overlap(this.playerGroup, this.zombieGroup, this.onPlayerOverlapZombie, null, this),
                            GAME.physics.arcade.overlap(this.playerGroup, this.machineGroup, this.onPlayerOverlapMachine, null, this),
                            GAME.physics.arcade.overlap(this.playerGroup, this.batGroup, this.onPlayerOverlapBat, null, this),
                            GAME.physics.arcade.overlap(this.playerGroup, this.zombieWeaponGroup, this.onPlayerOverlapZombieWeapon, null, this),
                            GAME.physics.arcade.overlap(this.playerGroup, this.machineWeaponGroup, this.onPlayerOverlapMachineWeapon, null, this),
                            GAME.physics.arcade.overlap(this.playerGroup, this.batWeaponGroup, this.onPlayerOverlapBatWeapon, null, this),
                            GAME.physics.arcade.overlap(this.playerArrowGroup, this.zombieGroup, this.onPlayerArrowOverlapMonster, null, this),
                            GAME.physics.arcade.overlap(this.playerArrowGroup, this.machineGroup, this.onPlayerArrowOverlapMonster, null, this),
                            GAME.physics.arcade.overlap(this.playerArrowGroup, this.batGroup, this.onPlayerArrowOverlapMonster, null, this),
                            GAME.physics.arcade.overlap(this.enemyArrowGroup, this.zombieGroup, this.onEnemyArrowOverlapMonster, null, this),
                            GAME.physics.arcade.overlap(this.enemyArrowGroup, this.machineGroup, this.onEnemyArrowOverlapMonster, null, this),
                            GAME.physics.arcade.overlap(this.enemyArrowGroup, this.batGroup, this.onEnemyArrowOverlapMonster, null, this),
                            GAME.physics.arcade.overlap(this.playerArrowGroup, this.enemyGroup, this.onPlayerArrowOverlapEnemy, null, this),
                            GAME.physics.arcade.overlap(this.playerArrowGroup, this.playerGroup, this.onPlayerArrowOverlapPlayer, null, this),
                            GAME.physics.arcade.overlap(this.enemyArrowGroup, this.playerGroup, this.onEnemyArrowOverlapPlayer, null, this),
                            GAME.physics.arcade.overlap(this.enemyArrowGroup, this.enemyGroup, this.onEnemyArrowOverlapEnemy, null, this),
                            GAME.physics.arcade.overlap(this.machineLaserGroup, this.playerGroup, this.onMachineLaserOverlapPlayer, null, this),
                            GAME.physics.arcade.overlap(this.machineLaserGroup, this.enemyGroup, this.onMachineLaserOverlapEnemy, null, this),
                            this.fadeAllEmitters(), this.enemyGroup.forEachAlive(
                                function (e) { this.updateCreatureBubbleVisibility(e) }, this), this.player.alive) {
                            if (this.player.body.velocity.x = 0, this.player.body.velocity.y = 0, this.player.body.angularVelocity = 0,
                                this.updateCreatureBubbleVisibility(this.player), GAME.input.activePointer.leftButton.isDown) this.playerMove();
                            else {
                                var t = 0;
                                this.cursors.left.isDown ? t = -this.playerAngularVelocity : this.cursors.right.isDown
                                    && (t = this.playerAngularVelocity), 0 !== t
                                    && this.playerRotateByKeyboard(t), this.cursors.up.isDown
                                    && this.playerMoveByKeyboard()
                            }
                            GAME.input.activePointer.rightButton.isDown ? 
                                this.playerFireArrow(this.player) : this.ctrlKey.isDown /*this.spaceKey.isDown*/
                                && this.playerFireArrowByKeyboard(this.player), this.enterKey.isDown
                                && e - this.player.blr.misc.lastEnterTimestamp > this.enterKeyDelay
                                && this.playerSendMessage()
                        }
                        this.zombieGroup.forEachAlive(function (e) { this.autoMove(e) }, this),
                        this.machineGroup.forEachAlive(function (e) {
                            var t = this.getNearestHero(e.blr.info.lastVector), 
                                r = GAME.physics.arcade.angleBetween(e, t);
                            this.updateCreatureWeapon(e, e.x, e.y, r)
                        }, this),
                        this.batGroup.forEachAlive(function (e) { this.autoMove(e) }, this), this.updateMinimap()
                    }
                }, preRender: function () {
                    this.isGameReady && (this.player.alive 
                        && this.updateCreatureLabelText(this.player), //
                        this.enemyGroup.forEachAlive(function (e) { this.updateCreatureLabelText(e) }, this),
                        this.zombieGroup.forEachAlive(function (e) { this.updateCreatureLabelText(e) }, this),
                        this.machineGroup.forEachAlive(function (e) { this.updateCreatureLabelText(e) }, this),
                        this.batGroup.forEachAlive(function (e) { this.updateCreatureLabelText(e) }, this))
                }, render: function () {
                    if (this.isGameReady && IS_DEBUG) {
                        var e = (l.getCurrentUtcTimestamp() - f) / 1e3, t = y / e, r = m / e, i = "rgba(0,255, 0, 0.4)", o = "rgba(215, 125, 125, 0.4)";
                        GAME.debug.bodyInfo(this.player, 264, 18),
                        GAME.debug.spriteInfo(this.player, 264, 120),
                        GAME.debug.start(6, 276),
                        GAME.debug.line("ping " + b + " ms"),
                        GAME.debug.line("nSocketSent " + y + " (" + t.toFixed(0) + " nps)"),
                        GAME.debug.line("nSizeSent " + m + " (" + r.toFixed(0) + " bps)"),
                        GAME.debug.line("Frames per second (FPS) " + GAME.time.fps),
                        GAME.debug.line("zombieGroup living " + this.zombieGroup.countLiving()),
                        GAME.debug.line("zombieGroup dead " + this.zombieGroup.countDead()),
                        GAME.debug.line("machineGroup living " + this.machineGroup.countLiving()),
                        GAME.debug.line("machineGroup dead " + this.machineGroup.countDead()),
                        GAME.debug.line("batGroup living " + this.batGroup.countLiving()),
                        GAME.debug.line("batGroup dead " + this.batGroup.countDead()),
                        GAME.debug.stop(),
                        GAME.debug.body(this.player.blr.weapon, i), 
                        this.zombieWeaponGroup.forEachAlive( function (e) { GAME.debug.body(e, o) }, this), 
                        this.machineWeaponGroup.forEachAlive( function (e) { GAME.debug.body(e, o) }, this), 
                        this.batWeaponGroup.forEachAlive( function (e) { GAME.debug.body(e, o) }, this),
                        GAME.debug.body(this.player, i), 
                        this.zombieGroup.forEachAlive( function (e) { GAME.debug.body(e, i) }, this), 
                        this.machineGroup.forEachAlive( function (e) { GAME.debug.body(e, i) }, this), 
                        this.batGroup.forEachAlive( function (e) { GAME.debug.body(e, i) }, this)
                    }
                }
        }, t.exports = E
    },
    {
        "./../../../../common/gutil":
            2, "./../../../../common/module":
            3, "./../../../../common/util":
            4, "./config":
            12, "object-sizeof":
            9
    }]
    , 15: [function (e, t, r) {
        console.log("Blocker - The Hunter is welcome!");

        var i = e("./../../../common/config"),
            o = e("./blocker"), 
            n = location.protocol + "//" + location.hostname + ":" + i.serverPort;
            window.COMMON_MODULE = e("./../../../common/module"),
            window.UI = e("./ui"), 
            window.UTIL = e("./../../../common/util"),
            window.EVENT_NAME = i.eventName, 
            window.IS_DEBUG = i.isDebug,
            window.GAME_WORLD_WIDTH = i.game.worldWidth, 
            window.GAME_WORLD_HEIGHT = i.game.worldHeight,
            window.SOCKET = io(n), 
            window.WINDOW_WIDTH = window.innerWidth,
            window.WINDOW_HEIGHT = window.innerHeight, 
            window.CLIENT_HEARTHBEAT = 1e3,
            window.GAME = new Phaser.Game(WINDOW_WIDTH, WINDOW_HEIGHT, Phaser.CANVAS, "game-wrap"), 
            UI.init(),
            GAME.state.add("Boot", o.Boot),
            GAME.state.add("Load", o.Load),
            GAME.state.add("Play", o.Play),
            GAME.state.start("Boot")
    }, { "./../../../common/config": 1, "./../../../common/module": 3, "./../../../common/util": 4, "./blocker": 10, "./ui": 16 }]
    , 16:
        [function (e, t, r) {
            var i = e("./../../../common/util"), o = {
                logListEle:         document.getElementById("logs"),
                creatureListEle:    document.getElementById("creatures"),
                sidebarEle:         document.getElementById("sidebar"),
                messageInputEle:    document.getElementsByClassName("message-input")[0], addTextToLogList: function (e) {
                    if (IS_DEBUG) {
                        var t = document.createElement("li"),
                            r = document.createTextNode(e);
                        t.appendChild(r), this.logListEle.insertBefore(t, this.logListEle.firstChild)
                    }
                }, addCreatureIdToCreatureList: function (e, t) {
                    void 0 === t && (t = "creature");
                    var r = document.createElement("li"),
                        i = document.createTextNode(e);
                    r.appendChild(i),
                    r.setAttribute("data-creature-id", e),
                    r.classList.add(t),
                    this.creatureListEle.appendChild(r)
                }, removeCreatureIdFromCreatureList: function (e) {
                    var t = document.querySelectorAll('[data-creature-id="' + e + '"]')[0];
                    i.removeElement(t)
                }, getMessageInput: function () {
                    return this.messageInputEle.value
                }, enableMessageInput: function () {
                    this.messageInputEle.style.opacity = 1,
                    this.messageInputEle.style.pointerEvents = "visible",
                    this.messageInputEle.focus()
                }, disableMessageInput: function () {
                    this.messageInputEle.style.opacity = .4,
                    this.messageInputEle.style.pointerEvents = "none",
                    this.messageInputEle.blur(), this.messageInputEle.value = ""
                }, init: function () { this.disableMessageInput() }
            };
            t.exports = o
        }, { "./../../../common/util": 4 }]
}, {}, [15]);
