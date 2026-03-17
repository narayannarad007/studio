'use client';
import Link from "next/link"
import { Rocket } from "lucide-react"
import { Button } from "@/components/ui/button"
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { useState } from "react";
import { useAuth, setDocumentNonBlocking } from "@/firebase";
import { useToast } from "@/hooks/use-toast";
import { createUserWithEmailAndPassword } from "firebase/auth";
import { getFirestore, doc, serverTimestamp } from "firebase/firestore";
import { getApp } from "firebase/app";


export default function SignupPage() {
  const auth = useAuth();
  const { toast } = useToast();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [fullName, setFullName] = useState('');

  const handleSignup = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email || !password || !fullName) {
      toast({
        variant: "destructive",
        title: "Missing fields",
        description: "Please fill out all fields.",
      });
      return;
    }
    
    try {
      toast({
        title: "Creating account...",
        description: "Please wait while we set things up for you.",
      });

      // 1. Create user in Firebase Authentication
      const userCredential = await createUserWithEmailAndPassword(auth, email, password);
      const user = userCredential.user;

      // 2. Create the user profile document in Firestore
      const firestore = getFirestore(getApp());
      // The path follows the structure defined in firestore.rules: /users/{userId}/profile/{profileId}
      // We use a static ID for the singular profile document.
      const profileDocRef = doc(firestore, 'users', user.uid, 'profile', 'main-profile');
      
      const newProfile = {
        id: profileDocRef.id,
        userId: user.uid,
        fullName: fullName,
        email: user.email,
        yearsOfExperience: 0,
        currentOrLastJobTitle: "",
        keySkills: [],
        workModePreference: "remote", // Default value
        createdAt: serverTimestamp(),
        updatedAt: serverTimestamp(),
      };
      
      // 3. Save the document non-blockingly
      setDocumentNonBlocking(profileDocRef, newProfile, { merge: false });

      toast({
        title: "Account Created!",
        description: "Welcome to CareerPilot AI. You will be redirected.",
      });
      // The user will be automatically redirected to the dashboard by the
      // onAuthStateChanged listener in the Firebase provider.

    } catch (error: any) {
      toast({
        variant: "destructive",
        title: "Signup Failed",
        description: error.message || "An unexpected error occurred. Please try again.",
      });
    }
  };

  return (
    <div className="flex min-h-screen items-center justify-center bg-background p-4">
      <Card className="mx-auto max-w-sm w-full">
        <CardHeader className="text-center">
          <Rocket className="mx-auto h-8 w-8 text-primary mb-2" />
          <CardTitle className="text-2xl font-headline">Create an Account</CardTitle>
          <CardDescription>
            Join CareerPilot AI to supercharge your job search.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSignup}>
            <div className="grid gap-4">
              <div className="grid gap-2">
                  <Label htmlFor="full-name">Full Name</Label>
                  <Input 
                    id="full-name" 
                    placeholder="Ada Lovelace" 
                    required 
                    value={fullName}
                    onChange={(e) => setFullName(e.target.value)}
                  />
                </div>
              <div className="grid gap-2">
                <Label htmlFor="email">Email</Label>
                <Input
                  id="email"
                  type="email"
                  placeholder="m@example.com"
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                />
              </div>
              <div className="grid gap-2">
                <Label htmlFor="password">Password</Label>
                <Input 
                  id="password" 
                  type="password" 
                  required
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                />
              </div>
              <Button type="submit" className="w-full">
                Create an account
              </Button>
              <Button variant="outline" className="w-full" type="button">
                Sign up with Google
              </Button>
            </div>
          </form>
          <div className="mt-4 text-center text-sm">
            Already have an account?{" "}
            <Link href="/login" className="underline">
              Sign in
            </Link>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
