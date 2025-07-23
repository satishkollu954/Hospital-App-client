import React, { useState } from "react";
import axios from "axios";

const ChatBot = () => {
  const [messages, setMessages] = useState([
    {
      sender: "bot",
      text: "👋 Welcome to RaagviCare! How can I help you today?",
    },
  ]);
  const [input, setInput] = useState("");
  const apiUrl = process.env.REACT_APP_API_URL;

  const sendMessage = async () => {
    if (!input.trim()) return;

    const userMessage = { sender: "user", text: input };
    setMessages((prev) => [...prev, userMessage]);

    try {
      // Send intent name as input (simulate Dialogflow intent request)
      const response = await axios.post(`${apiUrl}/api/webhook`, {
        queryResult: {
          intent: { displayName: input }, // You may improve intent mapping here
          parameters: {},
        },
      });

      const botMessage = {
        sender: "bot",
        text: response.data.fulfillmentText || "❌ Sorry, I didn't get that.",
      };
      setMessages((prev) => [...prev, botMessage]);
    } catch (error) {
      console.error("❌ Error:", error.message);
      setMessages((prev) => [
        ...prev,
        { sender: "bot", text: "❌ Server error. Please try again later." },
      ]);
    }

    setInput("");
  };

  const handleKeyDown = (e) => {
    if (e.key === "Enter") sendMessage();
  };

  return (
    <div
      style={{
        maxWidth: 500,
        margin: "2rem auto",
        border: "1px solid #ccc",
        padding: 16,
        borderRadius: 10,
      }}
    >
      <h2>RaagviCare Chatbot</h2>
      <div style={{ height: 300, overflowY: "auto", marginBottom: 12 }}>
        {messages.map((msg, i) => (
          <div
            key={i}
            style={{
              textAlign: msg.sender === "user" ? "right" : "left",
              marginBottom: 10,
            }}
          >
            <span
              style={{
                display: "inline-block",
                padding: "8px 12px",
                background: msg.sender === "user" ? "#DCF8C6" : "#EEE",
                borderRadius: 8,
                maxWidth: "80%",
              }}
            >
              {msg.text}
            </span>
          </div>
        ))}
      </div>
      <input
        type="text"
        value={input}
        onChange={(e) => setInput(e.target.value)}
        onKeyDown={handleKeyDown}
        placeholder="Type a message..."
        style={{ width: "80%", padding: 8 }}
      />
      <button
        onClick={sendMessage}
        style={{ padding: "8px 16px", marginLeft: 8 }}
      >
        Send
      </button>
    </div>
  );
};

export default ChatBot;
