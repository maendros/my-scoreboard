import { PrismaClient, UserRole } from "@prisma/client";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import { GraphQLError } from "graphql";
import { Context } from "@/types/context";

const prisma = new PrismaClient();
const JWT_SECRET = process.env.JWT_SECRET || "your-secret-key";

const authQueryResolvers = {
  Query: {
    me: async (_: any, __: any, context: Context) => {
      try {
        const token = context.req.headers
          .get("authorization")
          ?.replace("Bearer ", "");
        if (!token) return null;

        const decoded = jwt.verify(token, JWT_SECRET) as { userId: number };
        return await prisma.user.findUnique({
          where: { id: decoded.userId },
        });
      } catch (error) {
        return null;
      }
    },

    users: async (_: any, __: any, context: Context) => {
      const token = context.req.headers
        .get("authorization")
        ?.replace("Bearer ", "");
      if (!token) {
        throw new GraphQLError("Not authenticated", {
          extensions: { code: "UNAUTHENTICATED" },
        });
      }

      const decoded = jwt.verify(token, JWT_SECRET) as { userId: number };
      const user = await prisma.user.findUnique({
        where: { id: decoded.userId },
      });

      if (!user || user.role !== UserRole.ADMIN) {
        throw new GraphQLError("Not authorized", {
          extensions: { code: "FORBIDDEN" },
        });
      }

      return prisma.user.findMany();
    },
  },
};

export default authQueryResolvers;
