import { Hono } from "hono";
import { jsxRenderer } from "hono/jsx-renderer";
import { getSubject, getSubjecttxt, getThread, getdat } from "./module/storage";
import { kakiko } from "./module/kakiko";
import { config } from "./module/config";
import { kakiko_dat } from "./module/kakiko.dat";

declare module "hono" {
  interface ContextRenderer {
    (content: string | Promise<string>, props: { title?: string }): Response;
  }
}

const app = new Hono();

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

app.get(`${config().preference.site.InstDIR}/admin.cgi`, async (c) => {
    return c.render(
        <>
        <h1>管理画面</h1>
        <p>管理画面</p>
        </>,
        { title: "管理画面" },
    );
})

export default app;
