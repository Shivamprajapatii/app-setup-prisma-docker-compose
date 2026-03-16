import dotenv from "dotenv";
import express from "express";
import { PrismaPg } from "@prisma/adapter-pg";
import { PrismaClient } from "@prisma/client";
import { Pool } from "pg";

dotenv.config();
const databaseUrl = process.env.DATABASE_URL;
if (!databaseUrl) {
    throw new Error("DATABASE_URL is not set");
}

const app = express();

app.use(express.json());

const pool = new Pool({ connectionString: databaseUrl });
const adapter = new PrismaPg(pool);
const prismaClient = new PrismaClient({ adapter });


app.get("/", (req, res) => {
    res.send({
        message : "Hello, World!"
    });
});

app.get("/users", async (req, res) => {
    const users = await prismaClient.user.findMany();
    res.json({
        data : users
    })
});

app.post("/users", async (req, res) => {
    const {name, email, password} = req.body;
    const user = await prismaClient.user.create({
        data : {
            name : name,
            email : email,
            password : password
        }
    });
    res.send({
        message : "User created successfully",
        user : { name, email, password }
    });
});


async function startServer() {
  try {
    await prismaClient.$connect();
    console.log("✅ Database connected successfully");

    app.listen(3000, () => {
      console.log("🚀 Server is running on port 3000");
    });

  } catch (error) {
    console.error("❌ Database connection failed:", error);
    process.exit(1);
  }
}

startServer();