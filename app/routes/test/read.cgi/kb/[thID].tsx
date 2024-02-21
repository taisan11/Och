import type { Context } from 'hono'
import { createRoute } from 'honox/factory'
import { drizzle } from "drizzle-orm/d1";
import { desc, eq } from "drizzle-orm";
import { MES } from './MSE';
import { threads,post } from '../../../../../src/schema';
export default async function readCGI(c: Context) {
    const id = parseInt(c.req.param('thID'))    
    const db = drizzle(c.env.DB);
    const result = await db.select().from(post).where(eq(post.id, id));
    return (
        <>
        <div style="margin:0px;">
        <div style="margin-top:1em;">
            <span style="float:left;">
            <a href="#">■掲示板に戻る■</a>
            <a href="#">全部</a>
            <a href="#">1-</a>
            <a href="#">最新50</a>
            </span>
            <span style="float:right;">
            </span>&nbsp;
        </div>
        </div>
        <hr style="background-color:#888;color:#888;border-width:0;height:1px;position:relative;top:-.4em;"></hr>
        <h1 style="color:#CC0000;font-size:larger;font-weight:normal;margin:-.5em 0 0;">jonsdajand</h1>
        <dl class="thread">
        {result.map(result => (
        <>
            <dt id={result.id}>{result.id} ：<font color="seagreen"><b>{result.name}</b><b>{result.mail}</b></font>：{result.createdAt} ID:Test010101</dt>
            <dd>{result.message}</dd>
        </>
        ))}
        </dl>
        <form method="post">
            <input type="hidden" name="bbs" value="testing"/>
            <input type="hidden" name="thID" value={id}/>
            <button type="submit">書き込む</button>
            <label htmlFor="name">名前</label>
            <input type="text" id="name" name="name" />
            <label htmlFor="mail">メール(省略可)</label>
            <input type="text" id="mail" name="mail" /><br />
            <textarea rows="5" cols="70" name="MESSAGE"/>
        </form>
        </>
    )
}

export const POST = createRoute(async (c) => {
    const body = await c.req.formData();
    const thTi = body.get('thTi');//タイトル(新規作成時)
    let thID:number|null = body.get('thID');//スレッドID(かきこ時)
    const name = body.get('name');//名前
    const mail = body.get('mail');//メアドor色々
    const MESSAGE = body.get('MESSAGE');//内容
    const HEmes = MES(MESSAGE);//内容toHTML
    const bbs = body.get('bbs');//掲示板名
    const date = new Date();//時間
    const UnixTime = date.getTime()//UnixTime
    const db = drizzle(c.env.DB);//データベース
    const IP = '1.1.1.1'//テスト用
    // const IP = c.req.header('CF-Connecting-IP')//IP

    let newTh = false;
    const resIDold = await db.select()
        .from(post)
        .where(eq(post.id, thID))
        .orderBy(desc(post.res_id))
    const resID = resIDold[0].id + 1;
    const ex_id = Number(`${resID}${UnixTime}${Math.floor(Math.random() * 88) + 10}`);
    await db.insert(post).values({
        ex_id: ex_id,
        id: thID,
        res_id: resID,
        name: name,
        mail: mail,
        message: HEmes,
        ip_addr: IP,
        createdAt: UnixTime,
    });
   
    return c.redirect(`./kb/${thID}`);
});