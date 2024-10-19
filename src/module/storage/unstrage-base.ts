import { createStorage } from "unstorage";
import { config } from "../config";
import { subjectpaser,datpaser } from "../pase";
import { NewThreadParams,PostThreadParams, driver, getSubjectReturn, getThreadReturn, postReturn } from "../storage";
import { Driver } from "unstorage";

export function unstorage_driver(UnstorageOptions:Driver):driver{
    const drives = {"driver":UnstorageOptions}
    async function addSubject_file(BBSKEY:string,postnum: number, title: string,id: string):Promise<void> {
        const storage = createStorage(drives);
        const SUBJECT = await storage.getItem(`${BBSKEY}/SUBJECT.TXT`);
        await storage.setItem(`${BBSKEY}/SUBJECT.TXT`, `${id}.dat<>${title} (${postnum})\n${SUBJECT}`);
    }
    async function postNumEdit(BBSKEY:string,id: string):Promise<void> {
        const storage = createStorage(drives);
        const SUBJECT = await storage.getItem(`${BBSKEY}/SUBJECT.TXT`);
        const lines = String(SUBJECT).split('\n');
        const newLines = lines.map((line) => {
            if (line.startsWith(`${id}.dat`)) {
                const [id, title] = line.split('<>');
                const [postnum] = title.match(/\((\d+)\)/) || ['0'];
                //(1) -> 1
                const newNum = postnum.replace(/\((\d+)\)/, '$1');
                //title (1) -> title (2)
                const newTitle =  title.replace(/\((\d+)\)/, `(${Number(newNum) + 1})`);
                return `${id}<>${newTitle}`;
            }
            return line;
        });
        const newSubject = newLines.join('\n');
        await storage.setItem(`${BBSKEY}/SUBJECT.TXT`, newSubject);
    }
    async function DeleteOldSubject_file(BBSKEY:string,):Promise<void> {
        const storage = createStorage(drives);
        const SUBJECT = await storage.getItem(`${BBSKEY}/SUBJECT.TXT`);
        const lines = String(SUBJECT).split('\n');
        const newLines = lines.slice(0, config()!.preference!.limit!.MaxSubject); // Keep the first 10 lines
        const newSubject = newLines.join('\n');
        await storage.setItem(`${BBSKEY}/SUBJECT.TXT`, newSubject);
    }
    async function getSubjecttxt_file(BBSKEY:string,):Promise<string> {
        const storage = createStorage(drives);
        const SUBTXT = await storage.getItem(`${BBSKEY}/SUBJECT.TXT`);
        return String(SUBTXT);
    }
    async function getSubject_file(BBSKEY:string,):Promise<getSubjectReturn> {
        const storage = createStorage(drives);
        const HASSUB = await storage.hasItem(`${BBSKEY}/SUBJECT.TXT`);
        if (!HASSUB) {
            return {'data':{'a':["a","a"]},'has':HASSUB};
        }
        const SUBTXT = await storage.getItem(`${BBSKEY}/SUBJECT.TXT`);
        return {'data':subjectpaser(String(SUBTXT)),'has':HASSUB};
    }
    async function NewThread_file(BBSKEY:string,{ name, mail, message, date, title, id }: NewThreadParams):Promise<postReturn> {
        const storage = createStorage(drives);
        await storage.setItem(`${BBSKEY}/dat/${id}.dat`, `${name}<>${mail}<>${date}<>${message}<>${title}`);
        await addSubject_file(BBSKEY,1, title,id);
        return { 'sc': true, 'redirect': `${BBSKEY}/${id}` };
    }
    
    async function postThread_file(BBSKEY:string,{ name, mail, message, date, id }: PostThreadParams):Promise<postReturn> {
        const storage = createStorage(drives);
        const THDATTXT = await storage.getItem(`${BBSKEY}/dat/${id}.dat`);
        await storage.setItem(`${BBSKEY}/dat/${id}.dat`, `${THDATTXT}\n${name}<>${mail}<>${date}<>${message}`);
        await postNumEdit(BBSKEY,id);
        return {'sc':true,'redirect':`${BBSKEY}/${id}`};
    }
    
    async function getThread_file(BBSKEY:string,id: string):Promise<getThreadReturn> {
        const storage = createStorage(drives);
        const dat = await storage.getItem(`${BBSKEY}/dat/${id}.dat`);
        const hasdat=  await storage.hasItem(`${BBSKEY}/dat/${id}.dat`);
        return {'data':datpaser(String(dat)),has:hasdat};
    }
    async function getdat_file(BBSKEY:string,idextension: string):Promise<string> {
        const storage = createStorage(drives);
        const dat = await storage.getItem(`${BBSKEY}/dat/${idextension}.dat`);
        return String(dat)
    }
    
    /**
     * @description 仮実装 init admin
     */
    async function init_file():Promise<string> {
        const storage = createStorage(drives);
        await storage.clear();
        await storage.setItem("/test/SUBJECT.TXT", '1.dat<>初期スレ (1)');
        console.log('TEST(subjectFile):',await storage.hasItem("/test/SUBJECT.TXT"))
        await storage.setItem("/test/dat/1.dat", 'カワイイ名無しさん<><>2022/09/08(木) 17:40:07.67 ID:000000000<>こんにちは!!<>初期スレ');
        console.log('TEST(datFile):',await storage.hasItem("/test/dat/1.dat"))
        return String('init!!')
    }

    return {
        addSubject: (BBSKEY:string,postnum: number, title: string,id: string) => addSubject_file(BBSKEY,postnum, title,id),
        DeleteOldSubject: (BBSKEY: string) => DeleteOldSubject_file(BBSKEY),
        getSubjecttxt: (BBSKEY: string) => getSubjecttxt_file(BBSKEY),
        getSubject: (BBSKEY: string) => getSubject_file(BBSKEY),
        NewThread: (BBSKEY: string, { name, mail, message, date, title, id }: NewThreadParams) => NewThread_file(BBSKEY,{ name, mail, message, date, title, id }),
        postThread: (BBSKEY: string, { name, mail, message, date, id }: PostThreadParams) => postThread_file(BBSKEY,{ name, mail, message, date, id }),
        getThread: (BBSKEY: string, id: string) => getThread_file(BBSKEY,id),
        getdat: (BBSKEY: string, idextension: string) => getdat_file(BBSKEY,idextension),
        init: () => init_file(),
    }
}