import {$} from 'bun'

import { migrate } from "drizzle-orm/bun-sqlite/migrator";

import { drizzle } from "drizzle-orm/bun-sqlite";
import { Database } from "bun:sqlite";
// import { db } from "../src/module/storage/drizzle";
import * as schema from "../src/module/storage/schema/sqlite";

console.log(`Seeding complete.`);
//@ts-ignore
await $`rm -rf ./drizzle/ sqlite.db`
//@ts-ignore
await $`bun x drizzle-kit generate:sqlite --schema ./src/module/storage/schema/sqlite.ts`
const sqlite = new Database("sqlite.db");
const db = drizzle(sqlite);
//@ts-ignore
await migrate(db, { migrationsFolder: "./drizzle" });
//@ts-ignore
await db.insert(schema.Ita).values({
    id:"test",
    name:"test"
})
//@ts-ignore
await db.insert(schema.threds).values({
    id:90909090909,
    ItaID:"test",
    name:"テスト",
    PostNumNow:"0",
    ThTitle:"テスト",
})
//@ts-ignore
await db.insert(schema.posts).values({
    id: "test909090909090001",
    postNum: 1, 
    ItaID: "test",
    ThID: 90909090909,
    name: "テスト",
    MESSAGE: "iusdhdlnllnjknjnasnon\nowf",
    mail: "a"
})