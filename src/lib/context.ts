import { PrismaClient } from "@prisma/client";
import jwt from "jsonwebtoken";
import { Context } from "@/types/context";
import { NextRequest } from "next/server";

const prisma = new PrismaClient();

export async function createContext({
  request,
}: {
  request: NextRequest;
}): Promise<Context> {
  console.log("Creating context...");
  const token = request.headers.get("authorization")?.replace("Bearer ", "");
  console.log("Token:", token ? "exists" : "missing");

  let user = null;
  if (token) {
    try {
      const decoded = jwt.verify(token, process.env.JWT_SECRET!) as {
        userId: number;
      };
      console.log("Decoded token:", decoded);

      user = await prisma.user.findUnique({
        where: { id: decoded.userId },
        select: { id: true, role: true },
      });
      console.log("Found user:", user);
    } catch (error) {
      console.error("Auth error details:", error);
    }
  }

  const context: Context = {
    prisma,
    user,
    req: request,
  };
  console.log("Final context:", { ...context, prisma: "[PrismaClient]" });
  return context;
}
