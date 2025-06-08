"use client";
import React, { useState } from 'react';

const API_KEY = "ddc-free-8e5171eeac9148ed89969cc31002d99d";
const BASE_URL = "https://api.devsdocode.com/v1";

const ChatBox = ({ model = "provider-2/gpt-4.1", systemMessage = "You are a helpful assistant.", onResponse, buttonText = "Ask" }) => {
  const [input, setInput] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSubmit = async () => {
    if (!input.trim()) return;
    setLoading(true);
    try {
      const res = await fetch(`${BASE_URL}/chat/completions`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${API_KEY}`
        },
        body: JSON.stringify({
          model,
          messages: [
            { role: "system", content: systemMessage },
            { role: "user", content: input }
          ]
        })
      });

      const data = await res.json();
      const reply = data.choices?.[0]?.message?.content || 'No response';
      if (onResponse) onResponse(reply);
    } catch (error) {
      console.error("Chat error:", error);
      if (onResponse) onResponse("Error occurred!");
    }
    setLoading(false);
  };

  return (
    <div>
      <input
        type="text"
        value={input}
        placeholder="Type your message..."
        onChange={(e) => setInput(e.target.value)}
      />
      <button onClick={handleSubmit} disabled={loading}>
        {loading ? 'Thinking...' : buttonText}
      </button>
    </div>
  );
};

export default ChatBox;
