import { createTripByKey } from "./data-util";
import { CHAR_MAP, HTML_ESCAPE_MAP, SECURITY_PATTERNS } from "./constants";

function formatUnixTime(unixTime: number): string {
  // UNIXタイムをミリ秒に変換
  const date = new Date(unixTime * 1000);

  // 年月日と曜日を取得
  const ymd = date.toLocaleDateString('ja-JP', { year: 'numeric', month: '2-digit', day: '2-digit', weekday: 'short' });

  // 時分秒を取得
  const hms = date.toLocaleTimeString('ja-JP', { hour: '2-digit', minute: '2-digit', second: '2-digit' });

  // ミリ秒を取得
  const ms = ('00' + date.getMilliseconds()).slice(-2);

  // フォーマットを組み立てる
  return `${ymd} ${hms}.${ms}`;
}
/**
 * 様々な情報を加工する
 * @param mes メッセージ
 * @param name 名前
 * @param mail メアド(コマンド)
 * @param time 時間
 * @returns {mes:string,name:string,mail:string,time:number}
 */
export async function KAS(mes:string,name:string,mail:string,time:number,pw?:string|null):Promise<{mes:string,name:string,mail:string,time:string}>{
    const kkk = MES(mes)
    const lll = await NES(name,mail,pw)
    const ttt = formatUnixTime(time)
    return {
      mes:kkk,
      name:lll.name,
      mail:lll.mail,
      time:ttt
    }
}

/**
 * HTML escape function to prevent XSS attacks
 * @param input Input string that may contain malicious HTML
 * @returns Escaped HTML string safe for rendering
 * @security Prevents XSS by escaping all HTML special characters
 */
function MES(input: string | null): string {
  if (!input) return '';

  // HTML特殊文字を変換
  const htmlEscaped = input.replace(SECURITY_PATTERNS.HTML_ESCAPE, function(match) {
      return HTML_ESCAPE_MAP[match as keyof typeof HTML_ESCAPE_MAP] || '';
  });

  // 改行をbrタグに変換
  const newlineEscaped = htmlEscaped.replace(SECURITY_PATTERNS.NEWLINE, '<br/>');
  const numLinkConverted = newlineEscaped.replace(SECURITY_PATTERNS.NUM_LINK, '<a href="#$1">&gt;&gt;$1</a>');
  return numLinkConverted;
}

/**
 * Secure constant-time string comparison to prevent timing attacks
 * @param a First string to compare
 * @param b Second string to compare
 * @returns true if strings are equal, false otherwise
 * @security Uses constant-time comparison to prevent timing-based side-channel attacks
 */
function secureCompare(a: string, b: string): boolean {
  if (a.length !== b.length) return false;
  
  let result = 0;
  for (let i = 0; i < a.length; i++) {
    result |= a.charCodeAt(i) ^ b.charCodeAt(i);
  }
  return result === 0;
}

/**
 * Name processing function with trip generation support
 * @param input User-provided name input 
 * @param mail User email/command
 * @param pw Admin password for authentication
 * @returns Processed name and mail
 * @security Uses secure password comparison and validates trip codes
 */
async function NES(input: string, mail: string,pw?:string|null): Promise<{ name: string, mail: string }> {
    // Use secure comparison for password check
    if (pw && mail && secureCompare(mail, pw)) {
        return { "name": "管理者★★", "mail": "kanrisurumono" }
    }

    if (!input) {
        return { "name": "名無しのボンベイ", "mail": mail };
    }
    const match = input.match(SECURITY_PATTERNS.TRIP_HASH); // #の後ろの数字を取得する正規表現
    let length = 0;

    if (match && match[1]) {
        length = match[1].length; // 取得した数字の長さ（桁数）を計算
    }

    if (!input) return { name: '', mail: '' };
    const convertedInput = input.replace(SECURITY_PATTERNS.SPECIAL_CHARS, function (m) { return CHAR_MAP[m as keyof typeof CHAR_MAP]; });
    let trip = '';
    if (length > 0) {
        trip = `◆`+await createTripByKey(match![1]);
    }
    return { "name": `${convertedInput.replace(/#.*/, '')}${trip}`, "mail": mail }
}