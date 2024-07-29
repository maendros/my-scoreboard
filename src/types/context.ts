import { PrismaClient } from "@prisma/client";
import { IncomingMessage } from "http";

export interface Context {
  prisma: PrismaClient;
  req: IncomingMessage;
}
