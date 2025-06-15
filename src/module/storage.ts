import { config } from "./config";

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
export interface getSubjectReturn {
    has: boolean;
    data: { [key: string]: [string, string] };
};
export interface postReturn {
    sc:boolean,
    redirect:string
}
export interface driver {
    addIta?: (BBSKEY: string) => Promise<void>;
    addSubject: (BBSKEY:string,postnum: number, title: string,id: string) => Promise<void>;
    DeleteOldSubject: (BBSKEY: string) => Promise<void>;
    getSubjecttxt: (BBSKEY: string) => Promise<string>;
    getSubject: (BBSKEY: string) => Promise<getSubjectReturn>;
    NewThread: (BBSKEY: string, { name, mail, message, date, title, id }: NewThreadParams) => Promise<postReturn>;
    postThread: (BBSKEY: string, { name, mail, message, date, id }: PostThreadParams) => Promise<postReturn>;
    getThread: (BBSKEY: string, id: string) => Promise<getThreadReturn>;
    getdat: (BBSKEY: string, idextension: string) => Promise<string>;
    init: () => Promise<string>;
}

const driver = config().then((config) => {return config.preference.site.driver});

// export async function addSubject(BBSKEY:string,date: string, title: string,id: string): Promise<void>{
//     return driver.then((driver) => {return driver.addSubject(BBSKEY)})
// }

//ToDo:
export async function addIta(BBSKEY:string): Promise<void>{
    return driver.then((driver) => {return driver.addIta!(BBSKEY)})
}

export async function DeleteOldSubject(BBSKEY:string,): Promise<void>{
    return driver.then((driver) => {return driver.DeleteOldSubject(BBSKEY)})
}
export async function getSubjecttxt(BBSKEY:string,): Promise<string>{
    return driver.then((driver) => {return driver.getSubjecttxt(BBSKEY)})
}
export async function getSubject(BBSKEY:string,): Promise<getSubjectReturn>{
    return driver.then((driver) => {return driver.getSubject(BBSKEY)})
}
export async function NewThread(BBSKEY:string,{ name, mail, message, date, title, id }: NewThreadParams):Promise<postReturn> {
    return driver.then((driver) => {return driver.NewThread(BBSKEY,{ name, mail, message, date, title, id })})
}
export async function postThread(BBSKEY:string,{ name, mail, message, date, id }: PostThreadParams):Promise<postReturn> {
    return driver.then((driver) => {return driver.postThread(BBSKEY,{ name, mail, message, date, id })})
}

export async function getThread(BBSKEY:string,id: string):Promise<getThreadReturn> {
    return driver.then((driver) => {return driver.getThread(BBSKEY,id)})
}
export async function getdat(BBSKEY:string,idextension: string):Promise<string> {
    return driver.then((driver) => {return driver.getdat(BBSKEY,idextension)})
}
/**
 * @description 仮実装 init admin
 */
export async function init():Promise<string> {
    return driver.then((driver) => {return driver.init()})
}