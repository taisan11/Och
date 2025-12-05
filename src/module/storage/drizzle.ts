import { NewThreadParams,PostThreadParams, driver, getSubjectReturn, getThreadReturn, postReturn } from "../storage";
import * as schema from "./schema/sqlite"
import { BaseSQLiteDatabase } from "drizzle-orm/sqlite-core";
import { and, eq,desc,gte,lte,between } from "drizzle-orm";

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
    
    /**
     * ResNum記法でスレッドの範囲指定取得
     * @param resNum - "ln" (最後のn個) または "n-n" (範囲指定) 形式
     */
    async function getThreadRange_drizzle(BBSKEY:string,id: string, resNum: string):Promise<getThreadReturn> {
        const aaa = await db.select().from(schema.threds).where(and(eq(schema.threds.id,id),eq(schema.threds.BBSKEY,BBSKEY))).execute();
        if (!aaa.length) {
            return {'data':{title:'',post:[]},has:false};
        }
        
        // 全レス取得してソート
        const allPosts = await db.select().from(schema.posts)
            .where(and(eq(schema.posts.ThID,id),eq(schema.posts.BBSKEY,BBSKEY)))
            .orderBy(schema.posts.ResNum).execute();
        
        let filteredPosts = allPosts;
        
        // ResNum記法のパース
        if (resNum.startsWith('l')) {
            // ln形式: 最後のn個
            const n = parseInt(resNum.substring(1));
            if (!isNaN(n) && n > 0) {
                filteredPosts = allPosts.slice(-n);
            }
        } else if (resNum.includes('-')) {
            // n-n形式: 範囲指定
            const [startStr, endStr] = resNum.split('-');
            const start = parseInt(startStr);
            const end = parseInt(endStr);
            if (!isNaN(start) && !isNaN(end) && start > 0 && end >= start) {
                filteredPosts = allPosts.filter(v => v.ResNum >= start && v.ResNum <= end);
            }
        } else {
            // 数字単体: 特定のレス番号1つ
            const resNumber = parseInt(resNum);
            if (!isNaN(resNumber) && resNumber > 0) {
                filteredPosts = allPosts.filter(v => v.ResNum === resNumber);
            }
        }
        
        return {
            'data':{
                title:aaa[0].title,
                post:filteredPosts.map((v)=>({
                    postid:String(v.ResNum),
                    name:v.name,
                    mail:v.mail ?? '',
                    date:v.date,
                    message:v.message
                }))
            },
            has:true
        };
    }
    
    async function getdat_drizzle(BBSKEY:string,idextension: string):Promise<string> {
        const post = await db.select().from(schema.posts).where(and(eq(schema.posts.ThID,idextension),eq(schema.posts.BBSKEY,BBSKEY))).orderBy(schema.posts.ResNum).execute();
        if(post.length == 0) return '';
        const th = await db.select().from(schema.threds).where(and(eq(schema.threds.id,idextension),eq(schema.threds.BBSKEY,BBSKEY))).execute();
        const title = th[0]?.title ?? '';
        return post.map((v, i) =>
            i == 0
                ? `${v.name}<>${v.mail ?? ''}<>${v.date}<>${v.message}<>${title}`
                : `${v.name}<>${v.mail ?? ''}<>${v.date}<>${v.message}`
        ).join('\n');
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
        getThreadRange: (BBSKEY: string, id: string, resNum: string) => getThreadRange_drizzle(BBSKEY,id,resNum),
        getdat: (BBSKEY: string, idextension: string) => getdat_drizzle(BBSKEY,idextension),
        init: () => init_drizzle(),
    }
}