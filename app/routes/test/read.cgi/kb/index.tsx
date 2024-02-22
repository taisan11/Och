import type { Context } from 'hono'
import { createRoute } from 'honox/factory'
import thTitle from '../../../../compornent/thTitle'
import kakiko from '../../../../compornent/kakiko'
import { drizzle } from "drizzle-orm/d1";
import { desc, eq } from "drizzle-orm";
import { MES } from './MSE';
import { threads,post } from '../../../../../src/schema';

export default async function readCGI(c: Context) {
    const db = drizzle(c.env.DB,);
    let result = await db.select().from(threads).orderBy(desc(threads.createdAt)).limit(20).execute();
    if (!result) result = [{ id: 0, title: 'スレッドがありません', createdAt: "0",ip_addr:"0.0.0.0",isDelete:false}]
    return (
        <>
        {result.map(result => (
        <div key={result.id}>
            <a href={`./kb/${result.id}`}>{result.title} -- 作成時間{new Date(Number(result.createdAt)).toLocaleString()}</a><br />
        </div>
        ))}
        <p>スレ作成</p>
        <form method="post">
            <input type="hidden" name="bbs" value="testing"/>
            <label htmlFor="thTi">スレタイ:</label>
            <input type="text" id="thTi" name="thTi" />
            <button type="submit">新規スレッド作成</button><br />
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
    const db = drizzle(c.env.DB);//データベース
    const IP = c.req.header('CF-Connecting-IP')//IP
    //##チェック##
    if (MESSAGE.length == 0||MESSAGE.length>1000) {
        return c.redirect(`./error?e=0`);
    }
    if (Name.length == 0||Name.length>100) {
        Name = '名無しん';
    }
    if (thTi == null) {
        return c.redirect(`./error?e=2`);
    }
    let newTh = false;
    let resID = 1;

    if (thTi) {
        await db.insert(threads).values({
            id: UnixTime,
            title: thTi,
            createdAt: UnixTime,
            ip_addr: IP,
        });
        newTh = true;
        thID = UnixTime;
    } else {
        resID = await db.query.post.findFirst({
            where: (post, { eq }) => eq(post.id, thID),
            orderBy: (post, { desc }) => [desc(post.res_id)],
        });
        resID = resID + 1;
    }

    const ex_id = Number(`${resID}${UnixTime}${Math.floor(Math.random() * 88) + 10}`);
    await db.insert(post).values({
        ex_id: ex_id,
        id: thID,
        res_id: resID,
        name: Name,
        mail: mail,
        message: HEmes,
        ip_addr: IP,
        createdAt: UnixTime,
    });
   
    return c.redirect(`./kb/${thID}`);
});