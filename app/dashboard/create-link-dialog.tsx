"use client";

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

import { createLinkAction } from "./actions";

type CreateLinkDialogProps = Readonly<{
  triggerClassName?: string;
}>;

export function CreateLinkDialog({ triggerClassName }: CreateLinkDialogProps) {
  const router = useRouter();
  const [isPending, startTransition] = useTransition();
  const [isOpen, setIsOpen] = useState(false);
  const [originalUrl, setOriginalUrl] = useState("");
  const [slug, setSlug] = useState("");
  const [error, setError] = useState<string | null>(null);

  const handleOpenChange = (nextOpen: boolean) => {
    setIsOpen(nextOpen);

    if (!nextOpen) {
      setError(null);
    }
  };

  const handleSubmit: NonNullable<ComponentProps<"form">["onSubmit"]> = (
    event
  ) => {
    event.preventDefault();
    setError(null);

    startTransition(async () => {
      const result = await createLinkAction({
        originalUrl,
        slug: slug.trim() ? slug.trim().toLowerCase() : undefined,
      });

      if ("error" in result) {
        setError(result.error);
        return;
      }

      setOriginalUrl("");
      setSlug("");
      setIsOpen(false);
      router.refresh();
    });
  };

  return (
    <Dialog open={isOpen} onOpenChange={handleOpenChange}>
      <DialogTrigger asChild>
        <Button className={triggerClassName}>Create Link</Button>
      </DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Create a new short link</DialogTitle>
          <DialogDescription>
            Paste your destination URL and optionally choose a custom slug.
          </DialogDescription>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="original-url">Destination URL</Label>
            <Input
              id="original-url"
              type="url"
              placeholder="https://example.com/long-url"
              value={originalUrl}
              onChange={(event) => setOriginalUrl(event.target.value)}
              required
              disabled={isPending}
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="custom-slug">Custom slug (optional)</Label>
            <Input
              id="custom-slug"
              type="text"
              placeholder="my-campaign"
              value={slug}
              onChange={(event) => setSlug(event.target.value)}
              disabled={isPending}
            />
          </div>

          {error ? <p className="text-sm text-destructive">{error}</p> : null}

          <DialogFooter>
            <Button type="submit" disabled={isPending}>
              {isPending ? "Creating..." : "Create Link"}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
