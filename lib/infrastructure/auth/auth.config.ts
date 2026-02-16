import NextAuth, { DefaultSession } from "next-auth";
import { PrismaAdapter } from "@auth/prisma-adapter";
import CredentialsProvider from "next-auth/providers/credentials";
import GoogleProvider from "next-auth/providers/google";
import { compare } from "bcrypt";
import prisma from "@/lib/infrastructure/database/prisma";
import { env } from "@/config/env.config";
import { logger } from "@/utils/logger";

declare module "next-auth" {
  interface Session {
    user: {
      id: string;
      roles: string[];
      permissions: string[];
    } & DefaultSession["user"];
  }

  interface User {
    roles?: string[];
    permissions?: string[];
  }
}

export const { handlers, signIn, signOut, auth } = NextAuth({
  adapter: PrismaAdapter(prisma),
  session: {
    strategy: "jwt",
    maxAge: 30 * 24 * 60 * 60,
  },
  cookies: {
    sessionToken: {
      name: `next-auth.session-token`,
      options: {
        httpOnly: true,
        sameSite: "lax",
        path: "/",
        secure: process.env.NODE_ENV === "production",
      },
    },
  },
  pages: {
    signIn: "/auth/login",
    error: "/auth/error",
  },
  providers: [
    GoogleProvider({
      clientId: env.google.clientId,
      clientSecret: env.google.clientSecret,
      allowDangerousEmailAccountLinking: true,
    }),
    CredentialsProvider({
      name: "credentials",
      credentials: {
        email: { label: "Email", type: "email" },
        password: { label: "Password", type: "password" },
      },
      async authorize(credentials) {
        if (!credentials?.email || !credentials?.password) {
          throw new Error("Invalid credentials");
        }

        const user = await prisma.user.findUnique({
          where: {
            email: credentials.email as string,
          },
          include: {
            userRoles: {
              include: {
                role: {
                  include: {
                    rolePermissions: {
                      include: {
                        permission: true,
                      },
                    },
                  },
                },
              },
            },
          },
        });

        if (!user || !user.password) {
          throw new Error("Invalid credentials");
        }

        const isPasswordValid = await compare(credentials.password as string, user.password);

        if (!isPasswordValid) {
          throw new Error("Invalid credentials");
        }

        const roles = user.userRoles.map((ur: { role: { name: string } }) => ur.role.name);
        const permissions = user.userRoles.flatMap(
          (ur: {
            role: { rolePermissions: { permission: { resource: string; action: string } }[] };
          }) =>
            ur.role.rolePermissions.map(
              (rp: { permission: { resource: string; action: string } }) =>
                `${rp.permission.resource}:${rp.permission.action}`
            )
        );

        return {
          id: user.id,
          email: user.email,
          name: user.name,
          image: user.image,
          roles,
          permissions,
        };
      },
    }),
  ],
  callbacks: {
    async jwt({ token, user, trigger, session }) {
      if (user) {
        token.id = user.id;
        token.roles = user.roles || [];
        token.permissions = user.permissions || [];
      }

      if (trigger === "update" && session) {
        token = { ...token, ...session.user };
      }

      if (token.id && !token.roles) {
        const dbUser = await prisma.user.findUnique({
          where: { id: token.id as string },
          include: {
            userRoles: {
              include: {
                role: {
                  include: {
                    rolePermissions: {
                      include: {
                        permission: true,
                      },
                    },
                  },
                },
              },
            },
          },
        });

        if (dbUser) {
          token.roles = dbUser.userRoles.map((ur: { role: { name: string } }) => ur.role.name);
          token.permissions = dbUser.userRoles.flatMap(
            (ur: {
              role: { rolePermissions: { permission: { resource: string; action: string } }[] };
            }) =>
              ur.role.rolePermissions.map(
                (rp: { permission: { resource: string; action: string } }) =>
                  `${rp.permission.resource}:${rp.permission.action}`
              )
          );
        }
      }

      return token;
    },
    async session({ session, token }) {
      if (token && session.user) {
        session.user.id = token.id as string;
        session.user.roles = (token.roles as string[]) || [];
        session.user.permissions = (token.permissions as string[]) || [];
      }

      return session;
    },
    async signIn({ user, account }) {
      if (account?.provider === "google") {
        try {
          const existingUser = await prisma.user.findUnique({
            where: { email: user.email! },
          });

          if (!existingUser) {
            const studentRole = await prisma.role.findUnique({
              where: { name: "student" },
            });

            if (studentRole && user.id) {
              await prisma.userRole.create({
                data: {
                  userId: user.id,
                  roleId: studentRole.id,
                },
              });
            }
          }
        } catch (error) {
          logger.error("Error assigning default role", error);
        }
      }

      return true;
    },
  },
  events: {
    async signIn({ user }) {
      logger.info("User signed in", { userId: user.id, email: user.email });
    },
    async signOut(event) {
      const token = "token" in event ? event.token : null;
      logger.info("User signed out", { userId: token?.id });
    },
  },
  debug: env.app.isDevelopment,
});
