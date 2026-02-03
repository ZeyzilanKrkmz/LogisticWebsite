import React, { useState } from "react";
import Sidebar from "./components/Sidebar";
import ChatWindow from "./components/chatWindow";
import { useChat } from "./hooks/useChat";

export default function App() {
  const { messages, sendMessage, isTyping, error } = useChat();
  const [sidebarOpen, setSidebarOpen] = useState(false);

  return (
    <div className="min-h-screen bg-sand">
      {/* Subtle background accent */}
      <div className="pointer-events-none fixed inset-0 -z-10">
        <div className="absolute -top-24 -left-24 h-72 w-72 rounded-full bg-forest/10 blur-3xl" />
        <div className="absolute -bottom-24 -right-24 h-72 w-72 rounded-full bg-earth/10 blur-3xl" />
      </div>

      <div className="mx-auto max-w-6xl px-4 py-5 md:py-8">
        <div className="grid grid-cols-1 md:grid-cols-[340px_1fr] gap-5 md:gap-6">
          {/* Sidebar */}
          <div className="hidden md:block">
            <Sidebar open={true} onClose={() => {}} />
          </div>

          {/* Mobile Sidebar Drawer */}
          <div className="md:hidden">
            <Sidebar open={sidebarOpen} onClose={() => setSidebarOpen(false)} />
          </div>

          {/* Chat */}
          <div className="h-[calc(100vh-40px)] md:h-[calc(100vh-64px)]">
            <ChatWindow
              messages={messages}
              onSend={sendMessage}
              isTyping={isTyping}
              error={error}
              onOpenSidebar={() => setSidebarOpen(true)}
            />
          </div>
        </div>
      </div>
    </div>
  );
}