'use client';

import { useUser } from '@/firebase';
import { useJobs } from '@/hooks/useJobs';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import Link from 'next/link';
import { 
  Briefcase, 
  Plus,
  ArrowUpRight,
  CheckCircle2,
  Clock,
  Rocket
} from 'lucide-react';
import { Badge } from "@/components/ui/badge";

import { OnboardingChecklist } from '@/components/onboarding-checklist';
import { useProfile, useResumes } from '@/hooks/useJobs';

export default function DashboardPage() {
  const { user, isUserLoading } = useUser();
  const { jobs, isLoading: isJobsLoading } = useJobs();
  const { usage, plan, isLoading: isUsageLoading } = useUserUsage();
  const { profile, isLoading: isProfileLoading } = useProfile();
  const { resumes, isLoading: isResumesLoading } = useResumes();

  if (isUserLoading || isJobsLoading || isUsageLoading || isProfileLoading || isResumesLoading || !user) {
    return (
      <div className="flex flex-col h-64 items-center justify-center gap-4">
        <div className="h-12 w-12 border-4 border-primary border-t-transparent rounded-full animate-spin"></div>
        <p className="text-muted-foreground animate-pulse">Loading your career dashboard...</p>
      </div>
    );
  }

  const onboardingSteps = [
    {
      id: 1,
      title: "Upload Resume",
      description: "Upload your primary resume for AI parsing.",
      href: "/resumes",
      isCompleted: (resumes?.length || 0) > 0
    },
    {
      id: 2,
      title: "Fix Profile",
      description: "Complete your basic career preferences.",
      href: "/profile",
      isCompleted: !!profile?.fullName && !!profile?.keySkills?.length
    },
    {
      id: 3,
      title: "First Job",
      description: "Track your first target job opening.",
      href: "/jobs",
      isCompleted: (jobs?.length || 0) > 0
    },
    {
      id: 4,
      title: "AI Analysis",
      description: "Run an AI match score for your first job.",
      href: "/jobs",
      isCompleted: (usage?.jobAnalyses || 0) > 0
    }
  ];

  const stats = [
    { title: 'Saved Jobs', value: jobs?.filter(j => j.status === 'saved').length.toString() || '0', icon: Briefcase, color: 'text-blue-500' },
    { title: 'Applications', value: jobs?.filter(j => j.status === 'applied').length.toString() || '0', icon: CheckCircle2, color: 'text-green-500' },
    { title: 'Interviews', value: jobs?.filter(j => j.status === 'interview').length.toString() || '0', icon: Clock, color: 'text-violet-500' },
  ];

  const recentJobs = jobs?.slice(0, 3) || [];

  return (
    <div className="space-y-8 animate-in fade-in duration-500">
      <header className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h2 className="text-3xl font-bold font-headline text-primary tracking-tight">
            Welcome, {user.displayName?.split(' ')[0] || 'Explorer'}!
          </h2>
          <p className="text-muted-foreground mt-1 text-lg">Your job search is gaining altitude. 🚀</p>
        </div>
        <div className="flex gap-3">
          {plan === 'free' && (
            <Link href="/pricing" passHref>
              <Button variant="outline" className="border-amber-500/50 text-amber-600 hover:bg-amber-50">
                <Sparkles className="h-4 w-4 mr-2" />
                Go Pro (₹299)
              </Button>
            </Link>
          )}
          <Link href="/jobs" passHref>
            <Button className="bg-primary hover:bg-primary/90 text-primary-foreground shadow-lg flex gap-2 w-fit">
              <Plus className="h-4 w-4" />
              Track New Job
            </Button>
          </Link>
        </div>
      </header>

      {/* Onboarding Section */}
      <OnboardingChecklist steps={onboardingSteps} />

      {/* Stats and Usage Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
        <div className="lg:col-span-3 grid grid-cols-1 md:grid-cols-3 gap-6">
          {stats.map((stat) => (
            <Card key={stat.title} className="border-primary/5 bg-card/50 backdrop-blur-sm shadow-sm hover:shadow-md transition-all hover:-translate-y-1">
              <CardContent className="pt-6 flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-muted-foreground">{stat.title}</p>
                  <h3 className="text-3xl font-bold mt-1 tracking-tight">{stat.value}</h3>
                </div>
                <div className={`p-3 rounded-xl bg-opacity-10 ${stat.color} bg-current`}>
                  <stat.icon className="h-6 w-6" />
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
        <div className="lg:col-span-1">
          <UsageMeter usage={usage} plan={plan} />
        </div>
      </div>

      {/* Content Section */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        <Card className="border-primary/5 bg-card/50 shadow-sm">
          <CardHeader className="flex flex-row items-center justify-between">
            <CardTitle className="text-xl font-headline">Recent Applications</CardTitle>
            <Link href="/jobs">
              <Button variant="ghost" size="sm" className="text-primary hover:bg-primary/5">View All</Button>
            </Link>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {recentJobs.length > 0 ? (
                recentJobs.map((job) => (
                  <Link key={job.id} href={`/jobs/${job.id}`}>
                    <div className="flex items-center justify-between p-4 rounded-xl bg-background/50 border border-primary/5 hover:border-primary/20 transition-all group mb-4 last:mb-0 cursor-pointer">
                      <div className="flex items-center gap-4">
                        <div className="h-10 w-10 rounded-lg bg-primary/10 flex items-center justify-center font-bold text-primary group-hover:scale-110 transition-transform">
                          {job.company[0]}
                        </div>
                        <div>
                          <p className="font-semibold text-foreground">{job.title}</p>
                          <p className="text-sm text-muted-foreground">{job.company}</p>
                        </div>
                      </div>
                      <div className="flex items-center gap-4">
                        <Badge variant={job.status === 'applied' ? 'default' : job.status === 'interview' ? 'secondary' : 'outline'} className="rounded-full capitalize">
                          {job.status}
                        </Badge>
                        <ArrowUpRight className="h-4 w-4 text-muted-foreground group-hover:text-primary transition-colors" />
                      </div>
                    </div>
                  </Link>
                ))
              ) : (
                <div className="text-center py-8">
                  <p className="text-muted-foreground italic">No jobs tracked yet.</p>
                  <Link href="/jobs" className="text-primary hover:underline mt-2 inline-block">Start tracking jobs</Link>
                </div>
              )}
            </div>
          </CardContent>
        </Card>

        <Card className="border-primary/5 bg-card/50 shadow-sm relative overflow-hidden">
          <div className="absolute top-0 right-0 p-4 opacity-5">
            <Rocket className="h-24 w-24 text-primary rotate-45" />
          </div>
          <CardHeader>
            <CardTitle className="text-xl font-headline">AI Career Insight</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="p-6 rounded-2xl bg-gradient-to-br from-primary/5 to-accent/5 border border-primary/10 relative z-10">
              <div className="flex items-start gap-4">
                <div className="h-12 w-12 rounded-full bg-accent/20 flex items-center justify-center flex-shrink-0">
                  <Rocket className="h-6 w-6 text-accent" />
                </div>
                <div>
                  <h4 className="font-bold text-lg text-primary">Optimize your search</h4>
                  <p className="text-muted-foreground mt-2 leading-relaxed">
                    {recentJobs.length > 0 ? (
                      <>Try our **Resume Optimizer** to potentially increase your match score for the **{recentJobs[0].title}** role by 15%.</>
                    ) : (
                      <>Upload your resume to get personalized insights and match scores for your favorite jobs.</>
                    )}
                  </p>
                  <Link href={recentJobs.length > 0 ? "/jobs" : "/resumes"}>
                    <Button variant="outline" className="mt-4 border-accent/20 text-accent hover:bg-accent/10 transition-colors">
                      {recentJobs.length > 0 ? 'Optimize Resume' : 'Upload Resume'}
                    </Button>
                  </Link>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}

