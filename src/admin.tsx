import { Hono } from "hono";
import {env} from "hono/adapter"
import { jsxRenderer } from "hono/jsx-renderer";
import { addIta, init } from "./module/storage";

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