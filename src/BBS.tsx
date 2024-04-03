import { Hono } from "hono";
import { jsxRenderer } from "hono/jsx-renderer";
import { getSubject, getThread } from "./module/storage";
import { kakiko } from "./module/kakiko";
import { config } from "./module/config";

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

app.get(`${config().preference.site.InstDIR}/read.cgi/error`, async (c) => {
  const e = c.req.query("e");
  let em = "";
  switch (e) {
    case "0":
      em = "名前が入力されていないか、30文字を超えています";
      break;
    case "1":
      em = "内容が入力されていないか、300文字を超えています";
      break;
    case "2":
      em = "メールが70文字を超えています";
      break;
    case "3":
      em = "BBSKEYがありません";
      break;
    case "4":
      em = "THIDがありません";
      break;
    case "5":
      em = "スレタイが入力されていません";
      break;
  }
  return c.render(
    <>
      <h1>ERROR</h1>
      <p>えらーがきたぞー</p>
      <p>{em}</p>
    </>,
    { title: "ERROR" },
  );
})

app.get(`${config().preference.site.InstDIR}`, async (c) => {
  return c.render(
    <>
      <h1>hello</h1>
      <p>このサイトは[READ.CGI for BBS.TSX by Och BBS β]スクリプトを利用しています</p>
    </>,
    { title: "Hello" },
  );
});

app.post(`${config().preference.site.InstDIR}/read.cgi/:BBSKEY`, async (c) => {
  const kextuka = await kakiko(c, "newth",'test');
  return c.redirect(kextuka.redirect);
});

app.get(`${config().preference.site.InstDIR}/read.cgi/:BBSKEY`, async (c) => {
  const BBSKEY = c.req.param("BBSKEY");
  const SUBJECTJSON = await getSubject(BBSKEY);
  if (!SUBJECTJSON?.has) {
    return c.render(
      <>
        <h1>READ.CGI for BBS.TSX by Och BBS β</h1>
        <p>掲示板がありません</p>
      </>,
      { title: "掲示板がない" },
    );
  }
  if (!SUBJECTJSON.data) {
    return c.render(
      <>
        <h1>READ.CGI for BBS.TSX by Och BBS β</h1>
        <p>スレッドがありません</p>
        <p>作成してみてはいかがでしょうか?</p>
        <p>スレ作成</p>
        <form method="post">
          <input type="hidden" name="bbs" value="testing" />
          <label htmlFor="thTi">スレタイ:</label>
          <input type="text" id="thTi" name="thTi" />
          <button type="submit">新規スレッド作成</button>
          <br />
          <label htmlFor="name">名前</label>
          <input type="text" id="name" name="name" />
          <label htmlFor="mail">メール(省略可)</label>
          <input type="text" id="mail" name="mail" />
          <br />
          <textarea rows="5" cols="70" name="MESSAGE" />
        </form>
        <br />
        <br />
        <p>READ.CGI for BBS.TSX by Och BBS β</p>
      </>,
      { title: "スレッドがない" },
    );
  }
  return c.render(
    <>
      <h1>READ.CGI</h1>
      {
        Object.entries(SUBJECTJSON.data).map(([unixtime, [threadName, responseCount]]) => {
          const date = new Date(parseInt(unixtime) * 1000);
          const formattedDate = `${date.getFullYear()}/${date.getMonth() + 1}/${date.getDate()}`;
          return (
            <><a href={`./${BBSKEY}/${unixtime}`}>{`${threadName}-${responseCount}-${formattedDate}`}</a><br/></>
          );
        })
      }
      <p>スレ作成</p>
      <form method="post">
        <input type="hidden" name="bbs" value="testing" />
        <label htmlFor="thTi">スレタイ:</label>
        <input type="text" id="thTi" name="thTi" />
        <button type="submit">新規スレッド作成</button>
        <br />
        <label htmlFor="name">名前</label>
        <input type="text" id="name" name="name" />
        <label htmlFor="mail">メール(省略可)</label>
        <input type="text" id="mail" name="mail" />
        <br />
        <textarea rows="5" cols="70" name="MESSAGE" />
      </form>
      <br />
      <br />
      <p>READ.CGI for BBS.TSX by Och BBS β</p>
    </>,
    { title: "READ.CGI" },
  );
});

////////////////////////
//   ##現在の仕様のコーナー
//   現在はですね、IPを方法がないので放置です
//   いつか実装したいです
////////////////////////

app.post(`${config().preference.site.InstDIR}/read.cgi/:BBSKEY/:THID`, async (c) => {
  const kextuka = await kakiko(c, "kakiko",'test');
  return c.redirect(kextuka.redirect);
});

app.get(`${config().preference.site.InstDIR}/read.cgi/:BBSKEY/:THID`, async (c) => {
  const BBSKEY = c.req.param("BBSKEY");
  const THID = c.req.param("THID");
  const THD = await getThread(BBSKEY,THID)
  if (!THD?.has) {
    return c.render(
      <>
        <h1>READ.CGI for BBS.TSX by Och</h1>
        <p>スレッドがありません</p>
      </>,
      { title: "スレッドがない" },
    );
  }
  const EXAS = `../${BBSKEY}`;
  return c.render(
    <>
      <div style="margin:0px;">
        <div style="margin-top:1em;">
          <span style="float:left;">
            <a href={EXAS}>■掲示板に戻る■</a>眠たいね
          </span>
          <span style="float:right;"></span>&nbsp;
        </div>
      </div>
      <hr style="background-color:#888;color:#888;border-width:0;height:1px;position:relative;top:-.4em;" />
      <h1 style="color:#CC0000;font-size:larger;font-weight:normal;margin:-.5em 0 0;">
        {JSON.parse(THD.date).title}
      </h1>
      <dl class="thred">
        {//@ts-ignore
        JSON.parse(THD.date).post.map((post) => (
          <>
            <dt id={post.postid}>
              {post.postid} ：
              <font color="seagreen">
                <b>{post.name}</b>
                <b>{post.mail}</b>
              </font>
              ：{post.date}
            </dt>
            <dd dangerouslySetInnerHTML={{ __html: post.message }} />
          </>
        ))}
      </dl>
      <form method="post">
        <button type="submit">書き込む</button>
        <label htmlfor="name">名前:</label>
        <input type="text" id="name" name="name" />
        <label htmlfor="mail">メール(省略可):</label>
        <input type="text" id="mail" name="mail" /><br />
        <textarea rows="5" cols="70" name="MESSAGE"></textarea>
      </form>
      <br />
      <br />
      <p>READ.CGI for BBS.TSX by Och BBS β</p>
    </>,
    { title: "READ.CGI" },
  );
});

export default app;
