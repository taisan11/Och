# Deno Deployへのデプロイ方法
このリポジトリをDeno Deployに上げるだけなんですが、いくつか注意点があります。
### 設定ファイルを作成する。
`data/system.config.ts`を作成します。
中身は`export default config:Config`といった感じでConfig型を返します。
じゃあConfig型は`import { Config } from "../src/module/config";`でインポートできます。
Deno Deployに上げるためのConfigファイルは以下のような感じになります。
```ts
import deno_kv_adapter from "unstorage/drivers/deno-kv"
import { Config } from "../src/module/config";
import { unstorage_driver } from "../src/module/storage/unstrage-base";

const config:Config = {
    caps:{
        admin:{
            name:'Admin',
            pw:'Admin',
            fullname:'Administrator',
            description:'Administrator',
        }
    },
    preference:{
        site:{
            name:'Och',
            use:'bun',
            websocket:true,
            API:true,
            // Deno KVアダプターにデータを保存します。
            driver:unstorage_driver(deno_kv_adapter({})),
            //Pluginは任意
            plugins:[och_test_plugin()]
        },
    }
}

export default config
```
### 環境変数。
管理画面で初期化するためにパスワードを設定する必要があります。
Deno Deployの環境変数の設定メニューで、`psw="パスワード"`という感じにやってください。
そしたら`***.deno.dev/admin/init`にアクセスして、パスワードを入力したら完了です。