/**
 * @name och_test_plugin
 * @author taisan11
 * @description テストプラグイン
 * @since 2024-07-03
 */

import { PluginInfo } from "../module/plugin";

export const info:PluginInfo = {
    name: 'och_test_plugin',
    description: 'サンプルプラグイン',
    type: [1,2],
}

/**
 * @description プラグインのメイン処理
 * @param {object} - プラグインに渡されるデータ
 * @returns {} - プラグインの処理結果
 */
export function main(type: number, data:{name:string,mail:string,message:string}):{code:number,data:{name:string,mail:string,message:string}} {
    console.log("running och_test_plugin")
    if (type === 1) {
        return {code:0, data}
    } else
    if (type === 2) {
        let {name,mail,message} = data
        name = name + 'さん'
        return {code:0, data:{name,mail,message}}
    }else {
        return {code:1, data}
    }
}