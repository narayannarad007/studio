'use client';

import { Progress } from "@/components/ui/progress";
import { Badge } from "@/components/ui/badge";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { QUOTA_LIMITS, QuotaFeature } from "@/lib/quota-limits";
import { UserPlan } from "@/hooks/useJobs";
import { Sparkles, Zap } from "lucide-react";

interface UsageMeterProps {
  usage: any;
  plan: UserPlan;
}

export function UsageMeter({ usage, plan }: UsageMeterProps) {
  const limits = QUOTA_LIMITS[plan];
  
  const features: { label: string; key: QuotaFeature }[] = [
    { label: "Job Analyses", key: "jobAnalyses" },
    { label: "Resume Optimizations", key: "resumeOptimizations" },
    { label: "Cover Letters", key: "coverLetters" },
    { label: "Interview Prep", key: "interviewPreps" },
    { label: "AI Messages", key: "assistantMessages" },
  ];

  return (
    <Card className="border-primary/20 bg-primary/5 backdrop-blur-sm shadow-lg overflow-hidden relative">
      <div className="absolute top-0 right-0 p-4">
        {plan === 'pro' ? (
          <Badge className="bg-gradient-to-r from-amber-500 to-orange-600 border-none">
            <Zap className="w-3 h-3 mr-1 fill-current" /> Pro Plan
          </Badge>
        ) : (
          <Badge variant="secondary" className="bg-muted text-muted-foreground border-none">
            Free Plan
          </Badge>
        )}
      </div>
      <CardHeader className="pb-2">
        <CardTitle className="text-xl font-headline flex items-center gap-2">
          Usage Overview
          {plan === 'free' && <Sparkles className="h-4 w-4 text-amber-500 animate-pulse" />}
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        {features.map((feature) => {
          const used = usage?.[feature.key] || 0;
          const limit = limits[feature.key];
          const percentage = Math.min((used / limit) * 100, 100);
          
          return (
            <div key={feature.key} className="space-y-1.5">
              <div className="flex justify-between text-sm">
                <span className="text-muted-foreground">{feature.label}</span>
                <span className="font-medium">
                  {used} <span className="text-muted-foreground text-xs">/ {limit}</span>
                </span>
              </div>
              <Progress 
                value={percentage} 
                className={`h-1.5 ${percentage > 90 ? 'bg-destructive/20' : ''}`}
                // Using a fallback for the indicator color if needed, but standard Progress is fine
              />
            </div>
          );
        })}
        {plan === 'free' && (
          <div className="pt-2">
            <p className="text-xs text-muted-foreground mb-3 italic">
              Upgrade to Pro for 10x higher limits and priority access.
            </p>
          </div>
        )}
      </CardContent>
    </Card>
  );
}
