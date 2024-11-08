/**
 * @module data-util
 * @description 色々なデータの処理
 */
//## import
import {encode} from "iconv-cp932";
import crypt from 'unix-crypt-td-js'
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
  const rawKeyPettern = /^#[0-9A-Fa-f]{16}[.\/0-9A-Za-z]{0,2}$/;

  /**
   * @param text 文章
   * @returns 入力不可文字を変換した文章
   */
  const maskSpecialSymbols = (text: string) => text.replace(/★/g, '☆').replace(/◆/g, '◇');

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
      // 1 文字目から 2 文字を取得する
      .substr(1, 2)
      // . から z までの文字以外を . に置換する
      .replace(/[^\.-z]/g, '.')
      // 配列にする
      .split('')
      // salt として使えない記号をアルファベットに置換する
      .map((string) => {
        if (string === ':') return 'A';
        if (string === ';') return 'B';
        if (string === '<') return 'C';
        if (string === '=') return 'D';
        if (string === '>') return 'E';
        if (string === '?') return 'F';
        if (string === '@') return 'G';
        if (string === '[') return 'a';
        if (string === '\\') return 'b';
        if (string === ']') return 'c';
        if (string === '^') return 'd';
        if (string === '_') return 'e';
        if (string === '`') return 'f';

        return string;
      })
      // 文字列にする
      .join('');

    return (crypt(encodedKeyString, salt) as string).substr(-10, 10);
  };

  /**
   * @param key 一つ目の#を覗いた鍵となる部分。
   * @returns 生キートリップ
   */
  const createRawKeyTrip = (key: string) => {
    const saltSuffixString = '..';

    const rawKey = key
      // 2 文字目以降の全ての文字列を取得
      .substr(1)
      // 2 文字ごとに配列に分割する
      .match(/.{2}/g)!
      // ASCII コードを ASCII 文字に変換する
      .map((hexadecimalASCIICode) => {
        const demicalASCIICode = parseInt(hexadecimalASCIICode, 16);

        return String.fromCharCode(demicalASCIICode);
      })
      // 文字列にする
      .join('');

    const salt = `${key}${saltSuffixString}`.substr(17, 2);

    return (crypt(rawKey, salt) as string).substr(-10, 10);
  };

  // 10 桁トリップ
  if (encodedKeyString.length < 12) return create10DigitsTrip(key);

  // 生キートリップ
  if (encodedKeyString.startsWith('#') || encodedKeyString.startsWith('$')) {
    // 拡張用のため ??? を返す
    if (!rawKeyPettern.test(encodedKeyString)) return '???';
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
async function SHA512(message:string,salt?:string,Pepper?:string):Promise<string> {
  message = message+salt+Pepper;
  const msgUint8 = new TextEncoder().encode(message); // (utf-8 の) Uint8Array にエンコードする
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
      const anonRemohoPatterns = [
          /^.*\.(vpngate\.v4\.open\.ad\.jp|opengw\.net)$/,
          /(vpn|tor|proxy|onion)/,
          /^.*\.(ablenetvps\.ne\.jp|amazonaws\.com|arena\.ne\.jp|akamaitechnologies\.com|cdn77\.com|cnode\.io|datapacket\.com|digita-vm\.com|googleusercontent\.com|hmk-temp\.com|kagoya\.net|linodeusercontent\.com|sakura\.ne\.jp|vultrusercontent\.com|xtom\.com)$/,
          /^.*\.(tsc-soft\.com|53ja\.net)$/
      ];

      for (const pattern of anonRemohoPatterns) {
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
    const fwifiRemoho = [
      '.*\\.m-zone\\.jp',
      '\\d+\\.wi-fi\\.kddi\\.com',
      '.*\\.wi-fi\\.wi2\\.ne\\.jp',
      '.*\\.ec-userreverse\\.dion\\.ne\\.jp',
      '210\\.227\\.19\\.[67]\\d',
      '222-229-49-202.saitama.fdn.vectant.ne.jp'
    ];
    const fwifiNicknames = ['mz', 'auw', 'wi2', 'dion', 'lson', 'vectant'];

    for (let i = 0; i < fwifiRemoho.length; i++) {
      const name = fwifiRemoho[i];
      const regex = new RegExp(`^${name}$`);
      if (regex.test(remoho)) {
        isFwifi = fwifiNicknames[i];
        break;
      }
    }
  }

  return isFwifi;
}

async function ipHost(ip:string) {
  const reip = ip.split('.').reverse().join('.') + '.in-addr.arpa';
  const response = await fetch(`https://cloudflare-dns.com/dns-query?name=${reip}&type=PTR`, {
    headers: {
      'Accept': 'application/dns-json'
    }
  });
  const data = await response.json();
  return data.Authority[0].data;
}