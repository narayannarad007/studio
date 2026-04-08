'use client';

import { useState, useEffect } from "react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { Bookmark, CheckCircle, ExternalLink, Wand2, XCircle, Loader2, Sparkles, ArrowLeft } from "lucide-react";
import Link from "next/link";
import { useJobs, useJobAnalysis, useProfile, useResumes } from "@/hooks/useJobs";
import { useUser } from "@/firebase";
import { analyzeJob } from "@/ai/flows/analyze-job";
import { toast } from "sonner";
import { useParams, useRouter } from "next/navigation";
import { format } from "date-fns";

export default function JobAnalysisPage() {
  const params = useParams();
  const router = useRouter();
  const jobId = params?.jobId as string;
  
  const { getJob, updateJobStatus, saveAnalysis } = useJobs();
  const { analysis, isLoading: isAnalysisLoading } = useJobAnalysis(jobId);
  const { profile, isLoading: isProfileLoading } = useProfile();
  const { getPrimaryResume, getParsedResume, isLoading: isResumesLoading } = useResumes();
  
  const [job, setJob] = useState<any>(null);
  const [isJobLoading, setIsJobLoading] = useState(true);
  const [isAnalyzing, setIsAnalyzing] = useState(false);

  useEffect(() => {
    if (jobId) {
      getJob(jobId).then(data => {
        setJob(data);
        setIsJobLoading(false);
      });
    }
  }, [jobId]);

  const handleAnalyze = async () => {
    if (!profile) {
      toast.error("Please complete your profile first.");
      router.push("/profile");
      return;
    }

    const resume = getPrimaryResume();
    if (!resume) {
      toast.error("Please upload a resume first.");
      router.push("/resumes");
      return;
    }

    setIsAnalyzing(true);
    try {
      const parsedResume = await getParsedResume(resume.id);
      if (!parsedResume) {
        toast.error("Resume data not found. Try re-uploading.");
        return;
      }

      const { user } = useUser();
      
      const results = await analyzeJob({
        userId: user?.uid || '',
        userProfile: profile,
        structuredResume: parsedResume as any,
        structuredJob: {
          title: job.title,
          company: job.company,
          location: job.location,
          description: job.description,
        }
      });

      await saveAnalysis(jobId, results);
      toast.success("AI Analysis completed!");
    } catch (error: any) {
      console.error("Analysis failed:", error);
      if (error.message?.includes("QUOTA_EXCEEDED")) {
        toast.error(error.message.replace("QUOTA_EXCEEDED: ", ""), {
          action: {
            label: "Upgrade",
            onClick: () => router.push("/pricing")
          }
        });
      } else {
        toast.error("AI Analysis failed. Please try again.");
      }
    } finally {
      setIsAnalyzing(false);
    }
  };

  const handleUpdateStatus = async (status: any) => {
    try {
      await updateJobStatus(jobId, status);
      setJob({ ...job, status });
      toast.success(`Status updated to ${status}`);
    } catch (error) {
      toast.error("Failed to update status.");
    }
  };

  if (isJobLoading || isProfileLoading || isResumesLoading || isAnalysisLoading) {
    return (
      <div className="flex flex-col h-64 items-center justify-center gap-4">
        <Loader2 className="h-12 w-12 text-primary animate-spin" />
        <p className="text-muted-foreground animate-pulse">Loading job insights...</p>
      </div>
    );
  }

  if (!job) {
    return (
      <div className="text-center py-20">
        <h2 className="text-2xl font-bold">Job not found</h2>
        <p className="text-muted-foreground mt-2">The job you're looking for doesn't exist or you don't have access.</p>
        <Button className="mt-6" asChild>
          <Link href="/jobs">Return to Tracker</Link>
        </Button>
      </div>
    );
  }

  return (
    <div className="flex flex-col gap-6 animate-in fade-in slide-in-from-bottom-4 duration-700">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <Button variant="ghost" size="sm" className="mb-2 -ml-2" asChild>
            <Link href="/jobs"><ArrowLeft className="mr-2 h-4 w-4"/> Back to Tracker</Link>
          </Button>
          <h1 className="text-3xl font-bold tracking-tight font-headline">Job Analysis</h1>
          <p className="text-muted-foreground flex items-center gap-2">
            Insights for <span className="text-foreground font-semibold">{job.title}</span> at <span className="text-foreground font-semibold">{job.company}</span>
            {job.location && <Badge variant="outline">{job.location}</Badge>}
          </p>
        </div>
        <div className="flex gap-2">
           {!analysis && !isAnalyzing && (
            <Button onClick={handleAnalyze} className="bg-gradient-to-r from-primary to-purple-600 hover:opacity-90 transition-opacity">
              <Sparkles className="mr-2 h-4 w-4" /> Run AI Analysis
            </Button>
          )}
          {isAnalyzing && (
            <Button disabled>
              <Loader2 className="mr-2 h-4 w-4 animate-spin" /> Analyzing...
            </Button>
          )}
          {analysis && (
            <Button onClick={handleAnalyze} variant="outline" className="border-primary/20 hover:bg-primary/5">
              <Sparkles className="mr-2 h-4 w-4 text-primary" /> Re-run AI Analysis
            </Button>
          )}
        </div>
      </div>

      {!analysis && !isAnalyzing ? (
        <Card className="border-dashed border-2 bg-muted/30">
          <CardContent className="flex flex-col items-center justify-center py-12 text-center">
            <div className="h-16 w-16 bg-primary/10 rounded-full flex items-center justify-center mb-4">
              <Sparkles className="h-8 w-8 text-primary" />
            </div>
            <CardTitle className="mb-2">No Analysis Yet</CardTitle>
            <CardDescription className="max-w-md mx-auto mb-6">
              Run an AI analysis to see how well you match this role, identify skill gaps, and get personalized application advice.
            </CardDescription>
            <Button onClick={handleAnalyze} size="lg">
              Analyze Job Now
            </Button>
          </CardContent>
        </Card>
      ) : analysis ? (
        <div className="grid gap-8 md:grid-cols-2 lg:grid-cols-3">
          <Card className="lg:col-span-2 overflow-hidden border-primary/20 shadow-lg shadow-primary/5">
            <div className="h-1 bg-gradient-to-r from-primary to-purple-500" />
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                AI Match Score & Summary
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-8">
               <div className="flex flex-col items-center justify-center gap-4">
                  <div className="relative">
                    <svg className="w-32 h-32 transform -rotate-90">
                      <circle
                        cx="64"
                        cy="64"
                        r="58"
                        stroke="currentColor"
                        strokeWidth="8"
                        fill="transparent"
                        className="text-muted/30"
                      />
                      <circle
                        cx="64"
                        cy="64"
                        r="58"
                        stroke="currentColor"
                        strokeWidth="8"
                        fill="transparent"
                        strokeDasharray={2 * Math.PI * 58}
                        strokeDashoffset={2 * Math.PI * 58 * (1 - analysis.score / 100)}
                        strokeLinecap="round"
                        className="text-primary transition-all duration-1000 ease-out"
                      />
                    </svg>
                    <div className="absolute inset-0 flex items-center justify-center">
                      <span className="text-3xl font-bold">{analysis.score}%</span>
                    </div>
                  </div>
                  <Badge variant="secondary" className="px-4 py-1 text-sm font-medium">
                    {analysis.score >= 80 ? 'Excellent Match' : analysis.score >= 60 ? 'Good Match' : 'Potential Match'}
                  </Badge>
              </div>
              <div className="bg-muted/50 p-4 rounded-lg border border-muted">
                <p className="text-muted-foreground leading-relaxed italic">"{analysis.recommendationSummary}"</p>
              </div>
            </CardContent>
          </Card>

          <Card className="flex flex-col justify-between">
             <CardHeader>
              <CardTitle>Next Steps</CardTitle>
              <CardDescription>AI-recommended actions for this job.</CardDescription>
            </CardHeader>
            <CardContent className="grid gap-3">
               {analysis.nextActions.map((action: string, i: number) => (
                 <div key={i} className="flex items-start gap-2 text-sm p-2 rounded-md hover:bg-muted/50 transition-colors">
                   <CheckCircle className="h-4 w-4 text-green-500 mt-0.5 shrink-0" />
                   <span>{action}</span>
                 </div>
               ))}
            </CardContent>
            <div className="p-6 pt-0 flex flex-col gap-2">
               <Button variant={job.status === 'applied' ? 'secondary' : 'default'} onClick={() => handleUpdateStatus('applied')}>
                <Bookmark className="mr-2 h-4 w-4" />
                {job.status === 'applied' ? 'Already Applied' : 'Mark as Applied'}
              </Button>
              <Button variant="outline" className="group" asChild>
                <Link href={`/cover-letter?jobId=${jobId}`}>
                  <Wand2 className="mr-2 h-4 w-4 group-hover:text-primary transition-colors" />
                  Generate Tailored Resume
                </Link>
              </Button>
            </div>
          </Card>

          <div className="lg:col-span-3 grid gap-8 md:grid-cols-2">
            <Card className="bg-green-50/10 dark:bg-green-950/10 border-green-500/20">
              <CardHeader>
                <CardTitle className="flex items-center gap-2 text-green-600 dark:text-green-400">
                  <CheckCircle /> Matched Skills
                </CardTitle>
                <CardDescription>Skills and experiences that align with the job description.</CardDescription>
              </CardHeader>
              <CardContent className="flex flex-wrap gap-2">
                {analysis.matchedSkills.map((skill: string) => (
                  <Badge key={skill} variant="secondary" className="bg-green-100 dark:bg-green-900/40 text-green-700 dark:text-green-300 border-green-200 dark:border-green-800">
                    {skill}
                  </Badge>
                ))}
              </CardContent>
            </Card>

             <Card className="bg-destructive/5 border-destructive/20">
              <CardHeader>
                <CardTitle className="flex items-center gap-2 text-destructive">
                  <XCircle /> Skill Gaps
                </CardTitle>
                <CardDescription>Areas where you can improve your profile for this role.</CardDescription>
              </CardHeader>
              <CardContent className="flex flex-wrap gap-2">
                {analysis.missingSkills.map((skill: string) => (
                  <Badge variant="destructive" key={skill} className="bg-destructive/10 text-destructive hover:bg-destructive/20 transition-colors">
                    {skill}
                  </Badge>
                ))}
              </CardContent>
            </Card>

            <Card className="md:col-span-2">
              <CardHeader>
                <CardTitle>Strengths & Potential</CardTitle>
                <CardDescription>Key takeaways from the AI's deep dive.</CardDescription>
              </CardHeader>
              <CardContent>
                <ul className="grid gap-2 sm:grid-cols-2">
                   {analysis.strengths.map((str: string, i: number) => (
                     <li key={i} className="flex items-center gap-2 text-sm text-muted-foreground">
                       <span className="h-1.5 w-1.5 bg-primary rounded-full shrink-0" />
                       {str}
                     </li>
                   ))}
                </ul>
              </CardContent>
            </Card>
          </div>
        </div>
      ) : null}

      <Card>
        <CardHeader>
          <CardTitle>Post Information</CardTitle>
          <CardDescription>Details retrieved from the job posting.</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid gap-1">
            <h4 className="font-semibold">Description</h4>
            <div className="text-sm text-muted-foreground whitespace-pre-wrap rounded-md bg-muted/30 p-4 border overflow-auto max-h-[400px]">
              {job.description}
            </div>
          </div>
          <div className="flex justify-between items-center text-xs text-muted-foreground">
            <p>Added on {job.createdAt?.toDate ? format(job.createdAt.toDate(), 'PPP') : 'Recently'}</p>
            {job.location && <p>Location: {job.location}</p>}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
