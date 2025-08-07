"use client";

import { useState, useEffect, useRef } from "react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { useChat } from "ai/react";
import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";
import rehypeHighlight from "rehype-highlight";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

export function ChatView({ sessionId }: { sessionId: string }) {
  const [chooseAPI, setChooseAPI] = useState("");
  const chatParent = useRef<HTMLUListElement>(null);
  const [isLoadingHistory, setIsLoadingHistory] = useState(false);

  const { messages, input, handleInputChange, handleSubmit, setMessages } =
    useChat({
      api: `/api/chat/${chooseAPI}`,
      body: { sessionId },
      onFinish: async (message) => {
        // Save message to DB
        await fetch("/api/chat/messages", {
          method: "POST",
          body: JSON.stringify({
            sessionId,
            content: message.content,
            role: message.role,
          }),
        });
      },
      onError: (e) => console.error(e),
    });

  // Load previous messages from DB
  useEffect(() => {
    const loadHistory = async () => {
      if (!sessionId) return;
      setIsLoadingHistory(true);
      try {
        const res = await fetch(`/api/chat/messages?session_id=${sessionId}`);
        const history = await res.json();
        setMessages(history);
      } catch (err) {
        console.error("Failed to load chat history:", err);
      } finally {
        setIsLoadingHistory(false);
      }
    };

    loadHistory();
  }, [sessionId, setMessages]);

  // Scroll to bottom when messages change
  useEffect(() => {
    const domNode = chatParent.current;
    if (domNode) {
      domNode.scrollTop = domNode.scrollHeight;
    }
  }, [messages]);

  return (
    <main className="flex flex-col w-full h-screen max-h-dvh bg-background">
      <section className="container px-0 pt-8 flex flex-col flex-grow gap-4 mx-auto max-w-7xl">
        <ul
          ref={chatParent}
          className="h-1 p-4 flex-grow bg-accent rounded-lg overflow-y-auto flex flex-col gap-4"
        >
          {isLoadingHistory && (
            <p className="text-center text-muted-foreground">
              Loading history...
            </p>
          )}
          {messages.map((m, index) => (
            <li
              key={index}
              className={`flex ${
                m.role === "user" ? "flex-row" : "flex-row-reverse"
              }`}
            >
              <div className="rounded-xl p-4 bg-background shadow-md w-fit max-w-3xl">
                <div className="prose prose-sm dark:prose-invert max-w-none text-foreground">
                  <ReactMarkdown
                    remarkPlugins={[remarkGfm]}
                    rehypePlugins={[rehypeHighlight]}
                  >
                    {m.content}
                  </ReactMarkdown>
                </div>
              </div>
            </li>
          ))}
        </ul>
      </section>

      <section className="p-4">
        <form
          onSubmit={handleSubmit}
          className="flex gap-2 justify-center w-full max-w-7xl mx-auto items-center"
        >
          <Input
            className="flex-1 min-h-[40px]"
            placeholder="Type your question here..."
            type="text"
            value={input}
            onChange={handleInputChange}
          />
          <Button disabled={!chooseAPI} type="submit">
            Submit
          </Button>

          <Select value={chooseAPI} onValueChange={setChooseAPI}>
            <SelectTrigger className="w-[140px] min-h-[40px]">
              <SelectValue placeholder="Choose mode" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="openai">LLM</SelectItem>
              <SelectItem value="rag">LLM w/ RAG</SelectItem>
            </SelectContent>
          </Select>
        </form>
      </section>
    </main>
  );
}
