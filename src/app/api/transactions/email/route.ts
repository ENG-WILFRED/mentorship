import { NextResponse } from 'next/server';
import { getTransactions } from '@/actions/transactions';
import sendEmail from '@/lib/email.server';

function toCSV(rows: any[]) {
  const headers = ['id', 'userId', 'amount', 'currency', 'type', 'status', 'description', 'metadata', 'createdAt'];
  const lines = [headers.join(',')];
  for (const r of rows) {
    const vals = headers.map((h) => {
      const v = r[h] ?? '';
      if (typeof v === 'object') return `"${JSON.stringify(v).replace(/"/g, '""')}"`;
      return `"${String(v).replace(/"/g, '""')}"`;
    });
    lines.push(vals.join(','));
  }
  return lines.join('\n');
}

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const to = body?.email;
    const additionalInfo = body?.additionalInfo || '';
    if (!to) return NextResponse.json({ error: 'Missing email' }, { status: 400 });

    const txs = await getTransactions({ take: 1000 });
    const csv = toCSV(txs);
    const totalIncome = txs.reduce((acc, t) => t.amount > 0 ? acc + t.amount : acc, 0);
    const totalExpense = txs.reduce((acc, t) => t.amount < 0 ? acc + Math.abs(t.amount) : acc, 0);
    const net = totalIncome - totalExpense;

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
        <div style="background:linear-gradient(135deg, #7c3aed 0%, #ec4899 100%);padding:24px;">
          <h1 style="
            margin:0;
            font-size:22px;
            font-weight:600;
            color:#ffffff;
            text-align:center;
          ">
            💰 Transactions Export
          </h1>
        </div>

        <!-- Content -->
        <div style="padding:24px;">
          
          <!-- Summary Stats -->
          <div style="display:grid;grid-template-columns:1fr 1fr 1fr;gap:16px;margin-bottom:24px;">
            <div style="background:#f0fdf4;padding:16px;border-radius:8px;text-align:center;">
              <div style="font-size:12px;color:#6b7280;margin-bottom:4px;">Total Income</div>
              <div style="font-size:20px;font-weight:600;color:#16a34a;">+$${totalIncome.toFixed(2)}</div>
            </div>
            <div style="background:#fef2f2;padding:16px;border-radius:8px;text-align:center;">
              <div style="font-size:12px;color:#6b7280;margin-bottom:4px;">Total Expense</div>
              <div style="font-size:20px;font-weight:600;color:#dc2626;">-$${totalExpense.toFixed(2)}</div>
            </div>
            <div style="background:#f0f9ff;padding:16px;border-radius:8px;text-align:center;">
              <div style="font-size:12px;color:#6b7280;margin-bottom:4px;">Net Balance</div>
              <div style="font-size:20px;font-weight:600;color:#0284c7;">$${net.toFixed(2)}</div>
            </div>
          </div>

          <!-- Transaction Count -->
          <div style="background:#f9fafb;padding:12px;border-radius:6px;text-align:center;margin-bottom:24px;">
            <div style="font-size:14px;color:#6b7280;">Total Transactions: <strong>${txs.length}</strong></div>
          </div>

          ${additionalInfo ? `
          <!-- Additional Info -->
          <div style="
            background:#fef3c7;
            border-left:4px solid #f59e0b;
            padding:16px;
            border-radius:6px;
            font-size:14px;
            line-height:1.6;
            white-space:pre-wrap;
            margin-bottom:24px;
          ">
            <strong>Note:</strong> ${additionalInfo}
          </div>
          ` : ''}

          <!-- Attachment Info -->
          <div style="
            background:#f3f4f6;
            border:1px dashed #d1d5db;
            padding:16px;
            border-radius:6px;
            text-align:center;
            font-size:14px;
            color:#6b7280;
          ">
            📎 Attached: <strong>transactions.csv</strong>
          </div>

        </div>

        <!-- Footer -->
        <div style="
          background:#f3f4f6;
          padding:16px;
          text-align:center;
          font-size:12px;
          color:#6b7280;
        ">
          <p style="margin:0;">
            Generated on ${new Date().toLocaleString()}
          </p>
        </div>

      </div>
    </div>
    `;

    try {
      await sendEmail({
        to,
        subject: 'Transactions Export',
        text: 'Your transactions CSV is attached.',
        html,
        attachments: [
          { filename: 'transactions.csv', content: csv },
        ],
      });
      return NextResponse.json({ success: true });
    } catch (err) {
      console.error('Email send failed', err);
      return NextResponse.json({ error: 'Failed to send email' }, { status: 500 });
    }
  } catch (error) {
    console.error('Error sending transactions email', error);
    return NextResponse.json({ error: 'Failed to send email' }, { status: 500 });
  }
}
