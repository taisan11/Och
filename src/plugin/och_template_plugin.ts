/**
 * @name och_template_plugin
 * @author xxxxx
 * @description サンプルプラグイン
 * @since 20xx-xx-xx
 */

import { Plugin } from "../module/plugin";

export default function och_template_plugin(): Plugin {
    return {
        PluginInfo: () => ({
            name: "och_template_plugin",
            description: "サンプルプラグイン",
            type: [1, 2],
        }),
        main: (type, data) => {
            return {
                code: 200,
                data: {
                    name: data.name,
                    mail: data.mail,
                    message: data.message,
                },
            };
        },
        ConfigList: {
            "aaa":{
                ConfigType:"string",
                default:"aaa",
                description:"aaa"
            }
        }
    };
}