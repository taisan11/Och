import type { Context } from "hono";
import { getThread,postThread,NewThread,getSubject,DeleteOldSubject,addSubject } from "./storage";
import { KAS } from "./KAS";
import { id } from "./id";

/**
 * @param c Hono Context
 * @param mode 新しいスレッドを立てるか、レスを書き込むか
 * @returns {sc:'ok'|false,redirect:string} 成功したか、リダイレクト先
 */
export async function kakiko(c: Context, mode: 'newth' | 'kakiko', base: string): Promise<{ sc: boolean, redirect: string }> {
    const body = await c.req.parseBody()
    if (mode === 'newth') {
        // 内容物の取得
        const ThTi = String(body.ThTitle)
        const Name = String(body.name);//名前
        const mail = String(body.mail);//メアドor色々
        const MESSAGE = String(body.MESSAGE);//内容
        const BBSKEY = c.req.param("BBSKEY");//BBSKEY
        const date = new Date();//時間
        const ip = c.req.header('CF-Connecting-IP')//IP(cloudflare tunnel使えば行けるやろ)
        const UnixTime = String(date.getTime()).substring(0, 10)//UnixTime
        // 文字数制限など
        if (Name.length > 30) { return { 'sc': false, 'redirect': `/${base}/read.cgi/error?e=0` } }
        if (!MESSAGE || MESSAGE.length > 300) { return { 'sc': false, 'redirect': `/${base}/read.cgi/error?e=1` } }
        if (mail.length > 70) { return { 'sc': false, 'redirect': `/${base}/read.cgi/error?e=2` } }
        if (!BBSKEY) { return { 'sc': false, 'redirect': `/${base}/read.cgi/error?e=3` } }
        if (!ThTi) { return { 'sc': false, 'redirect': `/${base}/read.cgi/error?e=5` } }
        // 加工
        const KASS = await KAS(MESSAGE, Name, mail, Number(UnixTime));
        // 保存
        await NewThread(BBSKEY,{ name: KASS.name, mail: KASS.mail, message: KASS.mes, date: KASS.time+' ID:'+'testtests', title: ThTi, id: UnixTime });
        // 返す
        return { 'sc': true, 'redirect': `/${base}/read.cgi/${BBSKEY}/${UnixTime}` };
    }
    if (mode === 'kakiko') {
        // 内容物の取得
        const Name = String(body.name);//名前
        const mail = String(body.mail);//メアドor色々
        const MESSAGE = String(body.MESSAGE);//内容
        const BBSKEY = c.req.param("BBSKEY");//BBSKEY
        const THID = c.req.param("THID");//スレID
        const date = new Date();//時間
        const UnixTime = String(date.getTime()).substring(0, 10)//UnixTime
        const IP = c.req.header('CF-Connecting-IP')||c.env.ip.address||'0.0.0.0'//IP(cloudflare tunnel使えば行けるやろ)
        // 変換
        const KASS = await KAS(MESSAGE,Name,mail,Number(UnixTime));
        // 制限
        if (Name.length > 30) { return {'sc':false,'redirect':`/${base}/read.cgi/error?e=0`} }
        if (!MESSAGE || MESSAGE.length > 300) { return {'sc':false,'redirect':`/${base}/read.cgi/error?e=1`} }
        if (mail.length > 70) { return {'sc':false,'redirect':`/${base}/read.cgi/error?e=2`} }
        if (!BBSKEY) { return {'sc':false,'redirect':`/${base}/read.cgi/error?e=3`} }
        if (!THID) { return {'sc':false,'redirect':`/${base}/read.cgi/error?e=4`} }
        const ID = await id(IP,BBSKEY);
        // 入力
        await postThread(BBSKEY,{ name: KASS.name, mail: KASS.mail, message: KASS.mes, date: KASS.time+' ID:'+ID, id: THID });
        return {'sc':true,'redirect':`/${base}/read.cgi/${BBSKEY}/${THID}`};
      
    }
    return {sc:false,redirect:'/'}
}