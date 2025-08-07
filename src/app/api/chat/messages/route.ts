import { NextRequest, NextResponse } from 'next/server';

import { eq } from 'drizzle-orm';
import { getCurrentUser } from '@/lib/current-user';
import { db } from '@/db';
import { chatMessages } from '@/db/schema';


export async function GET(req: NextRequest) {
  const { searchParams } = new URL(req.url);
  const sessionId = searchParams.get('session_id');
  const user = await getCurrentUser();
  if (!user) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  if (!sessionId) return NextResponse.json({ error: 'Missing session_id' }, { status: 400 });

  const messages = await db
    .select()
    .from(chatMessages)
    .where(eq(chatMessages.sessionId, sessionId));

  return NextResponse.json(messages);
}

export async function POST(req: NextRequest) {
  const user = await getCurrentUser();
  if (!user) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });

  const { sessionId, role, content } = await req.json();
  if (!sessionId || !role || !content)
    return NextResponse.json({ error: 'Missing fields' }, { status: 400 });

  const [message] = await db.insert(chatMessages).values({
    sessionId,
    role,
    content,
  }).returning();

  return NextResponse.json(message);
}
