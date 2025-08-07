import { auth } from "@/lib/auth";
import { ChatView } from "@/modules/home/ui/views/chat-view";
import { headers } from "next/headers";
import { redirect } from "next/navigation";

import { eq } from "drizzle-orm";
import { db } from "@/db";
import { chatSessions } from "@/db/schema";

interface PageProps {
  params: {
    id: string;
  };
}

const Page = async ({ params }: PageProps) => {
  const session = await auth.api.getSession({
    headers: await headers(),
  });

  if (!session) {
    redirect("/sign-in");
  }

  const chatSession = await db.query.chatSessions.findFirst({
    where: eq(chatSessions.id, params.id),
  });

  if (!chatSession || chatSession.userId !== session.user.id) {
    redirect("/chat"); // or a 404 page
  }

  return <ChatView sessionId={params.id} />;
};

export default Page;
