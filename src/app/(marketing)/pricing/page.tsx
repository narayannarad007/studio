'use client';

import { Check, Sparkles, Zap, Shield, Crown } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import Link from "next/link";
import { useUserUsage } from "@/hooks/useJobs";
import { QUOTA_LIMITS } from "@/lib/quota-limits";

export default function PricingPage() {
  const { plan } = useUserUsage();

  const plans = [
    {
      name: "Free",
      price: "₹0",
      description: "Perfect to get started and explore the potential of Career Pilot AI.",
      features: [
        `${QUOTA_LIMITS.free.jobAnalyses} Job Analyses / mo`,
        `${QUOTA_LIMITS.free.resumeOptimizations} Resume Optimizations / mo`,
        `${QUOTA_LIMITS.free.coverLetters} Cover Letters / mo`,
        `${QUOTA_LIMITS.free.assistantMessages} Assistant Messages / mo`,
        "Basic Application Tracking",
        "Community Support",
      ],
      buttonText: plan === 'free' ? "Current Plan" : "Choose Free",
      buttonVariant: "outline" as const,
      highlight: false,
    },
    {
      name: "Pro",
      price: "₹299",
      period: "/ month",
      description: "Everything you need to accelerate your job search and stand out from the crowd.",
      features: [
        `${QUOTA_LIMITS.pro.jobAnalyses} Job Analyses / mo`,
        `${QUOTA_LIMITS.pro.resumeOptimizations} Resume Optimizations / mo`,
        `${QUOTA_LIMITS.pro.coverLetters} Cover Letters / mo`,
        `Unlimited Career Assistant access`,
        "Priority AI Support",
        "Custom Resume Variations",
        "Interview Prep Playbooks",
      ],
      buttonText: plan === 'pro' ? "Current Plan" : "Upgrade to Pro",
      buttonVariant: "default" as const,
      highlight: true,
      badge: "Best Value",
    }
  ];

  return (
    <div className="min-h-screen bg-slate-50/50 pt-20 pb-20 px-4">
      <div className="max-w-6xl mx-auto flex flex-col items-center text-center gap-6 mb-16 animate-in fade-in slide-in-from-top-4 duration-1000">
        <Badge variant="secondary" className="px-4 py-1.5 bg-primary/10 text-primary border-primary/20 hover:bg-primary/20 transition-colors">
          Simple, Transparent Pricing
        </Badge>
        <h1 className="text-4xl md:text-6xl font-bold font-headline tracking-tight max-w-2xl bg-clip-text text-transparent bg-gradient-to-r from-slate-900 via-slate-700 to-slate-900">
          Supercharge Your Career with AI 🚀
        </h1>
        <p className="text-xl text-muted-foreground max-w-xl">
          Get deeper insights, more applications, and tailored coaching. Built for Indian job seekers.
        </p>
      </div>

      <div className="max-w-5xl mx-auto grid grid-cols-1 md:grid-cols-2 gap-8 items-stretch">
        {plans.map((p, idx) => (
          <Card 
            key={p.name} 
            className={`flex flex-col border-none shadow-xl transition-all duration-500 hover:scale-[1.02] relative group ${
              p.highlight ? 'ring-2 ring-primary bg-white z-10' : 'bg-white/80'
            }`}
          >
            {p.badge && (
              <div className="absolute -top-4 left-1/2 -translate-x-1/2 px-4 py-1 rounded-full bg-gradient-to-r from-amber-500 to-orange-600 text-white text-sm font-bold shadow-lg">
                {p.badge}
              </div>
            )}
            
            <CardHeader className="pt-10 pb-6 text-center">
              <CardTitle className="text-2xl font-bold flex items-center justify-center gap-2">
                {p.name === 'Pro' ? <Crown className="w-6 h-6 text-amber-500" /> : <Shield className="w-6 h-6 text-slate-400" />}
                {p.name}
              </CardTitle>
              <div className="mt-4 flex flex-col items-center">
                <span className="text-5xl font-extrabold tracking-tight">{p.price}</span>
                <span className="text-muted-foreground mt-1">{p.period || "forever free"}</span>
              </div>
              <CardDescription className="mt-4 text-base px-4">
                {p.description}
              </CardDescription>
            </CardHeader>

            <CardContent className="flex-1 px-8">
              <ul className="space-y-4">
                {p.features.map(f => (
                  <li key={f} className="flex items-start gap-3 group/item">
                    <div className={`mt-1 h-5 w-5 rounded-full flex items-center justify-center flex-shrink-0 transition-colors ${
                      p.highlight ? 'bg-primary/10 text-primary' : 'bg-slate-100 text-slate-500'
                    }`}>
                      <Check className="w-3.5 h-3.5" />
                    </div>
                    <span className="text-slate-600 group-hover/item:text-slate-900 transition-colors">{f}</span>
                  </li>
                ))}
              </ul>
            </CardContent>

            <CardFooter className="pt-8 pb-10 px-8">
              <Button 
                className={`w-full py-6 text-lg rounded-xl transition-all shadow-lg ${
                  p.highlight 
                    ? 'bg-gradient-to-r from-primary to-purple-600 hover:shadow-primary/20' 
                    : 'hover:bg-slate-50'
                }`}
                variant={p.buttonVariant}
                asChild={p.name === 'Pro' && plan !== 'pro'}
              >
                {p.name === 'Pro' && plan !== 'pro' ? (
                  <Link href="/checkout?plan=pro">
                    <Zap className="w-5 h-5 mr-2 fill-current" />
                    {p.buttonText}
                  </Link>
                ) : (
                  <span>{p.buttonText}</span>
                )}
              </Button>
            </CardFooter>
          </Card>
        ))}
      </div>

      <div className="mt-20 text-center max-w-2xl mx-auto animate-in fade-in slide-in-from-bottom-4 duration-1000 delay-500">
        <h3 className="text-2xl font-bold mb-4">India's most loved career platform</h3>
        <p className="text-muted-foreground mb-8">
          Join thousands of job seekers who are using Career Pilot AI to land their dream roles in tech, product, and design.
        </p>
        <div className="flex flex-wrap justify-center gap-8 grayscale opacity-50">
           {/* Mock logos in place of actual partner logos */}
           <span className="font-bold text-xl tracking-widest uppercase">Razorpay</span>
           <span className="font-bold text-xl tracking-widest uppercase">UPI</span>
           <span className="font-bold text-xl tracking-widest uppercase">Secure</span>
        </div>
      </div>
    </div>
  );
}
