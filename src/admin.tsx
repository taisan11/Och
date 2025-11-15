import { Hono } from "hono";
import {env} from "hono/adapter"
import { jsxRenderer } from "hono/jsx-renderer";
import { addIta, init } from "./module/storage";
import {createMiddleware} from "hono/factory"
import { setCookie,getCookie } from "hono/cookie";
import { SHA256 } from "./module/data-util";

const app = new Hono()

app.get(
  "*",
  jsxRenderer(({ children }) => {
    return (
      <html lang="ja">
        <head>
          <meta charset="utf-8" />
          <meta name="viewport" content="width=device-width, initial-scale=1.0"/>
        </head>
        <body>{children}</body>
      </html>
    );
  }),
);

const kaniAuth = createMiddleware(async(c,next) => {
  const {psw} = env(c);
  const token = getCookie(c, "adminTooken");
  if (!token || token !== await SHA256(psw!+"salt0101way!!!!")) {
    return c.redirect("/admin");
  }
  await next();
})

app.get("/",(c)=>{
  return c.render(<>
    <h1>管理画面ログイン</h1>
    <form action="/admin" method="post">
      <label htmlFor="password">管理者パスワード:</label>
      <input type="password" id="password" name="password" required />
      <button type="submit">ログイン</button>
    </form>
  </>)
})

app.post("/", async (c) => {
  const body = await c.req.parseBody()
  if (body.password === env(c).psw) {
    setCookie(c, "adminTooken", await SHA256(env(c).psw!+"salt0101way!!!!"), { httpOnly: true, secure: true, sameSite: "strict" })
    return c.redirect("/admin/dashboard")
  }
  return c.render(<>
    <h1>管理者ログイン失敗</h1>
    <p>パスワードが違います。</p>
  </>)
})

// app.use("/*", kaniAuth)

app.get("/dashboard", kaniAuth,(c) => {
  return c.render(<>
    <h1>管理者ダッシュボード</h1>
    <a href="/admin/init">初期化</a><br />
    <a href="/admin/create">掲示板作成</a>
  </>)
})

app.get(`/init`, async (c) => {
    const {psw} = env(c);
    return c.render(
        <>
            <title>掲示板初期化君(仮)</title>
            <h1>READ.CGI for BBS.TSX by Och BBS β</h1>
            <h1>掲示板初期化君(仮)</h1>
            <form method="post">
                <label htmlFor="psw">パスワード:</label>
                <input type="password" id="psw" name="psw" />
                <button type="submit">初期化</button>
            </form>
        </>
    );
})

app.post(`/init`, async (c) => {
    const {psw} = env(c);
    const body = await c.req.parseBody()
    if (body.psw === psw) {
        await init()
        return c.render(
          <>
            <title>初期化完了</title>
            <h1>初期化しました</h1>
          </>
        );
    }
    return c.render(
        <>
            <title>初期化失敗</title>
            <h1>パスワードが違います</h1>
        </>
    );
})

app.get("/create", async (c) => {
    return c.render(
        <>
            <title>掲示板作成君(仮)</title>
            <h1>READ.CGI for BBS.TSX by Och BBS β</h1>
            <h1>掲示板作成君(仮)</h1>
            <form method="post">
                <label htmlFor="name">BBSKEY:</label>
                <input type="text" id="name" name="name" />
                <input type="password" id="psw" name="psw" placeholder="パスワード"/>
                <button type="submit">作成</button>
            </form>
        </>
    );
})

app.post("/create", async (c) => {
  const { psw } = env(c);
  const body = await c.req.parseBody()
  if (body.psw !== psw) {
    return c.render(
      <>
        <title>作成失敗</title>
        <h1>パスワードが違います</h1>
      </>
    );
  }
  await addIta(body.name.toString())
  return c.render(
    <>
      <title>掲示板作成完了</title>
      <h1>作成しました</h1>
    </>
  );
})

export default app