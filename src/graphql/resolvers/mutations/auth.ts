import { PrismaClient, UserRole } from "@prisma/client";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import { GraphQLError } from "graphql";
import { Context } from "@/types/context";

const prisma = new PrismaClient();
const JWT_SECRET = process.env.JWT_SECRET || "your-secret-key";

const authMutationResolvers = {
  Mutation: {
    register: async (_: any, { input }: { input: any }, context: Context) => {
      try {
        const { email, password, name } = input;

        const existingUser = await prisma.user.findUnique({
          where: { email },
        });

        if (existingUser) {
          throw new GraphQLError("User already exists", {
            extensions: { code: "BAD_USER_INPUT" },
          });
        }

        const hashedPassword = await bcrypt.hash(password, 10);

        const user = await prisma.user.create({
          data: {
            email,
            password: hashedPassword,
            name,
            role: UserRole.VIEWER,
          },
        });

        const token = jwt.sign({ userId: user.id }, JWT_SECRET);

        return {
          token,
          user,
        };
      } catch (error) {
        console.error("Registration error:", error);
        throw error;
      }
    },

    login: async (_: any, { input }: { input: any }, context: Context) => {
      try {
        const { email, password } = input;

        const user = await prisma.user.findUnique({
          where: { email },
        });

        if (!user || !user.password) {
          throw new GraphQLError("Invalid credentials", {
            extensions: { code: "UNAUTHORIZED" },
          });
        }

        const validPassword = await bcrypt.compare(password, user.password);
        if (!validPassword) {
          throw new GraphQLError("Invalid credentials", {
            extensions: { code: "UNAUTHORIZED" },
          });
        }

        const token = jwt.sign({ userId: user.id }, JWT_SECRET);

        return {
          token,
          user,
        };
      } catch (error) {
        console.error("Login error:", error);
        throw error;
      }
    },
  },
};

export default authMutationResolvers;
