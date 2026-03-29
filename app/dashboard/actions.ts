"use server";

import { auth } from "@clerk/nextjs/server";
import { revalidatePath } from "next/cache";
import { z } from "zod";

import { createLinkByUserId } from "@/data/links";

const createLinkInputSchema = z.object({
  originalUrl: z.url().trim().max(2048),
  slug: z
    .string()
    .trim()
    .min(3)
    .max(50)
    .regex(/^[a-z0-9-]+$/)
    .optional(),
});

export type CreateLinkActionInput = {
  originalUrl: string;
  slug?: string;
};

export type CreateLinkActionResult =
  | {
    success: {
      id: number;
      slug: string;
    };
  }
  | {
    error: string;
  };

export async function createLinkAction(
  input: CreateLinkActionInput
): Promise<CreateLinkActionResult> {
  const { userId } = await auth();

  if (!userId) {
    return { error: "You must be signed in to create a link." };
  }

  const parsedInput = createLinkInputSchema.safeParse(input);

  if (!parsedInput.success) {
    const firstError = parsedInput.error.issues[0]?.message;
    return {
      error: firstError ?? "Please provide a valid URL and slug.",
    };
  }

  try {
    const createdLink = await createLinkByUserId({
      userId,
      originalUrl: parsedInput.data.originalUrl,
      customSlug: parsedInput.data.slug,
    });

    revalidatePath("/dashboard");

    return {
      success: {
        id: createdLink.id,
        slug: createdLink.slug,
      },
    };
  } catch (error) {
    const message =
      error instanceof Error
        ? error.message
        : "Failed to create the link. Please try again.";

    return { error: message };
  }
}
