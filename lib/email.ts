import { Resend } from 'resend';

const resendApiKey = process.env.RESEND_API_KEY;
const resendFrom = process.env.RESEND_FROM || 'no-reply@cryptostore.local';

export const resend = resendApiKey ? new Resend(resendApiKey) : null;

export interface SendEmailParams {
  to: string;
  subject: string;
  html: string;
}

export async function sendTransactionalEmail({ to, subject, html }: SendEmailParams): Promise<boolean> {
  if (!resend) {
    console.log(`[Email Mock] To: ${to} | Subject: ${subject}`);
    return true;
  }

  try {
    await resend.emails.send({
      from: resendFrom,
      to,
      subject,
      html,
    });
    return true;
  } catch (error) {
    console.error('Error sending transactional email:', error);
    return false;
  }
}

export function generateOrderConfirmationEmail(orderNumber: string, trackingCode: string, total: number): string {
  return `
    <div style="font-family: sans-serif; background: #09090B; color: #FAFAFA; padding: 24px; border-radius: 12px;">
      <h2 style="color: #6366F1;">Order Placed: ${orderNumber}</h2>
      <p>Thank you for your order. Your cryptocurrency payment invoice is pending.</p>
      <p><strong>Total:</strong> $${total.toFixed(2)} USD</p>
      <p><strong>Public Tracking Code:</strong> <code style="color: #F59E0B;">${trackingCode}</code></p>
    </div>
  `;
}
