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