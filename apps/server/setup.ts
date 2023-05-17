import { database } from "@src/lib/database";

afterAll(async () => await database.$disconnect())
