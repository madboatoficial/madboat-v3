/**
 * @madboat/web
 * @file src/app/pricing/page.tsx
 * @version 1.0.0
 * @created 2025-09-14
 * @author Claude Sonnet 4 + Captain Sandro Fidelis
 * @description MadBoat Pricing Page with Stripe Integration
 */

'use client';

import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Badge } from '@/components/ui/badge';
import { Check, Zap, Crown, Rocket } from 'lucide-react';

interface PricingPlan {
  id: string;
  name: string;
  description: string;
  price: number;
  currency: string;
  period: string;
  stripePriceId: string;
  features: string[];
  icon: React.ReactNode;
  popular?: boolean;
}

const pricingPlans: PricingPlan[] = [
  {
    id: 'navigator',
    name: 'Navigator',
    description: 'Perfect for starting your transformation journey',
    price: 97,
    currency: 'USD',
    period: 'month',
    stripePriceId: 'price_navigator_monthly', // TODO: Replace with actual Stripe price ID
    icon: <Zap className="w-6 h-6" />,
    features: [
      'Personal persona discovery',
      'Basic transformation tools',
      'Community access',
      'Monthly progress reports',
      'Email support',
    ],
  },
  {
    id: 'captain',
    name: 'Captain',
    description: 'Advanced tools for serious transformers',
    price: 197,
    currency: 'USD',
    period: 'month',
    stripePriceId: 'price_captain_monthly', // TODO: Replace with actual Stripe price ID
    icon: <Crown className="w-6 h-6" />,
    popular: true,
    features: [
      'Everything in Navigator',
      'Advanced analytics & insights',
      'Personalized coaching sessions',
      'Priority support',
      'Custom transformation plans',
      'Access to exclusive masterclasses',
    ],
  },
  {
    id: 'admiral',
    name: 'Admiral',
    description: 'Enterprise-level transformation mastery',
    price: 497,
    currency: 'USD',
    period: 'month',
    stripePriceId: 'price_admiral_monthly', // TODO: Replace with actual Stripe price ID
    icon: <Rocket className="w-6 h-6" />,
    features: [
      'Everything in Captain',
      'White-glove onboarding',
      '1-on-1 strategy sessions',
      'Custom integrations',
      'Team collaboration tools',
      'Dedicated success manager',
      'Advanced API access',
    ],
  },
];

export default function PricingPage() {
  const [email, setEmail] = useState('');
  const [loading, setLoading] = useState<string | null>(null);

  const handleSubscribe = async (plan: PricingPlan) => {
    if (!email) {
      alert('Please enter your email address');
      return;
    }

    setLoading(plan.id);

    try {
      // Create Stripe Checkout Session
      const response = await fetch('/api/stripe/create-checkout', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          email,
          priceId: plan.stripePriceId,
          planName: plan.name,
        }),
      });

      const data = await response.json();

      if (data.success && data.url) {
        // Redirect to Stripe Checkout
        window.location.href = data.url;
      } else {
        throw new Error(data.error || 'Failed to create checkout session');
      }
    } catch (error) {
      console.error('Subscription error:', error);
      alert(`Error: ${error instanceof Error ? error.message : 'Something went wrong'}`);
    } finally {
      setLoading(null);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-blue-900 to-slate-900">
      <div className="container mx-auto px-4 py-16">
        {/* Header */}
        <div className="text-center mb-16">
          <h1 className="text-5xl font-bold text-white mb-6">
            Choose Your <span className="text-blue-400">Transformation Plan</span>
          </h1>
          <p className="text-xl text-slate-300 max-w-3xl mx-auto">
            Join thousands of leaders who have transformed their lives with MadBoat.
            Start your journey today and unlock your full potential.
          </p>
        </div>

        {/* Email Input */}
        <div className="max-w-md mx-auto mb-12">
          <Label htmlFor="email" className="text-white text-lg mb-2 block">
            Enter your email to get started:
          </Label>
          <Input
            id="email"
            type="email"
            placeholder="your@email.com"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className="h-12 text-lg"
            required
          />
        </div>

        {/* Pricing Cards */}
        <div className="grid md:grid-cols-3 gap-8 max-w-6xl mx-auto">
          {pricingPlans.map((plan) => (
            <Card
              key={plan.id}
              className={`relative ${
                plan.popular
                  ? 'border-2 border-blue-500 bg-slate-800/90 scale-105'
                  : 'border-slate-700 bg-slate-800/60'
              } backdrop-blur-sm`}
            >
              {plan.popular && (
                <Badge className="absolute -top-3 left-1/2 transform -translate-x-1/2 bg-blue-500 text-white px-4 py-1">
                  Most Popular
                </Badge>
              )}

              <CardHeader className="text-center pb-4">
                <div className="mx-auto mb-4 p-3 bg-blue-500/20 rounded-full w-fit">
                  {plan.icon}
                </div>
                <CardTitle className="text-2xl text-white">{plan.name}</CardTitle>
                <CardDescription className="text-slate-300">
                  {plan.description}
                </CardDescription>
                <div className="mt-4">
                  <span className="text-4xl font-bold text-white">
                    ${plan.price}
                  </span>
                  <span className="text-slate-400">/{plan.period}</span>
                </div>
              </CardHeader>

              <CardContent>
                <ul className="space-y-3">
                  {plan.features.map((feature, index) => (
                    <li key={index} className="flex items-center text-slate-300">
                      <Check className="w-5 h-5 text-green-400 mr-3 flex-shrink-0" />
                      {feature}
                    </li>
                  ))}
                </ul>
              </CardContent>

              <CardFooter>
                <Button
                  onClick={() => handleSubscribe(plan)}
                  disabled={loading === plan.id || !email}
                  className={`w-full h-12 text-lg ${
                    plan.popular
                      ? 'bg-blue-600 hover:bg-blue-700'
                      : 'bg-slate-700 hover:bg-slate-600'
                  }`}
                >
                  {loading === plan.id ? 'Processing...' : `Start ${plan.name} Plan`}
                </Button>
              </CardFooter>
            </Card>
          ))}
        </div>

        {/* Footer Info */}
        <div className="text-center mt-16 text-slate-400">
          <p className="mb-4">
            🔒 Secure payment processing by Stripe • Cancel anytime • 30-day money-back guarantee
          </p>
          <p className="text-sm">
            After payment, you'll receive an email with your login credentials and welcome materials.
          </p>
        </div>
      </div>
    </div>
  );
}