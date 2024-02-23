import type { Context } from 'hono'
import { createRoute } from 'honox/factory'
import { drizzle } from "drizzle-orm/d1";
import { desc, eq } from "drizzle-orm";
import { MES } from './MSE';
import { threads,post } from '../../../../../src/schema';
import * as schema from "../../../../../src/schema";
import { NES } from './NES';

export default async function readCGI(c: Context) {
    const id = parseInt(c.req.param('thID'))    
    const db = drizzle(c.env.DB);
    const result = await db.select().from(post).where(eq(post.id, id));
    const thTi = await db.select({ title: threads.title }).from(threads).where(eq(threads.id, id)).execute();
    return (
        <>
        <div style="margin:0px;">
        <div style="margin-top:1em;">
            <span style="float:left;">
            <a href=".">■掲示板に戻る■</a>眠たいね
            </span>
            <span style="float:right;">
            </span>&nbsp;
        </div>
        </div>
        <hr style="background-color:#888;color:#888;border-width:0;height:1px;position:relative;top:-.4em;"></hr>
        <h1 style="color:#CC0000;font-size:larger;font-weight:normal;margin:-.5em 0 0;">{thTi[0].title}</h1>
        <dl class="thread">
        {result.map(result => (
        <>
            <dt id={result.res_id}>{result.res_id} ：<font color="seagreen"><b>{result.name}</b><b>{result.mail}</b></font>：{new Date(Number(result.createdAt)).toLocaleString()} ID:Test010101</dt>
            <dd dangerouslySetInnerHTML={{ __html: result.message }}></dd>
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
        <br />
        <br />
        <p>READ.CGI(?) for JS - Och BBS β</p>
        </>
    )
}

export const POST = createRoute(async (c) => {
    const body = await c.req.formData();
    const thTi = body.get('thTi');//タイトル(新規作成時)
    let thID:number|null = body.get('thID');//スレッドID(かきこ時)
    let Name = body.get('name');//名前
    const mail = body.get('mail');//メアドor色々
    const MESSAGE = body.get('MESSAGE');//内容
    const HEmes = MES(MESSAGE);//内容toHTML
    const bbs = body.get('bbs');//掲示板名
    const date = new Date();//時間
    const UnixTime = date.getTime()//UnixTime
    const db = drizzle(c.env.DB, { schema });
    const IP = c.req.header('CF-Connecting-IP')//IP
    // ##制限check!!##
    // 文字数制限
    if (MESSAGE.length == 0||MESSAGE.length>1000) {
        return c.redirect(`./error?e=0`);
    }
    if (Name.length == 0||Name.length>100) {
        Name = '名無しん';
    }
    if (thID == null) {
        return c.redirect(`./error?e=2`);
    }
    let newTh = false;
    const thID2 = Number(thID);
    const name2 = String(await NES(Name));
	let resulta = await db.query.post.findFirst({
		where: (post, { eq }) => eq(post.id, thID2),
		orderBy: (post, { desc }) => [desc(post.res_id)],
	});
    const resID = Number(resulta?.res_id) + 1;
    const ex_id = Number(`${resID}${UnixTime}${Math.floor(Math.random() * 88) + 10}`);
    await db.insert(post).values({
        ex_id: ex_id,
        id: thID2,
        res_id: resID,
        name: name2,
        mail: mail,
        message: HEmes,
        ip_addr: IP,
        createdAt: UnixTime,
    });
   
    return c.redirect(`./${thID}`);
});