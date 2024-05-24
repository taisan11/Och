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
const driver = config().preference.site.driver;
export async function addSubject(BBSKEY:string,date: string, title: string,id: string) {
    if (driver === "unstorage") {
        return await addSubject_file(BBSKEY,date, title,id)
    }
}

export async function DeleteOldSubject(BBSKEY:string,) {
    if (driver === "unstorage") {
        return await DeleteOldSubject_file(BBSKEY)
    }
}
export async function getSubjecttxt(BBSKEY:string,) {
    if (driver === "unstorage") {
        return await getSubjecttxt_file(BBSKEY)
    }
}
export async function getSubject(BBSKEY:string,) {
    if (driver === "unstorage") {
        return await getSubject_file(BBSKEY)
    }
}

export async function NewThread(BBSKEY:string,{ name, mail, message, date, title, id }: NewThreadParams) {
    if (driver === "unstorage") {
        return await NewThread_file(BBSKEY,{ name, mail, message, date, title, id })
    }
}

export async function postThread(BBSKEY:string,{ name, mail, message, date, id }: PostThreadParams) {
    if (driver === "unstorage") {
        return await postThread_file(BBSKEY,{ name, mail, message, date, id })
    }
}

export async function getThread(BBSKEY:string,id: string) {
    if (driver === "unstorage") {
        return await getThread_file(BBSKEY,id)
    }
}
export async function getdat(BBSKEY:string,idextension: string) {
    if (driver === "unstorage") {
        return await getdat_file(BBSKEY,idextension)
    }
}