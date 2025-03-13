import mongoose from 'mongoose'
import app from './app'

const PORT = process.env.PORT || 3000

app.listen(PORT, () => {
  console.log(`🚀 Server is running on http://localhost:${PORT}`)
})

const initialDB = async () => {
  try {
    await mongoose.connect('mongodb://localhost:27017/mydb')

    console.log('✅ MongoDB Connected')

    const userSchema = new mongoose.Schema({
      name: String,
      age: Number,
      email: String,
      orders: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Order' }],
    })

    const orderSchema = new mongoose.Schema({
      product: String,
      price: Number,
      userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
    })

    const User = mongoose.model('User', userSchema)
    const Order = mongoose.model('Order', orderSchema)

    // Them du lieu
    // cach 1 de them 1 cai du lieu bang
    // const newUser = new User({
    //   name: "John Doe",
    //   age: 30,
    //   email: "john@example.com",
    // });
    // await newUser.save();

    // // // cach 2
    // await User.create({
    //   name: "Duong Vuong",
    //   age: 25,
    //   email: "quocvuong@example.com",
    // });

    // cap nhap 1 phan tu
    // await User.updateOne({ _id: "67d040ebca02df00c6e17d0f" }, { age: 100 });

    // const user = await User.findById("67d040ebca02df00c6e17d0f");

    // console.log(user);

    // cap nhap nhieu phan tu
    // await User.updateMany({ age: { $lt: 25 } }, { age: 25 });

    // new = false tra ve document chua cap nhap
    // new = true tra ve document sau khi cap nhap
    // const updatedUser = await User.findOneAndUpdate(
    //   { name: "John Doe" },
    //   { age: 50 },
    //   { new: true } // Trả về document đã cập nhật
    // );

    // console.log(updatedUser);

    // xoa 1
    // await User.deleteOne({ email: "quocvuong@example.com" });

    // xoa nhieu
    // await User.deleteMany({ age: 25 });

    // const user = await User.findById("67d040ebca02df00c6e17d0f");

    // await User.deleteOne({ _id: "67d040ebca02df00c6e17d0f" });

    // console.log(user);
    // const deletedUser = await User.findOneAndDelete({ name: "John Doe" });
    // console.log(deletedUser);

    // array
    // const users = await User.find();
    // console.log(users);

    // 1 object, 2 null
    // const user = await User.findOne({ name: "John Doe" });

    // console.log(user);

    // const user = await User.findOne({ _id: "67d04515098a6325068514eb" });
    // console.log(user);

    // const user1 = await User.findById("67d04515098a6325068514eb");
    // console.log(user1);

    // $gt > 25    lay tat nhung thang user nao ma co tuoi lon hon 25
    // const users = await User.find({ age: { $gt: 25 } });
    // $lt (Less Than - Nhỏ hơn) < 30    lay tat nhung thang user nao ma co tuoi nho hon 30
    // const users = await User.find({ age: { $lt: 30 } });

    // $gte (Greater Than or Equal - Lớn hơn hoặc bằng) >= 25
    // const users = await User.find({ age: { $gte: 25 } });

    // $lte (Less Than or Equal - Nhỏ hơn hoặc bằng) <= 30
    // const users = await User.find({ age: { $lte: 30 } });

    // $in (In - nằm trong)    age nằm trong cai mang [25, 30]
    // lay nhung thang user tuoi la 25 tuoi va 30 tuoi
    // const users = await User.find({ age: { $in: [25, 30] } });

    // $nin (Not In - Không nằm trong)    age không nằm trong cai mang [25, 30]
    // lay nhung thang user tuoi khac 25 tuoi va 30 tuoi
    // const users = await User.find({ age: { $nin: [25, 30] } });

    // $eq (Equal - Bằng với giá trị cụ thể)  === same javascript
    // const users = await User.find({ age: { $eq: 25 } });
    // short hand { age: { $eq: 25 } } => { age: 25 }

    // $ne (Not Equal - Khacs với giá trị cụ thể)  !== same javascript
    // const users = await User.find({ age: { $ne: 25 } });

    // $and (Kết hợp nhiều điều kiện - AND)
    // const users = await User.find({
    //   $and: [{ age: { $gt: 18 } }, { age: { $lt: 30 } }],
    // });
    // 18 => 30
    // age > 18 && age < 30

    //  short hand vi trung key
    // {
    //   age: { $gt: 18 },
    //   age: { $lt: 30 } => loi error
    // }

    // $and: [{ age: { $eq: 25 } }, { name:"Duong Vuong" }],
    //  short hand
    // {
    //   age: { $eq: 25 },
    //   name: "Duong Vuong"
    // }

    // $or (Kết hợp nhiều điều kiện - OR)
    // const users = await User.find({
    //   $or: [{ age: { $gt: 30 } }, { name: "Alice" }],
    // });

    // $cond (Điều kiện trong Aggregation) same
    // a === "100" ? 100 : 0 javascript toan tu dieu kien 3 ngoi

    // find() === aggregate([{ $match: {} }]) lay tat ca du lieu trong collection ==> array
    // const users = await User.aggregate([
    //   {
    //     // matching === filter trong find()
    //     $match: {
    //       $or: [{ age: { $gt: 30 } }, { name: "Alice" }],
    //     },
    //   },
    //   {
    //     // quy dinh du lieu tra ve 1 la tra ve, 0 la khong tra ve, if else bang $cond
    //     $project: {
    //       name: 1,
    //       isSenior: {
    //         $cond: {
    //           if: { $gte: ["$age", 30] },
    //           then: true,
    //           else: false,
    //         },
    //       },
    //     },
    //   },
    // ]);

    // const users = await User.find({ name: "Duong Vuong" });
    // const users1 = await User.aggregate([{ $match: { name: "Duong Vuong" } }]);

    // console.log(users);
    // console.log(users1);

    // $filter (Lọc dữ liệu trong mảng) === filter trong javascript
    // const users = await User.aggregate([
    //   { $match: {} },
    //   // { $lookup: {} },
    //   {
    //     $project: {
    //       // orders.filter(order => order.price > 50)

    //       orders: {
    //         $filter: {
    //           input: "$orders",
    //           as: "order",
    //           cond: { $gt: ["$$order.price", 50] },
    //         },
    //       },
    //     },
    //   },
    // ]);

    // sort Sắp xếp (Sort) => key cua truong minh muon sort gia 1 tang dan, -1 giam dan

    // const users = await User.find().sort({ age: -1 });
    // console.log(users);

    // phân trang (Pagination)
    // const page = 2;
    // const limit = 5;
    // const users = await User.find()
    //   .skip((page - 1) * limit)
    //   .limit(limit);

    // skip(count)  bo qua bao nhieu document (count = so luong document bo qua)
    // const users = await User.find().sort({ age: -1 }).skip(0);
    // console.log(users);

    // limit(count) gioi han bao nhieu document tra ve
    // const users = await User.find().limit(2);
    // console.log(users);

    // 3 trang 1 trang chi 1 document

    // const skip = (page - 1) * limit;

    // limit = 1
    // // page = 1
    // const users = await User.find().limit(1).skip(0);
    // // page = 2
    // const users1 = await User.find().limit(1).skip(1);
    // // page = 3
    // const users2 = await User.find().limit(1).skip(2);
    // // page = 4
    // const users3 = await User.find().limit(1).skip(3);
    // console.log(users);

    // limit = 2
    // page = 1
    // const page1 = await User.find().limit(2).skip(0);
    // // page = 2
    // const page2 = await User.find().limit(2).skip(2);
    // console.log({
    //   page1,
    //   page2,
    // });

    // John Doe
    // const users = await User.find({
    //   name: { $regex: new RegExp("jo", "i") },
    // });

    // console.log(users);
  } catch (error) {
    console.error('❌ MongoDB Connection Error:', error)
  }
}

initialDB()
