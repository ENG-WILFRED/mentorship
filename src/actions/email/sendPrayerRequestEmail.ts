"use server";

import nodemailer from 'nodemailer';

export async function sendPrayerRequestEmail({ prayer }: { prayer: any }) {
  if (!process.env.SMTP_HOST || !process.env.SMTP_PORT || !process.env.SMTP_USER || !process.env.SMTP_PASS) {
    console.warn('SMTP not configured; skipping prayer notification email');
    return;
  }

  const transporter = nodemailer.createTransport({
    host: process.env.SMTP_HOST,
    port: Number(process.env.SMTP_PORT),
    secure: Number(process.env.SMTP_PORT) === 465,
    auth: {
      user: process.env.SMTP_USER,
      pass: process.env.SMTP_PASS,
    },
  });

  const notifyTo = process.env.PRAYER_NOTIFICATION_EMAIL ?? process.env.SMTP_USER;

  const html = `
    <div style="font-family: system-ui, -apple-system, 'Segoe UI', Roboto, 'Helvetica Neue', Arial; color:#111;">
      <h2>New Prayer Request</h2>
      <p><strong>Name:</strong> ${prayer.name ?? 'Anonymous'}</p>
      <p><strong>Email:</strong> ${prayer.email ?? '—'}</p>
      <p><strong>School:</strong> ${prayer.school ?? '—'}</p>
      <p><strong>Category:</strong> ${prayer.category ?? '—'}</p>
      <p><strong>Priority:</strong> ${prayer.priority ?? '—'}</p>
      <hr />
      <p>${prayer.request}</p>
      <hr />
      <p style="font-size:12px;color:#666">Submitted: ${new Date(prayer.date).toLocaleString()}</p>
    </div>
  `;

  const mailOptions = {
    from: process.env.SMTP_USER,
    to: notifyTo,
    subject: `New Prayer Request${prayer.name ? ` — ${prayer.name}` : ''}`,
    html,
  };

  await transporter.sendMail(mailOptions);
}
