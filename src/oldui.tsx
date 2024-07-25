import { Hono } from "hono";
import { jsxRenderer } from "hono/jsx-renderer";
import { getSubject, getSubjecttxt, getThread, getdat } from "./module/storage";
import { config } from "./module/config";
// import {shiftjis} from '@taisan11/hono-shiftjis/src/index'

declare module "hono" {
  interface ContextRenderer {
    (content: string | Promise<string>, props: { title?: string }): Response;
  }
}


const app = new Hono()
// shiftjis
// app.use((c,next)=>{shiftjis(c,next)})

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

app.get("/bbsmenu.html", async (c) => {
    return c.render(
        <div>
        <b>aaa</b>
        <br/>
        <a href="https://kenmo.org/refuge/">テスト</a>
        <br/>
        </div>,{title: "掲示板メニュー"}
    );
})
app.get('/:BBSKEY/subject.txt', async (c) => {
  const BBSKEY = c.req.param("BBSKEY");
  c.header("Content-Type", "text/plain; charset=Shift_JIS");
  return c.body(await getSubjecttxt(BBSKEY))
})
app.get('/:BBSKEY/dat/:THIDextension', async (c) => {
  const BBSKEY = c.req.param("BBSKEY");
  const THIDextension = c.req.param("THIDextension");
  const dat = await getdat(BBSKEY,THIDextension)
  c.header("Content-Type", "text/plain; charset=Shift_JIS");
  return c.body(dat)
})

export default app;
