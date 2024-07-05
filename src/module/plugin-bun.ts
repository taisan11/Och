import {readdir} from 'node:fs/promises'
import {join,resolve} from 'node:path'

/**
 * @@fileoverview plugin(bun)
 * @description pluginの読み込み、管理、実行を行う
 * @link https://github.com/PrefKarafuto/ex0ch/blob/main/test/module/plugin.pl
 */
/**
 *  @description pluginのパス一覧 
 */
/**
 * @description plugin情報の読み込み
 * @param string path - pluginのパス
 * @returns {object} plugin情報
 */
export async function init(): Promise<string[]> {
    const paths: string[] = [];
    //@ts-ignore
    const path = resolve(import.meta.url, '../plugin');
    const files = await readdir(path,{});
    for (const file of files) {
        const filePath = join(path,file);
        paths.push(filePath);
    }
    return paths;
}