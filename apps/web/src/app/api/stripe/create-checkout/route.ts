/**
 * @madboat/web
 * @file src/app/api/stripe/create-checkout/route.ts
 * @version 1.0.0
 * @created 2025-09-14
 * @author Claude Sonnet 4 + Captain Sandro Fidelis
 * @description Stripe Checkout Session Creation API
 */

import { NextRequest, NextResponse } from 'next/server';
import Stripe from 'stripe';

if (!process.env.STRIPE_SECRET_KEY) {
  throw new Error('STRIPE_SECRET_KEY is required');
}

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY, {
  apiVersion: '2024-06-20',
});

export async function POST(request: NextRequest) {
  try {
    const { email, priceId, planName } = await request.json();

    if (!email || !priceId || !planName) {
      return NextResponse.json(
        { error: 'Email, priceId, and planName are required' },
        { status: 400 }
      );
    }

    // Create Stripe Checkout Session
    const session = await stripe.checkout.sessions.create({
      customer_email: email,
      line_items: [
        {
          price: priceId,
          quantity: 1,
        },
      ],
      mode: 'subscription', // ou 'payment' para pagamentos únicos
      metadata: {
        plan_name: planName,
        user_email: email,
        madboat_integration: 'true',
      },
      success_url: `${process.env.NEXT_PUBLIC_APP_URL}/payment/success?session_id={CHECKOUT_SESSION_ID}`,
      cancel_url: `${process.env.NEXT_PUBLIC_APP_URL}/payment/cancelled`,
      // Configuração do webhook
      automatic_tax: { enabled: false },
      billing_address_collection: 'required',
    });

    return NextResponse.json({
      success: true,
      sessionId: session.id,
      url: session.url,
    });

  } catch (error) {
    console.error('Stripe checkout error:', error);
    return NextResponse.json(
      {
        error: 'Failed to create checkout session',
        details: error instanceof Error ? error.message : 'Unknown error'
      },
      { status: 500 }
    );
  }
}