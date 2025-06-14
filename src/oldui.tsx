import { Hono } from "hono";
import { jsxRenderer } from "hono/jsx-renderer";
import { getSubject, getSubjecttxt, getThread, getdat } from "./module/storage";
import { kakikoAPI } from "./module/kakiko-api";
import { getConnInfo } from './module/unHono'
import { env } from "hono/adapter";
import {convert} from "encoding-japanese"

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
  // const encoded = UTF8ToSJIS(encoder.encode(moto));
  const encoded = convert(moto, { to: "SJIS", type: "string" });
  c.res = new Response(encoded, c.res)
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
  const  body = await c.req.parseBody();
  // const body = SJISToUTF8(new Uint8Array(rawBody));
  const BBSKEY = body["bbs"] as string
  const ThID = body["key"] as string
  // const time = body["time"] as string
  const submit = body["submit"] as string//書き込む
  const ThTitle = body["subject"] as string;
  const FROMraw = decodeURI(body["FROM"] as string)//名前
  const mailraw = decodeURI(body["mail"] as string)//メール
  const MESSAGEraw = decodeURI(body["MESSAGE"] as string)//本文
  if (!MESSAGEraw||!submit||!BBSKEY){return c.render("書き込み内容がありません", { title: "ＥＲＲＯＲ" })}
  const psw = env(c).psw as string
  const IP = c.req.header('CF-Connecting-IP')||(await getConnInfo(c))?.remote.address||'0.0.0.0'
  const FROM = convert(FROMraw, { to: "SJIS", type: "string" })//名前
  const mail = convert(mailraw, { to: "SJIS", type: "string" })//メール
  const MESSAGE = convert(MESSAGEraw, { to: "SJIS", type: "string" })//本文
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
  const encoded = convert(subject, { to: "SJIS", type: "string" });
  return c.body(encoded, { headers: { "Content-Type": "text/plain; charset=Shift_JIS" }})
});

app.get("/:BBSKEY/dat/:ThID{\\b\\d+\\.dat\\b}", async (c) => {
  const BBSKEY = c.req.param("BBSKEY");
  const ThID = c.req.param("ThID").replace(/\.dat$/, "");
  const thread = await getdat(BBSKEY, ThID);
  if (!thread) {
    return c.text("スレッドがありません", 404);
  }
  // Shift_JISに変換して返す
  const encoded = convert(thread, { to: "SJIS", type: "string" });
  return c.body(encoded, { headers: { "Content-Type": "text/plain; charset=Shift_JIS" }})
});

export default app;