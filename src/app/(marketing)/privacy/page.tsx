'use client';

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Shield } from "lucide-react";

export default function PrivacyPolicyPage() {
  return (
    <div className="container max-w-4xl py-20 px-4 mx-auto">
      <div className="flex items-center gap-4 mb-8">
        <div className="p-3 bg-primary/10 rounded-xl text-primary font-bold">
          <Shield className="w-8 h-8" />
        </div>
        <h1 className="text-4xl font-bold font-headline">Privacy Policy</h1>
      </div>
      
      <div className="prose prose-slate dark:prose-invert max-w-none space-y-8">
        <section>
          <h2 className="text-2xl font-bold">1. Introduction</h2>
          <p className="text-muted-foreground leading-relaxed">
            Welcome to Career Pilot AI. We respect your privacy and are committed to protecting your personal data. This privacy policy will inform you as to how we look after your personal data when you visit our website and tell you about your privacy rights.
          </p>
        </section>

        <section>
          <h2 className="text-2xl font-bold">2. Data We Collect</h2>
          <p className="text-muted-foreground leading-relaxed">
            We collect and process the following data to provide our AI career services:
          </p>
          <ul className="list-disc pl-6 space-y-2 mt-4 text-muted-foreground">
            <li><strong>Identity Data:</strong> Full name, email address.</li>
            <li><strong>Professional Data:</strong> Resume content, job experience, skills, and preferences.</li>
            <li><strong>Usage Data:</strong> Information about how you use our website and AI tools.</li>
            <li><strong>Payment Data:</strong> Handled securely by Razorpay. We do not store your credit card details.</li>
          </ul>
        </section>

        <section>
          <h2 className="text-2xl font-bold">3. How We Use Your Data</h2>
          <p className="text-muted-foreground leading-relaxed">
            We use your data primarily to:
          </p>
          <ul className="list-disc pl-6 space-y-2 mt-4 text-muted-foreground">
            <li>Analyze your resume against job descriptions using Google Gemini AI.</li>
            <li>Generate tailored cover letters and interview prep guides.</li>
            <li>Manage your job application tracking dashboard.</li>
            <li>Process your subscription payments via Razorpay.</li>
          </ul>
        </section>

        <section>
          <h2 className="text-2xl font-bold">4. AI Processing Disclaimer</h2>
          <p className="border-l-4 border-amber-500 bg-amber-50/50 p-4 italic text-muted-foreground">
            Note: Your resume and professional data are processed by Google's Gemini models to provide AI insights. By using the service, you consent to this processing as per our core functionality.
          </p>
        </section>

        <section>
          <h2 className="text-2xl font-bold">5. Data Retention</h2>
          <p className="text-muted-foreground leading-relaxed">
            We will only retain your personal data for as long as necessary to fulfill the purposes we collected it for, including for the purposes of satisfying any legal, accounting, or reporting requirements.
          </p>
        </section>

        <section className="bg-muted p-8 rounded-2xl">
          <h2 className="text-2xl font-bold mb-4">Contact Us</h2>
          <p className="text-muted-foreground">
            If you have any questions about this privacy policy or our privacy practices, please contact us at:
          </p>
          <p className="font-bold mt-2 text-primary">support@careerpilotai.com</p>
        </section>
      </div>
    </div>
  );
}
