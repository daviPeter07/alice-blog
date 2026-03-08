import { prisma } from '@/lib/prisma';
import type { User } from '@/lib/prisma';

export async function getUserByEmail(email: string): Promise<User | null> {
  return prisma.user.findUnique({
    where: { email: email.trim().toLowerCase() },
  });
}

export interface CreateUserData {
  name: string;
  email: string;
  passwordHash: string;
}

export async function createUser(data: CreateUserData): Promise<User> {
  return prisma.user.create({
    data: {
      name: data.name.trim(),
      email: data.email.trim().toLowerCase(),
      passwordHash: data.passwordHash,
    },
  });
}
