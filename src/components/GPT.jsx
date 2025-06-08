"use client";
import React, { useState } from "react";

const GPT = () => {
  const [prompt, setPrompt] = useState("");
  const [responseText, setResponseText] = useState("");
  const [loading, setLoading] = useState(false);

  const handleSend = async () => {
    setLoading(true);

    const res = await fetch("/api/gpt", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        prompt,
        content: "You just a code fixer, first you have to guess the language then fix the code. Note that don't write any text except code",
        model: "openai/gpt-4.1"
      }),
    });

    const data = await res.json();
    setResponseText(data.text);
    setLoading(false);
  };

  return (
    <div className="min-h-screen p-8 bg-gray-100 flex flex-col items-center justify-center space-y-4">
      <input
        type="text"
        value={prompt}
        onChange={(e) => setPrompt(e.target.value)}
        placeholder="Type your prompt here..."
        className="w-full max-w-md p-2 border border-gray-400 rounded"
      />
      <button
        onClick={handleSend}
        className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600 disabled:opacity-50"
        disabled={loading}
      >
        {loading ? "Generating..." : "Send"}
      </button>

      <div className="w-full max-w-md p-4 bg-white rounded shadow-md">
        <strong>Response:</strong>
        <p className="mt-2 whitespace-pre-line">{responseText}</p>
      </div>
    </div>
  );
};

export default GPT;
