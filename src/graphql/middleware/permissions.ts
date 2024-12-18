import { GraphQLError } from "graphql";
import { PrismaClient, UserRole } from "@prisma/client";
import jwt from "jsonwebtoken";

const JWT_SECRET = process.env.JWT_SECRET || "your-secret-key";

interface Context {
  prisma: PrismaClient;
  req: Request;
  user?: {
    id: number;
    role: UserRole;
  };
}

// Role hierarchy
const roleHierarchy: { [key in UserRole]: number } = {
  ADMIN: 3,
  EDITOR: 2,
  VIEWER: 1,
};

export const getUserFromToken = async (
  token: string | undefined,
  prisma: PrismaClient
) => {
  if (!token) return null;

  try {
    const decoded = jwt.verify(token, JWT_SECRET) as { userId: number };
    return await prisma.user.findUnique({
      where: { id: decoded.userId },
      select: { id: true, role: true },
    });
  } catch (error) {
    return null;
  }
};

export const checkPermission = (userRole: UserRole, requiredRole: UserRole) => {
  return roleHierarchy[userRole] >= roleHierarchy[requiredRole];
};

export const requireAuth =
  (next: any) => async (root: any, args: any, context: Context, info: any) => {
    const token = context.req.headers
      .get("authorization")
      ?.replace("Bearer ", "");
    const user = await getUserFromToken(token, context.prisma);

    if (!user) {
      throw new GraphQLError("Not authenticated", {
        extensions: { code: "UNAUTHENTICATED" },
      });
    }

    context.user = user;
    return next(root, args, context, info);
  };

export const requireRole =
  (role: UserRole) =>
  (next: any) =>
  async (root: any, args: any, context: Context, info: any) => {
    const token = context.req.headers
      .get("authorization")
      ?.replace("Bearer ", "");
    const user = await getUserFromToken(token, context.prisma);

    if (!user) {
      throw new GraphQLError("Not authenticated", {
        extensions: { code: "UNAUTHENTICATED" },
      });
    }

    if (!checkPermission(user.role, role)) {
      throw new GraphQLError(
        `Access denied. Required role: ${role}, Current role: ${user.role}`,
        {
          extensions: { code: "FORBIDDEN" },
        }
      );
    }

    context.user = user;
    return next(root, args, context, info);
  };

// Middleware functions for common permission patterns
export const adminOnly = requireRole(UserRole.ADMIN);
export const editorOrHigher = requireRole(UserRole.EDITOR);
export const viewerOrHigher = requireRole(UserRole.VIEWER);
