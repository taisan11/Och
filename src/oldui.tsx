import { Hono } from "hono";
import { jsxRenderer } from "hono/jsx-renderer";
import { getSubject, getSubjecttxt, getThread, getdat } from "./module/storage";
import { kakikoAPI } from "./module/kakiko-api";
import { getConnInfo } from './module/unHono'
import { env } from "hono/adapter";
import {convert} from "encoding-japanese"

function decodeUrlEncodedToBytes(input: string): Uint8Array {
  const bytes: number[] = [];

  for (let i = 0; i < input.length; ) {
    if (input[i] === '%') {
      const hex = input.slice(i + 1, i + 3);
      bytes.push(parseInt(hex, 16));
      i += 3;
    } else {
      // 非エンコード文字（安全文字）にも対応（例：a, 1, _）
      bytes.push(input.charCodeAt(i));
      i += 1;
    }
  }

  return new Uint8Array(bytes);
}

const app = new Hono()

// app.use(async (c, next) => {
//   if (c.req.header("User-Agent")!=="Monazilla/1.00") {
//     return c.text("専ブラ以外は帰れd=====(￣▽￣*)b")
//   }
//   await next();
// })

app.use("/test/bbs.cgi",async (c,next)=>{
  await next()
  const moto = await c.res.text()
  // const encoded = encode(moto,"shift_jis")
  // const encoded = UTF8ToSJIS(encoder.encode(moto));
  const encoded = convert(moto, { to: "SJIS", type: "array" });
  c.res = new Response(new Uint8Array(encoded), {headers: c.res.headers})
  return
})

app.get(
  "*",
  jsxRenderer(({ children }) => {
    return (
      <html lang="ja">
        <head>
          <meta charset="shift_jis" />
          <meta name="viewport" content="width=device-width, initial-scale=1.0" />
        </head>
        <body>{children}</body>
      </html>
    );
  }),
);

app.post("/test/bbs.cgi", async (c) => {
  const rawBody = await c.req.arrayBuffer();
  // Shift_JISデコードして文字列にする
  const decodedBody = convert(new Uint8Array(rawBody), { from: "SJIS", to: "UNICODE", type: "string" });
  
  // &で区切り、=で分割して連想配列にする
  const paramsMap = new Map();
  for (const pair of decodedBody.split("&")) {
    const [key, value] = pair.split("=");
    if (key && value !== undefined) {
      paramsMap.set(key, value);
    }
  }

  // パラメータを取得
  const BBSKEY = paramsMap.get("bbs") as string;
  const ThID = paramsMap.get("key") as string;
  const submit = paramsMap.get("submit") as string; // 書き込む
  const ThTitle = paramsMap.get("subject") as string;
  const FROM = convert(decodeUrlEncodedToBytes(paramsMap.get("FROM") as string),{to:"UNICODE",type:"string"}) // 名前
  const mail = convert(decodeUrlEncodedToBytes(paramsMap.get("mail") as string),{to:"UNICODE",type:"string"}) // メール
  const MESSAGE = convert(decodeUrlEncodedToBytes(paramsMap.get("MESSAGE") as string),{to:"UNICODE",type:"string"}) // 本文
  
  if (!MESSAGE || !submit || !BBSKEY) {
    return c.render(<><title>ＥＲＲＯＲ</title>書き込み内容がありません</>);
  }
  
  const psw = env(c).psw as string;
  const IP = c.req.header('CF-Connecting-IP') || (await getConnInfo(c))?.remote.address || '0.0.0.0';
  //スレ建て
  if (ThTitle) {
    const kextuka = await kakikoAPI({ThTitle,name:FROM,mail,MESSAGE,BBSKEY,IP,psw},"newth")
    if (!kextuka?.sc) {
      return c.render(<><title>ＥＲＲＯＲ</title>えらだよ</>)
    } else {
      return c.text(`
<!DOCTYPE html>
<html lang="ja">
  <head>
    <title>書きこみました。</title>
    <meta charset="Shift_JIS">
  </head>
  <body>
    書きこみが終りました。
  </body>
</html>`, { status: 200, headers: { "Content-Type": "text/html; charset=Shift_JIS" }})
    }
  } else if (ThID) {
    //書き込み
    const kextuka = await kakikoAPI({name:FROM,mail,MESSAGE,BBSKEY,IP,psw,ThID},"kakiko")
    if (!kextuka?.sc) {
      return c.render(<><title>ＥＲＲＯＲ</title>えらだよ</>)
    } else {
      return c.text(`
<!DOCTYPE html>
<html lang="ja">
  <head>
    <title>書きこみました。</title>
    <meta charset="Shift_JIS">
  </head>
  <body>
    書きこみが終りました。
  </body>
</html>`, { status: 200, headers: { "Content-Type": "text/html; charset=Shift_JIS" }})
    }
  }
})

app.get("/:BBSKEY/subject.txt", async (c) => {
  const BBSKEY = c.req.param("BBSKEY");
  const subject = await getSubjecttxt(BBSKEY);
  if (!subject) {
    return c.text("スレッドがありません", 404);
  }
  // Shift_JISに変換して返す
  const encoded = convert(subject, { to: "SJIS", type: "array" });
  return c.body(new Uint8Array(encoded), { headers: { "Content-Type": "text/plain; charset=Shift_JIS" }})
});

app.get("/:BBSKEY/dat/:ThID{\\b\\d+\\.dat\\b}", async (c) => {
  const BBSKEY = c.req.param("BBSKEY");
  const ThID = c.req.param("ThID").replace(/\.dat$/, "");
  const thread = await getdat(BBSKEY, ThID);
  if (!thread) {
    return c.text("スレッドがありません", 404);
  }
  // Shift_JISに変換して返す
  const encoded = convert(thread, { to: "SJIS", type: "array" });
  return c.body(new Uint8Array(encoded), { headers: { "Content-Type": "text/plain; charset=Shift_JIS" }})
});

export default app;