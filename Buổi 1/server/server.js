import express from "express";
// const fs = require("fs");
// const crypto = require("crypto");
// const path = require("path");
// const lodash = require("lodash");

// const file = fs.readFileSync("main.ts");
// console.log("File read successfully", file);
// fs.writeFileSync("test.txt", "Hello, this is a test!");
// console.log("File created successfully");
const app = express();

app.use(express.json());

// console.log(path.basename("C:\\temp\\myfile.html"));

// console.log(path.dirname("/foo/bar/baz/asdf/quux"));

// console.log(lodash.camelCase("hello world"));

app.get("/", function (req, res) {
  res.send({ message: "hello" });
});

// routers
// middleware

app.post("/", function (req, res) {
  console.log(req.body);
  res.send("You have sent a POST request");
});

app.listen(3000, () => {
  console.log("Server is running on port 3000");
});

// function Sum(a, b) {
//   return a + b;
// }

// const user = { name: "hello" };

// console.log(Sum(false, 3));

// const person = { name: "Alice", age: 25 };

// const { name, age } = person;
// console.log(name, age);

// const array = [1, 2, 3, 4, 5];

// const [firstNumber] = array;

// console.log("3213");

// function fetchData() {
//   return new Promise((resolve) =>
//     setTimeout(() => resolve("Dữ liệu tải xong!"), 2000)
//   );
// }

// async function getData() {
//   let data = await fetchData();
//   console.log(data);
//   console.log("#1231");
// }

// getData();

// const sum = (a, b) => a + b;

// module.exports = sum;
// // ===
// // export default sum;

// module.exports = { sum };
// ===
// export const sum = (a, b) => a + b;
