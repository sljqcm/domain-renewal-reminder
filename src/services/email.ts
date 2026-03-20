/**
 * Email Service
 * Handles email sending via HTTP API or SMTP
 */

import { Domain, SmtpConfig, ApiResponse } from '../types';
import { getDaysUntilExpiry, timestampToDate } from '../utils/date';

type EmailTemplate = {
  subject: string;
  htmlBody: string;
  textBody: string;
};

export class EmailService {
  constructor(private smtpConfig: SmtpConfig) {}

  private escapeHtml(value: string): string {
    return value
      .replace(/&/g, '&amp;')
      .replace(/</g, '&lt;')
      .replace(/>/g, '&gt;')
      .replace(/"/g, '&quot;')
      .replace(/'/g, '&#39;');
  }

  private dotStuff(value: string): string {
    return value.replace(/^\./gm, '..');
  }

  private getSmtpResponseCode(response: string): string {
    const match = response.match(/^(\d{3})/);
    if (!match) {
      throw new Error(`Invalid SMTP response: ${response}`);
    }

    return match[1];
  }

  private assertSmtpResponse(response: string, expectedCodes: string[], context: string): void {
    const code = this.getSmtpResponseCode(response);
    if (!expectedCodes.includes(code)) {
      throw new Error(`${context} failed: ${response}`);
    }
  }

  private sanitizeHeaderValue(value: string): string {
    return value.replace(/[\r\n]+/g, ' ').trim();
  }

  private encodeBase64Utf8(value: string): string {
    const bytes = new TextEncoder().encode(value);
    let binary = '';

    for (const byte of bytes) {
      binary += String.fromCharCode(byte);
    }

    return btoa(binary);
  }

  private encodeMimeHeader(value: string): string {
    const sanitized = this.sanitizeHeaderValue(value);
    if (!sanitized) {
      return '';
    }

    if (/^[\x20-\x7E]+$/.test(sanitized) && !/[",;<>]/.test(sanitized)) {
      return sanitized;
    }

    return `=?UTF-8?B?${this.encodeBase64Utf8(sanitized)}?=`;
  }

  private formatMailbox(name: string, email: string): string {
    const safeEmail = this.sanitizeHeaderValue(email);
    const safeName = this.encodeMimeHeader(name);

    return safeName ? `${safeName} <${safeEmail}>` : `<${safeEmail}>`;
  }

  private formatMessageId(): string {
    const domain = (this.smtpConfig.fromEmail.split('@')[1] || 'localhost')
      .toLowerCase()
      .replace(/[^a-z0-9.-]/g, '');

    return `<${crypto.randomUUID()}@${domain}>`;
  }

  private buildEmailLayout(options: {
    preheader: string;
    eyebrow: string;
    title: string;
    intro: string;
    content: string;
    actionLabel?: string;
    actionUrl?: string;
    footer: string;
  }): string {
    const {
      preheader,
      eyebrow,
      title,
      intro,
      content,
      actionLabel,
      actionUrl,
      footer,
    } = options;

    const actionBlock = actionLabel && actionUrl
      ? `
        <tr>
          <td style="padding: 0 32px 32px 32px;">
            <table role="presentation" cellspacing="0" cellpadding="0" border="0">
              <tr>
                <td bgcolor="#1565c0" style="border-radius: 10px;">
                  <a
                    href="${this.escapeHtml(actionUrl)}"
                    style="display: inline-block; padding: 14px 24px; font-size: 15px; font-weight: 600; line-height: 20px; color: #ffffff; text-decoration: none;"
                  >
                    ${this.escapeHtml(actionLabel)}
                  </a>
                </td>
              </tr>
            </table>
          </td>
        </tr>
      `
      : '';

    const brandBlock = `
      <table role="presentation" cellspacing="0" cellpadding="0" border="0">
        <tr>
          <td valign="middle" style="padding: 0 14px 0 0;">
            <table role="presentation" width="52" height="52" cellspacing="0" cellpadding="0" border="0" style="width: 52px; height: 52px; border-radius: 16px; background: linear-gradient(135deg, #59d5ff 0%, #1da9ef 55%, #0a83d8 100%);">
              <tr>
                <td align="center" valign="middle">
                  <div style="width: 26px; height: 26px; border: 3px solid #ffffff; border-radius: 999px;">
                    <div style="width: 3px; height: 8px; margin: 4px auto 0 auto; background-color: #ffffff; border-radius: 999px;"></div>
                    <div style="width: 9px; height: 3px; margin: 1px 0 0 12px; background-color: #ffffff; border-radius: 999px;"></div>
                  </div>
                </td>
              </tr>
            </table>
          </td>
          <td valign="middle">
            <div style="font-size: 18px; line-height: 24px; font-weight: 700; color: #ffffff;">闁绘牞绮鹃崵婊堟偨閸楃偟鍘甸柛姘Ф椤撴悂鎮?/div>
            <div style="font-size: 12px; line-height: 18px; color: rgba(255, 255, 255, 0.82);">Domain Management Console</div>
          </td>
        </tr>
      </table>
    `;

    return `
<!DOCTYPE html>
<html lang="zh-CN">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>${this.escapeHtml(title)}</title>
</head>
<body style="margin: 0; padding: 0; background-color: #eef3f8; font-family: 'Segoe UI', Arial, sans-serif; color: #1f2937;">
  <div style="display: none; max-height: 0; overflow: hidden; opacity: 0; mso-hide: all;">
    ${this.escapeHtml(preheader)}
  </div>
  <table role="presentation" width="100%" cellspacing="0" cellpadding="0" border="0" style="background-color: #eef3f8;">
    <tr>
      <td align="center" style="padding: 24px 12px;">
        <table role="presentation" width="100%" cellspacing="0" cellpadding="0" border="0" style="max-width: 640px; background-color: #ffffff; border: 1px solid #d7e0ea; border-radius: 18px; overflow: hidden;">
          <tr>
            <td style="padding: 28px 32px; background: linear-gradient(135deg, #10324b 0%, #1b5f8f 100%); color: #ffffff;">
              ${brandBlock}
              <div style="font-size: 12px; letter-spacing: 0.12em; text-transform: uppercase; opacity: 0.82;">${this.escapeHtml(eyebrow)}</div>
              <div style="margin-top: 18px; font-size: 28px; line-height: 36px; font-weight: 700;">${this.escapeHtml(title)}</div>
              <div style="margin-top: 12px; font-size: 15px; line-height: 24px; opacity: 0.92;">${this.escapeHtml(intro)}</div>
            </td>
          </tr>
          <tr>
            <td style="padding: 32px;">
              ${content}
            </td>
          </tr>
          ${actionBlock}
          <tr>
            <td style="padding: 20px 32px 28px 32px; border-top: 1px solid #e5ebf1; font-size: 13px; line-height: 22px; color: #607080;">
              ${footer}
            </td>
          </tr>
        </table>
      </td>
    </tr>
  </table>
</body>
</html>
    `.trim();
  }

  /**
   * Send email using configured provider
   */
  async sendEmail(to: string, subject: string, htmlBody: string, textBody: string): Promise<ApiResponse> {
    if (this.smtpConfig.provider === 'http-api') {
      return this.sendViaHttpApi(to, subject, htmlBody, textBody);
    } else {
      return this.sendViaSmtp(to, subject, htmlBody, textBody);
    }
  }

  /**
   * Send email via HTTP API (Resend, SendGrid, Mailgun, etc.)
   */
  private async sendViaHttpApi(to: string, subject: string, htmlBody: string, textBody: string): Promise<ApiResponse> {
    try {
      console.log('Sending email via HTTP API:', {
        to,
        subject,
        apiType: this.smtpConfig.apiType,
      });

      switch (this.smtpConfig.apiType) {
        case 'resend':
          return await this.sendViaResend(to, subject, htmlBody, textBody);
        case 'sendgrid':
          return await this.sendViaSendGrid(to, subject, htmlBody, textBody);
        case 'mailgun':
          return await this.sendViaMailgun(to, subject, htmlBody, textBody);
        case 'custom':
          return await this.sendViaCustomApi(to, subject, htmlBody, textBody);
        default:
          throw new Error(`Unsupported API type: ${this.smtpConfig.apiType}`);
      }
    } catch (error) {
      console.error('HTTP API email error:', error);
      await this.logEmailError(to, subject, error);
      return {
        success: false,
        error: {
          code: 'EMAIL_SEND_FAILED',
          message: 'Failed to send email via HTTP API',
          details: error instanceof Error ? error.message : 'Unknown error',
        },
      };
    }
  }

  /**
   * Send via Resend API
   */
  private async sendViaResend(to: string, subject: string, htmlBody: string, textBody: string): Promise<ApiResponse> {
    const response = await fetch('https://api.resend.com/emails', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${this.smtpConfig.apiKey || this.smtpConfig.password}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        from: `${this.smtpConfig.fromName} <${this.smtpConfig.fromEmail}>`,
        to: [to],
        subject,
        html: htmlBody,
        text: textBody,
      }),
    });

    if (!response.ok) {
      const error = await response.json();
      throw new Error(`Resend API error: ${JSON.stringify(error)}`);
    }

    return {
      success: true,
      message: 'Email accepted by Resend',
    };
  }

