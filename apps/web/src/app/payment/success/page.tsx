/**
 * @madboat/web
 * @file src/app/payment/success/page.tsx
 * @version 1.0.0
 * @created 2025-09-14
 * @author Claude Sonnet 4 + Captain Sandro Fidelis
 * @description Payment Success Page
 */

'use client';

import { useEffect, useState, Suspense } from 'react';
import { useSearchParams } from 'next/navigation';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { CheckCircle, Mail, ArrowRight } from 'lucide-react';
import Link from 'next/link';

function PaymentSuccessContent() {
  const searchParams = useSearchParams();
  const sessionId = searchParams.get('session_id');
  const [sessionData, setSessionData] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (sessionId) {
      // In a real implementation, you might want to fetch session details
      // from your backend to show customer information
      setSessionData({ sessionId });
      setLoading(false);
    } else {
      setLoading(false);
    }
  }, [sessionId]);

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-900 via-blue-900 to-slate-900 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-400 mx-auto mb-4"></div>
          <p className="text-white">Loading...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-blue-900 to-slate-900 flex items-center justify-center p-4">
      <Card className="w-full max-w-2xl bg-slate-800/90 backdrop-blur-sm border-slate-700">
        <CardHeader className="text-center pb-4">
          <div className="mx-auto mb-4 p-4 bg-green-500/20 rounded-full w-fit">
            <CheckCircle className="w-16 h-16 text-green-400" />
          </div>
          <CardTitle className="text-3xl text-white mb-2">
            🎉 Payment Successful!
          </CardTitle>
          <CardDescription className="text-slate-300 text-lg">
            Welcome aboard the MadBoat transformation journey!
          </CardDescription>
        </CardHeader>

        <CardContent className="space-y-6">
          <div className="text-center">
            <h3 className="text-xl font-semibold text-white mb-3">
              What happens next?
            </h3>
            <div className="space-y-4 text-left">
              <div className="flex items-start space-x-3">
                <div className="flex-shrink-0 w-8 h-8 bg-blue-500/20 rounded-full flex items-center justify-center text-blue-400 font-semibold">
                  1
                </div>
                <div>
                  <p className="text-white font-medium">Account Creation</p>
                  <p className="text-slate-300 text-sm">
                    Your MadBoat account is being created automatically. This usually takes 1-2 minutes.
                  </p>
                </div>
              </div>

              <div className="flex items-start space-x-3">
                <div className="flex-shrink-0 w-8 h-8 bg-blue-500/20 rounded-full flex items-center justify-center text-blue-400 font-semibold">
                  2
                </div>
                <div>
                  <p className="text-white font-medium flex items-center">
                    <Mail className="w-4 h-4 mr-2" />
                    Welcome Email
                  </p>
                  <p className="text-slate-300 text-sm">
                    Check your email for login credentials and your personalized welcome guide.
                  </p>
                </div>
              </div>

              <div className="flex items-start space-x-3">
                <div className="flex-shrink-0 w-8 h-8 bg-blue-500/20 rounded-full flex items-center justify-center text-blue-400 font-semibold">
                  3
                </div>
                <div>
                  <p className="text-white font-medium">Start Your Journey</p>
                  <p className="text-slate-300 text-sm">
                    Access your dashboard and begin your transformation with personalized tools and insights.
                  </p>
                </div>
              </div>
            </div>
          </div>

          {sessionId && (
            <div className="bg-slate-700/50 rounded-lg p-4">
              <p className="text-slate-300 text-sm">
                <strong>Session ID:</strong> {sessionId}
              </p>
              <p className="text-slate-400 text-xs mt-1">
                Save this for your records. If you need support, reference this session ID.
              </p>
            </div>
          )}

          <div className="flex flex-col sm:flex-row gap-4 pt-4">
            <Button asChild className="flex-1 bg-blue-600 hover:bg-blue-700">
              <Link href="/dashboard">
                Go to Dashboard
                <ArrowRight className="w-4 h-4 ml-2" />
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
              Need help? Email us at{' '}
              <a href="mailto:support@madboat.com" className="text-blue-400 hover:text-blue-300">
                support@madboat.com
              </a>
            </p>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}

export default function PaymentSuccessPage() {
  return (
    <Suspense fallback={
      <div className="min-h-screen bg-gradient-to-br from-slate-900 via-blue-900 to-slate-900 flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-400"></div>
      </div>
    }>
      <PaymentSuccessContent />
    </Suspense>
  );
}