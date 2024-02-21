import type { Context } from 'hono'
import { createRoute } from 'honox/factory'
import thTitle from '../../../../compornent/thTitle'
import kakiko from '../../../../compornent/kakiko'
import { drizzle } from "drizzle-orm/d1";
import { desc, eq } from "drizzle-orm";
import { MES } from './MSE';
import { threads,post } from '../../../../../src/schema';

type res = {
    thNum: number
    thNem: string
    thMil: string
    thTim: string
    thIDD: string
}
const resTD: res = {
    thNum: 1,
    thNem: 'jonsdajand',
    thMil: 'jonsdajand',
    thTim: '2021/10/10(日) 10:10:10.10',
    thIDD: '123456789'

}
export default function readCGI(c: Context) {
    const id = c.req.param('thID')
    
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
        <dt>{resTD.thNum} ：<font color="seagreen"><b>{resTD.thNem}</b><b>{resTD.thMil}</b></font>：{resTD.thTim} ID:{resTD.thIDD}</dt>
        <dd>kurowasan<br/>ki-makare-<br/>kusanoakiko</dd>
        </dl>
        <form method="post">
            <input type="hidden" name="bbs" value="testing"/>
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
    const thTi = body.get('thTi');//スレッドタイトル(新規作成時)
    const thID = body.get('thID');//スレッドID(かきこ時)
    const name = body.get('name');//名前
    const mail = body.get('mail');//メールなど
    const MESSAGE = body.get('MESSAGE');//本文
    const HEmes = MES(MESSAGE);//HTML用本文
    const bbs = body.get('bbs');//掲示板名
    const IP = c.req.header('CF-Connecting-IP')//IP
    const date = new Date();
	const UnixTime = date.getTime()
    const db = drizzle(c.env.DB);//DB接続用
    
    //スレッド作成
    let newTh = false;
    if (thTi) {
        await db.insert(threads).values({
            id: UnixTime,
            title: thTi,
            createdAt: UnixTime,
            ip_addr: IP,
        });
        const thID = UnixTime;
        let resID = 1;//新規の場合は1
        let newTh = true;
    }
    // ##書き込み##
    //レス番号取得 新規じゃないなら代入できるよね
    let resID = await db.query.post.findFirst({
		where: (post, { eq }) => eq(post.id, thID),
		orderBy: (post, { desc }) => [desc(post.res_id)],
	});
    // 新規スレッドではない場合+1する処理
    if (newTh == false) {
        resID = resID + 1;
    }
    //書き込み
    const ex_id = Number(`${resID}${UnixTime}${Math.floor(Math.random() * 88) + 10}`,);
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
   
    return c.redirect("/top");
  });