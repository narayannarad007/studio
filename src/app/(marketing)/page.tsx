import {
  ArrowRight,
  BarChart3,
  FileText,
  Globe,
  KanbanSquare,
  MessageSquare,
  Wand2,
} from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { PlaceHolderImages } from "@/lib/placeholder-images";

const features = [
  {
    icon: <BarChart3 className="w-8 h-8 text-primary" />,
    title: "AI-Powered Job Analysis",
    description: "Instantly score jobs against your profile and identify skill gaps.",
  },
  {
    icon: <FileText className="w-8 h-8 text-primary" />,
    title: "Resume & Profile Management",
    description: "Keep your professional details and resume parsed and ready for analysis.",
  },
  {
    icon: <Wand2 className="w-8 h-8 text-primary" />,
    title: "Tailored Application Generator",
    description: "Generate job-specific resume suggestions and personalized cover letters.",
  },
  {
    icon: <KanbanSquare className="w-8 h-8 text-primary" />,
    title: "Comprehensive Application Tracker",
    description: "Manage your job applications from saved to offer in one place.",
  },
  {
    icon: <Globe className="w-8 h-8 text-primary" />,
    title: "Browser Extension",
    description: "Save and analyze jobs directly from your browser as you discover them.",
  },
  {
    icon: <MessageSquare className="w-8 h-8 text-primary" />,
    title: "Interview Preparation",
    description: "Get AI-generated interview questions and answer guidance for any role.",
  },
];

const heroImage = PlaceHolderImages.find((img) => img.id === "hero-image");

export default function HomePage() {
  return (
    <div className="flex flex-col">
      <section className="relative w-full py-20 md:py-32 lg:py-40">
        <div className="container px-4 md:px-6">
          <div className="grid gap-6 lg:grid-cols-2 lg:gap-16">
            <div className="flex flex-col justify-center space-y-4">
              <h1 className="text-4xl font-bold tracking-tighter sm:text-5xl md:text-6xl lg:text-7xl font-headline text-balance">
                Land Your Dream Job Faster with AI
              </h1>
              <p className="max-w-[600px] text-muted-foreground md:text-xl">
                CareerPilot AI analyzes job descriptions, optimizes your
                resume, and generates tailored cover letters to help you stand out.
              </p>
              <div className="flex flex-col gap-4 sm:flex-row">
                <Link href="/signup">
                  <Button size="lg">
                    Get Started Free <ArrowRight className="ml-2 h-5 w-5" />
                  </Button>
                </Link>
                <Link href="#features">
                  <Button size="lg" variant="outline">
                    Learn More
                  </Button>
                </Link>
              </div>
            </div>
            <div className="relative">
              {heroImage && (
                <Image
                  src={heroImage.imageUrl}
                  alt={heroImage.description}
                  width={1200}
                  height={800}
                  data-ai-hint={heroImage.imageHint}
                  className="mx-auto aspect-video overflow-hidden rounded-xl object-cover"
                />
              )}
            </div>
          </div>
        </div>
      </section>

      <section id="features" className="w-full py-20 md:py-32 bg-white dark:bg-card">
        <div className="container px-4 md:px-6">
          <div className="flex flex-col items-center justify-center space-y-4 text-center">
            <div className="space-y-2">
              <div className="inline-block rounded-lg bg-muted px-3 py-1 text-sm">
                Key Features
              </div>
              <h2 className="text-3xl font-bold tracking-tighter sm:text-5xl font-headline">
                Your AI-Powered Job Search Toolkit
              </h2>
              <p className="max-w-[900px] text-muted-foreground md:text-xl/relaxed lg:text-base/relaxed xl:text-xl/relaxed">
                Everything you need to navigate the job market with confidence and efficiency.
              </p>
            </div>
          </div>
          <div className="mx-auto grid max-w-5xl items-start gap-8 sm:grid-cols-2 md:gap-12 lg:max-w-none lg:grid-cols-3 pt-12">
            {features.map((feature) => (
              <Card key={feature.title} className="h-full">
                <CardHeader>
                  {feature.icon}
                  <CardTitle className="pt-4 font-headline">{feature.title}</CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-muted-foreground">{feature.description}</p>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>
      
      <section className="w-full py-20 md:py-32">
        <div className="container grid items-center justify-center gap-4 px-4 text-center md:px-6">
          <div className="space-y-3">
            <h2 className="text-3xl font-bold tracking-tighter md:text-4xl/tight font-headline">
              Ready to take control of your job search?
            </h2>
            <p className="mx-auto max-w-[600px] text-muted-foreground md:text-xl/relaxed lg:text-base/relaxed xl:text-xl/relaxed">
              Stop guessing and start getting results. Let our AI copilot guide you to your next career opportunity.
            </p>
          </div>
          <div className="mx-auto w-full max-w-sm space-y-2">
             <Link href="/signup">
                <Button size="lg" className="w-full">
                  Sign Up Now
                </Button>
              </Link>
          </div>
        </div>
      </section>
    </div>
  );
}
