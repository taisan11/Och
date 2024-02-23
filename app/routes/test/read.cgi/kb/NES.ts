import * as IconvCP932 from "iconv-cp932";

export async function NES(input: string) {
    const match = input.match(/#(\d+)/); // #の後ろの数字を取得する正規表現
    let length = 0;

    if (match && match[1]) {
    length = match[1].length; // 取得した数字の長さ（桁数）を計算
    }

    const map: { [key: string]: string } = {
    '◆': '◇',
    '★': '☆',
    '\n': ''
    };
    if (input == null){return '';}
    const convertedInput = input.replace(/[◆★\n]/g, function(m) { return map[m]; });
    let trip = '';
    if (length > 0) {
    trip = `◆`+await convertTrip(match, length, true);}
    return `${convertedInput.replace(/#.*/, '')}${trip}`
}


/**
 * トリップ作成関数 - convertTrip
 * @param key トリップキー(リファレンス)
 * @param column 桁数
 * @param shatrip 12桁トリップON/OFF
 * @returns 変換後文字列
 */
async function convertTrip(key: string, column: number, shatrip: boolean): Promise<string> {
    // cryptのときの桁取得
    column *= -1;
  
    let trip = '';
  
    key = key || '';
  
    // // UTF-8エンコーディングを使用
    const encoder = new TextEncoder();
    // const decoder = new TextDecoder('utf-8');
    const keyBytes = encoder.encode(key);
    // key = decoder.decode(keyBytes);
    key = IconvCP932.decode(keyBytes);
  
    if (key.length >= 12) {
      // 先頭1文字の取得
      const mark = key.charAt(0);
  
      if (mark === '#' || mark === '$') {
        // 生キー
        const match = key.match(/^#([0-9a-zA-Z]{16})([./0-9A-Za-z]{0,2})$/);
  
        if (match) {
          const key2 = Buffer.from(match[1], 'hex');
          const salt = (match[2] + '..').substring(0, 2);
  
          // 0x80問題再現
          key2.fill(0x80, key2.length - 1);
  
          const keyBuffer = await crypto.subtle.importKey('raw', key2, { name: 'HMAC', hash: 'SHA-256' }, false, ['sign']);
          const signature = await crypto.subtle.sign('HMAC', keyBuffer, encoder.encode(salt));
  
          const signatureArray = Array.from(new Uint8Array(signature));
          trip = btoa(String.fromCharCode(...signatureArray)).substring(0, 12);
          trip = trip.replace(/\+/g, '.');
        } else {
          // 将来の拡張用
          trip = '★とりっぷえらー';
        }
      } else if (shatrip) {
        // SHA1(新仕様)トリップ
        const keyBuffer = await crypto.subtle.digest('SHA-1', encoder.encode(key));
        const signatureArray = Array.from(new Uint8Array(keyBuffer));
        trip = btoa(String.fromCharCode(...signatureArray)).substring(0, 12);
        trip = trip.replace(/\+/g, '.');
      }
    }
  
    // 従来のトリップ生成方式
    if (!trip) {
      let salt = key.substring(1, 3) || '';
      salt += 'H.';
      salt = salt.replace(/[^\.-z]/g, '.');
      salt = salt.replace(/:;<=>?@[\\]^_`/g, 'ABCDEFGabcdef');
  
      // 0x80問題再現
      key = key.replace(/\x80[\x00-\xff]*$/, '');
  
      const keyBuffer = await crypto.subtle.importKey('raw', encoder.encode(key), { name: 'HMAC', hash: 'SHA-256' }, false, ['sign']);
      const signature = await crypto.subtle.sign('HMAC', keyBuffer, encoder.encode(salt));
  
      const signatureArray = Array.from(new Uint8Array(signature));
      trip = btoa(String.fromCharCode(...signatureArray)).substring(0, 12);
    }
  
    return trip;
  }  