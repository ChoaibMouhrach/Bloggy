import { PrismaClient, User } from "@prisma/client";

// prisma instance
export const database = new PrismaClient();

// roles
export const defaultRoles = {
  ADMIN: 1,
  MEMBER: 2,
};

// remove hidden fields from user
export const prepareUser = (user: User) => {
  const newUser = user as Partial<User> & { id: number };
  delete newUser.password;
  return newUser;
};
