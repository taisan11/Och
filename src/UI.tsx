import { Hono } from "hono";
import { jsxRenderer } from "hono/jsx-renderer";
import { getSubject, getSubjecttxt, getThread, getdat } from "./module/storage";
import { kakikoAPI } from "./module/kakiko-api";
import { getConnInfo } from './module/unHono'
import { env } from "hono/adapter";
import { vValidator } from "@hono/valibot-validator";
import { newPostBody, newThreadBody } from "./types";

const app = new Hono()

app.notFound((c)=>{
  return c.render(
    <>
      <title>ページが見つかりません</title>
      <h1>READ.CGI for BBS.TSX by Och BBS β</h1>
      <p>ページが見つかりません</p>
    </>
  );
})
app.onError((err, c) => {
  console.error("Error occurred:", err);
  return c.render(
    <>
      <title>エラー</title>
      <h1>READ.CGI for BBS.TSX by Och BBS β</h1>
      <p>エラーが発生しました</p>
      <code>{err.message}</code>
    </>
  );
})

app.get(
  '*',
  jsxRenderer(({ children }) => {
    return (
      <html lang="ja">
        <head>
          <meta charset="UTF-8" />
          <meta name="viewport" content="width=device-width, initial-scale=1.0" />
        </head>
        <body>
          <div>{children}</div>
        </body>
      </html>
    )
  })
)

app.get(`/:BBSKEY`, async (c) => {
  const URL = c.req.url;
  const BBSKEY = c.req.param("BBSKEY");
  const SUBJECTJSON = await getSubject(BBSKEY);
  if (!SUBJECTJSON?.has) {
    return c.render(
      <>
        <title>掲示板がない</title>
        <h1>READ.CGI for BBS.TSX by Och BBS β</h1>
        <p>掲示板がありません</p>
      </>
    );
  }
  if (!SUBJECTJSON.data) {
    return c.render(
      <>
        <title>スレッドがない</title>
        <h1>READ.CGI for BBS.TSX by Och BBS β</h1>
        <p>スレッドがありません</p>
        <p>作成してみてはいかがでしょうか?</p>
        <p>スレ作成</p>
        <form method="post" action={URL}>
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
          <textarea rows={5} cols={70} name="MESSAGE" />
        </form>
        <br />
        <br />
        <p>READ.CGI for BBS.TSX by Och BBS β</p>
      </>
    );
  }
  return c.render(
    <>
      <title>READ.CGI</title>
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
      <form method="post" action={URL}>
        <input type="hidden" name="bbs" value="testing" />
        <label htmlFor="ThTitle">スレタイ:</label>
        <input type="text" id="ThTitle" name="ThTitle" />
        <button type="submit">新規スレッド作成</button>
        <br />
        <label htmlFor="name">名前</label>
        <input type="text" id="name" name="name" />
        <label htmlFor="mail">メール(省略可)</label>
        <input type="text" id="mail" name="mail" />
        <br />
        <textarea rows={5} cols={70} name="MESSAGE" />
      </form>
      <br />
      <br />
      <p>READ.CGI for BBS.TSX by Och BBS β</p>
    </>
  );
});

////////////////////////
//   ##現在の仕様のコーナー
//   現在はですね、IPを方法がないので放置です
//   いつか実装したいです
////////////////////////
// 書き込み
app.post(`/:BBSKEY/:THID`, vValidator("form",newPostBody),async (c) => {
  const IP = c.req.header('CF-Connecting-IP')||(await getConnInfo(c))?.remote.address||'0.0.0.0'
  const body = c.req.valid("form")
  const name = body.name
  const mail = body.mail
  const MESSAGE = body.MESSAGE;//内容
  const BBSKEY = c.req.param("BBSKEY");//BBSKEY
  const ThID = c.req.param("THID");//スレID
  const psw = env(c).psw as string
  const kextuka = await kakikoAPI({ThID,name,mail,MESSAGE,BBSKEY,IP,psw},"kakiko")
  if (kextuka.sc === false) {
    return c.render(
      <>
        <title>エラー</title>
        <h1>READ.CGI for BBS.TSX by Och</h1>
        <p>エラーが発生しました</p>
      </>
    );
  }
  return c.redirect(kextuka.ThID);
});
// Newスレッド
app.post(`/:BBSKEY`,vValidator("form",newThreadBody),async (c) => {
  const IP = c.req.header('CF-Connecting-IP')||(await getConnInfo(c))?.remote.address||'0.0.0.0'
  const body = c.req.valid("form")
  const ThTitle = body.ThTitle
  const name = body.name
  const mail = body.mail
  const MESSAGE = body.MESSAGE
  const BBSKEY = c.req.param("BBSKEY");
  const psw = env(c).psw as string
  const kextuka = await kakikoAPI({ThTitle,name,mail,MESSAGE,BBSKEY,IP,psw},"newth")
  if (kextuka.sc === false) {
    return c.render(
      <>
        <title>エラー</title>
        <h1>READ.CGI for BBS.TSX by Och</h1>
        <p>エラーが発生しました</p>
      </>
    );
  }
  return c.redirect(kextuka.ThID);
});

app.get(`/:BBSKEY/:THID`, async (c) => {
  const BBSKEY = c.req.param("BBSKEY");
  const THID = c.req.param("THID");
  const THD = await getThread(BBSKEY,THID)
  if (!THD.has) {
    return c.render(
      <>
        <title>スレッドがない</title>
        <h1>READ.CGI for BBS.TSX by Och</h1>
        <p>スレッドがありません</p>
      </>
    );
  }
  const EXAS = `../${BBSKEY}`;
  const URL = c.req.url;
  return c.render(
    <>
      <title>READ.CGI</title>
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
        {THD.data.title}
      </h1>
      <dl class="thred">
        {
        THD.data.post.map((post) => (
          <>
            <dt id={post.postid}>
              {post.postid} ：
              <font color="seagreen">
                {post.name}
              </font>
              ：{post.date}
            </dt>
            <dd dangerouslySetInnerHTML={{ __html: post.message }} />
          </>
        ))}
      </dl>
      <form method="post" action={URL}>
        <button type="submit">書き込む</button>
        <label htmlfor="name">名前:</label>
        <input type="text" id="name" name="name" />
        <label htmlfor="mail">メール(省略可):</label>
        <input type="text" id="mail" name="mail" /><br />
        <textarea rows={5} cols={70} name="MESSAGE"></textarea>
      </form>
      <br />
      <br />
      <p>READ.CGI for BBS.TSX by Och BBS β</p>
    </>
  );
});

export default app;