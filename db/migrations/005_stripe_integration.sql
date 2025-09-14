-- 🐙 MadBoat v3 - Stripe Integration Migration
-- File: db/migrations/005_stripe_integration.sql
-- Version: 1.0.0
-- Created: 2025-09-14
-- Author: Claude Sonnet 4 + Captain Sandro Fidelis
-- Description: Add Stripe subscription fields to profiles table

-- Add Stripe-related columns to profiles table
ALTER TABLE profiles ADD COLUMN IF NOT EXISTS subscription_plan VARCHAR(50);
ALTER TABLE profiles ADD COLUMN IF NOT EXISTS subscription_status VARCHAR(20) DEFAULT 'inactive';
ALTER TABLE profiles ADD COLUMN IF NOT EXISTS stripe_customer_id VARCHAR(100);
ALTER TABLE profiles ADD COLUMN IF NOT EXISTS stripe_subscription_id VARCHAR(100);
ALTER TABLE profiles ADD COLUMN IF NOT EXISTS subscription_start_date TIMESTAMP WITH TIME ZONE;
ALTER TABLE profiles ADD COLUMN IF NOT EXISTS subscription_end_date TIMESTAMP WITH TIME ZONE;
ALTER TABLE profiles ADD COLUMN IF NOT EXISTS trial_end_date TIMESTAMP WITH TIME ZONE;

-- Create subscription history table
CREATE TABLE IF NOT EXISTS subscription_history (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES profiles(id) ON DELETE CASCADE,
  stripe_event_id VARCHAR(100) UNIQUE,
  event_type VARCHAR(50) NOT NULL,
  subscription_plan VARCHAR(50),
  subscription_status VARCHAR(20),
  amount_paid INTEGER, -- in cents
  currency VARCHAR(3) DEFAULT 'USD',
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  metadata JSONB
);

-- Create indexes for better query performance
CREATE INDEX IF NOT EXISTS idx_profiles_stripe_customer ON profiles(stripe_customer_id);
CREATE INDEX IF NOT EXISTS idx_profiles_subscription_status ON profiles(subscription_status);
CREATE INDEX IF NOT EXISTS idx_subscription_history_user_id ON subscription_history(user_id);
CREATE INDEX IF NOT EXISTS idx_subscription_history_event_type ON subscription_history(event_type);

-- Enable RLS on subscription_history
ALTER TABLE subscription_history ENABLE ROW LEVEL SECURITY;

-- RLS Policy: Users can only see their own subscription history
CREATE POLICY "Users can view own subscription history" ON subscription_history
  FOR SELECT USING (
    auth.uid() = user_id
  );

-- RLS Policy: Service role can manage all subscription data
CREATE POLICY "Service role can manage subscription history" ON subscription_history
  FOR ALL USING (
    auth.jwt() ->> 'role' = 'service_role'
  );

-- Add subscription plan constraints
ALTER TABLE profiles ADD CONSTRAINT subscription_plan_check
  CHECK (subscription_plan IN ('Navigator', 'Captain', 'Admiral', 'Enterprise') OR subscription_plan IS NULL);

ALTER TABLE profiles ADD CONSTRAINT subscription_status_check
  CHECK (subscription_status IN ('active', 'inactive', 'cancelled', 'past_due', 'trialing', 'unpaid'));

-- Create function to handle subscription updates
CREATE OR REPLACE FUNCTION handle_subscription_change()
RETURNS TRIGGER AS $$
BEGIN
  -- Log subscription changes
  IF TG_OP = 'UPDATE' AND (
    OLD.subscription_status IS DISTINCT FROM NEW.subscription_status OR
    OLD.subscription_plan IS DISTINCT FROM NEW.subscription_plan
  ) THEN
    INSERT INTO subscription_history (
      user_id,
      event_type,
      subscription_plan,
      subscription_status,
      metadata
    ) VALUES (
      NEW.id,
      'subscription_updated',
      NEW.subscription_plan,
      NEW.subscription_status,
      jsonb_build_object(
        'old_status', OLD.subscription_status,
        'new_status', NEW.subscription_status,
        'old_plan', OLD.subscription_plan,
        'new_plan', NEW.subscription_plan
      )
    );
  END IF;

  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Create trigger for subscription changes
DROP TRIGGER IF EXISTS trigger_subscription_change ON profiles;
CREATE TRIGGER trigger_subscription_change
  AFTER UPDATE ON profiles
  FOR EACH ROW
  EXECUTE FUNCTION handle_subscription_change();

-- Grant necessary permissions
GRANT SELECT ON subscription_history TO anon, authenticated;
GRANT INSERT, UPDATE ON subscription_history TO service_role;

-- Insert some example data for testing (optional)
-- Uncomment for development/testing
/*
INSERT INTO subscription_history (user_id, event_type, subscription_plan, subscription_status, metadata)
VALUES (
  (SELECT id FROM profiles LIMIT 1),
  'subscription_created',
  'Captain',
  'active',
  '{"source": "stripe_webhook", "test": true}'
);
*/

-- Add helpful comments
COMMENT ON TABLE subscription_history IS 'Tracks all subscription-related events and changes';
COMMENT ON COLUMN profiles.subscription_plan IS 'Current subscription plan: Navigator, Captain, Admiral, or Enterprise';
COMMENT ON COLUMN profiles.subscription_status IS 'Current subscription status from Stripe';
COMMENT ON COLUMN profiles.stripe_customer_id IS 'Stripe customer ID for payment processing';
COMMENT ON COLUMN profiles.stripe_subscription_id IS 'Stripe subscription ID';

COMMIT;