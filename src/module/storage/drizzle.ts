import { createStorage } from "unstorage";
import { config } from "../config";
import { subjectpaser,datpaser } from "../pase";
import { NewThreadParams,PostThreadParams, driver, getSubjectReturn, getThreadReturn, postReturn } from "../storage";
import * as schema from "./schema/sqlite"
import { drizzle } from 'drizzle-orm/bun-sqlite';
import { BaseSQLiteDatabase } from "drizzle-orm/sqlite-core";
import { and, eq,desc } from "drizzle-orm";

//例えばdrizzle()をある関数の引数として受け入れたいときどのような型を指定すればいいでしょうか?
export function drizzle_db_driver(db:BaseSQLiteDatabase<'sync', void, Record<string, never>>):driver{
    async function addSubject_drizzle(BBSKEY:string,postnum: number, title: string,id: string):Promise<void> {
        await db.insert(schema.threds).values({id:id,BBSKEY,postnum:postnum,title:title,createAt:new Date()});
    }
    async function postNumEdit_drizzle(BBSKEY:string,id: string):Promise<void> {
        const THD = await db.select().from(schema.threds).where(and(eq(schema.threds.id,id),eq(schema.threds.BBSKEY,BBSKEY)));
        await db.update(schema.threds).set({postnum:THD[0].postnum+1}).where(and(eq(schema.threds.id,id),eq(schema.threds.BBSKEY,BBSKEY))).execute();
    }
    async function DeleteOldSubject_drizzle(BBSKEY:string,):Promise<void> {
        // Do nothing
    }
    async function getSubjecttxt_drizzle(BBSKEY:string,):Promise<string> {
        const THD = await db.select().from(schema.threds).where(eq(schema.threds.BBSKEY,BBSKEY)).orderBy(schema.threds.createAt).execute();
        return THD.map((v)=>`${v.id}.dat<>${v.title} (${v.postnum})`).join("\n");
    }
    async function getSubject_drizzle(BBSKEY:string,):Promise<getSubjectReturn> {
        const THD = await db.select().from(schema.threds).where(eq(schema.threds.BBSKEY,BBSKEY)).orderBy(schema.threds.createAt).execute();
        return {'data':THD.reduce((acc, v) => ({ ...acc, [v.id]: [v.title, String(v.postnum)] }), {}), has:true};
    }
    async function NewThread_drizzle(BBSKEY:string,{ name, mail, message, date, title, id }: NewThreadParams):Promise<postReturn> {
        await db.insert(schema.threds).values({id,BBSKEY,postnum:1,title,createAt:new Date()});
        await db.insert(schema.posts).values({id:Math.random().toString(32).substring(2),BBSKEY,ThID:id,ResNum:1,name,mail,date,message,createAt:new Date()});
        await addSubject_drizzle(BBSKEY,1, title,id);
        return { 'sc': true, 'redirect': `${BBSKEY}/${id}` };
    }
    
    async function postThread_drizzle(BBSKEY:string,{ name, mail, message, date, id }: PostThreadParams):Promise<postReturn> {
        const nupost = await db.select().from(schema.posts).where(and(eq(schema.posts.ThID,id),eq(schema.posts.BBSKEY,BBSKEY))).orderBy(desc(schema.posts.ResNum)).execute();
        await db.insert(schema.posts).values({id:Math.random().toString(32).substring(2),BBSKEY,ThID:id,ResNum:nupost[0].ResNum+1,name,mail,date,message,createAt:new Date()});
        await postNumEdit_drizzle(BBSKEY,id);
        return {'sc':true,'redirect':`${BBSKEY}/${id}`};
    }
    
    async function getThread_drizzle(BBSKEY:string,id: string):Promise<getThreadReturn> {
        const aaa = await db.select().from(schema.threds).where(and(eq(schema.threds.id,id),eq(schema.threds.BBSKEY,BBSKEY))).execute();
        const post = await db.select().from(schema.posts).where(and(eq(schema.posts.ThID,id),eq(schema.posts.BBSKEY,BBSKEY))).orderBy(schema.posts.createAt).execute();
        return {'data':{title:aaa[0].title,post:post.map((v)=>({postid:String(v.ResNum),name:v.name,mail:v.mail ?? '',date:v.date,message:v.message}))},has:true};
    }
    async function getdat_drizzle(BBSKEY:string,idextension: string):Promise<string> {
        // Do nothing(WIP)
        return ""
    }
    
    /**
     * @description 仮実装 init admin
     */
    async function init_drizzle():Promise<string> {
        await db.delete(schema.threds).execute();
        await db.delete(schema.posts).execute();
        await db.delete(schema.Ita).execute();
        await db.insert(schema.Ita).values({id:'test',title:'初期化!!'}).execute();
        await addSubject_drizzle('test',1,'初期化!!','1111111111');
        await db.insert(schema.posts).values({id:Math.random().toString(32).substring(2),BBSKEY:'test',ThID:'1111111111',ResNum:1,name:'admin',mail:'',date:new Date().toISOString(),message:'init!!',createAt:new Date()});
        return String('init!!')
    }

    return {
        addSubject: (BBSKEY:string,postnum: number, title: string,id: string) => addSubject_drizzle(BBSKEY,postnum, title,id),
        DeleteOldSubject: (BBSKEY: string) => DeleteOldSubject_drizzle(BBSKEY),
        getSubjecttxt: (BBSKEY: string) => getSubjecttxt_drizzle(BBSKEY),
        getSubject: (BBSKEY: string) => getSubject_drizzle(BBSKEY),
        NewThread: (BBSKEY: string, { name, mail, message, date, title, id }: NewThreadParams) => NewThread_drizzle(BBSKEY,{ name, mail, message, date, title, id }),
        postThread: (BBSKEY: string, { name, mail, message, date, id }: PostThreadParams) => postThread_drizzle(BBSKEY,{ name, mail, message, date, id }),
        getThread: (BBSKEY: string, id: string) => getThread_drizzle(BBSKEY,id),
        getdat: (BBSKEY: string, idextension: string) => getdat_drizzle(BBSKEY,idextension),
        init: () => init_drizzle(),
    }
}