import { createTripByKey } from "./trip";

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
export async function KAS(mes:string,name:string,mail:string,time:number){
    const kkk = MES(mes)
    const lll = await NES(name,mail)
    const ttt = formatUnixTime(time)
    return {
      mes:kkk,
      name:lll.name,
      mail:lll.mail,
      time:ttt
    }
}

function MES(input: string | null): string {
  if (!input) return '';

  // HTML特殊文字を変換
  const htmlEscaped = input.replace(/[&<>"']/g, function(match) {
      return {
          '&': '&amp;',
          '<': '&lt;',
          '>': '&gt;',
          '"': '&quot;',
          "'": '&#39;'
      }[match] || '';
  });

  // 改行をbrタグに変換
  const newlineEscaped = htmlEscaped.replace(/\r?\n/g, '<br/>');
  const numLinkConverted = newlineEscaped.replace(/\b(\d+)\b/g, '<a href="#$1">&gt;&gt;$1</a>');
  return numLinkConverted;
}

async function NES(input: string, mail: string): Promise<{ name: string, mail: string }> {
    if (!input) {
        return { "name": "名無しのボンベイ", "mail": mail };
    }
    const match = input.match(/#(\d+)/); // #の後ろの数字を取得する正規表現
    let length = 0;

    if (match && match[1]) {
        length = match[1].length; // 取得した数字の長さ（桁数）を計算
    }

    if (mail == "koskarure0192") {
        return { "name": "管理者★★", "mail": "kanrisurumono" }
    }

    const map: { [key: string]: string } = {
        '◆': '◇',
        '★': '☆',
        '\n': ''
    };
    if (input == null) { return { name: '', mail: '' }; }
    const convertedInput = input.replace(/[◆★\n]/g, function (m) { return map[m]; });
    let trip = '';
    if (length > 0) {
        trip = `◆`+await createTripByKey(match![1]);
        // trip = `◆` + `現在一時的にトリップは使用できません`
    }
    return { "name": `${convertedInput.replace(/#.*/, '')}${trip}`, "mail": mail }
}