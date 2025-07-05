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
  const [editingId, setEditingId] = useState<number | null>(null);
  const [sortBy, setSortBy] = useState<"newest" | "oldest">("newest");

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
      if (editingId) {
        await api.put(`contexts/${editingId}/`, {
          content,
          source_type: sourceType,
        });
        setEditingId(null);
      } else {
        await api.post("contexts/", { content, source_type: sourceType });
      }
      setContent("");
      setSourceType("note");
      fetchContexts();
    } catch (err) {
      console.error("Failed to submit context", err);
    }
  };

  const handleEdit = (entry: ContextEntry) => {
    setEditingId(entry.id);
    setContent(entry.content);
    setSourceType(entry.source_type);
  };

  const handleDelete = async (id: number) => {
    if (!confirm("Delete this context entry?")) return;
    try {
      await api.delete(`contexts/${id}/`);
      fetchContexts();
    } catch (err) {
      console.error("Failed to delete context", err);
    }
  };

  const getSourceBadge = (type: string) => {
    switch (type) {
      case "note":
        return <span className="text-green-600 font-semibold">🟢 Note</span>;
      case "whatsapp":
        return (
          <span className="text-purple-600 font-semibold">🟣 WhatsApp</span>
        );
      case "email":
        return <span className="text-blue-600 font-semibold">🔵 Email</span>;
      default:
        return <span className="text-gray-500">{type}</span>;
    }
  };

  const sortedEntries = [...entries].sort((a, b) => {
    return sortBy === "newest"
      ? new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime()
      : new Date(a.timestamp).getTime() - new Date(b.timestamp).getTime();
  });

  return (
    <main className="max-w-2xl mx-auto p-6 bg-gray-50 dark:bg-gray-900 text-gray-900 dark:text-white min-h-screen">
      <h1 className="text-2xl font-bold mb-4">Daily Context Input</h1>

      <form
        onSubmit={handleSubmit}
        className="space-y-4 bg-white dark:bg-gray-800 p-4 rounded-lg border shadow"
      >
        <textarea
          value={content}
          onChange={(e) => setContent(e.target.value)}
          placeholder="Enter message, note, or email..."
          className="w-full p-2 border rounded text-gray-900 dark:text-white dark:bg-gray-900"
          required
        />

        <select
          value={sourceType}
          onChange={(e) => setSourceType(e.target.value)}
          className="w-full p-2 border rounded text-gray-900 dark:text-white dark:bg-gray-900"
        >
          <option value="note">Note</option>
          <option value="whatsapp">WhatsApp</option>
          <option value="email">Email</option>
        </select>

        <button
          type="submit"
          className="bg-blue-600 text-white px-3 py-1 rounded hover:bg-blue-700"
        >
          {editingId ? "Update Context" : "Add Context"}
        </button>
      </form>

      <div className="flex items-center justify-between mt-8 mb-2">
        <h2 className="text-xl font-semibold">
          Context History ({entries.length} total)
        </h2>
        <select
          className="text-sm border rounded px-2 py-1 text-gray-900 dark:text-white dark:bg-gray-800"
          value={sortBy}
          onChange={(e) => setSortBy(e.target.value as "newest" | "oldest")}
        >
          <option value="newest">Sort: Newest</option>
          <option value="oldest">Sort: Oldest</option>
        </select>
      </div>

      <ul className="space-y-2">
        {sortedEntries.map((entry) => (
          <li
            key={entry.id}
            className="p-3 bg-gray-100 dark:bg-gray-800 border rounded-md text-sm"
          >
            <div className="flex justify-between">
              <p>{entry.content}</p>
              <div className="flex gap-2 text-xs">
                <button
                  onClick={() => handleEdit(entry)}
                  className="text-blue-500 hover:underline"
                >
                  Edit
                </button>
                <button
                  onClick={() => handleDelete(entry.id)}
                  className="text-red-500 hover:underline"
                >
                  Delete
                </button>
              </div>
            </div>
            <div className="flex justify-between text-xs text-gray-500 dark:text-gray-400 mt-1">
              <span>{getSourceBadge(entry.source_type)}</span>
              <span>{new Date(entry.timestamp).toLocaleString()}</span>
            </div>
          </li>
        ))}
      </ul>
    </main>
  );
}
