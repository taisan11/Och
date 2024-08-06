/**
 * @name och_test_plugin
 * @author taisan11
 * @description テストプラグイン
 * @since 2024-07-03
 */

import { Plugin } from "../module/plugin";

export default function och_test_plugin(): Plugin {
    return {
        PluginInfo: () => ({
            name: "och_test_plugin",
            description: "テスト用プラグイン",
            type: [1, 2],
        }),
        main: (type, data) => {
            if (type === 2) {
                console.log(data)
            }
            return {
                code: 200,
                data: {
                    name: data.name,
                    mail: data.mail,
                    message: data.message,
                },
            };
        },
    };
}