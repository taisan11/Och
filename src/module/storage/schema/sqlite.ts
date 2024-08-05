import { sql } from 'drizzle-orm';
import { sqliteTable, text, integer, uniqueIndex,index } from 'drizzle-orm/sqlite-core';

export const Ita = sqliteTable('Ita', {
    id: text('id').primaryKey(),
    name: text('name'),
  }
);

export const threds = sqliteTable('threds', {
  id: integer('id').primaryKey(),
  ItaID:text('ItaID').notNull().references(()=>Ita.id),
  PostNumNow:text('PostNumNow').notNull(),//1~1000など
  name: text('name').notNull(),
  ThTitle:text('ThTitle').notNull(),
  createdAt: text('created_at').notNull().default(sql`(CURRENT_TIMESTAMP)`),
})

export const posts = sqliteTable('posts', {
  id: text('id').primaryKey(),// ItaID+thID+postNum
  postNum: integer('postnum').notNull(),
  ItaID:text('ItaID').notNull().references(()=>Ita.id),
  ThID:integer('ThID').notNull().references(()=>threds.id),//1~1000など
  name:text('name').notNull(),
  MESSAGE:text('MESSAGE').notNull(),
  mail:text('mail').notNull()
})