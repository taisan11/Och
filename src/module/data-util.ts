/**
 * @module data-util
 * @description 色々なデータの処理
 */
//## import
import {encode} from "iconv-cp932";
import {crypt} from '@taisan11/unix-crypto-td-esm'
import {HTTPException} from "hono/http-exception"
import { SECURITY_PATTERNS, FWIFI_NICKNAMES, SALT_CHAR_MAP } from "./constants";
//## 内部関数
async function hashByteArray(byteArray:Uint8Array) {
  // SHA-1でハッシュを生成
  const hashBuffer = await crypto.subtle.digest('SHA-1', byteArray);

  // ArrayBufferをUint8Arrayに変換
  const hashArray = new Uint8Array(hashBuffer);

  // Base64エンコードに変換
  const base64String = btoa(String.fromCharCode(...hashArray)).replace(/\+/g, '.').substr(0, 12);

  return base64String;
}

//## 出力する関数
/**
 * @function createTripByKey
 * @description トリップを生成する
 * @param key 一つ目の#を覗いた鍵となる部分。
 * @returns trip
 */
export const createTripByKey = (key: string) => {
  const encodedKeyString = encode(key).toString();
  
  /**
   * @param key 一つ目の#を覗いた鍵となる部分。
   * @returns 12桁のトリップ
   */
  const create12DigitsTrip = (key: string) => {
    const arrayBuffer = encode(key);
    const byteArray = new Uint8Array(arrayBuffer);
    // 余裕があったらawaitを使用したweb標準の物を使いたい
    return hashByteArray(byteArray)
  };

  /**
   * @param key 一つ目の#を覗いた鍵となる部分。
   * @returns 10桁のトリップ
   */
  const create10DigitsTrip = (key: string) => {
    const saltSuffixString = 'H.';
    const encodedKeyString = encode(key).toString();

    const salt = `${encodedKeyString}${saltSuffixString}`
      // 1 文字目から 2 文字を取得する (replace deprecated substr)
      .substring(1, 3)
      // . から z までの文字以外を . に置換する
      .replace(SECURITY_PATTERNS.SALT_INVALID, '.')
      // 配列にする
      .split('')
      // salt として使えない記号をアルファベットに置換する
      .map((string) => {
        return SALT_CHAR_MAP[string as keyof typeof SALT_CHAR_MAP] || string;
      })
      // 文字列にする
      .join('');

    return (crypt(encodedKeyString, salt) as string).substring(crypt(encodedKeyString, salt).length - 10);
  };

  /**
   * @param key 一つ目の#を覗いた鍵となる部分。
   * @returns 生キートリップ
   */
  const createRawKeyTrip = (key: string) => {
    const saltSuffixString = '..';

    const rawKey = key
      // 2 文字目以降の全ての文字列を取得 (replace deprecated substr)
      .substring(1)
      // 2 文字ごとに配列に分割する
      .match(/.{2}/g)!
      // ASCII コードを ASCII 文字に変換する
      .map((hexadecimalASCIICode) => {
        const demicalASCIICode = parseInt(hexadecimalASCIICode, 16);

        return String.fromCharCode(demicalASCIICode);
      })
      // 文字列にする
      .join('');

    const salt = `${key}${saltSuffixString}`.substring(17, 19);

    return (crypt(rawKey, salt) as string).substring(crypt(rawKey, salt).length - 10);
  };

  // 10 桁トリップ
  if (encodedKeyString.length < 12) return create10DigitsTrip(key);

  // 生キートリップ
  if (encodedKeyString.startsWith('#') || encodedKeyString.startsWith('$')) {
    // 拡張用のため ??? を返す
    if (!SECURITY_PATTERNS.RAW_KEY.test(encodedKeyString)) return '???';
    return createRawKeyTrip(key);
  }

  // 12 桁トリップ
  return create12DigitsTrip(key);
};
/**
 * @description 一時的なIDを生成します。このIDは一日ごとに切り替わります。
 * @param ip IPアドレス
 * @param itaID 板ID
 * @returns 一時的なID
 */
export async function id(ip: string,itaID: string): Promise<string> {
  const date = new Date();
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, '0');
  const day = String(date.getDate()).padStart(2, '0');
  const formattedDate = `${year}${month}${day}`;
  // const host = await ipHost(ip);
  const hash = await SHA512(ip + itaID + formattedDate);
  return hash.slice(0, 9);
}
//## サブ関数
async function SHA512(message: string, salt?: string, Pepper?: string): Promise<string> {
  const fullMessage = message + (salt || '') + (Pepper || '');
  const msgUint8 = new TextEncoder().encode(fullMessage); // (utf-8 の) Uint8Array にエンコードする
  const hashBuffer = await crypto.subtle.digest("SHA-512", msgUint8); // メッセージをハッシュする
  const hashArray = Array.from(new Uint8Array(hashBuffer)); // バッファーをバイト列に変換する
  const hashHex = hashArray
    .map((b) => b.toString(16).padStart(2, "0"))
    .join(""); // バイト列を 16 進文字列に変換する
  return hashHex;
}
// 匿名IP判定
function isAnonymous(isFwifi: boolean, country: string, remoho: string, ipAddr: string): boolean {
  let isAnon = false;

  if (!isFwifi && country === 'JP' && remoho !== ipAddr) {
      for (const pattern of SECURITY_PATTERNS.ANON_REMOHO) {
          if (pattern.test(remoho)) {
              isAnon = true;
              break;
          }
      }
  }

  return isAnon;
}
//公衆Wifi判定
function isPublicWifi(country: string, ipAddr: string, remoho: string): string {
  let isFwifi = '';

  if (country === 'JP' && remoho !== ipAddr) {
    for (let i = 0; i < SECURITY_PATTERNS.FWIFI_REMOHO.length; i++) {
      const pattern = SECURITY_PATTERNS.FWIFI_REMOHO[i];
      if (pattern.test(remoho)) {
        isFwifi = FWIFI_NICKNAMES[i];
        break;
      }
    }
  }

  return isFwifi;
}

async function ipHost(ip: string): Promise<string> {
  try {
    const reip = ip.split('.').reverse().join('.') + '.in-addr.arpa';
    const response = await fetch(`https://cloudflare-dns.com/dns-query?name=${reip}&type=PTR`, {
      headers: {
        'Accept': 'application/dns-json'
      },
      signal: AbortSignal.timeout(5000) // 5 second timeout
    });
    
    if (!response.ok) {
      throw new Error(`HTTP ${response.status}: ${response.statusText}`);
    }
    
    const data = await response.json();
    return data.Authority?.[0]?.data || ip; // fallback to IP if no hostname found
  } catch (error) {
    console.warn(`Failed to resolve hostname for IP ${ip}:`, error);
    return ip; // fallback to IP address
  }
}