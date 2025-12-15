import nodemailer from 'nodemailer';

type SendEmailOptions = {
  to: string;
  subject: string;
  text?: string;
  html?: string;
  attachments?: Array<{ filename: string; content: string | Buffer }>;
};

let cachedTransporter: nodemailer.Transporter | null = null;

function getTransporter() {
  if (cachedTransporter) return cachedTransporter;

  if (!process.env.SMTP_HOST || !process.env.SMTP_PORT) {
    throw new Error('SMTP not configured');
  }

  const port = Number(process.env.SMTP_PORT);
  const secure = port === 465 || process.env.SMTP_SECURE === 'true';

  const transportOptions: any = {
    host: process.env.SMTP_HOST,
    port,
    secure,
    connectionTimeout: process.env.SMTP_CONNECTION_TIMEOUT ? Number(process.env.SMTP_CONNECTION_TIMEOUT) : 10000,
    greetingTimeout: process.env.SMTP_GREETING_TIMEOUT ? Number(process.env.SMTP_GREETING_TIMEOUT) : 5000,
  };

  if (process.env.SMTP_USER && process.env.SMTP_PASS) {
    transportOptions.auth = { user: process.env.SMTP_USER, pass: process.env.SMTP_PASS };
  }

  cachedTransporter = nodemailer.createTransport(transportOptions);
  return cachedTransporter;
}

export async function sendEmail(opts: SendEmailOptions) {
  const transporter = getTransporter();

  try {
    // verify connection (quick fail if can't connect)
    await transporter.verify();
  } catch (err) {
    console.error('SMTP verify failed', err);
    throw err;
  }

  const from = process.env.SMTP_FROM || process.env.SMTP_USER || `no-reply@${process.env.NEXT_PUBLIC_HOST || 'localhost'}`;

  const mailOptions: nodemailer.SendMailOptions = {
    from,
    to: opts.to,
    subject: opts.subject,
    text: opts.text,
    html: opts.html,
    attachments: opts.attachments,
  };

  try {
    const result = await transporter.sendMail(mailOptions);
    return result;
  } catch (err) {
    console.error('Error sending email', err);
    throw err;
  }
}

export default sendEmail;
