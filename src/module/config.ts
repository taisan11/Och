import { drizzle } from "drizzle-orm/bun-sqlite";

export type Config = {
    /**
     * キャップの設定
     */
    caps?: {
        [key:string]: {
            name: string;
            pw: string;
            fullname: string;
            description: string;
        };
    };
    // user?: {
    //     [key:string]: {
    //         name: string;
    //         password: string;
    //         fullname: string;
    //         admin: boolean;
    //     };
    // };
    /**
     * サイトの設定
     */
    preference: {
        site: {
            name: string;
            use?: RuntimeName|"other",
            websocket: boolean;
            API:boolean;
            driver:"unstorage"|"db"
            UnstorageOptions?:Driver
            drizzle:ReturnType<typeof drizzle>;
            plugins?: Plugin[];
        };
        limit?: {
            MaxSubject: number;
            MaxRes: number;
            MaxAnchor: number;
            MaxErrorLog: number;
            HostLog: number;
            MaxUserWriteFailureLog: number;
        };
        other?: {
            header: {
                text: string;
                link: string;
            };
            URL: {
                GazoToIMG: boolean;
                AuthLink: boolean;
                CookieDateExp: number;
            };
            saveformat: string;
        };
        // display?: {
        //     PRtext: string;
        //     PRlink: string;
        //     kokuti: {
        //         inIndex: boolean;
        //         inOther: boolean;
        //     };
        // };
        // kisei?: {
        //     "2jyuu": boolean;
        //     ShortPostRegulationSec: number;
        //     sinTorip: boolean;
        // };
    };
};

import configa from "../../data/system.config";
import { RuntimeName, runtimeInfo } from "std-env";
import { Driver } from "unstorage";
import { Plugin } from "./plugin";
export function config():Config{
    configa.preference.site.use = runtimeInfo?.name ||"other"|| configa.preference.site.use;
    if (configa.preference.limit) {
        configa.preference.limit.MaxSubject = configa.preference.limit.MaxSubject || 20;
    }

    return configa
}