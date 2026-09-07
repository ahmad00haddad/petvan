import { createServerFn } from "@tanstack/react-start";
import { prisma } from "../lib/prisma";

export const registerUserFn = createServerFn({ method: "POST" })
  .validator((data: { email: string; name: string; password: string }) => data)
  .handler(async ({ data }) => {
    // In a real app, hash the password. For this demo we store it plain.
    const email = data.email.trim().toLowerCase();
    const existingUser = await prisma.user.findUnique({
      where: { email },
    });

    if (existingUser) {
      return { ok: false as const, error: "User already exists" };
    }

    const user = await prisma.user.create({
      data: {
        email,
        name: data.name,
        password: data.password, // demo only
      },
    });

    return { ok: true as const, user };
  });

export const loginUserFn = createServerFn({ method: "POST" })
  .validator((data: { email: string; password: string }) => data)
  .handler(async ({ data }) => {
    const user = await prisma.user.findUnique({
      where: { email: data.email.trim().toLowerCase() },
    });

    if (!user || user.password !== data.password) {
      return { ok: false as const, error: "Invalid email or password" };
    }

    return { ok: true as const, user };
  });

export const getUserFn = createServerFn({ method: "GET" })
  .validator((userId: string | null) => userId)
  .handler(async ({ data: userId }) => {
    if (!userId) return null;
    return await prisma.user.findUnique({
      where: { id: userId },
    });
  });
