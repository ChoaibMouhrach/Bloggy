"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const database_1 = require("@src/lib/database");
afterAll(() => database_1.database.$disconnect());
