"use server";

import { auth } from "@clerk/nextjs/server";
import { revalidatePath } from "next/cache";
import { z } from "zod";

import {
  createLinkByUserId,
  deleteLinkByUserId,
  updateLinkByUserId,
} from "@/data/links";

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

const updateLinkInputSchema = z.object({
  id: z.number().int().positive(),
  originalUrl: z.url().trim().max(2048),
  slug: z
    .string()
    .trim()
    .min(3)
    .max(50)
    .regex(/^[a-z0-9-]+$/),
});

const deleteLinkInputSchema = z.object({
  id: z.number().int().positive(),
});

export type CreateLinkActionInput = {
  originalUrl: string;
  slug?: string;
};

export type UpdateLinkActionInput = {
  id: number;
  originalUrl: string;
  slug: string;
};

export type DeleteLinkActionInput = {
  id: number;
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

export type UpdateLinkActionResult =
  | {
    success: {
      id: number;
      slug: string;
    };
  }
  | {
    error: string;
  };

export type DeleteLinkActionResult =
  | {
    success: {
      id: number;
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

export async function updateLinkAction(
  input: UpdateLinkActionInput
): Promise<UpdateLinkActionResult> {
  const { userId } = await auth();

  if (!userId) {
    return { error: "You must be signed in to edit a link." };
  }

  const parsedInput = updateLinkInputSchema.safeParse(input);

  if (!parsedInput.success) {
    const firstError = parsedInput.error.issues[0]?.message;
    return {
      error: firstError ?? "Please provide a valid URL and slug.",
    };
  }

  try {
    const updatedLink = await updateLinkByUserId({
      userId,
      id: parsedInput.data.id,
      originalUrl: parsedInput.data.originalUrl,
      slug: parsedInput.data.slug,
    });

    revalidatePath("/dashboard");

    return {
      success: {
        id: updatedLink.id,
        slug: updatedLink.slug,
      },
    };
  } catch (error) {
    const message =
      error instanceof Error
        ? error.message
        : "Failed to update the link. Please try again.";

    return { error: message };
  }
}

export async function deleteLinkAction(
  input: DeleteLinkActionInput
): Promise<DeleteLinkActionResult> {
  const { userId } = await auth();

  if (!userId) {
    return { error: "You must be signed in to delete a link." };
  }

  const parsedInput = deleteLinkInputSchema.safeParse(input);

  if (!parsedInput.success) {
    const firstError = parsedInput.error.issues[0]?.message;
    return {
      error: firstError ?? "Invalid link id.",
    };
  }

  try {
    const deletedLink = await deleteLinkByUserId({
      userId,
      id: parsedInput.data.id,
    });

    revalidatePath("/dashboard");

    return {
      success: {
        id: deletedLink.id,
      },
    };
  } catch (error) {
    const message =
      error instanceof Error
        ? error.message
        : "Failed to delete the link. Please try again.";

    return { error: message };
  }
}
