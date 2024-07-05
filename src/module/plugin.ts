//@ts-ignore
import { init } from "./plugin-bun" with { type: 'macro' };

// const paths:string[] = await init();

export async function exic(type: number, data:{name:string,mail:string,message:string}): Promise<{code:number,data:{name:string,mail:string,message:string}}> {
    return {code:10,data}
    const result: any[] = [];
    //@ts-ignore
    for (const path of paths) {
        const plugin = await import(path);
        if (plugin.type.includes(type)) {
            result.push(plugin);
        }
    }
    let resultData: { code: number, data: { name: string, mail: string, message: string } } | null = null;
    for (const plugin of result) {
        const module = await import(plugin.path);
        const pluginResult = await module.main(type,{ data });
        //@ts-ignore
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