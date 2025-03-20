let message: string = "Hello TypeScript";
let count: number = 42;
let isDone: boolean = false;

interface User {
  name: string;
  email: string;
}

const user: User = {
  name: "1",
  email: "email",
};

type User1 = { name: string; email: string };

type User2 = boolean;

interface AdminUser extends User {
  role: "admin" | "user";
}

type AdminUser1 = User & { role: "admin" | "user" };

const userAdmin: AdminUser1 = {
  name: "1",
  email: "email",
  role: "user",
};

function Sum1(a: number, b: number): number {
  return a + b;
}
console.log(Sum1(5, 3));

class Person {
  name: string;

  constructor(name: string) {
    this.name = name;
  }

  greet() {
    return `Xin chào, tôi là ${this.name}`;
  }
}

let alice = new Person("Alice");
console.log(alice.greet());

// object array

const person = {
  name: "Alice",
  greet() {
    return `Xin chào, tôi là ${this.name}`;
  },
};

person.name;
person.greet();

function identity<T>(arg: T): T {
  return arg;
}

console.log(identity<string>("Hello"));
console.log(identity<Array<string>>(["32"]));

// pattern

// module
const logger = () => {
  const logs: string[] = [];

  const log = (message: string) => {
    logs.push(message);
  };

  return { logs, log };
};

const { logs, log } = logger();

// singleton

class Database {
  private static instance: Database;

  private constructor() {}

  static getInstance() {
    if (!Database.instance) {
      Database.instance = new Database();
    }

    return Database.instance;
  }
}

const db = Database.getInstance();

// // connect db
