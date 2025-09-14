/**
 * @madboat/web
 * @file src/lib/email/welcome-email.ts
 * @version 1.0.0
 * @created 2025-09-14
 * @author Claude Sonnet 4 + Captain Sandro Fidelis
 * @description Welcome Email Service for New MadBoat Users
 */

interface WelcomeEmailData {
  email: string;
  userId: string;
  planName: string;
  loginUrl?: string;
}

export const sendWelcomeEmail = async (data: WelcomeEmailData): Promise<boolean> => {
  try {
    // For now, we'll log the email content
    // In production, integrate with Resend, SendGrid, or similar service

    const emailContent = generateWelcomeEmailContent(data);

    console.log('📧 Welcome Email Sent to:', data.email);
    console.log('📄 Email Content:', emailContent);

    // TODO: Integrate with actual email service
    // Example with Resend:
    /*
    const response = await fetch('https://api.resend.com/emails', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${process.env.RESEND_API_KEY}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        from: 'MadBoat <welcome@madboat.com>',
        to: data.email,
        subject: emailContent.subject,
        html: emailContent.html,
      }),
    });
    */

    return true; // Mock success
  } catch (error) {
    console.error('❌ Failed to send welcome email:', error);
    return false;
  }
};

const generateWelcomeEmailContent = (data: WelcomeEmailData) => {
  const loginUrl = data.loginUrl || `${process.env.NEXT_PUBLIC_APP_URL}/dashboard`;

  const subject = `🚢 Welcome aboard MadBoat, Captain! Your ${data.planName} journey begins now`;

  const html = `
    <!DOCTYPE html>
    <html>
    <head>
        <meta charset="utf-8">
        <title>Welcome to MadBoat</title>
        <style>
            body { font-family: Arial, sans-serif; line-height: 1.6; color: #333; }
            .container { max-width: 600px; margin: 0 auto; padding: 20px; }
            .header { background: linear-gradient(135deg, #1e293b 0%, #1e40af 100%); padding: 40px 20px; text-align: center; color: white; border-radius: 8px 8px 0 0; }
            .content { background: #f8fafc; padding: 40px 20px; }
            .footer { background: #1e293b; padding: 20px; text-align: center; color: white; border-radius: 0 0 8px 8px; }
            .button { display: inline-block; background: #3b82f6; color: white; padding: 12px 24px; text-decoration: none; border-radius: 6px; font-weight: bold; margin: 20px 0; }
            .plan-badge { background: #10b981; color: white; padding: 6px 12px; border-radius: 20px; font-size: 14px; font-weight: bold; }
            .feature-list { list-style: none; padding: 0; }
            .feature-list li { padding: 8px 0; padding-left: 30px; position: relative; }
            .feature-list li:before { content: "⚡"; position: absolute; left: 0; color: #3b82f6; font-weight: bold; }
        </style>
    </head>
    <body>
        <div class="container">
            <div class="header">
                <h1>🚢 Welcome to MadBoat!</h1>
                <p>Your transformation journey starts now</p>
                <span class="plan-badge">${data.planName} Plan</span>
            </div>

            <div class="content">
                <h2>🎉 Your account is ready, Captain!</h2>

                <p>Welcome aboard! We're thrilled to have you join the MadBoat community of transformers. Your <strong>${data.planName}</strong> plan is now active and ready to help you unlock your full potential.</p>

                <h3>🎯 What's next?</h3>
                <ul class="feature-list">
                    <li><strong>Complete your persona discovery</strong> - Understand your unique transformation archetype</li>
                    <li><strong>Access your personalized dashboard</strong> - Track progress and set goals</li>
                    <li><strong>Join the community</strong> - Connect with fellow transformers</li>
                    <li><strong>Explore your tools</strong> - Dive into analytics, coaching, and resources</li>
                </ul>

                <div style="text-align: center; margin: 30px 0;">
                    <a href="${loginUrl}" class="button">🚀 Access Your Dashboard</a>
                </div>

                <div style="background: #e0f2fe; padding: 20px; border-radius: 6px; border-left: 4px solid #0ea5e9;">
                    <h4>💡 Pro Tip:</h4>
                    <p>Complete your persona assessment within the first 24 hours to unlock personalized recommendations and get the most out of your MadBoat experience.</p>
                </div>

                <h3>📞 Need help getting started?</h3>
                <p>Our team is here to help you succeed:</p>
                <ul>
                    <li>📧 Email: <a href="mailto:support@madboat.com">support@madboat.com</a></li>
                    <li>💬 Live Chat: Available in your dashboard</li>
                    <li>📚 Help Center: <a href="${process.env.NEXT_PUBLIC_APP_URL}/help">madboat.com/help</a></li>
                </ul>
            </div>

            <div class="footer">
                <p><strong>Account Details:</strong></p>
                <p>Email: ${data.email}</p>
                <p>Plan: ${data.planName}</p>
                <p>User ID: ${data.userId}</p>

                <hr style="border: 1px solid #374151; margin: 20px 0;">

                <p>🌊 <em>"The sea, being smooth, how many shallow bauble boats / Dared sail upon her patient breast, making their way with those of nobler bulk!"</em></p>
                <p style="font-size: 12px; color: #9ca3af;">
                    You're receiving this because you just subscribed to MadBoat.
                    <a href="#" style="color: #60a5fa;">Manage preferences</a> |
                    <a href="#" style="color: #60a5fa;">Unsubscribe</a>
                </p>
            </div>
        </div>
    </body>
    </html>
  `;

  const text = `
    Welcome to MadBoat! 🚢

    Your ${data.planName} plan is now active.

    Get started: ${loginUrl}

    Need help? Email us at support@madboat.com

    Account: ${data.email}
    User ID: ${data.userId}
  `;

  return { subject, html, text };
};