import { createStorage } from "unstorage";
import { config } from "../config";
import { subjectpaser,datpaser } from "../pase";
import { NewThreadParams,PostThreadParams, getSubjectReturn, getThreadReturn, postReturn } from "../storage";

const drives = {driver:config().preference.site.UnstorageOptions}

export async function addSubject_file(BBSKEY:string,date: string, title: string,id: string):Promise<void> {
    const storage = createStorage(drives);
    const SUBJECT = await storage.getItem(`${BBSKEY}/SUBJECT.TXT`);
    await storage.setItem(`${BBSKEY}/SUBJECT.TXT`, `${id}.dat<>${title} (0)\n${SUBJECT}`);
}

export async function DeleteOldSubject_file(BBSKEY:string,):Promise<void> {
    const storage = createStorage(drives);
    const SUBJECT = await storage.getItem(`${BBSKEY}/SUBJECT.TXT`);
    const lines = String(SUBJECT).split('\n');
    const newLines = lines.slice(0, config()!.preference!.limit!.MaxSubject); // Keep the first 10 lines
    const newSubject = newLines.join('\n');
    await storage.setItem(`${BBSKEY}/SUBJECT.TXT`, newSubject);
}
export async function getSubjecttxt_file(BBSKEY:string,):Promise<string> {
    const storage = createStorage(drives);
    const SUBTXT = await storage.getItem(`${BBSKEY}/SUBJECT.TXT`);
    return String(SUBTXT);
}
export async function getSubject_file(BBSKEY:string,):Promise<getSubjectReturn> {
    const storage = createStorage(drives);
    const SUBTXT = await storage.getItem(`${BBSKEY}/SUBJECT.TXT`);
    const HASSUB = await storage.hasItem(`${BBSKEY}/SUBJECT.TXT`);
    if (!HASSUB) {
        return {'data':{'a':["a","a"]},'has':HASSUB};
    }
    return {'data':subjectpaser(String(SUBTXT)),'has':HASSUB};
}
export async function NewThread_file(BBSKEY:string,{ name, mail, message, date, title, id }: NewThreadParams):Promise<postReturn> {
    const storage = createStorage(drives);
    await storage.setItem(`${BBSKEY}/dat/${id}.dat`, `${name}<>${mail}<>${date}<>${message}<>${title}`);
    await addSubject_file(BBSKEY,date, title,id);
    return { 'sc': true, 'redirect': `${BBSKEY}/${id}` };
}

export async function postThread_file(BBSKEY:string,{ name, mail, message, date, id }: PostThreadParams):Promise<postReturn> {
    const storage = createStorage(drives);
    const THDATTXT = await storage.getItem(`${BBSKEY}/dat/${id}.dat`);
    await storage.setItem(`${BBSKEY}/dat/${id}.dat`, `${THDATTXT}\n${name}<>${mail}<>${date}<>${message}`);
    return {'sc':true,'redirect':`${BBSKEY}/${id}`};
}

export async function getThread_file(BBSKEY:string,id: string):Promise<getThreadReturn> {
    const storage = createStorage(drives);
    const dat = await storage.getItem(`${BBSKEY}/dat/${id}.dat`);
    const hasdat=  await storage.hasItem(`${BBSKEY}/dat/${id}.dat`);
    return {'data':JSON.parse(datpaser(String(dat))),has:hasdat};
}
export async function getdat_file(BBSKEY:string,idextension: string):Promise<string> {
    const storage = createStorage(drives);
    const dat = await storage.getItem(`${BBSKEY}/dat/${idextension}.dat`);
    return String(dat)
}