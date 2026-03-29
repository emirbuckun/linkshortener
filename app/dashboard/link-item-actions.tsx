"use client";

import { Pencil, Trash2 } from "lucide-react";
import { type ComponentProps, useState, useTransition } from "react";
import { useRouter } from "next/navigation";

import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

import { deleteLinkAction, updateLinkAction } from "./actions";

type LinkItemActionsProps = Readonly<{
  link: {
    id: number;
    originalUrl: string;
    slug: string;
  };
}>;

export function LinkItemActions({ link }: LinkItemActionsProps) {
  const router = useRouter();
  const [isEditOpen, setIsEditOpen] = useState(false);
  const [isDeleteOpen, setIsDeleteOpen] = useState(false);
  const [isEditPending, startEditTransition] = useTransition();
  const [isDeletePending, startDeleteTransition] = useTransition();
  const [originalUrl, setOriginalUrl] = useState(link.originalUrl);
  const [slug, setSlug] = useState(link.slug);
  const [editError, setEditError] = useState<string | null>(null);
  const [deleteError, setDeleteError] = useState<string | null>(null);

  const handleEditOpenChange = (nextOpen: boolean) => {
    setIsEditOpen(nextOpen);

    if (nextOpen) {
      setOriginalUrl(link.originalUrl);
      setSlug(link.slug);
      setEditError(null);
      return;
    }

    setEditError(null);
  };

  const handleDeleteOpenChange = (nextOpen: boolean) => {
    setIsDeleteOpen(nextOpen);

    if (!nextOpen) {
      setDeleteError(null);
    }
  };

  const handleEditSubmit: NonNullable<ComponentProps<"form">["onSubmit"]> = (
    event
  ) => {
    event.preventDefault();
    setEditError(null);

    startEditTransition(async () => {
      const result = await updateLinkAction({
        id: link.id,
        originalUrl,
        slug: slug.trim().toLowerCase(),
      });

      if ("error" in result) {
        setEditError(result.error);
        return;
      }

      setIsEditOpen(false);
      router.refresh();
    });
  };

  const handleDeleteConfirm = () => {
    setDeleteError(null);

    startDeleteTransition(async () => {
      const result = await deleteLinkAction({ id: link.id });

      if ("error" in result) {
        setDeleteError(result.error);
        return;
      }

      setIsDeleteOpen(false);
      router.refresh();
    });
  };

  return (
    <div className="flex items-center gap-2">
      <Dialog open={isEditOpen} onOpenChange={handleEditOpenChange}>
        <DialogTrigger asChild>
          <Button
            size="icon"
            variant="outline"
            aria-label="Edit link"
            title="Edit link"
          >
            <Pencil className="size-4" aria-hidden="true" />
            <span className="sr-only">Edit link</span>
          </Button>
        </DialogTrigger>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Edit link</DialogTitle>
            <DialogDescription>
              Update your destination URL or slug.
            </DialogDescription>
          </DialogHeader>

          <form onSubmit={handleEditSubmit} className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor={`edit-original-url-${link.id}`}>Destination URL</Label>
              <Input
                id={`edit-original-url-${link.id}`}
                type="url"
                value={originalUrl}
                onChange={(event) => setOriginalUrl(event.target.value)}
                required
                disabled={isEditPending}
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor={`edit-slug-${link.id}`}>Slug</Label>
              <Input
                id={`edit-slug-${link.id}`}
                type="text"
                value={slug}
                onChange={(event) => setSlug(event.target.value)}
                required
                disabled={isEditPending}
              />
            </div>

            {editError ? <p className="text-sm text-destructive">{editError}</p> : null}

            <DialogFooter>
              <Button type="submit" disabled={isEditPending}>
                {isEditPending ? "Saving..." : "Save Changes"}
              </Button>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>

      <Dialog open={isDeleteOpen} onOpenChange={handleDeleteOpenChange}>
        <DialogTrigger asChild>
          <Button
            size="icon"
            variant="destructive"
            aria-label="Delete link"
            title="Delete link"
          >
            <Trash2 className="size-4" aria-hidden="true" />
            <span className="sr-only">Delete link</span>
          </Button>
        </DialogTrigger>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Delete link?</DialogTitle>
            <DialogDescription>
              This will permanently delete /{link.slug} and its click history.
            </DialogDescription>
          </DialogHeader>

          {deleteError ? (
            <p className="text-sm text-destructive">{deleteError}</p>
          ) : null}

          <DialogFooter>
            <Button
              type="button"
              variant="outline"
              onClick={() => setIsDeleteOpen(false)}
              disabled={isDeletePending}
            >
              Cancel
            </Button>
            <Button
              type="button"
              variant="destructive"
              onClick={handleDeleteConfirm}
              disabled={isDeletePending}
            >
              {isDeletePending ? "Deleting..." : "Delete"}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
