import { PrismaClient, UserRole } from "@prisma/client";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import { GraphQLError } from "graphql";
import { Context } from "@/types/context";

const prisma = new PrismaClient();
const JWT_SECRET = process.env.JWT_SECRET || "your-secret-key";

type Role = "ADMIN" | "EDITOR" | "VIEWER";

const authMutationResolvers = {
  Mutation: {
    register: async (
      _: any,
      { input }: { input: { email: string; password: string; name: string } }
    ) => {
      try {
        const existingUser = await prisma.user.findUnique({
          where: { email: input.email },
        });

        if (existingUser) {
          throw new GraphQLError("User already exists", {
            extensions: { code: "BAD_USER_INPUT" },
          });
        }

        const hashedPassword = await bcrypt.hash(input.password, 10);

        const user = await prisma.user.create({
          data: {
            email: input.email,
            password: hashedPassword,
            name: input.name,
            role: "VIEWER",
          },
        });

        const token = jwt.sign(
          { userId: user.id, role: user.role },
          JWT_SECRET
        );

        return {
          token,
          user,
        };
      } catch (error) {
        console.error("Registration error:", error);
        throw error;
      }
    },

    login: async (
      _: any,
      { input }: { input: { email: string; password: string } }
    ) => {
      try {
        const user = await prisma.user.findUnique({
          where: { email: input.email },
        });

        if (!user || !user.password) {
          throw new GraphQLError("Invalid credentials", {
            extensions: { code: "UNAUTHORIZED" },
          });
        }

        const validPassword = await bcrypt.compare(
          input.password,
          user.password
        );
        if (!validPassword) {
          throw new GraphQLError("Invalid credentials", {
            extensions: { code: "UNAUTHORIZED" },
          });
        }

        const token = jwt.sign(
          { userId: user.id, role: user.role },
          JWT_SECRET
        );

        return {
          token,
          user,
        };
      } catch (error) {
        console.error("Login error:", error);
        throw error;
      }
    },

    socialLogin: async (
      _: any,
      { provider, code }: { provider: string; code: string }
    ) => {
      try {
        let userInfo;
        let accessToken;
        let refreshToken;

        if (provider === "google") {
          // Exchange code for tokens
          const tokenResponse = await fetch(
            "https://oauth2.googleapis.com/token",
            {
              method: "POST",
              headers: {
                "Content-Type": "application/json",
              },
              body: JSON.stringify({
                client_id: process.env.GOOGLE_CLIENT_ID,
                client_secret: process.env.GOOGLE_CLIENT_SECRET,
                code,
                redirect_uri:
                  process.env.NODE_ENV === "production"
                    ? "https://my-scoreboard-alpha.vercel.app"
                    : "http://localhost:5000",
                grant_type: "authorization_code",
              }),
            }
          );

          const tokenData = await tokenResponse.json();
          if (tokenData.error) {
            throw new Error(
              tokenData.error_description || "Failed to exchange Google code"
            );
          }

          accessToken = tokenData.access_token;
          refreshToken = tokenData.refresh_token;

          // Get user info
          const userResponse = await fetch(
            "https://www.googleapis.com/oauth2/v2/userinfo",
            {
              headers: {
                Authorization: `Bearer ${accessToken}`,
              },
            }
          );
          userInfo = await userResponse.json();
          if (!userInfo.email) {
            throw new Error("Failed to get user email from Google");
          }
        } else if (provider === "apple") {
          // For now, we'll just parse the ID token from Apple
          // You'll need to implement proper verification later
          try {
            const tokenParts = code.split(".");
            const payload = JSON.parse(
              Buffer.from(tokenParts[1], "base64").toString()
            );
            userInfo = {
              id: payload.sub,
              email: payload.email,
              name: payload.name || payload.email.split("@")[0],
            };
          } catch (error) {
            console.error("Apple token parsing error:", error);
            throw new Error("Invalid Apple ID token");
          }
        } else {
          throw new GraphQLError("Invalid provider", {
            extensions: { code: "BAD_USER_INPUT" },
          });
        }

        // Check if user exists
        const existingUser = await prisma.user.findUnique({
          where: { email: userInfo.email },
        });

        // Determine role
        let role: Role = "VIEWER";
        if (!existingUser) {
          const userCount = await prisma.user.count();
          if (userCount === 0) {
            role = "ADMIN";
          } else {
            const allowedAdmins =
              process.env.ALLOWED_ADMIN_EMAILS?.split(",") || [];
            if (allowedAdmins.includes(userInfo.email)) {
              role = "ADMIN";
            } else if (
              process.env.ORGANIZATION_DOMAIN &&
              userInfo.email.endsWith(`@${process.env.ORGANIZATION_DOMAIN}`)
            ) {
              role = "EDITOR";
            }
          }
        } else {
          role = existingUser.role;
        }

        // Create or update user
        const user = await prisma.user.upsert({
          where: { email: userInfo.email },
          update: {
            name: userInfo.name,
            image: userInfo.picture,
            provider,
            providerId: userInfo.sub || userInfo.id,
            accessToken,
            refreshToken,
            ...((!existingUser || role === "ADMIN") && { role }),
          },
          create: {
            email: userInfo.email,
            name: userInfo.name,
            image: userInfo.picture,
            provider,
            providerId: userInfo.sub || userInfo.id,
            role,
            accessToken,
            refreshToken,
          },
        });

        const token = jwt.sign(
          {
            userId: user.id,
            role: user.role,
            email: user.email,
            name: user.name,
          },
          JWT_SECRET,
          { expiresIn: "7d" }
        );

        return { token, user };
      } catch (err) {
        console.error("Social login error:", err);
        const error = err as Error;
        throw new GraphQLError(error.message || "Authentication failed", {
          extensions: { code: "UNAUTHORIZED" },
        });
      }
    },
  },
};

export default authMutationResolvers;
