/**
 * @name och_template_plugin
 * @author xxxxx
 * @description サンプルプラグイン
 * @since 20xx-xx-xx
 */

import { PluginInfo } from "../module/plugin";

export const info:PluginInfo = {
    name: 'och_template_plugin',
    description: 'サンプルプラグイン',
    type: [1,2],
}

/**
 * @description プラグインのメイン処理
 * @param {object} - プラグインに渡されるデータ
 * @returns {} - プラグインの処理結果
 */
export function main(type: number, data:{name:string,mail:string,message:string}):{code:number,data:{name:string,mail:string,message:string}} {
    return {code:0, data}
}