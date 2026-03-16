import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import { Wand2 } from "lucide-react";

export default function CoverLettersPage() {
  return (
    <div className="flex flex-col gap-6">
      <div>
        <h1 className="text-3xl font-bold tracking-tight font-headline">Cover Letter Generator</h1>
        <p className="text-muted-foreground">Generate tailored cover letters for your job applications.</p>
      </div>

      <div className="grid gap-8 md:grid-cols-2">
        <Card>
          <CardHeader>
            <CardTitle>Generation Hub</CardTitle>
            <CardDescription>Select a job and tone to create a new cover letter.</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="job-select">Select a Saved Job</Label>
              <Select>
                <SelectTrigger id="job-select">
                  <SelectValue placeholder="Choose a job..." />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="job1">Senior Frontend Engineer - Innovate Inc.</SelectItem>
                  <SelectItem value="job2">Product Manager - Tech Solutions</SelectItem>
                </SelectContent>
              </Select>
            </div>
             <div className="space-y-2">
              <Label htmlFor="tone-select">Select a Tone</Label>
              <Select>
                <SelectTrigger id="tone-select">
                  <SelectValue placeholder="Choose a tone..." />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="professional">Professional</SelectItem>
                  <SelectItem value="confident">Confident</SelectItem>
                  <SelectItem value="concise">Concise</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <Button className="w-full">
              <Wand2 className="mr-2" />
              Generate Cover Letter
            </Button>
          </CardContent>
        </Card>

        <Card className="flex flex-col">
          <CardHeader>
            <CardTitle>Generated Letter</CardTitle>
            <CardDescription>Your AI-crafted cover letter will appear here.</CardDescription>
          </CardHeader>
          <CardContent className="flex-1">
             <Textarea 
                className="h-full resize-none"
                placeholder="Dear Hiring Manager..."
                readOnly
              />
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
