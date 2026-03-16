import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { FileText, PlusCircle, Trash2, UploadCloud } from "lucide-react";
import { Badge } from "@/components/ui/badge";

const resumes = [
  { id: 1, name: "Senior_Frontend_Engineer_Resume_v3.pdf", isPrimary: true, uploaded: "2024-05-20" },
  { id: 2, name: "Product_Manager_Resume.pdf", isPrimary: false, uploaded: "2024-05-18" },
];

export default function ResumesPage() {
  return (
    <div className="flex flex-col gap-6">
       <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight font-headline">Resume Management</h1>
          <p className="text-muted-foreground">Upload and manage your resumes for AI analysis.</p>
        </div>
        <Button>
          <UploadCloud className="mr-2" /> Upload New Resume
        </Button>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>My Resumes</CardTitle>
          <CardDescription>You can set one resume as primary for default analysis.</CardDescription>
        </CardHeader>
        <CardContent className="grid gap-4">
          {resumes.map(resume => (
            <Card key={resume.id} className="flex items-center justify-between p-4">
              <div className="flex items-center gap-4">
                <FileText className="w-8 h-8 text-primary" />
                <div>
                  <p className="font-medium">{resume.name}</p>
                  <p className="text-sm text-muted-foreground">Uploaded on {resume.uploaded}</p>
                </div>
                 {resume.isPrimary && <Badge>Primary</Badge>}
              </div>
              <div className="flex items-center gap-2">
                {!resume.isPrimary && <Button variant="secondary" size="sm">Set as Primary</Button>}
                <Button variant="ghost" size="icon" aria-label="Delete resume">
                  <Trash2 className="w-4 h-4 text-destructive" />
                </Button>
              </div>
            </Card>
          ))}
           <div className="flex flex-col items-center justify-center p-8 border-2 border-dashed rounded-lg">
            <UploadCloud className="w-12 h-12 text-muted-foreground" />
            <h3 className="mt-4 text-lg font-semibold">Upload a new resume</h3>
            <p className="mt-2 text-sm text-muted-foreground">Drag and drop or click to browse. PDF or DOCX.</p>
            <Button className="mt-4">
              <PlusCircle className="mr-2" />
              Upload
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
