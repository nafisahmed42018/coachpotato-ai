import { db } from '@/db';
import { chatSessions } from '@/db/schema';
import { getCurrentUser } from '@/lib/current-user';
import { eq } from 'drizzle-orm';
import { NextRequest, NextResponse } from 'next/server';

export async function PATCH(req: NextRequest, { params }: { params: { id: string } }) {
  const user = await getCurrentUser();
  if (!user) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });

  const sessionId = params.id;
  const { title } = await req.json();
  if (!title) return NextResponse.json({ error: 'Missing title' }, { status: 400 });

  const result = await db
    .update(chatSessions)
    .set({ title })
    .where(eq(chatSessions.id, sessionId))
    .returning();

  if (!result.length) {
    return NextResponse.json({ error: 'Session not found or not yours' }, { status: 404 });
  }

  return NextResponse.json(result[0]);
}
