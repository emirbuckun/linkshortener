import { auth } from "@clerk/nextjs/server";
import { redirect } from "next/navigation";
import { SignInButton, SignUpButton } from "@clerk/nextjs";
import { Link2, BarChart2, Pencil, LayoutDashboard } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardHeader,
  CardTitle,
  CardDescription,
  CardContent,
} from "@/components/ui/card";

const features = [
  {
    icon: Link2,
    title: "Instant URL Shortening",
    description:
      "Paste any long URL and get a clean, shareable short link in seconds. No setup required.",
  },
  {
    icon: BarChart2,
    title: "Click Analytics",
    description:
      "See how many times each link has been clicked and understand how your links perform over time.",
  },
  {
    icon: Pencil,
    title: "Custom Aliases",
    description:
      "Create memorable, branded short links with custom slugs that reflect your content.",
  },
  {
    icon: LayoutDashboard,
    title: "Easy Management",
    description:
      "Manage all your shortened links from one place. Edit, delete, or copy them with a single click.",
  },
];

export default async function Home() {
  const { userId } = await auth();

  if (userId) {
    redirect("/dashboard");
  }

  return (
    <div className="flex flex-col flex-1">
      {/* Hero */}
      <section className="flex flex-col items-center justify-center flex-1 text-center px-4 py-24 gap-8">
        <div className="flex flex-col items-center gap-4 max-w-2xl">
          <h1 className="text-4xl sm:text-5xl font-bold tracking-tight">
            Shorten. Share. Track.
          </h1>
          <p className="text-lg text-muted-foreground max-w-lg">
            Link Shortener turns your long, unwieldy URLs into clean short links
            you can share anywhere — and tracks every click along the way.
          </p>
        </div>
        <div className="flex flex-wrap items-center justify-center gap-3">
          <SignUpButton mode="modal">
            <Button size="lg" className="px-6">
              Get Started for Free
            </Button>
          </SignUpButton>
          <SignInButton mode="modal">
            <Button size="lg" variant="outline" className="px-6">
              Sign In
            </Button>
          </SignInButton>
        </div>
      </section>

      {/* Features */}
      <section className="px-4 pb-24">
        <div className="mx-auto max-w-5xl">
          <h2 className="text-2xl font-semibold text-center mb-10">
            Everything you need to manage your links
          </h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            {features.map(({ icon: Icon, title, description }) => (
              <Card key={title}>
                <CardHeader>
                  <div className="mb-1">
                    <Icon className="size-6 text-primary" />
                  </div>
                  <CardTitle>{title}</CardTitle>
                </CardHeader>
                <CardContent>
                  <CardDescription>{description}</CardDescription>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>
    </div>
  );
}
