export const dynamic = 'force-dynamic';
import { NextRequest, NextResponse } from 'next/server';
import { adminDb } from '@/lib/firebase-admin';
import { verifyWebhookSignature } from '@/lib/razorpay';
import { FieldValue } from 'firebase-admin/firestore';

export async function POST(req: NextRequest) {
  const body = await req.text();
  const signature = req.headers.get('x-razorpay-signature') || '';
  const webhookSecret = process.env.RAZORPAY_WEBHOOK_SECRET || '';

  if (!verifyWebhookSignature(body, signature, webhookSecret)) {
    return NextResponse.json({ error: 'Invalid signature' }, { status: 400 });
  }

  const event = JSON.parse(body);
  const { event: eventType, payload } = event;

  try {
    switch (eventType) {
      case 'subscription.activated':
      case 'subscription.charged': {
        const subscription = payload.subscription.entity;
        const userId = subscription.notes.userId;
        
        if (userId) {
          await adminDb.collection('users').doc(userId).set({
            plan: 'pro',
            subscriptionId: subscription.id,
            subscriptionStatus: 'active',
            updatedAt: FieldValue.serverTimestamp()
          }, { merge: true });
        }
        break;
      }

      case 'subscription.cancelled':
      case 'subscription.expired': {
        const subscription = payload.subscription.entity;
        const userId = subscription.notes.userId;

        if (userId) {
          await adminDb.collection('users').doc(userId).set({
            plan: 'free',
            subscriptionStatus: 'cancelled',
            updatedAt: FieldValue.serverTimestamp()
          }, { merge: true });
        }
        break;
      }
    }

    return NextResponse.json({ status: 'ok' });
  } catch (error) {
    console.error('Webhook error:', error);
    return NextResponse.json({ error: 'Webhook processing failed' }, { status: 500 });
  }
}
