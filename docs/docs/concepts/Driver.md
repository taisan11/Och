# Driver
Driverとは複数の保存方法を提供するための物です。Driverはランタイム間との差異をなくすための目的で作られました。
Driverはconfigファイルに入れてください。
公式のDriverは以下の通りです。
::: info
公式Driverは/src/module/storageの下にあります。
:::
## unstorage_driver
unstorage_driverはunstorageを使用して、データを保存するためのDriverです。
unstorageはランタイムに依存しない複数のunstorage_driverを利用して様々なところで動かせるKey - Valueストレージです。
下記のように設定します。
```ts system.config.ts
import { unstorage_driver } from "../src/module/storage/unstrage-base";
import fs from "unstorage/drivers/fs"

const config:Config = {
    preference:{
        site:{
            name:'Och',
            use:'bun',
            websocket:true,
            API:true,
            driver:unstorage_driver(fs({base:"./data"})),
        },
    }
}

export default config
```
### UnStorage DenoKV driver
Ochが提供しているDenoKVでunstorageを利用するためのdriverです。
Ochのdriverと区別するためunstorageがついています。
設定方法は[こちら](/docs/deploy/deno.md)を参照してください。
## Drizzle Driver(SQlite)
Drizzle DriverはDrizzle ORMを利用してデータを保存するためのDriverです。
SQliteでの使用に対応しています。
設定方法、使い方は[こちら](/docs/deploy/drizzle_driver.md)を参照してください。