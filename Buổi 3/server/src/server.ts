import app from './app'

const PORT = process.env.PORT || 3000

app.listen(PORT, () => {
  console.log(`🚀 Server is running on http://localhost:${PORT}`)
})

// const initialDB = async () => {
//   try {
//     await mongoose.connect('mongodb://localhost:27017/mydb')

//     console.log('✅ MongoDB Connected')

//     const UserSchema = new mongoose.Schema({
//       name: String,
//       email: String,
//       age: Number,
//       role: String,
//       createdAt: { type: Date, default: Date.now },
//     })

//     const PostSchema = new mongoose.Schema({
//       title: String,
//       content: String,
//       author: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
//       tags: [String],
//     })

//     PostSchema.index({ title: 'text', content: 'text' })

//     const OrderSchema = new mongoose.Schema({
//       user: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
//       items: [{ name: String, quantity: Number, price: Number }],
//       status: String,
//       createdAt: { type: Date, default: Date.now },
//     })

//     const User = mongoose.model('User', UserSchema)
//     const Post = mongoose.model('Post', PostSchema)
//     const Order = mongoose.model('Order', OrderSchema)

//     // Tìm kiếm
//     // await Post.create({
//     //   title: 'Hướng dẫn NodeJS',
//     //   content: 'Học NodeJS cơ bản và nâng cao.',
//     // })

//     // search gần đúng fulltext search
//     // const posts = await Post.find({ $text: { $search: 'dẫn' } })
//     // console.log(posts)

//     // $regex regex javascript
//     // new RegExp('hello') => ^hello
//     //  { $regex: new RegExp('nodeJS', 'i') } ===  { $regex: new RegExp('nodeJS'), $options: 'i' }
//     // const posts = await Post.find({
//     //   title: { $regex: new RegExp('nodeJS', 'i') },
//     // })

//     // console.log(posts)

//     // await User.create([
//     //   { name: 'Alice', email: 'alice@example.com', age: 25, role: 'admin' },
//     //   { name: 'Bob', email: 'bob@example.com', age: 30, role: 'user' },
//     //   { name: 'Bob', email: 'bob@example.com', age: 12, role: 'user' },
//     //   { name: 'Bob', email: 'bob@example.com', age: 34, role: 'user' },
//     //   { name: 'Bob', email: 'bob@example.com', age: 10, role: 'user' },
//     // ])

//     // const users = await User.find().select('name email age')
//     // console.log(users)

//     // mongoose cach 1
//     // const usersWithEmail = await User.find({ email: { $exists: true } })
//     // mongoose cach 2
//     // const usersWithEmail = await User.find().where('email').exists(true)

//     // console.log(usersWithEmail)

//     // Đếm số lượng
//     // const userCount = await User.find({ name: 'Bob' }).countDocuments()

//     // console.log(userCount)

//     // const roles = await User.distinct('role')
//     // console.log(roles)

//     // const alice = await User.findOne({ name: 'Alice' })

//     // await Post.create({
//     //   title: 'Post 1',
//     //   content: 'Hello World',
//     //   author: alice?._id,
//     // })

//     // const posts = await Post.find().populate('author', 'name email')

//     // console.log(posts)

//     // const users = await User.where('age').gt(18).lt(30)
//     // const users = await User.find({
//     //   $and: [{ age: { $gt: 18 } }, { age: { $lt: 30 } }],
//     // })
//     // console.log(users)

//     // const users = await User.aggregate([
//     //   {
//     //     $match: {
//     //       $and: [{ age: { $gt: 18 } }, { age: { $lt: 30 } }],
//     //     },
//     //   },
//     // ])

//     // api tong hop nhung nguoi co do tuoi 1- 100 gom bao nhieu nguoi
//     // const users = await User.aggregate([
//     //   { $group: { _id: '$age', total: { $sum: 1 } } },
//     // ])

//     // console.log(users)

//     // JOIN Bang

//     // const posts1 = await Post.find().populate('author', 'name email')

//     // console.log(posts1)

//     // projection =  $project

