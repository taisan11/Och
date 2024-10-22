# Drizzle Driverを利用する。
## Drizzle Driverとは
Drizzle Driverを使用するとDBを利用して保存したりできます。
## Step①.drizzle.config.tsの編集。
初期状態だとsqlite.dbファイルが作成されます。
D1で使用したり、Trusoで使用する場合は頑張って編集してください。
## Step②.DBを生成。
```bash
bun run ./script/dbgen.ts
```
を実行すると
```bash
bun x drizzle-kit generate
```
されて、初期データが生成されます。
初期データがいらない場合は`./script/dbgen.ts`を見ながら頑張ってください。
## Step③.configをいじる。
`data/system.config.ts`をいじります。ない場合は作ってください。
では中身です。
```ts system.config.ts
import { Config } from "../src/module/config";
import {drizzle} from "drizzle-orm/bun-sqlite"
import { Database } from "bun:sqlite";
import { drizzle_db_driver } from "../src/module/storage/drizzle";

const sqlite = new Database("sqlite.db");

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
            // これが重要。
            driver:drizzle_db_driver(drizzle(new Database("sqlite.db"))),
            plugins:[]
        },
    }
}

export default config
```
詳しく解説すると`drizzle_db_driver()`という関数の中にdrizzle ormから`drizzle()`を渡してあげます。
`drizzle()`によって、BunやD1で使えます。例ではBunを使ってます。
詳しくは[公式ドキュメント](https://orm.drizzle.team/docs/connect-overview)を見てください。