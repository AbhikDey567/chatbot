import React, { useState } from "react";
import "./App.css";

// Rules with keywords and optional context keywords
const rules = [
  { keywords: ["hello", "hi"], response: "Hello! How can I help you today?" },
  { keywords: ["how are you"], response: "I'm a bot, but I'm doing great! 😊" },
  { keywords: ["bye", "goodbye"], response: "Goodbye! Have a nice day!" },
  { keywords: ["help"], response: "Sure! Ask me anything and I'll try to answer." },
  { keywords: ["vite"], response: "Ah! You like Vite projects, right? It's super fast for React!" },
  { keywords: ["project", "react"], response: "React + Vite is perfect for fast web development!" },
];

function App() {
  const [messages, setMessages] = useState([]);
  const [input, setInput] = useState("");
  const [context, setContext] = useState([]);

  const handleSend = () => {
    if (!input.trim()) return;

    const userMessage = { sender: "user", text: input };
    setMessages((prev) => [...prev, userMessage]);
    setContext((prev) => [...prev, input].slice(-3)); // remember last 3 messages

    // Multi-keyword matching
    const matchedRules = rules.filter((r) =>
      r.keywords.some((k) => input.toLowerCase().includes(k))
    );

    let botText = "Sorry, I don't understand that.";
    if (matchedRules.length === 1) {
      botText = matchedRules[0].response;
    } else if (matchedRules.length > 1) {
      // Pick rule with most keywords matched
      const scored = matchedRules.map((r) => ({
        rule: r,
        score: r.keywords.filter((k) => input.toLowerCase().includes(k)).length,
      }));
      scored.sort((a, b) => b.score - a.score);
      botText = scored[0].rule.response;
    }

    const botMessage = { sender: "bot", text: botText };
    setMessages((prev) => [...prev, botMessage]);
    setInput("");
  };

  const handleKeyPress = (e) => {
    if (e.key === "Enter") handleSend();
  };

  return (
    <div className="chat-container">
      <h1>Smart Rule-Based Chatbot 🤖</h1>
      <div className="chat-box">
        {messages.map((msg, idx) => (
          <div key={idx} className={`message ${msg.sender}`}>
            {msg.text}
          </div>
        ))}
      </div>
      <div className="input-container">
        <input
          type="text"
          placeholder="Type a message..."
          value={input}
          onChange={(e) => setInput(e.target.value)}
          onKeyPress={handleKeyPress}
        />
        <button onClick={handleSend}>Send</button>
      </div>
    </div>
  );
}

export default App;
