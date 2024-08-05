import { config } from "../config";
import type { drizzle } from "drizzle-orm/bun-sqlite"
import type { BaseSQLiteDatabase } from "drizzle-orm/sqlite-core";
import { subjectpaser,datpaser } from "../pase";
import { NewThreadParams,PostThreadParams, getSubjectReturn, getThreadReturn, postReturn } from "../storage";

type DBBase<TSchema extends Record<string, unknown> = Record<string, never>> = BaseSQLiteDatabase<'sync', void, TSchema>

const db = config().preference.site.drizzle()! as DBBase

db("a")