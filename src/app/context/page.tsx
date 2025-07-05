"use client";
import { useEffect, useState } from "react";
import api from "@/lib/axios";

interface ContextEntry {
  id: number;
  content: string;
  source_type: string;
  timestamp: string;
}

export default function ContextPage() {
  const [entries, setEntries] = useState<ContextEntry[]>([]);
  const [content, setContent] = useState("");
  const [sourceType, setSourceType] = useState("note");

  useEffect(() => {
    fetchContexts();
  }, []);

  const fetchContexts = async () => {
    try {
      const res = await api.get<ContextEntry[]>("contexts/");
      setEntries(res.data);
    } catch (err) {
      console.error("Failed to load context entries", err);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!content.trim()) return;

    try {
      await api.post("contexts/", { content, source_type: sourceType });
      setContent("");
      setSourceType("note");
      fetchContexts(); // refresh list
    } catch (err) {
      console.error("Failed to submit context", err);
    }
  };

  return (
    <main className="max-w-2xl mx-auto p-6">
      <h1 className="text-2xl font-bold text-white-700 mb-4">
        Daily Context Input
      </h1>

      <form
        onSubmit={handleSubmit}
        className="space-y-4 bg-white p-4 rounded-lg border shadow"
      >
        <textarea
          value={content}
          onChange={(e) => setContent(e.target.value)}
          placeholder="Enter message, note, or email..."
          className="w-full p-2 border rounded text-black"
          required
        />

        <select
          value={sourceType}
          onChange={(e) => setSourceType(e.target.value)}
          className="w-full p-2 border rounded text-black"
        >
          <option value="note">Note</option>
          <option value="whatsapp">WhatsApp</option>
          <option value="email">Email</option>
        </select>

        <button
          type="submit"
          className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700"
        >
          Add Context
        </button>
      </form>

      <h2 className="text-xl font-semibold mt-8 mb-2">Context History</h2>
      <ul className="space-y-2">
        {entries.map((entry) => (
          <li
            key={entry.id}
            className="p-3 bg-gray-100 dark:bg-gray-800 border rounded-md text-sm"
          >
            <p>{entry.content}</p>
            <div className="flex justify-between text-xs text-gray-500 mt-1">
              <span className="capitalize">📤 {entry.source_type}</span>
              <span>{new Date(entry.timestamp).toLocaleString()}</span>
            </div>
          </li>
        ))}
      </ul>
    </main>
  );
}
