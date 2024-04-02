import { loadConfig } from "c12";
import type { ResolvedConfig, ConfigLayerMeta } from "c12";
import { resolve } from 'pathe'
import configa from '../../data/system.config'

export type Config = {
    caps: {
        [key:string]: {
            name: string;
            pw: string;
            fullname: string;
            description: string;
        };
    };
    user: {
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
        };
        limit: {
            MaxSubject: number;
            MaxRes: number;
            MaxAnchor: number;
            MaxErrorLog: number;
            HostLog: number;
            MaxUserWriteFailureLog: number;
        };
        other: {
            header: {
                text: string;
                link: string;
            };
            URL: {
                GazoToIMG: boolean;
                AuthLink: boolean;
                CookieDateExp: number;
            };
        };
        display: {
            PRtext: string;
            PRlink: string;
            kokuti: {
                inIndex: boolean;
                inOther: boolean;
            };
        };
        kisei: {
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
            }
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

export function config():Config {return configa}