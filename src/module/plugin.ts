/**
 * @module plugin
 * @description pluginの読み込み、管理、実行を行う
 * @link https://github.com/PrefKarafuto/ex0ch/blob/main/test/module/plugin.pl
 */

/**
 *  @description pluginのパス一覧 
 */
const paths: string[] = [];
/**
 * @description plugin情報の読み込み
 * @param string path - pluginのパス
 * @returns {object} plugin情報
 */
export async function load(path: string): Promise<PluginInfo> {
    paths.push(path);
    const plugin = await import(path);
    return plugin.info;
}
export async function exic(type: number, data:{name:string,mail:string,message:string}): Promise<{code:number,data:{name:string,mail:string,message:string}}> {
    const result: any[] = [];
    for (const path of paths) {
        const plugin = await load(path);
        if (plugin.type.includes(type)) {
            result.push(plugin);
        }
    }
    let resultData: { code: number, data: { name: string, mail: string, message: string } } | null = null;
    for (const plugin of result) {
        const module = await import(plugin.path);
        const pluginResult = await module.main(type,{ data });
        if (resultData === null || pluginResult.code > resultData.code) {
            resultData = pluginResult;
        }
    }
    console.log(resultData!)
    return resultData!;
}
export type PluginInfo = {
    /**
     * @description プラグイン名
     * @example och_template_plugin
     */
    name: string,
    /**
     * @description プラグインの説明
     * @example サンプルプラグイン
     */
    description: string,
    /**
     * @description プラグインの種類(スレ立て:1, レス:2, read:4, index:8, 書き込み前処理:16)
     * @example [1,2]
     */
    type: number[],
    /**
    * @deprecated 
     */
    version?: string,
}