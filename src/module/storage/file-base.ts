import { createStorage } from "unstorage";
import fsDriver from "unstorage/drivers/fs";
import { use } from "hono/jsx";
import { config } from "../config";
import { subjectpaser,datpaser } from "../pase";
import { NewThreadParams,PostThreadParams } from "../storage";
import * as IconvCP932 from "iconv-cp932";

export function writedat(dat: string, datname: string) {
    const storage = createStorage({ driver: fsDriver({ base: "./data" }) });
}

export async function addSubject_file(BBSKEY:string,date: string, title: string,id: string) {
    const storage = createStorage({ driver: fsDriver({ base: "./data" }) });
    const SUBJECT = await storage.getItem(`${BBSKEY}/SUBJECT.TXT`);
    await storage.setItem(`${BBSKEY}/SUBJECT.TXT`, `${id}.dat<>${title} (0)\n${SUBJECT}`);
}

export async function DeleteOldSubject_file(BBSKEY:string,) {
    const storage = createStorage({ driver: fsDriver({ base: "./data" }) });
    const SUBJECT = await storage.getItem(`${BBSKEY}/SUBJECT.TXT`);
    //@ts-ignore
    const lines = SUBJECT.split('\n');
    const newLines = lines.slice(0, config().preference.limit.MaxSubject); // Keep the first 10 lines
    const newSubject = newLines.join('\n');
    await storage.setItem(`${BBSKEY}/SUBJECT.TXT`, newSubject);
}

export async function getSubject_file(BBSKEY:string,) {
    const storage = createStorage({ driver: fsDriver({ base: "./data" }) });
    const SUBTXT = await storage.getItem(`${BBSKEY}/SUBJECT.TXT`);
    const HASSUB = await storage.hasItem(`${BBSKEY}/SUBJECT.TXT`);
    if (!HASSUB) {
        return {'data':[],'has':HASSUB};
    }
    return {'data':subjectpaser(String(SUBTXT)),'has':HASSUB};
}
export async function getSubjecttxt_file(BBSKEY:string,) {
    const storage = createStorage({ driver: fsDriver({ base: "./data" }) });
    const SUBTXT = await storage.getItem(`${BBSKEY}/SUBJECT.TXT`);
    return IconvCP932.encode(SUBTXT);
}
export async function NewThread_file(BBSKEY:string,{ name, mail, message, date, title, id }: NewThreadParams) {
    const storage = createStorage({ driver: fsDriver({ base: "./data" }) });
    await storage.setItem(`${BBSKEY}/dat/${id}.dat`, `${name}<>${mail}<>${date}<>${message}<>${title}`);
    await addSubject_file(BBSKEY,date, title,id);
    return { 'sc': 'ok', 'redirect': `/${config().preference.site.InstDIR}/read.cgi/${BBSKEY}/${id}` };
}

export async function postThread_file(BBSKEY:string,{ name, mail, message, date, id }: PostThreadParams) {
    const storage = createStorage({ driver: fsDriver({ base: "./data" }) });
    const THDATTXT = await storage.getItem(`${BBSKEY}/dat/${id}.dat`);
    await storage.setItem(`${BBSKEY}/dat/${id}.dat`, `${THDATTXT}\n${name}<>${mail}<>${date}<>${message}`);
    return {'sc':'ok','redirect':`/${config().preference.site.InstDIR}/read.cgi/${BBSKEY}/${id}`};
}

export async function getThread_file(BBSKEY:string,id: string) {
    const storage = createStorage({ driver: fsDriver({ base: "./data" }) });
    const dat = await storage.getItem(`${BBSKEY}/dat/${id}.dat`);
    const hasdat=  await storage.hasItem(`${BBSKEY}/dat/${id}.dat`);
    return {'date':datpaser(String(dat)),has:hasdat};
}
export async function getdat_file(BBSKEY:string,idextension: string) {
    const storage = createStorage({ driver: fsDriver({ base: "./data" }) });
    const dat = await storage.getItem(`${BBSKEY}/dat/${idextension}.dat`);
    return IconvCP932.encode(dat);
}