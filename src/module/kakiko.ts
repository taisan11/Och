import type { Context } from "hono";
import { storage } from "./storage";
import { KAS } from "./KAS";

/**
 * @param c Hono Context
 * @param mode 新しいスレッドを立てるか、レスを書き込むか
 * @returns {sc:'ok'|'no',redirect:string} 成功したか、リダイレクト先
 */
export async function kakiko(c: Context, mode: 'newth' | 'kakiko', base: string): Promise<{ sc: 'ok' | 'no', redirect: string }> {
    const body = await c.req.parseBody()
    if (mode === 'newth') {
        // 内容物の取得
        const ThTi = body.thTi
        const Name = String(body.name);//名前
        const mail = String(body.mail);//メアドor色々
        const MESSAGE = String(body.MESSAGE);//内容
        const BBSKEY = c.req.param("BBSKEY");//BBSKEY
        const date = new Date();//時間
        const UnixTime = String(date.getTime()).substring(0, 10)//UnixTime
        // 文字数制限など
        if (Name.length > 30) { return { 'sc': 'no', 'redirect': `/${base}/read.cgi/error?e=0` } }
        if (!MESSAGE || MESSAGE.length > 300) { return { 'sc': 'no', 'redirect': `/${base}/read.cgi/error?e=1` } }
        if (mail.length > 70) { return { 'sc': 'no', 'redirect': `/${base}/read.cgi/error?e=2` } }
        if (!BBSKEY) { return { 'sc': 'no', 'redirect': `/${base}/read.cgi/error?e=3` } }
        if (!ThTi) { return { 'sc': 'no', 'redirect': `/${base}/read.cgi/error?e=5` } }
        // 加工
        const KASS = await KAS(MESSAGE, Name, mail, Number(UnixTime));
        // 保存
        const SUBTXT = await storage.getItem(`/${BBSKEY}/SUBJECT.TXT`);
        await storage.setItem(`/${BBSKEY}/SUBJECT.TXT`, `${UnixTime}.dat<>${ThTi} (1)\n${SUBTXT}`)
        await storage.setItem(`/${BBSKEY}/dat/${UnixTime}.dat`, `${KASS.name}<>${KASS.mail}<>${KASS.time}<>${KASS.mes}<>${ThTi}`);
        return { 'sc': 'ok', 'redirect': `/${base}/read.cgi/${BBSKEY}/${UnixTime}` };
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
        const IP = c.req.header('CF-Connecting-IP')//IP(cloudflare tunnel使えば行けるやろ)
        // 変換
        const KASS = await KAS(MESSAGE,Name,mail,Number(UnixTime));
        // 制限
        if (Name.length > 30) { return {'sc':'no','redirect':`/${base}/read.cgi/error?e=0`} }
        if (!MESSAGE || MESSAGE.length > 300) { return {'sc':'no','redirect':`/${base}/read.cgi/error?e=1`} }
        if (mail.length > 70) { return {'sc':'no','redirect':`/${base}/read.cgi/error?e=2`} }
        if (!BBSKEY) { return {'sc':'no','redirect':`/${base}/read.cgi/error?e=3`} }
        if (!THID) { return {'sc':'no','redirect':`/${base}/read.cgi/error?e=4`} }
        // 入力
        const THDATTXT = await storage.getItem(`/${BBSKEY}/dat/${THID}.dat`);
        await storage.setItem(`/${BBSKEY}/dat/${THID}.dat`, `${THDATTXT}\n${KASS.name}<>${KASS.mail}<>${KASS.time}<>${KASS.mes}`);
        return {'sc':'ok','redirect':`/${base}/read.cgi/${BBSKEY}/${THID}`};
      
    }
    return {sc:'no',redirect:'/'}
}