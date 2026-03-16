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
import { PlusCircle } from "lucide-react";
import Link from "next/link";

const jobs = [
  { id: '1', company: "Innovate Inc.", role: "Senior Frontend Engineer", status: "Applied", date: "2024-05-15" },
  { id: '2', company: "Tech Solutions", role: "Product Manager", status: "Interview", date: "2024-05-20" },
  { id: '3', company: "Data Corp", role: "Data Scientist", status: "Saved", date: "2024-05-22" },
  { id: '4', company: "CloudNet", role: "DevOps Engineer", status: "Offer", date: "2024-05-18" },
  { id: '5', company: "Creative LLC", role: "UX Designer", status: "Rejected", date: "2024-05-10" },
];

export default function JobTrackerPage() {
  return (
    <div className="flex flex-col gap-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight font-headline">Job Application Tracker</h1>
          <p className="text-muted-foreground">Manage your job applications from saved to offer.</p>
        </div>
        <Button>
          <PlusCircle className="mr-2" /> Add Job
        </Button>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>My Jobs</CardTitle>
          <CardDescription>A list of all your saved and applied jobs.</CardDescription>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Company</TableHead>
                <TableHead>Role</TableHead>
                <TableHead>Status</TableHead>
                <TableHead>Date</TableHead>
                <TableHead><span className="sr-only">Actions</span></TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {jobs.map((job) => (
                <TableRow key={job.id}>
                  <TableCell className="font-medium">{job.company}</TableCell>
                  <TableCell>{job.role}</TableCell>
                  <TableCell>
                    <Badge variant={
                      job.status === 'Interview' || job.status === 'Offer' ? 'default' : 
                      job.status === 'Rejected' ? 'destructive' : 'secondary'
                    }>{job.status}</Badge>
                  </TableCell>
                  <TableCell>{job.date}</TableCell>
                  <TableCell className="text-right">
                    <Link href={`/jobs/${job.id}`} passHref>
                       <Button variant="ghost" size="sm">View</Button>
                    </Link>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </CardContent>
      </Card>
    </div>
  );
}
