import { postThread,NewThread } from "./storage";
import { KAS } from "./KAS";
import { id } from "./data-util";
import { exic } from "./plugin";
import { INPUT_LIMITS, ERROR_CODES } from "./constants";

function JDATE() {
    return new Date(Date.now() + ((new Date().getTimezoneOffset() + (9 * 60)) * 60 * 1000));//日本時間
}

/**
 * kakikoAPI
 * @description 情報を加工し、保存する
 * @param {ThTitle:string,name:string,mail:string,MESSAGE:string,BBSKEY:string,ThID:string} 情報
 * @param c Hono Context
 * @param mode 新しいスレッドを立てるか、レスを書き込むか
 * @returns {sc:'ok'|false,redirect:string} 成功したか、リダイレクト先
 */
export async function kakikoAPI({ThTitle,name,mail,MESSAGE,BBSKEY,ThID,IP,psw}:{ThTitle?:string,name?:string,mail?:string,MESSAGE:string,BBSKEY:string,ThID?:string,IP:string,psw:string},mode: 'newth' | 'kakiko'): Promise<{ sc: boolean, ThID: string }> {
    // Input validation
    if (!BBSKEY) { 
        return { 'sc': false, 'ThID': ERROR_CODES.BBSKEY_MISSING }; 
    }
    if (!MESSAGE || MESSAGE.length > INPUT_LIMITS.MESSAGE_MAX_LENGTH) { 
        return { 'sc': false, 'ThID': ERROR_CODES.MESSAGE_INVALID }; 
    }
    if (name && name.length > INPUT_LIMITS.NAME_MAX_LENGTH) { 
        return { 'sc': false, 'ThID': ERROR_CODES.NAME_TOO_LONG }; 
    }
    if (mail && mail.length > INPUT_LIMITS.MAIL_MAX_LENGTH) { 
        return { 'sc': false, 'ThID': ERROR_CODES.MAIL_TOO_LONG }; 
    }

    if (mode === 'newth') {
        const date = JDATE();//日本時間
        const UnixTime = String(date.getTime()).substring(0, 10)//UnixTime
        
        // Additional validation for new thread
        if (!ThTitle) { 
            return { 'sc': false, 'ThID': ERROR_CODES.TITLE_MISSING }; 
        }
        if (ThTitle.length > INPUT_LIMITS.TITLE_MAX_LENGTH) { 
            return { 'sc': false, 'ThID': ERROR_CODES.TITLE_TOO_LONG }; 
        }
        
        const ID = await id(IP,BBSKEY);
        // 加工
        const KASS = await KAS(MESSAGE, name!, mail!, Number(UnixTime),psw);
        const a = await exic(1,{name:KASS.name,mail:KASS.mail,message:KASS.mes});
        // 保存
        await NewThread(BBSKEY,{ name: a.data.name||KASS.name, mail: a.data.mail||KASS.mail, message: a.data.message||KASS.mes, date: KASS.time+' ID:'+ID, title: ThTitle, id: UnixTime });
        // 返す
        return { 'sc': true, 'ThID': `/${BBSKEY}/${UnixTime}` };
    }
    if (mode === 'kakiko') {
        // 内容物の取得
        const date = JDATE();//時間
        const UnixTime = String(date.getTime()).substring(0, 10)//UnixTime
        
        // Additional validation for kakiko
        if (!ThID) { 
            return {'sc':false,'ThID': ERROR_CODES.THREAD_ID_MISSING}; 
        }
        
        const ID = await id(IP,BBSKEY);
        // 変換
        const KASS = await KAS(MESSAGE,name!,mail!,Number(UnixTime),psw);
        const a = await exic(2,{name:KASS.name,mail:KASS.mail,message:KASS.mes});
        // 保存
        await postThread(BBSKEY,{ name: a.data.name||KASS.name, mail: a.data.mail||KASS.mail, message: a.data.message||KASS.mes, date: KASS.time+' ID:'+ID, id: ThID });
        // 返す
        return {'sc':true,'ThID':`/${BBSKEY}/${ThID}`};
      
    }
    return {sc:false,ThID: ERROR_CODES.UNKNOWN_ERROR}
}