
import { db } from '@/db';
import { chatMessages, chatSessions } from '@/db/schema';
import { getCurrentUser } from '@/lib/current-user';
import { and, eq } from 'drizzle-orm';

import { NextRequest, NextResponse } from 'next/server';

export async function PATCH(req: NextRequest, { params }: { params: { id: string } }) {
  const user = await getCurrentUser();
  if (!user) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });

  const { content } = await req.json();
  if (!content) return NextResponse.json({ error: 'Missing content' }, { status: 400 });

  const msgId = params.id;

  // Verify ownership
  const [msg] = await db
    .select({
      id: chatMessages.id,
      sessionId: chatMessages.sessionId,
    })
    .from(chatMessages)
    .where(eq(chatMessages.id, msgId));

  if (!msg) return NextResponse.json({ error: 'Message not found' }, { status: 404 });

  const [session] = await db
    .select()
    .from(chatSessions)
    .where(and(eq(chatSessions.id, msg.sessionId), eq(chatSessions.userId, user.id)));

  if (!session) return NextResponse.json({ error: 'Forbidden' }, { status: 403 });

  await db.update(chatMessages).set({ content }).where(eq(chatMessages.id, msgId));
  return NextResponse.json({ success: true });
}

export async function DELETE(req: NextRequest, { params }: { params: { id: string } }) {
  const user = await getCurrentUser();
  if (!user) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });

  const msgId = params.id;

  // Verify ownership
  const [msg] = await db
    .select({
      id: chatMessages.id,
      sessionId: chatMessages.sessionId,
    })
    .from(chatMessages)
    .where(eq(chatMessages.id, msgId));

  if (!msg) return NextResponse.json({ error: 'Message not found' }, { status: 404 });

  const [session] = await db
    .select()
    .from(chatSessions)
    .where(and(eq(chatSessions.id, msg.sessionId), eq(chatSessions.userId, user.id)));

  if (!session) return NextResponse.json({ error: 'Forbidden' }, { status: 403 });

  await db.delete(chatMessages).where(eq(chatMessages.id, msgId));
  return NextResponse.json({ success: true });
}
