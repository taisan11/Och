import {$} from 'bun'

import { migrate } from "drizzle-orm/bun-sqlite/migrator";

import { drizzle } from "drizzle-orm/bun-sqlite";
import { Database } from "bun:sqlite";
import { drizzle_db_driver } from "../src/module/storage/drizzle";

console.log(`Seeding complete.`);
//@ts-ignore
await $`rm -rf ./drizzle/ sqlite.db`
//@ts-ignore
await $`bun x drizzle-kit generate`
const sqlite = new Database("sqlite.db");
const db = drizzle(sqlite);
//@ts-ignore
await migrate(db, { migrationsFolder: "./drizzle" });
const hoi = drizzle_db_driver(db)
//@ts-ignore
await hoi.init()