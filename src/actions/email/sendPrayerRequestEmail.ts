"use server";

import nodemailer from "nodemailer";

export async function sendPrayerRequestEmail({ prayer }: { prayer: any }) {
  if (
    !process.env.SMTP_HOST ||
    !process.env.SMTP_PORT ||
    !process.env.SMTP_USER ||
    !process.env.SMTP_PASS
  ) {
    console.warn("SMTP not configured; skipping prayer notification email");
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

  const notifyTo =
    process.env.PRAYER_NOTIFICATION_EMAIL ?? process.env.SMTP_USER;

  const html = `
  <div style="background:#f4f6f8;padding:32px 16px;">
    <div style="
      max-width:600px;
      margin:0 auto;
      background:#ffffff;
      border-radius:10px;
      overflow:hidden;
      box-shadow:0 10px 25px rgba(0,0,0,0.08);
      font-family:system-ui,-apple-system,'Segoe UI',Roboto,Arial,sans-serif;
      color:#1f2937;
    ">

      <!-- Header -->
      <div style="background:#4f46e5;padding:24px;">
        <h1 style="
          margin:0;
          font-size:22px;
          font-weight:600;
          color:#ffffff;
          text-align:center;
        ">
          🙏 New Prayer Request
        </h1>
      </div>

      <!-- Content -->
      <div style="padding:24px;">
        
        <!-- Details -->
        <table width="100%" cellpadding="0" cellspacing="0" style="margin-bottom:20px;">
          <tr>
            <td style="padding:6px 0;font-size:14px;"><strong>Name:</strong></td>
            <td style="padding:6px 0;font-size:14px;">${prayer.name ?? "Anonymous"}</td>
          </tr>
          <tr>
            <td style="padding:6px 0;font-size:14px;"><strong>Email:</strong></td>
            <td style="padding:6px 0;font-size:14px;">${prayer.email ?? "—"}</td>
          </tr>
          <tr>
            <td style="padding:6px 0;font-size:14px;"><strong>School:</strong></td>
            <td style="padding:6px 0;font-size:14px;">${prayer.school ?? "—"}</td>
          </tr>
          <tr>
            <td style="padding:6px 0;font-size:14px;"><strong>Category:</strong></td>
            <td style="padding:6px 0;font-size:14px;">${prayer.category ?? "—"}</td>
          </tr>
          <tr>
            <td style="padding:6px 0;font-size:14px;"><strong>Priority:</strong></td>
            <td style="padding:6px 0;font-size:14px;">${prayer.priority ?? "—"}</td>
          </tr>
        </table>

        <!-- Message -->
        <div style="
          background:#f9fafb;
          border-left:4px solid #4f46e5;
          padding:16px;
          border-radius:6px;
          font-size:15px;
          line-height:1.6;
          white-space:pre-wrap;
        ">
          ${prayer.request}
        </div>

        <!-- Timestamp -->
        <p style="
          margin-top:24px;
          font-size:12px;
          color:#6b7280;
          text-align:right;
        ">
          Submitted on ${new Date(prayer.date).toLocaleString()}
        </p>

      </div>

      <!-- Footer -->
      <div style="
        background:#f3f4f6;
        padding:16px;
        text-align:center;
        font-size:12px;
        color:#6b7280;
      ">
        This prayer request was submitted through your ministry website.
      </div>

    </div>
  </div>
  `;

  await transporter.sendMail({
    from: `"Prayer Requests" <${process.env.SMTP_USER}>`,
    to: notifyTo,
    subject: `🙏 New Prayer Request${prayer.name ? ` — ${prayer.name}` : ""}`,
    html,
  });
}
