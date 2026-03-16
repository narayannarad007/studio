import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";

export default function ProfilePage() {
  return (
    <div className="flex flex-col gap-6">
      <div>
        <h1 className="text-3xl font-bold tracking-tight font-headline">Your Professional Profile</h1>
        <p className="text-muted-foreground">This information is used by the AI to analyze jobs and tailor content for you.</p>
      </div>

       <Card>
        <CardHeader>
          <CardTitle>Profile Details</CardTitle>
          <CardDescription>Keep your professional information up-to-date.</CardDescription>
        </CardHeader>
        <CardContent className="grid gap-6 md:grid-cols-2">
            <div className="space-y-2">
              <Label htmlFor="fullName">Full Name</Label>
              <Input id="fullName" defaultValue="Ada Lovelace" />
            </div>
            <div className="space-y-2">
              <Label htmlFor="headline">Headline</Label>
              <Input id="headline" placeholder="e.g. Senior Software Engineer" />
            </div>
             <div className="space-y-2">
              <Label htmlFor="email">Email</Label>
              <Input id="email" type="email" defaultValue="ada.lovelace@example.com" />
            </div>
             <div className="space-y-2">
              <Label htmlFor="phone">Phone</Label>
              <Input id="phone" type="tel" placeholder="+1 (555) 123-4567" />
            </div>
             <div className="space-y-2">
              <Label htmlFor="experience">Years of Experience</Label>
              <Input id="experience" type="number" defaultValue="5" />
            </div>
            <div className="space-y-2">
              <Label htmlFor="work-mode">Work Mode Preference</Label>
              <Select>
                <SelectTrigger id="work-mode">
                  <SelectValue placeholder="Select work mode..." />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="remote">Remote</SelectItem>
                  <SelectItem value="hybrid">Hybrid</SelectItem>
                  <SelectItem value="onsite">On-site</SelectItem>
                </SelectContent>
              </Select>
            </div>
             <div className="space-y-2 md:col-span-2">
              <Label htmlFor="preferredRoles">Preferred Roles</Label>
              <Input id="preferredRoles" placeholder="e.g. Frontend Developer, Product Manager (comma-separated)" />
            </div>
            <div className="space-y-2 md:col-span-2">
              <Label htmlFor="keySkills">Key Skills</Label>
              <Textarea id="keySkills" placeholder="Enter your key skills, separated by commas..." />
            </div>
             <div className="md:col-span-2 flex justify-end">
                <Button>Save Changes</Button>
            </div>
        </CardContent>
       </Card>
    </div>
  )
}
