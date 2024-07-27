import type { Context } from "hono";
import { getThread,postThread,NewThread,getSubject,DeleteOldSubject } from "./storage";
import { KAS } from "./KAS";
import { id } from "./id";
import { exic } from "./plugin";
import { getConnInfo } from "./unHono";

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
        const IP = c.req.header('CF-Connecting-IP')||getConnInfo(c).remote.address||'0.0.0.0'
        const UnixTime = String(date.getTime()).substring(0, 10)//UnixTime
        // 文字数制限など
        if (name.length > 30) { return { 'sc': false, 'ThID': `error0` } }
        if (!MESSAGE || MESSAGE.length > 300) { return { 'sc': false, 'ThID':"error1" } }
        if (mail.length > 70) { return { 'sc': false, 'ThID': "error2" } }
        if (!BBSKEY) { return { 'sc': false, 'ThID': "error3" } }
        if (!ThTitle) { return { 'sc': false, 'ThID': "error5" } }
        const ID = await id(IP,BBSKEY);
        // 加工
        const KASS = await KAS(MESSAGE, name, mail, Number(UnixTime));
        const a = await exic(1,{name:KASS.name,mail:KASS.mail,message:KASS.mes});
        // 保存
        await NewThread(BBSKEY,{ name: a.data.name||KASS.name, mail: a.data.mail||KASS.mail, message: a.data.message||KASS.mes, date: KASS.time+' ID:'+ID, title: ThTitle, id: UnixTime });
        // 返す
        return { 'sc': true, 'ThID': `/${BBSKEY}/${UnixTime}` };
    }
    if (mode === 'kakiko') {
        // 内容物の取得
        const date = new Date();//時間
        const UnixTime = String(date.getTime()).substring(0, 10)//UnixTime
        const IP = c.req.header('CF-Connecting-IP')||getConnInfo(c).remote.address||'0.0.0.0'
        // 制限
        if (name.length > 30) { return { 'sc': false, 'ThID': `error0` } }
        if (!MESSAGE || MESSAGE.length > 300) { return { 'sc': false, 'ThID':"error1" } }
        if (mail.length > 70) { return { 'sc': false, 'ThID': "error2" } }
        if (!BBSKEY) { return { 'sc': false, 'ThID': "error3" } }
        if (!ThID) { return {'sc':false,'ThID':"error4"} }
        const ID = await id(IP,BBSKEY);
        // 変換
        const KASS = await KAS(MESSAGE,name,mail,Number(UnixTime));
        const a = await exic(2,{name:KASS.name,mail:KASS.mail,message:KASS.mes});
        // 保存
        await postThread(BBSKEY,{ name: a.data.name||KASS.name, mail: a.data.mail||KASS.mail, message: a.data.message||KASS.mes, date: KASS.time+' ID:'+ID, id: ThID });
        // 返す
        return {'sc':true,'ThID':`/${BBSKEY}/${ThID}`};
      
    }
    return {sc:false,ThID:'error999999999'}
}