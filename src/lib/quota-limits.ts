export type UserPlan = 'free' | 'pro';

export type QuotaFeature = 
  | 'jobAnalyses' 
  | 'resumeOptimizations' 
  | 'coverLetters' 
  | 'interviewPreps' 
  | 'assistantMessages';

export const QUOTA_LIMITS: Record<UserPlan, Record<QuotaFeature, number>> = {
  free: {
    jobAnalyses: 5,
    resumeOptimizations: 2,
    coverLetters: 3,
    interviewPreps: 2,
    assistantMessages: 10,
  },
  pro: {
    jobAnalyses: 60,
    resumeOptimizations: 30,
    coverLetters: 60,
    interviewPreps: 30,
    assistantMessages: 1000, // Effectively unlimited for chat
  }
};
