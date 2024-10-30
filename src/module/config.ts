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
    /**
     * サイトの設定
     */
    preference: {
        site: {
            name: string;
            use?: RuntimeName|"other",
            websocket: boolean;
            API:boolean;
            driver:driver
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
    };
};

import configa from "../../data/system.config";
import { RuntimeName, runtimeInfo } from "std-env";
import { Plugin } from "./plugin";
import { driver } from "./storage";
export async function config():Promise<Config>{
    configa.preference.site.use = runtimeInfo?.name ?? configa.preference.site.use ?? "other";
    if (configa.preference.limit) {
        configa.preference.limit.MaxSubject = configa.preference.limit.MaxSubject ?? 20;
    }

    return configa;
}