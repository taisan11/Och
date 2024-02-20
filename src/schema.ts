import { integer, sqliteTable, text } from "drizzle-orm/sqlite-core";

export const threads = sqliteTable("threads", {
	id: integer("id").primaryKey().notNull(), //スレッドID(タイムスタンプ)
	title: text("title").notNull(), //スレタイ
	createdAt: text("created_at").notNull(), //投稿日時
	ip_addr: text("ip_addr").notNull(), //投稿者IPアドレス
	isDelete: integer("isDelete", { mode: "boolean" }).notNull().default(false), // 削除フラグ あぼーんjiwd
});

export const post = sqliteTable("post", {
	ex_id: integer("ex_id").primaryKey().notNull(), //投稿ID(非公開)(スレッドID+レス番号+乱数)
	id: integer("id").notNull().references(() => threads.id), //スレッドID(タイムスタンプ)
	res_id: integer("res_id").notNull(), //レス番号(0001~1000まで)
	name: text("name").notNull(), //投稿者名
	mail: text("mail"), //任意!!投稿者メールアドレス(キャップ可)
	message: text("message").notNull(), //投稿内容
	createdAt: text("created_at").notNull(), //投稿日時
	ip_addr: text("ip_addr").notNull(), //投稿者IPアドレス
	isDelete: integer("isDelete", { mode: "boolean" }).notNull().default(false), // 削除フラグ あぼーん
});
