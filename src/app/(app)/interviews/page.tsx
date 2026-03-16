import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { MessageSquare, Wand2 } from "lucide-react";
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion";

const generatedPrep = {
  behavioral: [
    "Tell me about a time you handled a tight deadline.",
    "Describe a conflict you had with a coworker and how you resolved it."
  ],
  technical: [
    "What is the difference between `let`, `const`, and `var` in JavaScript?",
    "How would you optimize a slow-running database query?"
  ],
  roleFit: [
    "Why are you interested in working at our company?",
    "Where do you see yourself in 5 years?"
  ]
}

export default function InterviewPrepPage() {
  return (
    <div className="flex flex-col gap-6">
      <div>
        <h1 className="text-3xl font-bold tracking-tight font-headline">Interview Preparation</h1>
        <p className="text-muted-foreground">Generate likely interview questions and guidance for any role.</p>
      </div>

       <div className="grid gap-8 md:grid-cols-2">
        <Card>
          <CardHeader>
            <CardTitle>Prep Generator</CardTitle>
            <CardDescription>Select a job to generate interview questions and tips.</CardDescription>
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
            <Button className="w-full">
              <MessageSquare className="mr-2" />
              Generate Prep Materials
            </Button>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Generated Questions</CardTitle>
            <CardDescription>Your AI-generated questions will appear here.</CardDescription>
          </CardHeader>
          <CardContent>
            <Accordion type="single" collapsible className="w-full">
              <AccordionItem value="behavioral">
                <AccordionTrigger>Behavioral Questions</AccordionTrigger>
                <AccordionContent>
                  <ul className="list-disc pl-5 space-y-2">
                    {generatedPrep.behavioral.map((q, i) => <li key={i}>{q}</li>)}
                  </ul>
                </AccordionContent>
              </AccordionItem>
              <AccordionItem value="technical">
                <AccordionTrigger>Technical Questions</AccordionTrigger>
                <AccordionContent>
                   <ul className="list-disc pl-5 space-y-2">
                    {generatedPrep.technical.map((q, i) => <li key={i}>{q}</li>)}
                  </ul>
                </AccordionContent>
              </AccordionItem>
              <AccordionItem value="role-fit">
                <AccordionTrigger>Role-Fit Questions</AccordionTrigger>
                <AccordionContent>
                   <ul className="list-disc pl-5 space-y-2">
                    {generatedPrep.roleFit.map((q, i) => <li key={i}>{q}</li>)}
                  </ul>
                </AccordionContent>
              </AccordionItem>
            </Accordion>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
