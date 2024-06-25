// idは9文字
export async function id(ip: string,itaID: string): Promise<string> {
    const date = new Date();
    const year = date.getFullYear();
    const month = String(date.getMonth() + 1).padStart(2, '0');
    const day = String(date.getDate()).padStart(2, '0');
    const formattedDate = `${year}${month}${day}`;
    const hash = await SHA512(ip + itaID + formattedDate);
    return hash.slice(0, 9);
}

/////////////////
// サブ関数
/////////////////
//SHA512関数
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
  