import { Injectable, Logger } from '@nestjs/common';
import * as nodemailer from 'nodemailer';

@Injectable()
export class MailService {
  private readonly logger = new Logger(MailService.name);
  private transporter: nodemailer.Transporter | null = null;

  constructor() {
    const host = process.env.SMTP_HOST;
    const port = Number(process.env.SMTP_PORT ?? 587);
    const user = process.env.SMTP_USER;
    const pass = process.env.SMTP_PASS;

    if (host && user && pass) {
      this.transporter = nodemailer.createTransport({
        host,
        port,
        secure: port === 465, // true for 465, false for 587 (STARTTLS)
        auth: { user, pass },
      });
      this.logger.log(`MailService initialized with SMTP host: ${host}:${port}`);
    } else {
      this.logger.warn('SMTP configuration missing in env (SMTP_HOST, SMTP_USER, SMTP_PASS). MailService will log reset links to console.');
    }
  }

  async sendPasswordResetEmail(toEmail: string, resetLink: string): Promise<void> {
    const from = process.env.MAIL_FROM ?? `"Aruli Support" <${process.env.SMTP_USER}>`;
    const subject = 'Password Reset Request';
    const html = `
      <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px; border: 1px solid #e0e0e0; border-radius: 8px;">
        <h2 style="color: #333;">Password Reset Request</h2>
        <p>Hello,</p>
        <p>You requested to reset your password for your Aruli E-Commerce account.</p>
        <p>Please click the button below to reset your password. This link is valid for <strong>15 minutes</strong>.</p>
        <p style="margin: 25px 0;">
          <a href="${resetLink}" style="background-color: #007bff; color: white; padding: 12px 24px; text-decoration: none; border-radius: 4px; font-weight: bold; display: inline-block;">Reset Password</a>
        </p>
        <p>Or copy and paste this link into your browser:</p>
        <p style="word-break: break-all; color: #555;"><a href="${resetLink}">${resetLink}</a></p>
        <hr style="margin: 30px 0; border: none; border-top: 1px solid #eee;" />
        <p style="color: #999; font-size: 12px;">If you did not request a password reset, please ignore this email.</p>
      </div>
    `;

    if (this.transporter) {
      try {
        await this.transporter.sendMail({
          from,
          to: toEmail,
          subject,
          html,
        });
        this.logger.log(`Password reset email successfully sent to ${toEmail}`);
      } catch (error) {
        this.logger.error(`Failed to send email to ${toEmail}: ${(error as Error).message}`, (error as Error).stack);
      }
    } else {
      // In development mode without SMTP, log the email & reset link cleanly to console
      this.logger.log(`================ PASSWORD RESET LINK ================`);
      this.logger.log(`TO: ${toEmail}`);
      this.logger.log(`RESET LINK: ${resetLink}`);
      this.logger.log(`===================================================`);
    }
  }
}
