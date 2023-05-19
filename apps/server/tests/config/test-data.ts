import { defaultRoles } from "@src/lib/database";

export const rolePayload = () => ({
  name: `supplier${Math.random()}`,
});

export const adminPayload = () => ({
  username: `admin${Math.random()}`,
  bio: "bio",
  url: "url",
  roleId: defaultRoles.ADMIN,
  email: `${Math.random()}admin@bloggy.com`,
  password: "$2b$10$yMyEEGz4P6ScAzlJHCh6yeiHhliD9UGeAIn9/D4BGaKU4jguFnGpS",
});

export const userPayload = () => ({
  username: `John${Math.random()}`,
  bio: "John's bio",
  url: "https://web.com",
  roleId: defaultRoles.MEMBER,
  email: `${Math.random()}john@bloggy.com`,
  password: "$2b$10$yMyEEGz4P6ScAzlJHCh6yeiHhliD9UGeAIn9/D4BGaKU4jguFnGpS",
});
