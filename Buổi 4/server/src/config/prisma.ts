import { PrismaClient } from '@prisma/client'

export const prisma = new PrismaClient()

async function PrismaQuery() {
  //  Lấy danh sách users
  // const users = await prisma.user.findMany()
  // console.log(users)
  // ====
  // create - Thêm mới user

  await prisma.user.create({
    data: {
      name: 'Dương Vương',
      email: 'vuong@example.com',
      gender: 'MALE',
      age: 25,
    },
  })
  // update - Cập nhập user
  // await prisma.user.update({
  //   where: {
  //     email: 'vuong@example.com',
  //   },
  //   data: { age: 40 },
  // })
  // delete - Xóa user
  // await prisma.user.delete({
  //   where: {
  //     email: 'vuong@example.com',
  //   },
  // })
  // const results = await prisma.post.findMany({
  //   where: {
  //     title: { search: 'post New' },
  //   },
  // })
  // console.log(results)
  // pagination
  // page, limit
  // const skip = (page - 1) * limit
  // => page = 1, limit = 10 => skip = 0, take = 10 (limit)
  // => page = 2, limit = 10 => skip = 10, take = 10
  // => page = 3, limit = 10 => skip = 20, take = 10
  // const users = await prisma.user.findMany({
  //   skip: 0,
  //   take: 5,
  // })
  // console.log(users)
  // .sort({name: -1 | 1}) mongoose
  // asc, desc
  // const users = await prisma.user.findMany({
  //   orderBy: { age: 'asc' },
  // })
  // console.log(users)
  // ==> $regex: new RegExp("", "i") mongoose
  // const posts = await prisma.post.findMany({
  //   where: { title: { contains: 'os' } },
  // })
  // console.log(posts)
  // const email = 'vuong@gmail.com'
  // if (email.startsWith('vuong'))
  // const posts = await prisma.post.findMany({
  //   where: {
  //     title: {
  //       startsWith: 'post',
  //     },
  //   },
  // })
  // console.log(posts)
  // const users = await prisma.user.findMany({
  //   where: {
  //     age: {
  //       gt: 10, // Lớn hơn 10
  //       lt: 30, // Nhỏ hơn 30
  //     },
  //   },
  // })
  // console.log(users)
  // const users = await prisma.user.findMany({
  //   where: {
  //     AND: [{ age: { gt: 30 } }, { name: { contains: 'Us' } }],
  //   },
  // })
  // console.log(users)
  // const usersOr = await prisma.user.findMany({
  //   where: {
  //     OR: [{ age: { lt: 18 } }, { name: { startsWith: 'User' } }],
  //   },
  // })
  // console.log(usersOr)
  // const usersIn = await prisma.user.findMany({
  //   where: {
  //     id: {
  //       in: [1, 2, 3, 4],
  //     },
  //   },
  // })
  // console.log(usersIn)
  // const usersNotIn = await prisma.user.findMany({
  //   where: {
  //     id: {
  //       notIn: [1, 2, 3],
  //     },
  //   },
  // })
  // console.log(usersNotIn)
  // so sánh ===
  // const userEq = await prisma.user.findMany({
  //   where: {
  //     age: {
  //       equals: 12,
  //     },
  //   },
  // })
  // const userEq = await prisma.user.findMany({
  //   where: {
  //     age: 12
  //   },
  // })
  // console.log(userEq)
  // const userNe = await prisma.user.findMany({
  //   where: {
  //     age: {
  //       not: 25,
  //     },
  //   },
  // })
  // console.log(userNe)
  // const updatedPost = await prisma.post.update({
  //   where: { id: 1 },
  //   data: {
  //     author: {
  //       connect: { id: 1 }, // Kết nối bài viết với user có id = 1
  //     },
  //   },
  // })
  // console.log(updatedPost)
  // const updatedPostDisconnect = await prisma.post.update({
  //   where: { id: 1 },
  //   data: {
  //     author: {
  //       disconnect: true, // Hủy liên kết bài viết với user hiện tại
  //     },
  //   },
  // })
  // find post > 0
  // console.log(updatedPostDisconnect)
  // await prisma.user.delete({
  //   where: { id: 1 },
  // })
}

PrismaQuery()
  .catch((e) => console.error(e))
  .finally(async () => await prisma.$disconnect())
