import Razorpay from 'razorpay';
import crypto from 'crypto';

export const razorpay = new Razorpay({
  key_id: process.env.NEXT_PUBLIC_RAZORPAY_KEY_ID || '',
  key_secret: process.env.RAZORPAY_KEY_SECRET || '',
});

export function verifyWebhookSignature(
  body: string,
  signature: string,
  secret: string
) {
  const expectedSignature = crypto
    .createHmac('sha256', secret)
    .update(body)
    .digest('hex');
  return expectedSignature === signature;
}

export async function createSubscription(userId: string) {
  const planId = process.env.RAZORPAY_PLAN_ID;
  if (!planId) {
    throw new Error('RAZORPAY_PLAN_ID is not configured');
  }

  const subscription = await razorpay.subscriptions.create({
    plan_id: planId,
    customer_notify: 1,
    total_count: 120, // 10 years
    notes: {
      userId: userId,
    },
  });

  return subscription;
}
