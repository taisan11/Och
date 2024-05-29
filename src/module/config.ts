import fsDriver, { FSStorageOptions } from "unstorage/drivers/fs"

export type Config = {
    caps?: {
        [key:string]: {
            name: string;
            pw: string;
            fullname: string;
            description: string;
        };
    };
    user?: {
        [key:string]: {
            name: string;
            password: string;
            fullname: string;
            admin: boolean;
        };
    };
    preference: {
        site: {
            InstDIR: string;
            KejibanConfigDIR: string;
            name: string;
            use?: RuntimeName|"other",
            websocket: boolean;
            API:boolean;
            driver:"unstorage"|"db"
            UnstorageOptions?:Driver
            dbOptin?:"sqlite"|"mysql"|"posgresql"
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
        display?: {
            PRtext: string;
            PRlink: string;
            kokuti: {
                inIndex: boolean;
                inOther: boolean;
            };
        };
        kisei?: {
            "2jyuu": boolean;
            ShortPostRegulationSec: number;
            sinTorip: boolean;
        };
    };
};

export const defaults:Config = {
    'caps':{
        'admin':{
            'name':'Admin',
            'pw':'Admin',
            'fullname':'Administrator',
            'description':'Administrator',
        }
    },
    'user':{
        'admin':{
            'name':'admin',
            'password':'admin',
            'fullname':'Administrator',
            'admin':true
        }
    },
    'preference':{
        'site':{
            'InstDIR':'/test',
            'KejibanConfigDIR':'..',
            'name':'Och',
            'use':'bun',
            'websocket':true,
            'API':true,
            'driver':"unstorage",
            'UnstorageOptions':fsDriver({base:"./data"})
        },
        'limit':{
            'MaxSubject':500,
            'MaxRes':1000,
            'MaxAnchor':10,
            'MaxErrorLog':500,
            'HostLog':500,
            'MaxUserWriteFailureLog':500,
        },
        'other':{
            'header':{
                'text':'<small>■<b>レス検索</b>■</small>',
                'link':'../test/search.cgi'
            },
            'URL':{
                'GazoToIMG':false,
                'AuthLink':true,
                'CookieDateExp':30
            },
            'saveformat':"file"
        },
        'display':{
            'PRtext':'Och~おーちゃんねる~',
            'PRlink':'https://github.com/taisan11/Och',
            'kokuti':{
                'inIndex':true,
                'inOther':false
            }
        },
        'kisei':{
            '2jyuu':true,
            'ShortPostRegulationSec':0,
            'sinTorip':true,
        }
    }
}
import configa from "../../data/system.config";
import { RuntimeName, runtimeInfo } from "std-env";
import { Driver } from "unstorage";
export function config():Config{
    configa.preference.site.use = runtimeInfo?.name ||"other"|| configa.preference.site.use;
    if (configa.preference.limit) {
        configa.preference.limit.MaxSubject = configa.preference.limit.MaxSubject || 20;
    }

    return configa
}