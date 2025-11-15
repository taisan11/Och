import { createTripByKey } from "./data-util";

const hoihoi = new Intl.DateTimeFormat('ja-JP', { year: 'numeric', month: '2-digit', day: '2-digit', weekday: 'short',timeZone: 'Asia/Tokyo'});
const hoihoihoi = new Intl.DateTimeFormat('ja-JP', { hour: '2-digit', minute: '2-digit', second: '2-digit',timeZone: 'Asia/Tokyo'});

function formatTime(date: Date): string {
  // 年月日と曜日を取得
  const ymd = hoihoi.format(date);

  // 時分秒を取得
  const hms = hoihoihoi.format(date);

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
 * @returns {mes:string,name:string,mail:string,time:Date}
 */
export async function KAS(mes:string,name:string,mail:string,time:Date,pw?:string|null):Promise<{mes:string,name:string,mail:string,time:string}>{
    const kkk = MES(mes)
    const lll = await NES(name,mail,pw)
    const ttt = formatTime(time)
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
  const numLinkConverted = newlineEscaped.replace(/&gt;&gt;(\d+)/g, '<a href="#$1">&gt;&gt;$1</a>');
  return numLinkConverted;
}

async function NES(input: string, mail: string,pw?:string|null): Promise<{ name: string, mail: string }> {
    if (mail == pw) {
        return { "name": "管理者★★", "mail": "kanrisurumono" }
    }

    if (!input) {
        return { "name": "名無しのボンベイ", "mail": mail };
    }
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
    if (!input) return { name: '', mail: '' };
    const convertedInput = input.replace(/[◆★\n]/g, function (m) { return map[m]; });
    let trip = '';
    if (length > 0) {
        trip = `◆`+await createTripByKey(match![1]);
        // trip = `◆` + `現在一時的にトリップは使用できません`
    }
    return { "name": `${convertedInput.replace(/#.*/, '')}${trip}`, "mail": mail }
}