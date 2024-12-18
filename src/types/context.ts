import { PrismaClient, UserRole } from "@prisma/client";
import { NextRequest } from "next/server";

export interface Context {
  prisma: PrismaClient;
  req: NextRequest;
  user?: {
    id: number;
    role: UserRole;
  } | null;
}
