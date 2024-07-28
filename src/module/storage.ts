import { createStorage } from "unstorage";
import fsDriver from "unstorage/drivers/fs";
import { config } from "./config";
import { addSubject_file, DeleteOldSubject_file, getSubject_file, NewThread_file, postThread_file, getThread_file,getSubjecttxt_file,getdat_file } from "./storage/unstrage-base";
export const storage = createStorage({ driver: fsDriver({ base: "./data" }), });

export type Subject = {
    date: Date;
    title: string;
};
export type NewThreadParams = {
    name: string;
    mail: string;
    message: string;
    date: string;
    title: string;
    id: string;
};
export type PostThreadParams = {
    name: string;
    mail: string;
    message: string;
    date: string;
    id: string;
};
export type getThreadReturn = {
    has: boolean;
    data: {
        title: string;
        post: {
            postid: string;
            name: string;
            mail: string;
            date: string;
            message: string;
        }[];
    }
};
export type getSubjectReturn = {
    has: boolean;
    data: { [key: string]: [string, string] };
};
export type postReturn = {
    sc:boolean,
    redirect:string
}
const driver = config().preference.site.driver;
// export async function addSubject(BBSKEY:string,date: string, title: string,id: string): Promise<void>{
//     if (driver === "unstorage") {
//         return await addSubject_file(BBSKEY,date, title,id)
//     }
// }

export async function DeleteOldSubject(BBSKEY:string,): Promise<void>{
    if (driver === "unstorage") {
        return await DeleteOldSubject_file(BBSKEY)
    }
}
export async function getSubjecttxt(BBSKEY:string,): Promise<string>{
    if (driver === "unstorage") {
        return await getSubjecttxt_file(BBSKEY)
    }
    return ""
}
export async function getSubject(BBSKEY:string,): Promise<getSubjectReturn>{
    if (driver === "unstorage") {
        return await getSubject_file(BBSKEY)
    }
    return {has:false,data:{}}
}
export async function NewThread(BBSKEY:string,{ name, mail, message, date, title, id }: NewThreadParams):Promise<postReturn> {
    if (driver === "unstorage") {
        return await NewThread_file(BBSKEY,{ name, mail, message, date, title, id })
    }
    return {sc:false,redirect:"/test"}
}
export async function postThread(BBSKEY:string,{ name, mail, message, date, id }: PostThreadParams):Promise<postReturn> {
    if (driver === "unstorage") {
        return await postThread_file(BBSKEY,{ name, mail, message, date, id })
    }
    return {sc:false,redirect:"/test"}
}

export async function getThread(BBSKEY:string,id: string):Promise<getThreadReturn> {
    if (driver === "unstorage") {
        return await getThread_file(BBSKEY,id)
    }
    return {data:{"title":"",post:[]},has:false}
}
export async function getdat(BBSKEY:string,idextension: string):Promise<string> {
    if (driver === "unstorage") {
        return await getdat_file(BBSKEY,idextension)
    }
    return ""
}