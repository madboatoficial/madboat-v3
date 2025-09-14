/**
 * @madboat/web
 * @file src/app/payment/cancelled/page.tsx
 * @version 1.0.0
 * @created 2025-09-14
 * @author Claude Sonnet 4 + Captain Sandro Fidelis
 * @description Payment Cancelled Page
 */

'use client';

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { XCircle, ArrowLeft, Heart } from 'lucide-react';
import Link from 'next/link';

export default function PaymentCancelledPage() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-blue-900 to-slate-900 flex items-center justify-center p-4">
      <Card className="w-full max-w-2xl bg-slate-800/90 backdrop-blur-sm border-slate-700">
        <CardHeader className="text-center pb-4">
          <div className="mx-auto mb-4 p-4 bg-orange-500/20 rounded-full w-fit">
            <XCircle className="w-16 h-16 text-orange-400" />
          </div>
          <CardTitle className="text-3xl text-white mb-2">
            Payment Cancelled
          </CardTitle>
          <CardDescription className="text-slate-300 text-lg">
            No worries! Your payment was not processed.
          </CardDescription>
        </CardHeader>

        <CardContent className="space-y-6">
          <div className="text-center">
            <p className="text-slate-300 mb-6">
              We understand that choosing the right transformation program is an important decision.
              Take your time to think it over.
            </p>

            <div className="bg-slate-700/50 rounded-lg p-6 mb-6">
              <h3 className="text-white font-semibold mb-3 flex items-center justify-center">
                <Heart className="w-5 h-5 mr-2 text-red-400" />
                Why join thousands of MadBoat transformers?
              </h3>
              <ul className="text-slate-300 space-y-2 text-sm">
                <li>✨ Personalized transformation roadmap based on your unique persona</li>
                <li>🎯 Proven methodologies used by successful leaders worldwide</li>
                <li>🚀 Community of like-minded individuals on similar journeys</li>
                <li>📈 Track your progress with advanced analytics and insights</li>
                <li>💪 30-day money-back guarantee - risk-free transformation</li>
              </ul>
            </div>

            <div className="text-slate-400 text-sm mb-6">
              <p>
                <strong>Special Offer:</strong> Use code <code className="bg-slate-600 px-2 py-1 rounded text-blue-300">COMEBACK20</code>
                {' '}for 20% off your first month if you return within 24 hours.
              </p>
            </div>
          </div>

          <div className="flex flex-col sm:flex-row gap-4 pt-4">
            <Button asChild className="flex-1 bg-blue-600 hover:bg-blue-700">
              <Link href="/pricing">
                <ArrowLeft className="w-4 h-4 mr-2" />
                Try Again
              </Link>
            </Button>
            <Button asChild variant="outline" className="flex-1">
              <Link href="/">
                Back to Home
              </Link>
            </Button>
          </div>

          <div className="text-center pt-4 border-t border-slate-600">
            <p className="text-slate-400 text-sm">
              Questions about our plans? Chat with us at{' '}
              <a href="mailto:hello@madboat.com" className="text-blue-400 hover:text-blue-300">
                hello@madboat.com
              </a>
              {' '}or schedule a free consultation.
            </p>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}