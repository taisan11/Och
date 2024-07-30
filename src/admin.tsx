import { Hono } from "hono";
import {env} from "hono/adapter"
import { jsxRenderer } from "hono/jsx-renderer";
import { init } from "./module/storage";

declare module "hono" {
  interface ContextRenderer {
    (content: string | Promise<string>, props: { title?: string }): Response;
  }
}

const app = new Hono()

app.get(
  "*",
  jsxRenderer(({ children, title }) => {
    return (
      <html lang="ja">
        <head>
          <meta charset="utf-8" />
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

app.get(`/init`, async (c) => {
    const {psw} = env(c);
    return c.render(
        <>
            <h1>READ.CGI for BBS.TSX by Och BBS β</h1>
            <h1>掲示板初期化君(仮)</h1>
            <form method="post">
                <label htmlFor="psw">パスワード:</label>
                <input type="password" id="psw" name="psw" />
                <button type="submit">初期化</button>
            </form>
        </>,
        { title: "掲示板がない" },
    );
})

app.post(`/init`, async (c) => {
    const {psw} = env(c);
    const body = await c.req.parseBody()
    if (body.psw === psw) {
        await init()
        return c.render(
            <h1>初期化しました</h1>,
            { title: "初期化完了" },
        );
    }
    return c.render(
        <h1>パスワードが違います</h1>,
        { title: "初期化失敗" },
    );
})

export default app