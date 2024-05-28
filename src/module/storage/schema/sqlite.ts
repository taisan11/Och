import { sql } from 'drizzle-orm';
import { sqliteTable, text, integer, uniqueIndex,index } from 'drizzle-orm/sqlite-core';

export const Ita = sqliteTable('Ita', {
    id: text('id').primaryKey(),
    name: text('name'),
  }, (tabel) => {
    return {
      id_idx: uniqueIndex("id_idx").on(tabel.id)
    }
  }
);

export const threds = sqliteTable('threds', {
  id: integer('id').primaryKey(),
  ItaID:text('ItaID').notNull().references(()=>Ita.id),
  PostNumNow:text('PostNumNow').notNull(),//1~1000など
  name: text('name').notNull(),
  ThTitle:text('ThTitle').notNull(),
  createdAt: text('created_at').notNull().default(sql`(CURRENT_TIMESTAMP)`),
}, (tabel) => {
  return {
    id_idx: uniqueIndex("id_idx").on(tabel.id),
    ItaID_idx: index("ItaID_idx").on(tabel.ItaID)
  }
})

export const posts = sqliteTable('posts', {
  id: text('id').primaryKey(),// ItaID+thID+postNum
  postNum: integer('postnum').notNull(),
  ItaID:text('ItaID').notNull().references(()=>Ita.id),
  ThID:integer('ThID').notNull().references(()=>threds.id),//1~1000など
  name:text('name').notNull(),
  MESSAGE:text('MESSAGE').notNull(),
  mail:text('mail').notNull()
}, (tabel) => {
  return {
    ItaID_idx: index("ItaID_idx").on(tabel.ItaID),
    ThID_idx: uniqueIndex("ThID").on(tabel.ThID),
    postNum_idx: index("postNum_idx").on(tabel.postNum)
  }
})