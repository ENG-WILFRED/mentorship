import { NextResponse } from 'next/server';
import { getTransactions } from '@/actions/transactions';

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

export async function GET(req: Request) {
  try {
    const txs = await getTransactions({ take: 1000 });
    const csv = toCSV(txs);
    return new NextResponse(csv, {
      status: 200,
      headers: {
        'Content-Type': 'text/csv',
        'Content-Disposition': 'attachment; filename="transactions.csv"',
      },
    });
  } catch (error) {
    console.error('Error generating transactions CSV', error);
    return NextResponse.json({ error: 'Failed to generate CSV' }, { status: 500 });
  }
}
