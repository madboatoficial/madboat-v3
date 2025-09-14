/**
 * @madboat/web
 * @file src/app/api/stripe/webhook/route.ts
 * @version 1.0.0
 * @created 2025-09-14
 * @author Claude Sonnet 4 + Captain Sandro Fidelis
 * @description Stripe Webhook for Automatic User Creation
 */

import { NextRequest, NextResponse } from 'next/server';
import Stripe from 'stripe';
import { createClient } from '@supabase/supabase-js';

if (!process.env.STRIPE_SECRET_KEY) {
  throw new Error('STRIPE_SECRET_KEY is required');
}

if (!process.env.STRIPE_WEBHOOK_SECRET) {
  throw new Error('STRIPE_WEBHOOK_SECRET is required');
}

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY, {
  apiVersion: '2024-06-20',
});

// Supabase Admin Client (para criar usuários)
const supabaseAdmin = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!, // Service Role Key para admin operations
  {
    auth: {
      autoRefreshToken: false,
      persistSession: false,
    },
  }
);

export async function POST(request: NextRequest) {
  const body = await request.text();
  const signature = request.headers.get('stripe-signature');

  if (!signature) {
    return NextResponse.json(
      { error: 'Missing stripe-signature header' },
      { status: 400 }
    );
  }

  let event: Stripe.Event;

  try {
    event = stripe.webhooks.constructEvent(
      body,
      signature,
      process.env.STRIPE_WEBHOOK_SECRET!
    );
  } catch (error) {
    console.error('Webhook signature verification failed:', error);
    return NextResponse.json(
      { error: 'Invalid webhook signature' },
      { status: 400 }
    );
  }

  try {
    // Handle successful payment
    if (event.type === 'checkout.session.completed') {
      const session = event.data.object as Stripe.Checkout.Session;

      const { user_email, plan_name } = session.metadata || {};

      if (!user_email || !plan_name) {
        console.error('Missing required metadata:', session.metadata);
        return NextResponse.json(
          { error: 'Missing user metadata' },
          { status: 400 }
        );
      }

      // Create user in Supabase Auth
      const { data: authUser, error: authError } = await supabaseAdmin.auth.admin.createUser({
        email: user_email,
        email_confirm: true, // Auto-confirm email
        user_metadata: {
          plan: plan_name,
          stripe_customer_id: session.customer,
          stripe_session_id: session.id,
          created_via: 'stripe_payment',
          subscription_status: 'active',
        },
      });

      if (authError) {
        console.error('Error creating auth user:', authError);
        return NextResponse.json(
          { error: 'Failed to create user account' },
          { status: 500 }
        );
      }

      // Create user profile in database
      const { error: profileError } = await supabaseAdmin
        .from('profiles')
        .insert({
          id: authUser.user.id,
          email: user_email,
          subscription_plan: plan_name,
          subscription_status: 'active',
          stripe_customer_id: session.customer,
          created_at: new Date().toISOString(),
          updated_at: new Date().toISOString(),
        });

      if (profileError) {
        console.error('Error creating user profile:', profileError);
        // Note: We could implement a retry mechanism here
      }

      console.log(`✅ User created successfully: ${user_email} with plan: ${plan_name}`);

      // Send welcome email with login credentials
      try {
        const { sendWelcomeEmail } = await import('../../../lib/email/welcome-email');
        const emailSent = await sendWelcomeEmail({
          email: user_email,
          userId: authUser.user.id,
          planName: plan_name,
        });

        if (emailSent) {
          console.log(`📧 Welcome email sent to: ${user_email}`);
        } else {
          console.error(`❌ Failed to send welcome email to: ${user_email}`);
        }
      } catch (emailError) {
        console.error('Welcome email error:', emailError);
        // Don't fail the entire webhook for email issues
      }

      return NextResponse.json({
        success: true,
        message: 'User created successfully',
        userId: authUser.user.id,
      });
    }

    // Handle subscription updates
    if (event.type === 'customer.subscription.updated') {
      const subscription = event.data.object as Stripe.Subscription;

      // Update user subscription status
      const { error } = await supabaseAdmin
        .from('profiles')
        .update({
          subscription_status: subscription.status,
          updated_at: new Date().toISOString(),
        })
        .eq('stripe_customer_id', subscription.customer);

      if (error) {
        console.error('Error updating subscription:', error);
      }
    }

    // Handle subscription cancellations
    if (event.type === 'customer.subscription.deleted') {
      const subscription = event.data.object as Stripe.Subscription;

      // Update user subscription status to cancelled
      const { error } = await supabaseAdmin
        .from('profiles')
        .update({
          subscription_status: 'cancelled',
          updated_at: new Date().toISOString(),
        })
        .eq('stripe_customer_id', subscription.customer);

      if (error) {
        console.error('Error cancelling subscription:', error);
      }
    }

    return NextResponse.json({ received: true });

  } catch (error) {
    console.error('Webhook processing error:', error);
    return NextResponse.json(
      {
        error: 'Webhook processing failed',
        details: error instanceof Error ? error.message : 'Unknown error'
      },
      { status: 500 }
    );
  }
}