//     // // console.log(posts1)
//     // const posts = await Post.aggregate([
//     //   {
//     //     $match: {
//     //       _id: new mongoose.mongo.ObjectId('67d2df17117ef99069715874'),
//     //     },
//     //   },
//     //   {
//     //     $lookup: {
//     //       from: 'users',
//     //       localField: 'author',
//     //       foreignField: '_id',
//     //       as: 'authors',
//     //     },
//     //   },
//     //   {
//     //     $addFields: {
//     //       author: { $arrayElemAt: ['$authors', 0] },
//     //     },
//     //   },
//     //   {
//     //     $project: {
//     //       authors: 0,
//     //     },
//     //   },
//     // ])

//     // console.log(posts)

//     // const alice = await User.findOne({ name: 'Alice' })
//     // await Order.create({
//     //   user: alice?._id,
//     //
//     //   items: [
//     //     { name: 'Laptop', quantity: 1, price: 1000 },
//     //     { name: 'Mouse', quantity: 2, price: 50 },
//     //      { name: 'Mouse', quantity: 2, price: 50 },
//     //   ],
//     // })

//     // {
//     //   user: alice?._id,
//     //   items: [
//     //     { name: 'Laptop', quantity: 1, price: 1000 },
//     //     { name: 'Mouse', quantity: 2, price: 50 },
//     //   ],
//     // }

//     // {
//     //   user: alice?._id,
//     //   items: { name: 'Laptop', quantity: 1, price: 1000}
//     // }

//     // {
//     //   user: alice?._id,
//     //   items:{ name: 'Mouse', quantity: 2, price: 50 }
//     // }

//     // const orders = await Order.aggregate([{ $unwind: '$items' }])

//     // console.log(orders)

//     // backup du lieu
//     // await User.aggregate([
//     //   { $match: { role: 'admin' } },
//     //   { $out: 'admin_user' },
//     // ])

//     // lay tat ca nhung user co role === "admin" va luu bang vao bang admin_user

//     // {
//     //   user: alice?._id,
//     //   items: [
//     //     { name: 'Laptop', quantity: 1, price: 1000 },
//     //     { name: 'Mouse', quantity: 2, price: 50 },
//     //   ],
//     // }

//     // {
//     //   user: alice?._id,
//     //   items: { name: 'Laptop', quantity: 1, price: 1000}
//     // }

//     // ==> { name: 'Laptop', quantity: 1, price: 1000}

//     // {
//     //   user: alice?._id,
//     //   items:{ name: 'Mouse', quantity: 2, price: 50 }
//     // }

//     //  => { name: 'Mouse', quantity: 2, price: 50 }
//     // const orders = await Order.aggregate([
//     //   { $unwind: '$items' },
//     //   { $replaceRoot: { newRoot: '$items' } },
//     // ])

//     // console.log(orders)

//     // const randomUsers = await User.aggregate([{ $sample: { size: 2 } }])
//     // console.log(randomUsers)

//     // update khong khuyen khich su dung
//     // const randomUsers = await User.aggregate([
//     //   { $set: { status: 'Duong Vuong' } },
//     // ])

//     // console.log(randomUsers)

//     // User.updateOne()

//     // them vua kiem tra co ton tai chua co ton tai thi update user_truong_thanh
//     // await User.aggregate([
//     //   { $match: { age: { $gte: 18 } } },
//     //   { $merge: 'user_truong_thanh' },
//     // ])

//     // const users = await User.aggregate([
//     //   { $match: { age: { $gte: 18 } } },
//     //   {
//     //     $addFields: {
//     //       type: 'Anh Trai',
//     //       isSenior: {
//     //         $cond: {
//     //           if: { $gt: ['$age', 30] },
//     //           then: 'Senior',
//     //           else: 'Junior',
//     //         },
//     //       },
//     //     },
//     //   },
//     //   {
//     //     $project: {
//     //       type: 0,
//     //     },
//     //   },
//     // ])

//     // console.log(users)
//   } catch (error) {
//     console.error('❌ MongoDB Connection Error:', error)
//   }
// }

// initialDB()
