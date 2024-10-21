import { sql } from 'drizzle-orm';
import { sqliteTable, text, integer, uniqueIndex,index } from 'drizzle-orm/sqlite-core';

export const Ita = sqliteTable('Ita', {
    id: text("id").primaryKey(),
    title: text("title").notNull(),
    config_file: text("config_file"),
  }
);

export const threds = sqliteTable('threds', {
    id: text("id").primaryKey(),
    BBSKEY: text("BBSKEY").notNull().references(() => Ita.id),
    title: text("title").notNull(),
    postnum: integer("postnum").notNull(),
    createAt: integer("createAt",{mode:"timestamp_ms"}).notNull(),
})

export const posts = sqliteTable('posts', {
  id: text("id").primaryKey(),
  BBSKEY: text("BBSKEY").notNull().references(() => Ita.id),
  ThID: text("ThID").notNull().references(() => threds.id),
  ResNum: integer("ResNum").notNull(),
  name: text("name").notNull(),
  mail: text("mail"),
  date: text("date").notNull(),
  message: text("message").notNull(),
  createAt: integer("createAt",{mode:"timestamp_ms"}).notNull(),
})