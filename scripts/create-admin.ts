import { PrismaClient, UserRole } from "@prisma/client";
import bcrypt from "bcryptjs";
import readline from "readline";

const prisma = new PrismaClient();

const rl = readline.createInterface({
  input: process.stdin,
  output: process.stdout,
});

const question = (query: string): Promise<string> =>
  new Promise((resolve) => rl.question(query, resolve));

async function createAdmin() {
  try {
    const email = await question("Enter admin email: ");
    const password = await question("Enter admin password: ");
    const name = await question("Enter admin name: ");

    const hashedPassword = await bcrypt.hash(password, 10);

    const admin = await prisma.user.create({
      data: {
        email,
        password: hashedPassword,
        name,
        role: UserRole.ADMIN,
        provider: "email",
      },
    });

    console.log("\nAdmin user created successfully:");
    console.log({
      id: admin.id,
      email: admin.email,
      name: admin.name,
      role: admin.role,
    });
  } catch (error) {
    console.error("Error creating admin:", error);
  } finally {
    rl.close();
    await prisma.$disconnect();
  }
}

createAdmin();
