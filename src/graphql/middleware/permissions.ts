import { GraphQLError } from "graphql";
import { PrismaClient, UserRole } from "@prisma/client";
import { rule, shield, and, allow, or } from "graphql-shield";
import { Context } from "../../types/context";
import jwt from "jsonwebtoken";

const JWT_SECRET = process.env.JWT_SECRET || "your-secret-key";

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

// Base rules
const isAuthenticated = rule()(async (_parent, _args, ctx: Context) => {
  const token = ctx.req.headers.get("authorization")?.replace("Bearer ", "");

  if (!token) return false;

  try {
    const user = await getUserFromToken(token, ctx.prisma);
    if (!user) return false;

    // Attach user to context
    ctx.user = user;
    return true;
  } catch (error) {
    console.error("Auth error:", error);
    return false;
  }
});

const isAdmin = rule()(async (_parent, _args, ctx: Context) => {
  console.log("Checking admin role...");
  console.log("User role:", ctx.user?.role);
  return ctx.user?.role === "ADMIN";
});

const isEditor = rule()(async (_parent, _args, ctx: Context) => {
  console.log("Checking editor role...");
  console.log("User role:", ctx.user?.role);
  return ["ADMIN", "EDITOR"].includes(ctx.user?.role || "");
});

const isTeamOwner = rule()(async (parent, args, ctx: Context) => {
  const teamId = args.id || args.teamId;
  if (!teamId) return false;

  const team = await ctx.prisma.team.findUnique({
    where: { id: teamId },
    select: { userId: true },
  });

  return team?.userId === ctx.user?.id;
});

// Permissions shield
export const permissions = shield(
  {
    Query: {
      // Public queries (no auth required)
      me: allow,
      getTeam: allow,
      teamDetails: allow,
      leagueStats: allow,
      fixtures: allow,
      league: allow,

      // Protected queries (require authentication and proper role)
      getTeams: isEditor,
      getLeagues: isEditor,
      getAdminStats: isAdmin,
      getAllUsers: isAdmin,
      myTeams: isAuthenticated,
      teams: and(isAuthenticated, or(isAdmin, isEditor)),
    },
    Mutation: {
      // Public mutations
      login: allow,
      register: allow,

      // Team mutations (require editor or admin)
      createTeam: isEditor,
      updateTeam: and(isAuthenticated, or(isAdmin, isTeamOwner)),
      deleteTeam: isEditor,

      // League mutations (require editor or admin)
      createLeague: isEditor,
      updateLeague: isEditor,
      deleteLeague: isEditor,

      // Fixture mutations (require editor or admin)
      createFixture: isEditor,
      updateFixture: isEditor,
      deleteFixture: isEditor,

      // Admin only mutations
      updateUserRole: isAdmin,
      deleteUser: isAdmin,
      assignTeam: isAdmin,
    },
  },
  {
    allowExternalErrors: true,
    fallbackError: "Not authorized to perform this action",
    fallbackRule: isAuthenticated,
  }
);
