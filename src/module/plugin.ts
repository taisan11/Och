/**
 * @module plugin
 * @description pluginの読み込み、管理、実行を行う
 * @link https://github.com/PrefKarafuto/ex0ch/blob/main/test/module/plugin.pl
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
export async function exic(type: number, data: any): Promise<any> {
    const result: any[] = [];
    for (const path of paths) {
        const plugin = await load(path);
        if (plugin.type.includes(type)) {
            result.push(path);
        }
    }
    await import(result[0]);
    return result;
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