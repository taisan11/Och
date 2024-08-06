import { config } from "./config";

export async function exic(type: number, data:{name:string,mail:string,message:string}): Promise<{code:number,data:{name:string,mail:string,message:string}}> {
    // return {code:10,data}
    const plugins = config().preference.site.plugins;
    if (!plugins) {
        return {code:11,data}
    }
    let result = {code:0,data}
    config().preference.site.plugins!.forEach(plugin => {
        if (plugin.PluginInfo().type.includes(type)) {
            const a = plugin.main(type, result.data);
            if (a.code !== 200) {
                result = a;
            }
        }
    });
    return result;
}

type PluginInfo = {
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
};

type main = (type: number, data: { name: string, mail: string, message: string }) => { code: number, data: { name: string, mail: string, message: string } };

export type Plugin = {
    PluginInfo: () => PluginInfo,
    main: main
};