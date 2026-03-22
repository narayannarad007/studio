'use client';
import Link from "next/link"
import { useRouter } from "next/navigation";
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
import { useState, useEffect } from "react";
import { useAuth, useUser } from "@/firebase";
import { useToast } from "@/hooks/use-toast";
import { createUserWithEmailAndPassword, GoogleAuthProvider, signInWithPopup } from "firebase/auth";
import { getFirestore, doc, serverTimestamp, setDoc, getDoc } from "firebase/firestore";
import { getApp } from "firebase/app";


export default function SignupPage() {
  const auth = useAuth();
  const { user, isUserLoading } = useUser();
  const router = useRouter();
  const { toast } = useToast();
  
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [fullName, setFullName] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  // Redirect to dashboard if user is already logged in
  useEffect(() => {
    if (!isUserLoading && user) {
      router.push('/dashboard');
    }
  }, [user, isUserLoading, router]);

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
    
    setIsLoading(true);
    
    try {
      // 1. Create user in Firebase Authentication
      const userCredential = await createUserWithEmailAndPassword(auth, email, password);
      const newUser = userCredential.user;

      // 2. Create the user profile document in Firestore
      const firestore = getFirestore(getApp());
      const profileDocRef = doc(firestore, 'users', newUser.uid, 'profile', 'main-profile');
      
      const newProfile = {
        id: profileDocRef.id,
        userId: newUser.uid,
        fullName: fullName,
        email: newUser.email,
        yearsOfExperience: 0,
        currentOrLastJobTitle: "",
        keySkills: [],
        workModePreference: "remote",
        createdAt: serverTimestamp(),
        updatedAt: serverTimestamp(),
        profileCompletenessScore: 20
      };
      
      // 3. Save the document
      await setDoc(profileDocRef, newProfile);

      toast({
        title: "Account Created!",
        description: "Welcome to CareerPilot AI. You will be redirected.",
      });
      // Redirection is handled by the useEffect hook

    } catch (error: any) {
      let description = "An unexpected error occurred. Please try again.";
      if (error.code) {
          switch (error.code) {
              case 'auth/email-already-in-use':
                  description = "An account with this email address already exists. Please login instead.";
                  break;
              case 'auth/weak-password':
                  description = "The password is too weak. It must be at least 6 characters long.";
                  break;
              case 'auth/invalid-email':
                  description = "The email address is not valid. Please check and try again.";
                  break;
          }
      }
      toast({
        variant: "destructive",
        title: "Signup Failed",
        description: description,
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handleGoogleSignup = async () => {
    setIsLoading(true);
    const provider = new GoogleAuthProvider();
    const firestore = getFirestore(getApp());
    try {
        const result = await signInWithPopup(auth, provider);
        const user = result.user;

        const profileDocRef = doc(firestore, 'users', user.uid, 'profile', 'main-profile');
        const docSnap = await getDoc(profileDocRef);

        if (!docSnap.exists()) {
            // This is a new user, create their profile
            const newProfile = {
                id: profileDocRef.id,
                userId: user.uid,
                fullName: user.displayName || 'New User',
                email: user.email,
                yearsOfExperience: 0,
                currentOrLastJobTitle: "",
                keySkills: [],
                workModePreference: "remote",
                createdAt: serverTimestamp(),
                updatedAt: serverTimestamp(),
                profileCompletenessScore: 20
            };
            await setDoc(profileDocRef, newProfile);
            toast({
                title: "Account Created!",
                description: "Welcome to CareerPilot AI.",
            });
        } else {
             toast({
                title: "Welcome Back!",
                description: "You've been successfully logged in.",
            });
        }
        // Redirect will be handled by the useEffect hook
    } catch (error: any) {
        toast({
            variant: "destructive",
            title: "Google Sign-In Failed",
            description: error.message || "Could not sign in with Google. Please try again.",
        });
    } finally {
        setIsLoading(false);
    }
  };


  // Don't render the form if we are still checking auth state
  if (isUserLoading || user) {
    return null; 
  }

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
                    disabled={isLoading}
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
                  disabled={isLoading}
                />
              </div>
              <div className="grid gap-2">
                <Label htmlFor="password">Password</Label>
                <Input 
                  id="password" 
                  type="password" 
                  required
                  minLength={6}
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  disabled={isLoading}
                />
              </div>
              <Button type="submit" className="w-full" disabled={isLoading}>
                {isLoading ? 'Creating Account...' : 'Create an account'}
              </Button>
              <Button variant="outline" className="w-full" type="button" onClick={handleGoogleSignup} disabled={isLoading}>
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
