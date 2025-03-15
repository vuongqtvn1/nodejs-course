import { PrismaClient } from '@prisma/client'

const prisma = new PrismaClient()

async function main() {
  await prisma.user.createMany({
    data: [
      {
        id: 1,
        name: 'User 1',
        email: 'user1@example.com',
        gender: 'MALE',
        age: 15,
      },
      {
        id: 2,
        name: 'User 2',
        email: 'user2@example.com',
        gender: 'MALE',
        age: 20,
      },
      {
        id: 3,
        name: 'User 3',
        email: 'user3@example.com',
        gender: 'FEMALE',
        age: 30,
      },
      {
        id: 4,
        name: 'User 4',
        email: 'user4@example.com',
        gender: 'MALE',
        age: 40,
      },
      {
        id: 5,
        name: 'User 5',
        email: 'user5@example.com',
        gender: 'FEMALE',
        age: 18,
      },
      {
        id: 6,
        name: 'User 6',
        email: 'user6@example.com',
        gender: 'FEMALE',
        age: 12,
      },
      {
        id: 7,
        name: 'User 7',
        email: 'user7@example.com',
        gender: 'FEMALE',
        age: 26,
      },
      {
        id: 8,
        name: 'User 8',
        email: 'user8@example.com',
        gender: 'MALE',
        age: 37,
      },
      {
        id: 9,
        name: 'User 9',
        email: 'user9@example.com',
        gender: 'FEMALE',
        age: 59,
      },
      {
        id: 10,
        name: 'User 10',
        email: 'user10@example.com',
        gender: 'MALE',
        age: 70,
      },
    ],
  })

  await prisma.post.createMany({
    data: [
      {
        id: 1,
        title: 'Post 1',
        content: 'This is content of post 1',
        authorId: 3,
      },
      {
        id: 2,
        title: 'Post 2',
        content: 'This is content of post 2',
        authorId: 5,
      },
      {
        id: 3,
        title: 'Post 3',
        content: 'This is content of post 3',
        authorId: 1,
      },
      {
        id: 4,
        title: 'Post 4',
        content: 'This is content of post 4',
        authorId: 2,
      },
      {
        id: 5,
        title: 'Post 5',
        content: 'This is content of post 5',
        authorId: 8,
      },
      {
        id: 6,
        title: 'Post 6',
        content: 'This is content of post 6',
        authorId: 7,
      },
      {
        id: 7,
        title: 'Post 7',
        content: 'This is content of post 7',
        authorId: 9,
      },
      {
        id: 8,
        title: 'Post 8',
        content: 'This is content of post 8',
        authorId: 10,
      },
      {
        id: 9,
        title: 'Post 9',
        content: 'This is content of post 9',
        authorId: 4,
      },
      {
        id: 10,
        title: 'Post 10',
        content: 'This is content of post 10',
        authorId: 6,
      },
      {
        id: 11,
        title: 'Post 11',
        content: 'This is content of post 11',
        authorId: 1,
      },
      {
        id: 12,
        title: 'Post 12',
        content: 'This is content of post 12',
        authorId: 2,
      },
      {
        id: 13,
        title: 'Post 13',
        content: 'This is content of post 13',
        authorId: 3,
      },
      {
        id: 14,
        title: 'Post 14',
        content: 'This is content of post 14',
        authorId: 4,
      },
      {
        id: 15,
        title: 'Post 15',
        content: 'This is content of post 15',
        authorId: 5,
      },
      {
        id: 16,
        title: 'Post 16',
        content: 'This is content of post 16',
        authorId: 6,
      },
      {
        id: 17,
        title: 'Post 17',
        content: 'This is content of post 17',
        authorId: 7,
      },
      {
        id: 18,
        title: 'Post 18',
        content: 'This is content of post 18',
        authorId: 8,
      },
      {
        id: 19,
        title: 'Post 19',
        content: 'This is content of post 19',
        authorId: 9,
      },
      {
        id: 20,
        title: 'Post 20',
        content: 'This is content of post 20',
        authorId: 10,
      },
      {
        id: 21,
        title: 'Post 21',
        content: 'This is content of post 21',
        authorId: 1,
      },
      {
        id: 22,
        title: 'Post 22',
        content: 'This is content of post 22',
        authorId: 2,
      },
      {
        id: 23,
        title: 'Post 23',
        content: 'This is content of post 23',
        authorId: 3,
      },
      {
        id: 24,
        title: 'Post 24',
        content: 'This is content of post 24',
        authorId: 4,
      },
      {
        id: 25,
        title: 'Post 25',
        content: 'This is content of post 25',
        authorId: 5,
      },
      {
        id: 26,
        title: 'Post 26',
        content: 'This is content of post 26',
        authorId: 6,
      },
      {
        id: 27,
        title: 'Post 27',
        content: 'This is content of post 27',
        authorId: 7,
      },
      {
        id: 28,
        title: 'Post 28',
        content: 'This is content of post 28',
        authorId: 8,
      },
      {
        id: 29,
        title: 'Post 29',
        content: 'This is content of post 29',
        authorId: 9,
      },
      {
        id: 30,
        title: 'Post 30',
        content: 'This is content of post 30',
        authorId: 10,
      },
    ],
    skipDuplicates: true, // Skip 'Duplicate'
  })
}

main()
  .catch((e) => console.error(e))
  .finally(() => prisma.$disconnect())
