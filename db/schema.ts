import { InferInsertModel, InferSelectModel } from "drizzle-orm";
import {
  index,
  integer,
  pgTable,
  text,
  timestamp,
  uniqueIndex,
  varchar,
} from "drizzle-orm/pg-core";

export const links = pgTable(
  "links",
  {
    id: integer("id").primaryKey().generatedAlwaysAsIdentity(),
    userId: text("user_id").notNull(),
    originalUrl: text("original_url").notNull(),
    slug: varchar("slug", { length: 50 }).notNull(),
    clickCount: integer("click_count").notNull().default(0),
    createdAt: timestamp("created_at", { withTimezone: true })
      .notNull()
      .defaultNow(),
    updatedAt: timestamp("updated_at", { withTimezone: true })
      .notNull()
      .defaultNow(),
  },
  (table) => [
    uniqueIndex("links_slug_unique_idx").on(table.slug),
    index("links_user_id_idx").on(table.userId),
    index("links_slug_idx").on(table.slug),
  ],
);

export type Link = InferSelectModel<typeof links>;
export type NewLink = InferInsertModel<typeof links>;
