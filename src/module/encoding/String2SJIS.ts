//based https://github.com/polygonplanet/encoding.js
// MIT License

import { UTF8_TO_JIS_TABLE } from "./Table";

export function UTF8ToSJIS(data:Uint8Array|number[]):number[] {
    const results = [];
    let i = 0;
    const len = data && data.length;
    let b, b1, b2, bytes, utf8:number, jis;
    // const fallbackOption = options && options.fallback;

    for (; i < len; i++) {
        b = data[i];

        if (b >= 0x80) {
            if (b <= 0xDF) {
                // 2 bytes
                bytes = [b, data[i + 1]];
                utf8 = (b << 8) + data[++i];
            } else if (b <= 0xEF) {
                // 3 bytes
                bytes = [b, data[i + 1], data[i + 2]];
                utf8 = (b << 16) +
                    (data[++i] << 8) +
                    (data[++i] & 0xFF);
            } else {
                // 4 bytes
                bytes = [b, data[i + 1], data[i + 2], data[i + 3]];
                utf8 = (b << 24) +
                    (data[++i] << 16) +
                    (data[++i] << 8) +
                    (data[++i] & 0xFF);
            }
            //@ts-expect-error
            jis = UTF8_TO_JIS_TABLE[utf8];
            if (jis == null) {
                // if (fallbackOption) {
                //     handleFallback(results, bytes, fallbackOption);
                // } else {
                results[results.length] = 63; // '?'
                // }
            } else {
                if (jis < 0xFF) {
                    results[results.length] = jis + 0x80;
                } else {
                    if (jis > 0x10000) {
                        jis -= 0x10000;
                    }

                    b1 = jis >> 8;
                    b2 = jis & 0xFF;
                    if (b1 & 0x01) {
                        b1 >>= 1;
                        if (b1 < 0x2F) {
                            b1 += 0x71;
                        } else {
                            b1 -= 0x4F;
                        }

                        if (b2 > 0x5F) {
                            b2 += 0x20;
                        } else {
                            b2 += 0x1F;
                        }
                    } else {
                        b1 >>= 1;
                        if (b1 <= 0x2F) {
                            b1 += 0x70;
                        } else {
                            b1 -= 0x50;
                        }
                        b2 += 0x7E;
                    }
                    results[results.length] = b1 & 0xFF;
                    results[results.length] = b2 & 0xFF;
                }
            }
        } else {
            results[results.length] = data[i] & 0xFF;
        }
    }

    return results;
}

let JIS_TO_UTF8_TABLE:null|Object = null;

function init_JIS_TO_UTF8_TABLE() {
    if (JIS_TO_UTF8_TABLE === null) {
        JIS_TO_UTF8_TABLE = {};

        const keys = Object.keys(UTF8_TO_JIS_TABLE);
        let i = 0;
        const len = keys.length;
        let key, value;

        for (; i < len; i++) {
            key = keys[i];
            //@ts-expect-error
            value = UTF8_TO_JIS_TABLE[key];
            if (value > 0x5F) {
                //@ts-expect-error
                JIS_TO_UTF8_TABLE[value] = Number(key) | 0;
            }
        }
    }
}

export function SJISToUTF8(data:Uint8Array|number[]):number[] {
    init_JIS_TO_UTF8_TABLE();

    var results = [];
    var i = 0;
    var len = data && data.length;
    var b, b1, b2, u2, u3, jis, utf8;

    for (; i < len; i++) {
        b = data[i];
        if (b >= 0xA1 && b <= 0xDF) {
            b2 = b - 0x40;
            u2 = 0xBC | ((b2 >> 6) & 0x03);
            u3 = 0x80 | (b2 & 0x3F);

            results[results.length] = 0xEF;
            results[results.length] = u2 & 0xFF;
            results[results.length] = u3 & 0xFF;
        } else if (b >= 0x80) {
            b1 = b << 1;
            b2 = data[++i];

            if (b2 < 0x9F) {
                if (b1 < 0x13F) {
                    b1 -= 0xE1;
                } else {
                    b1 -= 0x61;
                }

                if (b2 > 0x7E) {
                    b2 -= 0x20;
                } else {
                    b2 -= 0x1F;
                }
            } else {
                if (b1 < 0x13F) {
                    b1 -= 0xE0;
                } else {
                    b1 -= 0x60;
                }
                b2 -= 0x7E;
            }

            b1 &= 0xFF;
            jis = (b1 << 8) + b2;
            //@ts-expect-error
            utf8 = JIS_TO_UTF8_TABLE[jis];
            if (utf8 === void 0) {
                results[results.length] = 63; // '?'
            } else {
                if (utf8 < 0xFFFF) {
                    results[results.length] = utf8 >> 8 & 0xFF;
                    results[results.length] = utf8 & 0xFF;
                } else {
                    results[results.length] = utf8 >> 16 & 0xFF;
                    results[results.length] = utf8 >> 8 & 0xFF;
                    results[results.length] = utf8 & 0xFF;
                }
            }
        } else {
            results[results.length] = data[i] & 0xFF;
        }
    }

    return results;
}