  /**
   * Send via SendGrid API
   */
  private async sendViaSendGrid(to: string, subject: string, htmlBody: string, textBody: string): Promise<ApiResponse> {
    const response = await fetch('https://api.sendgrid.com/v3/mail/send', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${this.smtpConfig.apiKey || this.smtpConfig.password}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        personalizations: [{
          to: [{ email: to }],
        }],
        from: {
          email: this.smtpConfig.fromEmail,
          name: this.smtpConfig.fromName,
        },
        subject,
        content: [{
          type: 'text/plain',
          value: textBody,
        }, {
          type: 'text/html',
          value: htmlBody,
        }],
      }),
    });

    if (!response.ok) {
      const error = await response.text();
      throw new Error(`SendGrid API error: ${error}`);
    }

    return {
      success: true,
      message: 'Email accepted by SendGrid',
    };
  }

  /**
   * Send via Mailgun API
   */
  private async sendViaMailgun(to: string, subject: string, htmlBody: string, textBody: string): Promise<ApiResponse> {
    const domain = this.smtpConfig.mailgunDomain || this.smtpConfig.host;
    const auth = btoa(`api:${this.smtpConfig.apiKey || this.smtpConfig.password}`);

    const formData = new FormData();
    formData.append('from', `${this.smtpConfig.fromName} <${this.smtpConfig.fromEmail}>`);
    formData.append('to', to);
    formData.append('subject', subject);
    formData.append('text', textBody);
    formData.append('html', htmlBody);

    const response = await fetch(`https://api.mailgun.net/v3/${domain}/messages`, {
      method: 'POST',
      headers: {
        'Authorization': `Basic ${auth}`,
      },
      body: formData,
    });

    if (!response.ok) {
      const error = await response.text();
      throw new Error(`Mailgun API error: ${error}`);
    }

    return {
      success: true,
      message: 'Email accepted by Mailgun',
    };
  }

  /**
   * Send via custom HTTP API
   */
  private async sendViaCustomApi(to: string, subject: string, htmlBody: string, textBody: string): Promise<ApiResponse> {
    const authHeader = this.smtpConfig.username
      ? `Basic ${btoa(`${this.smtpConfig.username}:${this.smtpConfig.password}`)}`
      : `Bearer ${this.smtpConfig.apiKey || this.smtpConfig.password}`;

    const response = await fetch(`https://${this.smtpConfig.host}/api/send`, {
      method: 'POST',
      headers: {
        'Authorization': authHeader,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        from: {
          email: this.smtpConfig.fromEmail,
          name: this.smtpConfig.fromName,
        },
        to: [{ email: to }],
        subject,
        text: textBody,
        html: htmlBody,
      }),
    });

    if (!response.ok) {
      const errorText = await response.text();
      throw new Error(`Custom API error: ${response.status} - ${errorText}`);
    }

    return {
      success: true,
      message: 'Email accepted by custom email API',
    };
  }

  /**
   * Send email via SMTP (TCP Socket)
   * Note: This requires implementing the full SMTP protocol
   */
  private async sendViaSmtp(to: string, subject: string, htmlBody: string, textBody: string): Promise<ApiResponse> {
    try {
      console.log('Sending email via SMTP:', {
        to,
        subject,
        host: this.smtpConfig.host,
        port: this.smtpConfig.port,
      });

      const { connect } = await import('cloudflare:sockets');

      const socket = connect({
        hostname: this.smtpConfig.host,
        port: this.smtpConfig.port,
      }, {
        secureTransport: this.smtpConfig.port === 465 ? 'on' : 'starttls',
        allowHalfOpen: false,
      });

      const writer = socket.writable.getWriter();
      const reader = socket.readable.getReader();
      const encoder = new TextEncoder();
      const decoder = new TextDecoder();
      let responseBuffer = '';

      try {
        const sendCommand = async (command: string) => {
          console.log('SMTP >', command);
          await writer.write(encoder.encode(command + '\r\n'));
        };

        const extractSmtpResponse = (): string | null => {
          const completeLines = responseBuffer.match(/[^\r\n]*\r\n/g) ?? [];
          if (completeLines.length === 0) {
            return null;
          }

          const firstLine = completeLines[0].slice(0, -2);
          const match = firstLine.match(/^(\d{3})([ -])/);
          if (!match) {
            return null;
          }

          const [, code, separator] = match;
          if (separator === ' ') {
            const consumedLength = completeLines[0].length;
            const response = responseBuffer.slice(0, consumedLength).trimEnd();
            responseBuffer = responseBuffer.slice(consumedLength);
            return response;
          }

          let consumedLength = 0;
          for (const lineWithBreak of completeLines) {
            consumedLength += lineWithBreak.length;
            const line = lineWithBreak.slice(0, -2);
            if (line.startsWith(`${code} `)) {
              const response = responseBuffer.slice(0, consumedLength).trimEnd();
              responseBuffer = responseBuffer.slice(consumedLength);
              return response;
            }
          }

          return null;
        };

        const readResponse = async (): Promise<string> => {
          while (true) {
            const response = extractSmtpResponse();
            if (response) {
              console.log('SMTP <', response);
              return response;
            }

            const { value, done } = await reader.read();
            if (done) {
              const trailing = responseBuffer + decoder.decode();
              responseBuffer = '';

              if (!trailing.trim()) {
                throw new Error('SMTP connection closed unexpectedly');
              }

              const finalResponse = trailing.trimEnd();
              console.log('SMTP <', finalResponse);
              return finalResponse;
            }

            responseBuffer += decoder.decode(value, { stream: true });
          }
        };

        let response = await readResponse();
        this.assertSmtpResponse(response, ['220'], 'SMTP greeting');

        await sendCommand(`EHLO ${this.smtpConfig.host}`);
        response = await readResponse();
        this.assertSmtpResponse(response, ['250'], 'EHLO');

        if (this.smtpConfig.port === 587) {
          await sendCommand('STARTTLS');
          response = await readResponse();
          this.assertSmtpResponse(response, ['220'], 'STARTTLS');

          await sendCommand(`EHLO ${this.smtpConfig.host}`);
          response = await readResponse();
          this.assertSmtpResponse(response, ['250'], 'EHLO after STARTTLS');
        }

        if (this.smtpConfig.password) {
          await sendCommand('AUTH LOGIN');
          response = await readResponse();
          this.assertSmtpResponse(response, ['334'], 'AUTH LOGIN');

          const username = this.smtpConfig.username || this.smtpConfig.fromEmail;
          await sendCommand(btoa(username));
          response = await readResponse();
          this.assertSmtpResponse(response, ['334'], 'Username authentication');

          await sendCommand(btoa(this.smtpConfig.password));
          response = await readResponse();
          this.assertSmtpResponse(response, ['235'], 'Password authentication');
        }

        await sendCommand(`MAIL FROM:<${this.smtpConfig.fromEmail}>`);
        response = await readResponse();
        this.assertSmtpResponse(response, ['250'], 'MAIL FROM');

        await sendCommand(`RCPT TO:<${to}>`);
        response = await readResponse();
        this.assertSmtpResponse(response, ['250', '251'], 'RCPT TO');

        await sendCommand('DATA');
        response = await readResponse();
        this.assertSmtpResponse(response, ['354'], 'DATA command');

        const boundary = `boundary_${crypto.randomUUID()}`;
        const fromHeader = this.formatMailbox(this.smtpConfig.fromName, this.smtpConfig.fromEmail);
        const replyToHeader = this.formatMailbox(this.smtpConfig.fromName, this.smtpConfig.fromEmail);
        const subjectHeader = this.encodeMimeHeader(subject);
        const messageBody = [
          `From: ${fromHeader}`,
          `Reply-To: ${replyToHeader}`,
          `To: ${to}`,
          `Subject: ${subjectHeader}`,
          `Date: ${new Date().toUTCString()}`,
          `Message-ID: ${this.formatMessageId()}`,
          'Auto-Submitted: auto-generated',
          'X-Auto-Response-Suppress: All',
          'MIME-Version: 1.0',
          `Content-Type: multipart/alternative; boundary="${boundary}"`,
          '',
          `--${boundary}`,
          'Content-Type: text/plain; charset=utf-8',
          'Content-Transfer-Encoding: 8bit',
          '',
          textBody,
          '',
          `--${boundary}`,
          'Content-Type: text/html; charset=utf-8',
          'Content-Transfer-Encoding: 8bit',
          '',
          htmlBody,
          '',
          `--${boundary}--`,
        ].join('\r\n');

        // Dot-stuff only the message body. The SMTP terminator must remain a single "." line.
        await sendCommand(`${this.dotStuff(messageBody)}\r\n.`);
        response = await readResponse();
        this.assertSmtpResponse(response, ['250'], 'Email sending');

        await sendCommand('QUIT');
        response = await readResponse();
        this.assertSmtpResponse(response, ['221'], 'QUIT');

        return {
          success: true,
          message: 'Email accepted by SMTP server',
        };
      } finally {
        await writer.close();
        await socket.close();
      }
    } catch (error) {
      console.error('SMTP error:', error);
      await this.logEmailError(to, subject, error);
      return {
        success: false,
        error: {
          code: 'EMAIL_SEND_FAILED',
          message: 'Failed to send email via SMTP',
          details: error instanceof Error ? error.message : 'Unknown error',
        },
      };
    }
  }

  /**
   * Compose reminder email
   */
  composeReminderEmail(domain: Domain): EmailTemplate {
    const expiryDate = timestampToDate(domain.expiry_date);
    const daysRemaining = getDaysUntilExpiry(expiryDate);
    const isExpired = daysRemaining < 0;
    const overdueDays = Math.abs(daysRemaining);
    const safeDomain = this.escapeHtml(domain.domain_address);
    const expiryLabel = this.escapeHtml(expiryDate.toLocaleDateString('zh-CN'));
    const remainingTone = isExpired || daysRemaining <= 7 ? '#c62828' : '#1565c0';
    const statusLabel = isExpired ? `Expired ${overdueDays} days ago` : `${daysRemaining} days remaining`;
    const statusIntro = isExpired
      ? 'This domain has entered the post-expiry handling window. Please confirm its current status as soon as possible.'
      : 'This domain has entered the notification window you configured. Please review its current status.';
    const statusFooter = isExpired
      ? 'If your registrar still supports recovery or post-expiry processing, please complete the required action in the registrar console as soon as possible.'
      : 'If you have already handled this domain, you can ignore this message. To keep receiving notifications, make sure the current domain record and mailbox settings remain valid.';
    const subject = isExpired
      ? `Domain status notice: ${domain.domain_address} expired ${overdueDays} days ago`
      : `Domain status notice: ${domain.domain_address} ${daysRemaining} days remaining`;

    const content = `
      <table role="presentation" width="100%" cellspacing="0" cellpadding="0" border="0">
        <tr>
          <td style="padding: 0 0 18px 0; font-size: 15px; line-height: 24px; color: #334155;">
            ${statusIntro}
          </td>
        </tr>
        <tr>
          <td style="padding: 0 0 20px 0;">
            <table role="presentation" width="100%" cellspacing="0" cellpadding="0" border="0" style="background-color: #f8fbfe; border: 1px solid #dbe5ef; border-radius: 14px;">
              <tr>
                <td style="padding: 20px 22px;">
                  <table role="presentation" width="100%" cellspacing="0" cellpadding="0" border="0">
                    <tr>
                      <td style="padding: 0 0 12px 0; font-size: 13px; line-height: 20px; color: #5f6f82;">Domain</td>
                      <td align="right" style="padding: 0 0 12px 12px; font-size: 15px; line-height: 22px; font-weight: 600; color: #102a43;">${safeDomain}</td>
                    </tr>
                    <tr>
                      <td style="padding: 12px 0; border-top: 1px solid #dbe5ef; font-size: 13px; line-height: 20px; color: #5f6f82;">Expiry date</td>
                      <td align="right" style="padding: 12px 0 12px 12px; border-top: 1px solid #dbe5ef; font-size: 15px; line-height: 22px; color: #102a43;">${expiryLabel}</td>
                    </tr>
                    <tr>
                      <td style="padding: 12px 0; border-top: 1px solid #dbe5ef; font-size: 13px; line-height: 20px; color: #5f6f82;">Current status</td>
                      <td align="right" style="padding: 12px 0 12px 12px; border-top: 1px solid #dbe5ef; font-size: 16px; line-height: 22px; font-weight: 700; color: ${remainingTone};">${statusLabel}</td>
                    </tr>
                    <tr>
                      <td style="padding: 12px 0 0 0; border-top: 1px solid #dbe5ef; font-size: 13px; line-height: 20px; color: #5f6f82;">Suggested action</td>
                      <td align="right" style="padding: 12px 0 0 12px; border-top: 1px solid #dbe5ef; font-size: 14px; line-height: 22px; color: #102a43;">Open the detail page and confirm the current status</td>
                    </tr>
                  </table>
                </td>
              </tr>
            </table>
          </td>
        </tr>
        <tr>
          <td style="padding: 0; font-size: 14px; line-height: 22px; color: #5f6f82;">
            ${statusFooter}
          </td>
        </tr>
      </table>
    `.trim();

    const htmlBody = this.buildEmailLayout({
      preheader: isExpired
        ? `${domain.domain_address} expired ${overdueDays} days ago. Please review the current status.`
        : `${domain.domain_address} has ${daysRemaining} days remaining. Please review the current status.`,
      eyebrow: 'Domain Status Notice',
      title: isExpired ? 'Domain Status Update' : 'Domain Status Notice',
      intro: 'The system detected that this domain has entered the attention window you configured. The current status is shown below.',
      content,
      actionLabel: 'View Details',
      actionUrl: domain.renewal_url,
      footer: 'This is an automated status notification. Please do not reply directly to this email. If you need to adjust the notification strategy, sign in to the system and update the domain settings.',
    });

    const textBody = [
      isExpired ? '[Domain Status Update]' : '[Domain Status Notice]',
      `Domain: ${domain.domain_address}`,
      `Expiry date: ${expiryDate.toLocaleDateString('zh-CN')}`,
      `Current status: ${statusLabel}`,
      '',
      isExpired
        ? 'This domain is still in the post-expiry handling window. Please check the registrar console and confirm the current status as soon as possible.'
        : 'This domain has entered the notification window you configured. Please check the registrar console and confirm the current status as soon as possible.',
      'The detail entry is provided through the HTML email button. If you cannot open it, sign in to the system and review the processing address stored for this domain.',
      'This is an automated status notification. Please do not reply directly to this email.',
    ].join('\n');

    return { subject, htmlBody, textBody };
  }

  /**
   * Compose verification email
   */
  composeVerificationEmail(_email: string, token: string, appUrl: string): EmailTemplate {
    const cleanBaseUrl = appUrl.replace(/\/$/, '');
    const verificationUrl = `${cleanBaseUrl}/verify?token=${token}`;
    const safeVerificationUrl = this.escapeHtml(verificationUrl);
    const subject = 'Verify your email address';

    const content = `
      <table role="presentation" width="100%" cellspacing="0" cellpadding="0" border="0">
        <tr>
          <td style="padding: 0 0 18px 0; font-size: 15px; line-height: 24px; color: #334155;">
            Welcome to the domain management console. Please verify your email address before signing in and receiving automated domain notifications.
          </td>
        </tr>
        <tr>
          <td style="padding: 0 0 20px 0;">
            <table role="presentation" width="100%" cellspacing="0" cellpadding="0" border="0" style="background-color: #f8fbfe; border: 1px solid #dbe5ef; border-radius: 14px;">
              <tr>
                <td style="padding: 20px 22px; font-size: 14px; line-height: 23px; color: #334155;">
                  <strong style="display: block; margin-bottom: 8px; color: #102a43;">Verification notes</strong>
                  1. Use the button below to complete verification.<br>
                  2. This verification link is valid for 24 hours.<br>
                  3. If the button does not open, copy the backup link below into your browser.
                </td>
              </tr>
            </table>
          </td>
        </tr>
        <tr>
          <td style="padding: 0 0 12px 0; font-size: 14px; line-height: 22px; color: #5f6f82;">
            Backup verification link:
          </td>
        </tr>
        <tr>
          <td style="padding: 0; font-size: 14px; line-height: 22px; color: #1565c0; word-break: break-all;">
            ${safeVerificationUrl}
          </td>
        </tr>
      </table>
    `.trim();

    const htmlBody = this.buildEmailLayout({
      preheader: 'Verify your email address to activate sign-in and domain notifications.',
      eyebrow: 'Account Verification',
      title: 'Verify Your Email',
      intro: 'Please confirm this email address so the system can deliver account and domain updates reliably.',
      content,
      actionLabel: 'Verify Email',
      actionUrl: verificationUrl,
      footer: 'If you did not request this account, you can safely ignore this email. This message was sent automatically; please do not reply.',
    });

    const textBody = [
      '[Email Verification]',
      'Welcome to the domain management console.',
      'Use the link below to verify your email address. The link is valid for 24 hours:',
      verificationUrl,
      '',
      'If you did not request this account, you can safely ignore this email.',
      'This message was sent automatically; please do not reply.',
    ].join('\n');

    return { subject, htmlBody, textBody };
  }

  /**
   * Log email sending error
   */
  private async logEmailError(to: string, subject: string, error: any): Promise<void> {
    console.error('Email error:', {
      to,
      subject,
      error: error instanceof Error ? error.message : error,
      timestamp: new Date().toISOString(),
    });
  }
}
