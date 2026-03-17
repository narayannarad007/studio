'use client';

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { Bookmark, CheckCircle, ExternalLink, Wand2, XCircle } from "lucide-react";
import Link from "next/link";
import { useUser, useFirestore, addDocumentNonBlocking } from "@/firebase";
import { useToast } from "@/hooks/use-toast";
import { collection, serverTimestamp } from "firebase/firestore";

const analysis = {
  job: {
    title: "Senior Frontend Engineer",
    company: "Innovate Inc.",
    url: "#",
  },
  matchScore: 82,
  strengths: ["React", "TypeScript", "Next.js", "Team Leadership"],
  gaps: ["GraphQL", "CI/CD Pipeline Management"],
  recommendation: "Your profile is a strong match. Focus on highlighting your leadership experience and familiarize yourself with GraphQL basics to close the skill gap.",
};

export default function JobAnalysisPage({ params }: { params: { jobId: string }}) {
  const { user } = useUser();
  const firestore = useFirestore();
  const { toast } = useToast();

  const handleSaveJob = () => {
    if (!user || !firestore) {
      toast({
        variant: "destructive",
        title: "Not logged in",
        description: "You must be logged in to save a job.",
      });
      return;
    }

    const savedJobsCollectionRef = collection(firestore, 'users', user.uid, 'savedJobs');
    
    const newSavedJob = {
      userId: user.uid,
      jobId: params.jobId,
      status: "Saved",
      followUpFlag: false,
      createdAt: serverTimestamp(),
      updatedAt: serverTimestamp(),
      notes: "",
      // These fields can be populated later
      appliedDate: null, 
      reminderDate: null,
    };

    // Use the non-blocking function to add the document
    addDocumentNonBlocking(savedJobsCollectionRef, newSavedJob)
      .then(() => {
        toast({
          title: "Job Saved!",
          description: `${analysis.job.title} has been added to your tracker.`,
        });
      })
      .catch(() => {
        // The permission error is handled globally by the FirestorePermissionError emitter.
        // This catch is for other potential issues, though less likely.
        toast({
          variant: "destructive",
          title: "Uh oh!",
          description: "Could not save the job. Please try again.",
        });
      });
  };

  return (
    <div className="flex flex-col gap-6">
      <div>
        <h1 className="text-3xl font-bold tracking-tight font-headline">Job Analysis for {analysis.job.title}</h1>
        <p className="text-muted-foreground">
          AI-powered insights for your application to{" "}
          <Link href={analysis.job.url} target="_blank" className="text-primary hover:underline">
            {analysis.job.company} <ExternalLink className="inline-block w-4 h-4" />
          </Link>
        </p>
      </div>

      <div className="grid gap-8 md:grid-cols-2 lg:grid-cols-3">
        <Card className="lg:col-span-2">
          <CardHeader>
            <CardTitle>AI Match Score & Summary</CardTitle>
          </CardHeader>
          <CardContent className="space-y-6">
             <div className="flex items-center justify-center space-x-4">
                <div className="text-6xl font-bold text-primary">{analysis.matchScore}%</div>
                <Progress value={analysis.matchScore} className="w-2/3 h-4" />
            </div>
            <p className="text-muted-foreground text-center">{analysis.recommendation}</p>
          </CardContent>
        </Card>

        <Card>
           <CardHeader>
            <CardTitle>Next Steps</CardTitle>
            <CardDescription>AI-recommended actions for this job.</CardDescription>
          </CardHeader>
          <CardContent className="grid gap-4">
             <Button onClick={handleSaveJob}>
              <Bookmark className="mr-2" />
              Save to Tracker
            </Button>
            <Button variant="secondary">
              <Wand2 className="mr-2" />
              Generate Cover Letter
            </Button>
            <Button variant="secondary">
              Prepare for Interview
            </Button>
          </CardContent>
        </Card>
      </div>

       <div className="grid gap-8 md:grid-cols-2">
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2"><CheckCircle className="text-green-500"/> Matched Skills</CardTitle>
            <CardDescription>Skills and experiences that align with the job description.</CardDescription>
          </CardHeader>
          <CardContent className="flex flex-wrap gap-2">
            {analysis.strengths.map(skill => <Badge key={skill}>{skill}</Badge>)}
          </CardContent>
        </Card>
         <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2"><XCircle className="text-destructive"/> Skill Gaps</CardTitle>
            <CardDescription>Areas where you can improve your profile for this role.</CardDescription>
          </CardHeader>
          <CardContent className="flex flex-wrap gap-2">
            {analysis.gaps.map(skill => <Badge variant="destructive" key={skill}>{skill}</Badge>)}
          </CardContent>
        </Card>
      </div>

    </div>
  );
}
