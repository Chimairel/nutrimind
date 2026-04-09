"use server";

import { db } from "@/lib/db";
import { signIn } from "@/lib/auth";
import bcrypt from "bcryptjs";
import { z } from "zod";

const RegisterSchema = z.object({
  name: z.string().min(2, "Name must be at least 2 characters"),
  email: z.string().email("Invalid email address"),
  password: z.string().min(8, "Password must be at least 8 characters"),
});

export async function registerUser(values: z.infer<typeof RegisterSchema>) {
  const validated = RegisterSchema.safeParse(values);

  if (!validated.success) {
    return { error: (validated as any).error.errors[0]?.message || "Validation failed" };
  }

  const { name, email, password } = validated.data;

  // Check if user already exists
  const existingUser = await db.user.findUnique({
    where: { email },
  });

  if (existingUser) {
    return { error: "Email already in use" };
  }

  const hashedPassword = await bcrypt.hash(password, 12);

  await db.user.create({
    data: {
      name,
      email,
      password: hashedPassword,
    },
  });

  // Auto sign in after registration
  await signIn("credentials", {
    email,
    password,
    redirect: false,
  });

  return { success: true };
}