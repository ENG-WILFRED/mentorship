import { NextResponse } from 'next/server';
import { getTransactions, createTransaction, updateTransaction, deleteTransaction } from '@/actions/transactions';

export async function GET(req: Request) {
  try {
    const url = new URL(req.url);
    const take = url.searchParams.get('take') ? Number(url.searchParams.get('take')) : 50;
    const skip = url.searchParams.get('skip') ? Number(url.searchParams.get('skip')) : 0;
    const txs = await getTransactions({ take, skip });
    return NextResponse.json(txs);
  } catch (error) {
    console.error('GET /api/transactions error', error);
    return NextResponse.json({ error: 'Failed to fetch transactions' }, { status: 500 });
  }
}

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const tx = await createTransaction(body);
    return NextResponse.json(tx);
  } catch (error) {
    console.error('POST /api/transactions error', error);
    return NextResponse.json({ error: 'Failed to create transaction' }, { status: 500 });
  }
}

export async function PUT(req: Request) {
  try {
    const body = await req.json();
    if (!body?.id) return NextResponse.json({ error: 'Missing id' }, { status: 400 });
    const tx = await updateTransaction(Number(body.id), body);
    return NextResponse.json(tx);
  } catch (error) {
    console.error('PUT /api/transactions error', error);
    return NextResponse.json({ error: 'Failed to update transaction' }, { status: 500 });
  }
}

export async function DELETE(req: Request) {
  try {
    const url = new URL(req.url);
    const id = url.searchParams.get('id');
    if (!id) return NextResponse.json({ error: 'Missing id' }, { status: 400 });
    await deleteTransaction(Number(id));
    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('DELETE /api/transactions error', error);
    return NextResponse.json({ error: 'Failed to delete transaction' }, { status: 500 });
  }
}
