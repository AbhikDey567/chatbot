import React, { useState } from "react";
import "./App.css";

// Travel booking rules
const rules = [
  { keywords: ["hello", "hi"], response: "Hello! 👋 Welcome to TravelBot. Are you looking to book a ticket?" },
  { keywords: ["book", "ticket", "reserve"], response: "Great! ✈️ Please tell me your destination." },
  { keywords: ["train", "bus", "flight"], response: "We offer booking for trains, buses, and flights. Which one would you like?" },
  { keywords: ["price", "fare", "cost"], response: "Ticket prices depend on your destination, date, and travel mode. Can you share those details?" },
  { keywords: ["help"], response: "I can help you with ticket booking, fare details, and travel options. Just tell me your destination!" },
  { keywords: ["cancel", "refund"], response: "To cancel a ticket, please provide your booking ID and I’ll guide you through the process." },
  { keywords: ["bye", "goodbye"], response: "Goodbye! 👋 Safe travels and hope to see you again." }
];

function App() {
  const [messages, setMessages] = useState([]);
  const [input, setInput] = useState("");
  
  // Context memory: stores transport, destination, date
  const [context, setContext] = useState({ transport: "", destination: "", date: "" });

  const handleSend = () => {
    if (!input.trim()) return;

    const userMessage = { sender: "user", text: input };
    setMessages((prev) => [...prev, userMessage]);

    let botText = "Sorry, I didn't understand that. Please try again.";

    // 1️⃣ Check transport
    if (["train", "bus", "flight"].some((t) => input.toLowerCase().includes(t))) {
      const transport = ["train", "bus", "flight"].find((t) => input.toLowerCase().includes(t));
      setContext((prev) => ({ ...prev, transport }));
      botText = `Great! You chose ${transport}. Please tell me your destination.`;
    }
    // 2️⃣ Check destination
    else if (context.transport && !context.destination) {
      setContext((prev) => ({ ...prev, destination: input }));
      botText = `Got it! Your destination is ${input}. Please enter your travel date (e.g., 2025-09-01).`;
    }
    // 3️⃣ Check date
    else if (context.transport && context.destination && !context.date) {
      setContext((prev) => ({ ...prev, date: input }));
      botText = `Perfect! Your travel date is ${input}. Do you want to confirm your booking? (yes/no)`;
    }
    // 4️⃣ Confirm booking
    else if (input.toLowerCase().includes("yes") && context.transport && context.destination && context.date) {
      botText = `🎉 Your ${context.transport} ticket to ${context.destination} on ${context.date} has been booked successfully!`;
      setContext({ transport: "", destination: "", date: "" }); // reset context after booking
    }
    // 5️⃣ Cancel or goodbye
    else if (input.toLowerCase().includes("no")) {
      botText = "Booking cancelled. You can start over if you like.";
      setContext({ transport: "", destination: "", date: "" }); // reset context
    }
    // 6️⃣ Fallback: rule-based matching
    else {
      const matchedRule = rules.find((r) =>
        r.keywords.some((k) => input.toLowerCase().includes(k))
      );
      if (matchedRule) botText = matchedRule.response;
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
      <h1>TravelBot 🎫</h1>
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
