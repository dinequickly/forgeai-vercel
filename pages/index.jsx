import { useState } from "react";

export default function Home() {
  const [messages, setMessages] = useState([]);
  const [input, setInput] = useState("");

  const sendMessage = async () => {
    if (!input.trim()) return;

    const newMessages = [...messages, { sender: "user", text: input }];
    setMessages(newMessages);
    setInput("");

    try {
      const res = await fetch("/api/chat", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ message: input }),
      });

      const data = await res.json();
      setMessages((prev) => [...prev, { sender: "assistant", text: data.reply }]);
    } catch (err) {
      setMessages((prev) => [...prev, { sender: "assistant", text: "[Server error]" }]);
    }
  };

  return (
    <div className="bg-gray-100 min-h-screen flex flex-col">
      <head>
        <title>ForgeAI Chat</title>
        <script src="https://cdn.tailwindcss.com"></script>
      </head>

      <header className="bg-white shadow p-4">
        <h1 className="text-2xl font-semibold text-center text-gray-800">🔥 ForgeAI Startup Assistant</h1>
      </header>

      <main className="flex-1 overflow-y-auto p-4 space-y-4 max-w-2xl mx-auto w-full">
        {messages.map((msg, i) => (
          <div key={i} className={msg.sender === "user" ? "text-right" : "text-left"}>
            <div
              className={`inline-block px-4 py-2 rounded-xl max-w-[80%] ${
                msg.sender === "user"
                  ? "bg-blue-500 text-white ml-auto"
                  : "bg-gray-200 text-gray-800"
              }`}
            >
              {msg.text}
            </div>
          </div>
        ))}
      </main>

      <footer className="bg-white p-4 shadow-md">
        <div className="flex max-w-2xl mx-auto w-full gap-2">
          <input
            value={input}
            onChange={(e) => setInput(e.target.value)}
            placeholder="Type your idea..."
            className="flex-1 border border-gray-300 rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
          <button
            onClick={sendMessage}
            className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-all"
          >
            Send
          </button>
        </div>
      </footer>
    </div>
  );
}