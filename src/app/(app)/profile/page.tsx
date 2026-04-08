'use client';

import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import { useProfile } from "@/hooks/useJobs";
import { Loader2, Save } from "lucide-react";
import { toast } from "sonner";

export default function ProfilePage() {
  const { profile, isLoading, updateProfile } = useProfile();
  const [isSaving, setIsSaving] = useState(false);
  const [formData, setFormData] = useState<any>({});

  useEffect(() => {
    if (profile) {
      setFormData(profile);
    }
  }, [profile]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    setFormData({ ...formData, [e.target.id]: e.target.value });
  };

  const handleSelectChange = (value: string) => {
    setFormData({ ...formData, workModePreference: value });
  };

  const handleSave = async () => {
    setIsSaving(true);
    try {
      // Split comma-separated strings into arrays if needed
      const dataToSave = {
        ...formData,
        preferredRoles: typeof formData.preferredRoles === 'string' 
          ? formData.preferredRoles.split(',').map((s: string) => s.trim()) 
          : formData.preferredRoles,
        keySkills: typeof formData.keySkills === 'string'
          ? formData.keySkills.split(',').map((s: string) => s.trim())
          : formData.keySkills,
        yearsOfExperience: Number(formData.yearsOfExperience),
      };

      await updateProfile(dataToSave);
      toast.success("Profile updated successfully!");
    } catch (error) {
      console.error("Failed to update profile:", error);
      toast.error("Failed to update profile.");
    } finally {
      setIsSaving(false);
    }
  };

  if (isLoading) {
    return (
      <div className="flex h-64 items-center justify-center">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
      </div>
    );
  }

  return (
    <div className="flex flex-col gap-6 animate-in fade-in duration-500">
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
              <Input id="fullName" value={formData.fullName || ""} onChange={handleChange} placeholder="Ada Lovelace" />
            </div>
            <div className="space-y-2">
              <Label htmlFor="headline">Headline</Label>
              <Input id="headline" value={formData.headline || ""} onChange={handleChange} placeholder="e.g. Senior Software Engineer" />
            </div>
             <div className="space-y-2">
              <Label htmlFor="email">Email</Label>
              <Input id="email" type="email" value={formData.email || ""} onChange={handleChange} placeholder="ada.lovelace@example.com" />
            </div>
             <div className="space-y-2">
              <Label htmlFor="phone">Phone</Label>
              <Input id="phone" type="tel" value={formData.phone || ""} onChange={handleChange} placeholder="+1 (555) 123-4567" />
            </div>
             <div className="space-y-2">
              <Label htmlFor="yearsOfExperience">Years of Experience</Label>
              <Input id="yearsOfExperience" type="number" value={formData.yearsOfExperience || ""} onChange={handleChange} />
            </div>
            <div className="space-y-2">
              <Label htmlFor="workModePreference">Work Mode Preference</Label>
              <Select value={formData.workModePreference || ""} onValueChange={handleSelectChange}>
                <SelectTrigger id="workModePreference">
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
              <Input 
                id="preferredRoles" 
                value={Array.isArray(formData.preferredRoles) ? formData.preferredRoles.join(', ') : (formData.preferredRoles || "")} 
                onChange={handleChange}
                placeholder="e.g. Frontend Developer, Product Manager (comma-separated)" 
              />
            </div>
            <div className="space-y-2 md:col-span-2">
              <Label htmlFor="keySkills">Key Skills</Label>
              <Textarea 
                id="keySkills" 
                value={Array.isArray(formData.keySkills) ? formData.keySkills.join(', ') : (formData.keySkills || "")} 
                onChange={handleChange}
                placeholder="Enter your key skills, separated by commas..." 
              />
            </div>
             <div className="md:col-span-2 flex justify-end">
                <Button onClick={handleSave} disabled={isSaving}>
                  {isSaving ? <Loader2 className="mr-2 h-4 w-4 animate-spin"/> : <Save className="mr-2 h-4 w-4"/>}
                  Save Changes
                </Button>
            </div>
        </CardContent>
       </Card>
    </div>
  )
}
