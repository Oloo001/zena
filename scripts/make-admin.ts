import * as dotenv from "dotenv";
dotenv.config();

import { PrismaClient } from "@prisma/client";
import { PrismaPg } from "@prisma/adapter-pg";
import { Pool } from "pg";
import bcrypt from "bcryptjs";

const pool = new Pool({ connectionString: process.env.DATABASE_URL });
const adapter = new PrismaPg(pool);
const prisma = new PrismaClient({ adapter });


//const prisma = new PrismaClient();


async function main() {
  const email = "admin@zena.co.ke";
  const password = "Admin1234";

  const existing = await prisma.user.findUnique({ where: { email } });

  if (existing) {
    await prisma.user.update({
      where: { email },
      data: { role: "ADMIN" },
    });
    console.log("✅ Existing user promoted to ADMIN:", email);
    return;
  }

  const hashed = await bcrypt.hash(password, 12);

  await prisma.user.create({
    data: {
      name: "Zena Admin",
      email,
      password: hashed,
      role: "ADMIN",
    },
  });

  console.log("✅ Admin user created");
  console.log("   Email:", email);
  console.log("   Password:", password);
  console.log("   Change this password after first login.");
}

main()
  .catch(console.error)
  .finally(() => prisma.$disconnect());