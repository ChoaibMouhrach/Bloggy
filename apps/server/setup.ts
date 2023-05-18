import { database } from "@src/lib/database";

afterAll(() => database.$disconnect());
