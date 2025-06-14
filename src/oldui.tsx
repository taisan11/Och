import { Hono } from "hono";
import { jsxRenderer } from "hono/jsx-renderer";
import { getSubject, getSubjecttxt, getThread, getdat } from "./module/storage";
import { kakikoAPI } from "./module/kakiko-api";
import { getConnInfo } from './module/unHono'
import { env } from "hono/adapter";
import {UTF8ToSJIS,SJISToUTF8} from "./module/encoding/String2SJIS"

declare module "hono" {
  interface ContextRenderer {
    (content: string | Promise<string>, props: { title?: string }): Response;
  }
}

const app = new Hono()

const encoder = new TextEncoder();

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
  const encoded = UTF8ToSJIS(encoder.encode(moto));
  c.res = new Response(new Uint8Array(encoded), c.res)
})

app.get(
  "*",
  jsxRenderer(({ children, title }) => {
    return (
      <html lang="ja">
        <head>
          <meta charset="shift_jis" />
          <meta
            name="viewport"
            content="width=device-width, initial-scale=1.0"
          />
          <title>{title}</title>
        </head>
        <body>{children}</body>
      </html>
    );
  }),
);

app.post("/test/bbs.cgi", async (c) => {
  const rawBody = await c.req.arrayBuffer();
  const body = SJISToUTF8(new Uint8Array(rawBody));
  const params = new URLSearchParams(String.fromCharCode(...body));
  const BBSKEY = params.get("bbs")
  const ThID = params.get("key")
  // const time = params.get("time")
  const submit = params.get("submit")//書き込む
  const ThTitle = params.get("subject");
  const FROMraw = decodeURI(params.get("FROM")!)//名前
  const mailraw = decodeURI(params.get("mail")!)//メール
  const MESSAGEraw = decodeURI(params.get("MESSAGE")!)//本文
  console.log("MESSAGEraw",MESSAGEraw)
  if (!MESSAGEraw||!submit||!BBSKEY){return c.render("書き込み内容がありません", { title: "ＥＲＲＯＲ" })}
  const psw = env(c).psw as string
  const IP = c.req.header('CF-Connecting-IP')||(await getConnInfo(c))?.remote.address||'0.0.0.0'
  const FROM = String.fromCharCode(...SJISToUTF8(new TextEncoder().encode(FROMraw)))
  const mail = String.fromCharCode(...SJISToUTF8(new TextEncoder().encode(mailraw)))
  const MESSAGE = String.fromCharCode(...SJISToUTF8(new TextEncoder().encode(MESSAGEraw)))
  //スレ建て
  if (ThTitle) {
    const kextuka = await kakikoAPI({ThTitle,name:FROM,mail,MESSAGE,BBSKEY,IP,psw},"newth")
    if (!kextuka?.sc) {
      return c.render(<>えらだよ</>, { title: "ＥＲＲＯＲ" })
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
      return c.render(<>えらだよ</>, { title: "ＥＲＲＯＲ" })
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
  const encoded = UTF8ToSJIS(new TextEncoder().encode(subject));
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
  const encoded = UTF8ToSJIS(new TextEncoder().encode(thread));
  return c.body(new Uint8Array(encoded), { headers: { "Content-Type": "text/plain; charset=Shift_JIS" }})
});

export default app;