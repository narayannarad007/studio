'use client';

import { Gavel } from "lucide-react";

export default function TermsOfServicePage() {
  return (
    <div className="container max-w-4xl py-20 px-4 mx-auto">
      <div className="flex items-center gap-4 mb-8">
        <div className="p-3 bg-primary/10 rounded-xl text-primary font-bold">
          <Gavel className="w-8 h-8" />
        </div>
        <h1 className="text-4xl font-bold font-headline">Terms of Service</h1>
      </div>
      
      <div className="prose prose-slate dark:prose-invert max-w-none space-y-8">
        <section>
          <h2 className="text-2xl font-bold">1. Agreement to Terms</h2>
          <p className="text-muted-foreground leading-relaxed">
            By accessing or using Career Pilot AI, you agree to be bound by these Terms of Service. If you do not agree to all of these terms, do not use the service.
          </p>
        </section>

        <section>
          <h2 className="text-2xl font-bold">2. Description of Service</h2>
          <p className="text-muted-foreground leading-relaxed">
            Career Pilot AI provides AI-powered tools for job seekers, including resume analysis, cover letter generation, and interview preparation.
          </p>
        </section>

        <section>
          <h2 className="text-2xl font-bold">3. Subscription & Payments</h2>
          <p className="text-muted-foreground leading-relaxed">
            - <strong>Pro Plan:</strong> Billed monthly at ₹299 INR.<br/>
            - <strong>Payments:</strong> Handled via Razorpay. By subscribing, you authorize us to charge the recurring fee.<br/>
            - <strong>Cancellations:</strong> You can cancel your subscription at any time via your account settings. Cancellation will take effect at the end of the current billing cycle.
          </p>
        </section>

        <section>
          <h2 className="text-2xl font-bold">4. Refund Policy</h2>
          <p className="bg-destructive/5 border-l-4 border-destructive p-4 text-muted-foreground">
            <strong>No Refunds:</strong> Due to the immediate costs associated with AI generation and API usage, we do not offer refunds once a subscription period has started. You may cancel to prevent future charges.
          </p>
        </section>

        <section>
          <h2 className="text-2xl font-bold">5. User Conduct</h2>
          <p className="text-muted-foreground leading-relaxed">
            You agree not to use the service for any illegal purposes or to attempt to "reverse engineer" or scrape the AI outputs in bulk.
          </p>
        </section>

        <section>
          <h2 className="text-2xl font-bold">6. Limitation of Liability</h2>
          <p className="text-muted-foreground leading-relaxed italic text-sm">
            Career Pilot AI provides AI-generated suggestions. We do not guarantee employment or specific career outcomes. The final responsibility for your applications and interviews rests with you.
          </p>
        </section>

        <section className="bg-muted p-8 rounded-2xl">
          <h2 className="text-2xl font-bold mb-4">Contact</h2>
          <p className="text-muted-foreground">
            For any legal or billing inquiries, please reach out to:
          </p>
          <p className="font-bold mt-2 text-primary">legal@careerpilotai.com</p>
        </section>
      </div>
    </div>
  );
}
