"use client";
import { useState } from "react";
import api from "@/lib/axios";
import { useRouter } from "next/navigation";

export default function AddTaskPage() {
  const router = useRouter();
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [deadline, setDeadline] = useState("");
  const [priorityScore, setPriorityScore] = useState(0.5);
  const [status, setStatus] = useState("pending");

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      await api.post("tasks/", {
        title,
        description,
        priority_score: priorityScore,
        deadline,
        status,
      });
      router.push("/");
    } catch (err) {
      console.error("Error adding task", err);
    }
  };

  const handleAISuggestion = async () => {
    try {
      const res = await api.post("ai/suggest/", {
        task: { title, description },
        context: [],
      });

      const data = res.data;
      setPriorityScore(data.priority_score);
      setDeadline(data.suggested_deadline);
      setDescription(data.improved_description);
    } catch (err) {
      console.error("AI suggestion error", err);
    }
  };

  return (
    <main className="p-6 max-w-xl mx-auto">
      <h1 className="text-3xl font-bold mb-4">➕ Add Task</h1>
      <form onSubmit={handleSubmit} className="space-y-4">
        <input
          type="text"
          placeholder="Title"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          className="w-full p-2 border rounded"
          required
        />
        <textarea
          placeholder="Description"
          value={description}
          onChange={(e) => setDescription(e.target.value)}
          className="w-full p-2 border rounded"
          required
        />
        <input
          type="date"
          value={deadline}
          onChange={(e) => setDeadline(e.target.value)}
          className="w-full p-2 border rounded"
        />
        <input
          type="number"
          step="0.01"
          max="1"
          min="0"
          value={priorityScore}
          onChange={(e) => setPriorityScore(parseFloat(e.target.value))}
          className="w-full p-2 border rounded"
        />
        <select
          value={status}
          onChange={(e) => setStatus(e.target.value)}
          className="w-full p-2 border rounded"
        >
          <option value="pending">Pending</option>
          <option value="done">Done</option>
        </select>

        <div className="flex gap-2">
          <button
            type="submit"
            className="bg-blue-600 text-white px-4 py-2 rounded"
          >
            Save Task
          </button>
          <button
            type="button"
            onClick={handleAISuggestion}
            className="bg-green-600 text-white px-4 py-2 rounded"
          >
            🔮 AI Suggest
          </button>
        </div>
      </form>
    </main>
  );
}
