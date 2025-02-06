import exp = require('constants');
import { relations } from 'drizzle-orm';
import { integer, pgTable, timestamp, varchar } from 'drizzle-orm/pg-core';

const baseEntity = () => ({
  id: integer().primaryKey().generatedAlwaysAsIdentity(),
  createdAt: timestamp('created_at').notNull().defaultNow(),
  updatedAt: timestamp('created_at').notNull().defaultNow(),
});

export const user = pgTable('user', {
  ...baseEntity(),
  name: varchar({ length: 255 }).notNull(),
  age: integer().notNull(),
  email: varchar({ length: 255 }).notNull().unique(),
});

export const post = pgTable('post', {
  ...baseEntity(),
  title: varchar({ length: 255 }).notNull(),
  content: varchar({ length: 1000 }).notNull(),
  authorId: integer()
    .references(() => user.id)
    .notNull(),
});

export const comment = pgTable('comment', {
  ...baseEntity(),
  text: varchar({ length: 1000 }).notNull(),
  postId: integer()
    .references(() => post.id)
    .notNull(),
  userId: integer()
    .references(() => user.id)
    .notNull(),
});

export const userRelations = relations(user, ({ many }) => ({
  posts: many(post),
}));

export const postRelations = relations(post, ({ one, many }) => ({
  user: one(user, { fields: [post.authorId], references: [user.id] }),
  comments: many(comment),
}));

export const commentRelations = relations(comment, ({ one }) => ({
  post: one(post, { fields: [comment.postId], references: [post.id] }),
  user: one(user, { fields: [comment.userId], references: [user.id] }),
}));
