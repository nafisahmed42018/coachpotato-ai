import { db } from "@/db";
import { chatSessions } from "@/db/schema";
import { auth } from "@/lib/auth";
import { eq, desc } from "drizzle-orm";
import { headers } from "next/headers";
import { redirect } from "next/navigation";
import React from "react";

const Page = async () => {
  const session = await auth.api.getSession({
    headers: await headers(),
  });

  if (!session) {
    redirect("/sign-in");
  }

  // ✅ Fetch the latest chat session for the current user
  const [latestSession] = await db
    .select()
    .from(chatSessions)
    .where(eq(chatSessions.userId, session.user.id))
    .orderBy(desc(chatSessions.createdAt))
    .limit(1);

  // If no session exists, redirect to create one
  if (!latestSession) {
    redirect("/chats"); // or create a new one via POST and redirect to `/chat/${newId}`
  }

  return (
    <iframe
      src={`/chat/${latestSession.id}`}
      className="w-full h-full"
      title="Chat"
    />
  );
};

export default Page;
