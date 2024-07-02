import type { Context } from "hono";
import { getThread,postThread,NewThread,getSubject,DeleteOldSubject,addSubject } from "./storage";
import { KAS } from "./KAS";
import { id } from "./id";

/**
 * kakikoAPI
 * @description 情報を加工し、保存する
 * @param {ThTitle:string,name:string,mail:string,MESSAGE:string,BBSKEY:string,ThID:string} 情報
 * @param c Hono Context
 * @param mode 新しいスレッドを立てるか、レスを書き込むか
 * @returns {sc:'ok'|false,redirect:string} 成功したか、リダイレクト先
 */
export async function kakikoAPI({ThTitle,name,mail,MESSAGE,BBSKEY,ThID}:{ThTitle?:string,name:string,mail:string,MESSAGE:string,BBSKEY:string,ThID?:string},c: Context, mode: 'newth' | 'kakiko'): Promise<{ sc: boolean, ThID: string }> {
    if (mode === 'newth') {
        const date = new Date();//時間
        const IP = c.req.header('CF-Connecting-IP')||c.env.ip.address||'0.0.0.0'
        const UnixTime = String(date.getTime()).substring(0, 10)//UnixTime
        // 文字数制限など
        if (name.length > 30) { return { 'sc': false, 'ThID': `error0` } }
        if (!MESSAGE || MESSAGE.length > 300) { return { 'sc': false, 'ThID':"error1" } }
        if (mail.length > 70) { return { 'sc': false, 'ThID': "error2" } }
        if (!BBSKEY) { return { 'sc': false, 'ThID': "error3" } }
        if (!ThTitle) { return { 'sc': false, 'ThID': "error5" } }
        // 加工
        const KASS = await KAS(MESSAGE, name, mail, Number(UnixTime));
        // 保存
        await NewThread(BBSKEY,{ name: KASS.name, mail: KASS.mail, message: KASS.mes, date: KASS.time+' ID:'+'testtests', title: ThTitle, id: UnixTime });
        // 返す
        return { 'sc': true, 'ThID': `/${BBSKEY}/${UnixTime}` };
    }
    if (mode === 'kakiko') {
        // 内容物の取得
        const date = new Date();//時間
        const UnixTime = String(date.getTime()).substring(0, 10)//UnixTime
        const IP = c.req.header('CF-Connecting-IP')||c.env.ip.address||'0.0.0.0'
        // 変換
        const KASS = await KAS(MESSAGE,name,mail,Number(UnixTime));
        // 制限
        if (name.length > 30) { return { 'sc': false, 'ThID': `error0` } }
        if (!MESSAGE || MESSAGE.length > 300) { return { 'sc': false, 'ThID':"error1" } }
        if (mail.length > 70) { return { 'sc': false, 'ThID': "error2" } }
        if (!BBSKEY) { return { 'sc': false, 'ThID': "error3" } }
        if (!ThID) { return {'sc':false,'ThID':"error4"} }
        const ID = await id(IP,BBSKEY);
        // 入力
        await postThread(BBSKEY,{ name: KASS.name, mail: KASS.mail, message: KASS.mes, date: KASS.time+' ID:'+ID, id: ThID });
        return {'sc':true,'ThID':`/${BBSKEY}/${ThID}`};
      
    }
    return {sc:false,ThID:'error999999999'}
}