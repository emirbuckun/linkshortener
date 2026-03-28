import "server-only";

import { desc, eq } from "drizzle-orm";

import db from "@/db";
import { links } from "@/db/schema";

export async function getLinksByUserId(userId: string) {
  return db
    .select({
      id: links.id,
      originalUrl: links.originalUrl,
      slug: links.slug,
      clickCount: links.clickCount,
      createdAt: links.createdAt,
    })
    .from(links)
    .where(eq(links.userId, userId))
    .orderBy(desc(links.createdAt));
}
