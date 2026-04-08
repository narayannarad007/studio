'use server';

import { createSubscription } from '@/lib/razorpay';
import { adminDb } from '@/lib/firebase-admin';

export async function initiateProSubscription(userId: string) {
  try {
    const subscription = await createSubscription(userId);
    
    // Store preliminary intent in DB
    await adminDb.collection('users').doc(userId).set({
      pendingSubscriptionId: subscription.id,
      updatedAt: new Date(),
    }, { merge: true });

    return { 
      success: true, 
      subscriptionId: subscription.id,
      keyId: process.env.NEXT_PUBLIC_RAZORPAY_KEY_ID
    };
  } catch (error: any) {
    console.error('Subscription initiation failed:', error);
    return { success: false, error: error.message };
  }
}
