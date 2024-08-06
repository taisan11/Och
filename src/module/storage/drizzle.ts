import { and, eq } from "drizzle-orm";
import { config } from "../config";
import { subjectpaser,datpaser } from "../pase";
import { NewThreadParams,PostThreadParams, getSubjectReturn, getThreadReturn, postReturn, postThread } from "../storage";
import { posts, threds } from "./schema/sqlite";
import {nanoid} from 'nanoid'

const drizzleInstance = config().preference.site.drizzle;
const db = drizzleInstance

export async function addSubject_db(BBSKEY:string,postnum: number, title: string,id: string):Promise<void> {
    const now = new Date().toISOString()
    // UnixTime
    const nowUnix = Math.floor(new Date(now).getTime() / 1000)
    db.insert(threds).values({
        id: id,
        ItaID: BBSKEY,
        ThTitle: title,
        PostNumNow: postnum,
        createdAt: nowUnix
    })
}
async function postNumEdit(BBSKEY:string,id: string):Promise<string> {
    const thread = await db.select().from(threds).where(and(eq(threds.id,id),eq(threds.ItaID,BBSKEY))).get()
    if(thread){
        db.update(threds).set({
            PostNumNow:thread.PostNumNow+1
        }).where(and(eq(threds.id,id),eq(threds.ItaID,BBSKEY)))
    }
    return thread!.PostNumNow+1
}
export async function DeleteOldSubject_db(BBSKEY:string,):Promise<void> {
    return
}
export async function getSubjecttxt_db(BBSKEY:string,):Promise<string> {
    const threads = await db.select().from(threds).where(eq(threds.ItaID,BBSKEY))
    return threads.map((thread)=>{
        return `${thread.id}.dat<>${thread.ThTitle} (${thread.PostNumNow})`
    }).join('\n')
}
export async function getSubject_db(BBSKEY:string,):Promise<getSubjectReturn> {
    const threads = await db.select().from(threds).where(eq(threds.ItaID,BBSKEY))
    const result: { [key: string]: [string, string] } = {};
    threads.map((threads=>{
        result[threads.id]=[threads.ThTitle,threads.PostNumNow]
    }))
    return {'data':result,has:true}
}
export async function NewThread_db(BBSKEY:string,{ name, mail, message, date, title, id }: NewThreadParams):Promise<postReturn> {
    const now = new Date().toISOString()
    // UnixTime
    const nowUnix = Math.floor(new Date(now).getTime() / 1000).toString()
    addSubject_db(BBSKEY,1, title,id);
    db.insert(posts).values({
        name: name,
        date: date,
        id: id+BBSKEY+"1"+nanoid(10),
        ItaID: BBSKEY,
        ThID: id,
        postNum: 1,
        mail: mail,
        MESSAGE: message,
        createAt: nowUnix
    })
    return { 'sc': true, 'redirect': `${BBSKEY}/${id}` };
}
export async function postThread_db(BBSKEY:string,{ name, mail, message, date, id }: PostThreadParams):Promise<postReturn> {
    const now = new Date().toISOString()
    // UnixTime
    const nowUnix = Math.floor(new Date(now).getTime() / 1000)
    const thread = await db.select().from(threds).where(and(eq(threds.id,id),eq(threds.ItaID,BBSKEY)))
    const postnum = await postNumEdit(BBSKEY,id)
    if(thread){
        db.insert(posts).values({
            name: name,
            date: date,
            id: id+BBSKEY+postnum+nanoid(10),
            ItaID: BBSKEY,
            ThID: id,
            postNum: postnum,
            mail: mail,
            MESSAGE: message,
            createAt: nowUnix
        })
    }
    return {'sc':true,'redirect':`${BBSKEY}/${id}`};
}
export async function getThread_db(BBSKEY:string,id: string):Promise<getThreadReturn> {
    const thread = await db.select().from(threds).where(and(eq(threds.id,id),eq(threds.ItaID,BBSKEY))).get()
    if(thread){
        const postss = await db.select().from(posts).where(and(eq(posts.ThID,id),eq(posts.ItaID,BBSKEY)))
        const result:getThreadReturn = {
            has:true,
            data:{
                title:thread.ThTitle,
                post:postss.map((post)=>{
                    return {
                        postid:post.id,
                        name:post.name,
                        mail:post.mail,
                        date:post.date,
                        message:post.MESSAGE
                    }
                })
            }
        };
        return result
    }
    return {
        has:false,
        data:{
            title:"",
            post:[]
        }
    }
}
export async function getdat_db(BBSKEY:string,idextension: string):Promise<string> {
    const post = await db.select().from(posts).where(and(eq(posts.id,idextension),eq(posts.ItaID,BBSKEY)))
    const title = await db.select().from(threds).where(and(eq(threds.id,post[0].ThID),eq(threds.ItaID,BBSKEY)))
    let a = ""
    post.map((post)=>{
        //最初の一回だけ分岐
        if(post.postNum===1){
            a + `${post.name}<>${post.mail}<>${post.date}<>${post.MESSAGE}<>${title[0].ThTitle}`
        }
        a + `${post.name}<>${post.mail}<>${post.date}<>${post.MESSAGE}`
    })
    return a
}