import 'dotenv/config';
import { drizzle } from 'drizzle-orm/node-postgres';
import { reset } from 'drizzle-seed';
import * as schema from './schema';

const { user, post, comment } = schema;

const db = drizzle(process.env.DATABASE_URL!);

export async function seed() {
  await db.insert(user).values([
    {
      name: 'John',
      age: 30,
      email: 'john@example.com',
    },
    {
      name: 'Jane',
      age: 25,
      email: 'jane@example.com',
    },
  ]);
  console.log('New users created!');

  await db.insert(post).values([
    {
      title: 'My first post',
      content: 'This is my first post!',
      authorId: 1,
    },
    {
      title: 'My second post',
      content: 'This is my first post!',
      authorId: 1,
    },
    {
      title: 'My first post',
      content: "This is my first post! I'm not that other user",
      authorId: 2,
    },
  ]);
  console.log('New posts created!');

  await db.insert(comment).values([
    { postId: 1, userId: 1, text: 'This is my first comment on my post!' },
    { postId: 1, userId: 1, text: 'This is my second comment on my post!' },
    { postId: 1, userId: 2, text: 'This is my first comment on not my post!' },
    { postId: 3, userId: 2, text: 'This is my first comment on my post!' },
    { postId: 3, userId: 1, text: 'This is my first comment on not my post!' },
  ]);
  console.log('New comments created!');
}

export async function truncate() {
  await reset(db, schema);
  console.log('Database truncated!');
}

seed()
  // truncate()
  //
  .then(() => process.exit());
