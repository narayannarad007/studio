import { adminDb } from './firebase-admin';
import { format } from 'date-fns';
import { FieldValue } from 'firebase-admin/firestore';
import { QUOTA_LIMITS, UserPlan, QuotaFeature } from './quota-limits';

export { QUOTA_LIMITS };
export type { UserPlan, QuotaFeature };

export async function checkAndIncrementQuota(userId: string, feature: QuotaFeature) {
  const currentMonth = format(new Date(), 'yyyy-MM');
  const userRef = adminDb.collection('users').doc(userId);
  const usageRef = userRef.collection('usage').doc('current');

  // Use a transaction to ensure atomicity
  return await adminDb.runTransaction(async (transaction) => {
    const userDoc = await transaction.get(userRef);
    const usageDoc = await transaction.get(usageRef);

    let plan: UserPlan = 'free';
    if (userDoc.exists) {
      plan = userDoc.data()?.plan || 'free';
    } else {
      // Initialize user if missing
      transaction.set(userRef, {
        plan: 'free',
        subscriptionStatus: 'none',
        createdAt: FieldValue.serverTimestamp(),
        updatedAt: FieldValue.serverTimestamp()
      });
    }

    const limits = QUOTA_LIMITS[plan];
    const limit = limits[feature];

    if (!usageDoc.exists || usageDoc.data()?.month !== currentMonth) {
      // LAZY RESET: New month or first-time usage
      const initialUsage = {
        month: currentMonth,
        jobAnalyses: 0,
        resumeOptimizations: 0,
        coverLetters: 0,
        interviewPreps: 0,
        assistantMessages: 0,
        updatedAt: FieldValue.serverTimestamp()
      };
      
      // Increment the current feature
      initialUsage[feature] = 1;
      
      transaction.set(usageRef, initialUsage);
      return { allowed: true, plan, remaining: limit - 1 };
    }

    const currentUsage = usageDoc.data()!;
    const count = currentUsage[feature] || 0;

    if (count >= limit) {
      return { allowed: false, plan, limit };
    }

    // Increment
    transaction.update(usageRef, {
      [feature]: FieldValue.increment(1),
      updatedAt: FieldValue.serverTimestamp()
    });

    return { 
      allowed: true, 
      plan, 
      remaining: limit - (count + 1) 
    };
  });
}
