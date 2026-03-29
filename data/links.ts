import "server-only";

import { and, desc, eq } from "drizzle-orm";

import db from "@/db";
import { links } from "@/db/schema";

const RANDOM_SLUG_ALPHABET = "abcdefghjkmnpqrstuvwxyz23456789";
const RANDOM_SLUG_LENGTH = 7;
const MAX_SLUG_GENERATION_ATTEMPTS = 5;

function generateRandomSlug(length = RANDOM_SLUG_LENGTH) {
  return Array.from({ length }, () => {
    const index = Math.floor(Math.random() * RANDOM_SLUG_ALPHABET.length);
    return RANDOM_SLUG_ALPHABET[index];
  }).join("");
}

function isUniqueViolationError(error: unknown) {
  return (
    typeof error === "object" &&
    error !== null &&
    "code" in error &&
    error.code === "23505"
  );
}

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

type CreateLinkInput = {
  userId: string;
  originalUrl: string;
  customSlug?: string;
};

type UpdateLinkInput = {
  userId: string;
  id: number;
  originalUrl: string;
  slug: string;
};

type DeleteLinkInput = {
  userId: string;
  id: number;
};

export async function createLinkByUserId({
  userId,
  originalUrl,
  customSlug,
}: CreateLinkInput) {
  if (customSlug) {
    try {
      const [createdLink] = await db
        .insert(links)
        .values({
          userId,
          originalUrl,
          slug: customSlug,
        })
        .returning({
          id: links.id,
          slug: links.slug,
        });

      return createdLink;
    } catch (error) {
      if (isUniqueViolationError(error)) {
        throw new Error("This slug is already in use.");
      }

      throw error;
    }
  }

  for (let attempt = 0; attempt < MAX_SLUG_GENERATION_ATTEMPTS; attempt += 1) {
    const generatedSlug = generateRandomSlug();

    try {
      const [createdLink] = await db
        .insert(links)
        .values({
          userId,
          originalUrl,
          slug: generatedSlug,
        })
        .returning({
          id: links.id,
          slug: links.slug,
        });

      return createdLink;
    } catch (error) {
      if (isUniqueViolationError(error)) {
        continue;
      }

      throw error;
    }
  }

  throw new Error("Failed to create a unique slug. Please try again.");
}

export async function updateLinkByUserId({
  userId,
  id,
  originalUrl,
  slug,
}: UpdateLinkInput) {
  try {
    const [updatedLink] = await db
      .update(links)
      .set({
        originalUrl,
        slug,
        updatedAt: new Date(),
      })
      .where(and(eq(links.id, id), eq(links.userId, userId)))
      .returning({
        id: links.id,
        slug: links.slug,
      });

    if (!updatedLink) {
      throw new Error("Link not found.");
    }

    return updatedLink;
  } catch (error) {
    if (isUniqueViolationError(error)) {
      throw new Error("This slug is already in use.");
    }

    throw error;
  }
}

export async function deleteLinkByUserId({ userId, id }: DeleteLinkInput) {
  const [deletedLink] = await db
    .delete(links)
    .where(and(eq(links.id, id), eq(links.userId, userId)))
    .returning({
      id: links.id,
    });

  if (!deletedLink) {
    throw new Error("Link not found.");
  }

  return deletedLink;
}
