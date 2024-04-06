import type { Context } from "hono";
import { getThread,postThread,NewThread,getSubject,DeleteOldSubject,addSubject } from "./storage";
import { KAS } from "./KAS";
import * as IconvCP932 from "iconv-cp932";

/**
 * @param c Hono Context
 * @param mode 新しいスレッドを立てるか、レスを書き込むか
 * @returns {sc:'ok'|'no',redirect:string} 成功したか、リダイレクト先
 */
export async function kakiko_dat(c: Context, base: string): Promise<{ sc: 'ok' | 'no', redirect: string }> {
    const body = await c.req.parseBody()
    const mode = IconvCP932.decodeURIComponent(String(body.submit))
    if (mode === '新規スレッド作成') {
        // 内容物の取得
        const ThTi = String(IconvCP932.decodeURIComponent(body.subject))
        const Name = String(IconvCP932.decodeURIComponent(body.FROM));//名前
        const mail = String(IconvCP932.decodeURIComponent(body.mail));//メアドor色々
        const MESSAGE = String(IconvCP932.decodeURIComponent(body.MESSAGE));//内容
        const BBSKEY = String(IconvCP932.decodeURIComponent(body.bbs));//BBSKEY
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
        await NewThread(base,{ name: KASS.name, mail: KASS.mail, message: KASS.mes, date: KASS.time, title: ThTi, id: UnixTime });
        // 返す
        return { 'sc': 'ok', 'redirect': `/${base}/read.cgi/${BBSKEY}/${UnixTime}` };
    }
    if (mode === '書き込む') {
        // 内容物の取得
        const Name = String(IconvCP932.decodeURIComponent(body.FROM));//名前
        const mail = String(IconvCP932.decodeURIComponent(body.mail));//メアドor色々
        const MESSAGE = String(IconvCP932.decodeURIComponent(body.MESSAGE));//内容
        const BBSKEY = String(IconvCP932.decodeURIComponent(body.bbs));//BBSKEY
        const THID = String(IconvCP932.decodeURIComponent(body.key));//スレID
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
        await postThread(base,{ name: KASS.name, mail: KASS.mail, message: KASS.mes, date: KASS.time, id: THID });
        return {'sc':'ok','redirect':`/${base}/read.cgi/${BBSKEY}/${THID}`};
      
    }
    return {sc:'no',redirect:'/'}
}