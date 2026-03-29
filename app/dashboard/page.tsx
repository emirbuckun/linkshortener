import { auth } from "@clerk/nextjs/server";
import { ExternalLink } from "lucide-react";
import Link from "next/link";
import { redirect } from "next/navigation";

import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { getLinksByUserId } from "@/data/links";

import { CreateLinkDialog } from "./create-link-dialog";
import { LinkItemActions } from "./link-item-actions";

export default async function DashboardPage() {
  const { userId } = await auth();

  if (!userId) {
    redirect("/");
  }

  const userLinks = await getLinksByUserId(userId);

  return (
    <div className="mx-auto w-full max-w-4xl px-4 py-10">
      <div className="mb-8 flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Your Links</h1>
          <p className="mt-2 text-muted-foreground">
            Manage your shortened links and monitor their performance.
          </p>
        </div>
        <CreateLinkDialog />
      </div>

      {userLinks.length === 0 ? (
        <Card>
          <CardHeader>
            <CardTitle>No links yet</CardTitle>
            <CardDescription>
              Create your first short link to start tracking clicks.
            </CardDescription>
          </CardHeader>
          <CardFooter>
            <CreateLinkDialog />
          </CardFooter>
        </Card>
      ) : (
        <div className="space-y-4">
          {userLinks.map((link) => (
            <Card key={link.id}>
              <CardHeader>
                <CardTitle className="break-all">/{link.slug}</CardTitle>
                <CardDescription className="break-all">
                  {link.originalUrl}
                </CardDescription>
              </CardHeader>
              <CardContent>
                <p className="text-sm text-muted-foreground">
                  Clicks: {link.clickCount}
                </p>
              </CardContent>
              <CardFooter className="justify-between gap-2">
                <p className="text-xs text-muted-foreground">
                  Created {new Date(link.createdAt).toLocaleString()}
                </p>
                <div className="flex items-center gap-2">
                  <Button asChild size="sm" variant="outline">
                    <Link
                      href={`/${link.slug}`}
                      target="_blank"
                      rel="noreferrer"
                      aria-label="Open link"
                      title="Open link"
                    >
                      <ExternalLink className="size-4" aria-hidden="true" />
                      <span className="sr-only">Open link</span>
                    </Link>
                  </Button>
                  <LinkItemActions
                    link={{
                      id: link.id,
                      originalUrl: link.originalUrl,
                      slug: link.slug,
                    }}
                  />
                </div>
              </CardFooter>
            </Card>
          ))}
        </div>
      )}
    </div>
  );
}
