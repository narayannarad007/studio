'use client';

import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Loader2 } from "lucide-react";
import Link from "next/link";
import { useJobs } from "@/hooks/useJobs";
import { AddJobDialog } from "@/components/AddJobDialog";
import { format } from "date-fns";

export default function JobTrackerPage() {
  const { jobs, isLoading } = useJobs();

  if (isLoading) {
    return (
      <div className="flex flex-col h-64 items-center justify-center gap-4">
        <Loader2 className="h-12 w-12 text-primary animate-spin" />
        <p className="text-muted-foreground animate-pulse">Loading your application tracker...</p>
      </div>
    );
  }

  return (
    <div className="flex flex-col gap-6 animate-in fade-in duration-500">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight font-headline">Job Application Tracker</h1>
          <p className="text-muted-foreground">Manage your job applications from saved to offer.</p>
        </div>
        <AddJobDialog />
      </div>

      <Card>
        <CardHeader>
          <CardTitle>My Jobs</CardTitle>
          <CardDescription>A list of all your saved and applied jobs.</CardDescription>
        </CardHeader>
        <CardContent>
          {jobs && jobs.length > 0 ? (
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Company</TableHead>
                  <TableHead>Role</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead>Date Added</TableHead>
                  <TableHead className="text-right">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {jobs.map((job) => (
                  <TableRow key={job.id} className="hover:bg-muted/50 transition-colors">
                    <TableCell className="font-medium">{job.company}</TableCell>
                    <TableCell>{job.title}</TableCell>
                    <TableCell>
                      <Badge variant={
                        job.status === 'interview' || job.status === 'offer' ? 'default' : 
                        job.status === 'rejected' ? 'destructive' : 'secondary'
                      } className="capitalize">
                        {job.status}
                      </Badge>
                    </TableCell>
                    <TableCell>
                      {job.createdAt?.toDate ? format(job.createdAt.toDate(), 'MMM d, yyyy') : 'Recently'}
                    </TableCell>
                    <TableCell className="text-right">
                      <Link href={`/jobs/${job.id}`} passHref>
                         <Button variant="ghost" size="sm" className="hover:text-primary transition-colors font-semibold">View Analysis</Button>
                      </Link>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          ) : (
            <div className="text-center py-12">
              <p className="text-muted-foreground italic mb-4">You haven't added any jobs yet.</p>
              <AddJobDialog />
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
