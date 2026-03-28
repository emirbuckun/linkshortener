import { auth } from "@clerk/nextjs/server";
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

export default async function DashboardPage() {
  const { userId } = await auth();

  if (!userId) {
    redirect("/");
  }

  const userLinks = await getLinksByUserId(userId);

  return (
    <div className="mx-auto w-full max-w-4xl px-4 py-10">
      <div className="mb-8">
        <h1 className="text-3xl font-bold tracking-tight">Your Links</h1>
        <p className="mt-2 text-muted-foreground">
          Manage your shortened links and monitor their performance.
        </p>
      </div>

      {userLinks.length === 0 ? (
        <Card>
          <CardHeader>
            <CardTitle>No links yet</CardTitle>
            <CardDescription>
              Create your first short link to start tracking clicks.
            </CardDescription>
          </CardHeader>
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
                <Button asChild size="sm" variant="outline">
                  <Link href={`/${link.slug}`} target="_blank" rel="noreferrer">
                    Open Link
                  </Link>
                </Button>
              </CardFooter>
            </Card>
          ))}
        </div>
      )}
    </div>
  );
}
