import { PrismaClient } from "@prisma/client";
import { NextRequest } from "next/server";

export interface Context {
  prisma: PrismaClient;
  req: NextRequest; // Use NextApiRequest
}
