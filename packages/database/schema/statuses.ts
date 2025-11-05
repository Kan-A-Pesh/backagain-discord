import { pgTable, text, timestamp, uuid, jsonb } from "drizzle-orm/pg-core";

type Requester = {
  id: string;
  username: string;
  displayName: string;
};

export const statuses = pgTable("statuses", {
  id: uuid("id").primaryKey().defaultRandom(),
  status: text("status").notNull(),
  requester: jsonb("requester").$type<Requester>().notNull(),

  createdAt: timestamp("created_at").notNull().defaultNow(),
  updatedAt: timestamp("updated_at").notNull().defaultNow().$onUpdateFn(() => new Date()),
});