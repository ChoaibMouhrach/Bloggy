import { defaultRoles } from "@src/lib/database";

export const adminPayload = {
  username: "admin",
  bio: "bio",
  url: "url",
  roleId: defaultRoles.ADMIN,
  email: "admin@bloggy.com",
  password: "$2b$10$yMyEEGz4P6ScAzlJHCh6yeiHhliD9UGeAIn9/D4BGaKU4jguFnGpS",
};

export const userPayload = {
  username: "John",
  bio: "John's bio",
  url: "https://web.com",
  roleId: defaultRoles.MEMBER,
  email: "john@bloggy.com",
  password: "$2b$10$yMyEEGz4P6ScAzlJHCh6yeiHhliD9UGeAIn9/D4BGaKU4jguFnGpS",
};
