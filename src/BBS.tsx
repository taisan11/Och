import { Hono } from "hono";
import { jsxRenderer } from "hono/jsx-renderer";
import { getSubject, getSubjecttxt, getThread, getdat } from "./module/storage";
import { kakiko } from "./module/kakiko";
import { config } from "./module/config";
import type { SocketAddress } from 'bun'

declare module "hono" {
  interface ContextRenderer {
    (content: string | Promise<string>, props: { title?: string }): Response;
  }
}
type Bindings = {
  ip: SocketAddress
}


const app = new Hono<{ Bindings: Bindings }>()

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

app.get(`${config().preference.site.InstDIR}/read.cgi/:BBSKEY`, async (c) => {
  const URL = c.req.url;
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
        <textarea rows="5" cols="70" name="MESSAGE" />
      </form>
      <br />
      <br />
      <p>READ.CGI for BBS.TSX by Och BBS β</p>
    </>,
    { title: "READ.CGI" },
  );
});

// app.post(`${config().preference.site.InstDIR}/bbs.cgi`, async (c) => {
// })

////////////////////////
//   ##現在の仕様のコーナー
//   現在はですね、IPを方法がないので放置です
//   いつか実装したいです
////////////////////////
// 書き込み
app.post(`${config().preference.site.InstDIR}/read.cgi/:BBSKEY/:THID`, async (c) => {
  const kextuka = await kakiko(c,'kakiko','test');
  return c.redirect(kextuka.redirect);
});
// Newスレッド
app.post(`${config().preference.site.InstDIR}/read.cgi/:BBSKEY`, async (c) => {
  const kextuka = await kakiko(c, "newth",'test');
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
  const URL = c.req.url;
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
      <form method="post" action={URL}>
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

app.get('/:BBSKEY', async (c) => {
  return c.render(
    <tbody>
      <tr>
        <td>
          <table border={0} width="100%">
            <tbody>
              <tr>
                <td>
                  <font size="+1">
                    <b>楽しく雑談しよう。ただそれだけの場所です</b>
                  </font>
                </td>
                <td align="right">
                  <a href="#menu">■</a> <a href="#1">▼</a>
                </td>
              </tr>
              <tr>
                <td colspan={2}>
                  <div align="center" style={{ margin: "1.2em 0" }}>
                    <font color="red">
                      クリックで救える命が…ないです(｀・ω・´)シャキーン
                    </font>
                  </div>

                  <b>掲示板使用上の注意</b>
                  <blockquote style={{ marginTop: 0, fontWeight: "bold" }}>
                    ・日本法に準拠する<br />
                    ・かといってがっちがちではない<br />
                    ・管理者Tに従う<br />
                  </blockquote>
                </td>
              </tr>
            </tbody>
          </table>
        </td>
      </tr>
      <tr>
        <td align="center">
          <a href="../test/search.cgi" target="_blank">
            <small>■<b>レス検索</b>■</small>
          </a>
        </td>
      </tr>
    </tbody>,{
    'title': "BBS"
  })});
app.get('/:BBSKEY/subject.txt', async (c) => {
  const BBSKEY = c.req.param("BBSKEY");
  //@ts-ignore
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
