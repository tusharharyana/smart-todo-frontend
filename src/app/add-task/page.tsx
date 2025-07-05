"use client";
import { useState, useEffect } from "react";
import api from "@/lib/axios";
import { useRouter } from "next/navigation";
import Link from "next/link";

interface ContextEntry {
  id: number;
  content: string;
  source_type: string;
  timestamp: string;
}

interface Category {
  id: number;
  name: string;
}

export default function AddTaskPage() {
  const router = useRouter();
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [deadline, setDeadline] = useState("");
  const [priorityScore, setPriorityScore] = useState(0.5);
  const [status, setStatus] = useState("pending");
  const [contexts, setContexts] = useState<ContextEntry[]>([]);
  const [categories, setCategories] = useState<Category[]>([]);
  const [categoryId, setCategoryId] = useState<number | null>(null);
  const [showModal, setShowModal] = useState(false);
  const [newCategoryName, setNewCategoryName] = useState("");

  useEffect(() => {
    const fetchContexts = async () => {
      try {
        const res = await api.get<ContextEntry[]>("contexts/");
        setContexts(res.data);
      } catch (err) {
        console.error("Error loading context", err);
      }
    };

    fetchContexts();
    const fetchCategories = async () => {
      try {
        const res = await api.get<Category[]>("categories/");
        setCategories(res.data);
      } catch (err) {
        console.error("Error loading categories", err);
      }
    };
    fetchCategories();
  }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      await api.post("tasks/", {
        title,
        description,
        priority_score: priorityScore,
        deadline,
        status,
        category: categoryId,
      });
      router.push("/");
    } catch (err) {
      console.error("Error adding task", err);
    }
  };

  const handleAISuggestion = async () => {
    try {
      const contextTexts = contexts.map((ctx) => ctx.content);
      const res = await api.post("ai/suggest/", {
        task: { title, description },
        context: contextTexts,
      });

      const data = res.data;
      setPriorityScore(data.priority_score);
      setDeadline(data.suggested_deadline);
      setDescription(data.improved_description);
      const matchedCategory = categories.find(
        (cat) =>
          cat.name.toLowerCase() === data.recommended_category?.toLowerCase()
      );
      if (matchedCategory) setCategoryId(matchedCategory.id);
    } catch (err) {
      console.error("AI suggestion error", err);
    }
  };

  return (
    <main className="max-w-2xl mx-auto p-6 bg-gray-50 dark:bg-gray-900 text-gray-900 dark:text-white min-h-screen">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold">Create New Task</h1>
        <Link href="/" className="text-blue-500 dark:text-blue-300">
          ← Back
        </Link>
      </div>

      <form
        onSubmit={handleSubmit}
        className="space-y-4 bg-white dark:bg-gray-800 p-6 border rounded-lg shadow"
      >
        <input
          type="text"
          placeholder="Title"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          className="w-full p-2 border rounded text-gray-900 dark:text-white dark:bg-gray-900"
          required
        />
        <textarea
          placeholder="Description"
          value={description}
          onChange={(e) => setDescription(e.target.value)}
          className="w-full p-2 border rounded text-gray-900 dark:text-white dark:bg-gray-900"
          required
        />
        <input
          type="date"
          value={deadline}
          onChange={(e) => setDeadline(e.target.value)}
          className="w-full p-2 border rounded text-gray-900 dark:text-white dark:bg-gray-900"
        />
        <div className="flex gap-2 items-center">
          <select
            value={categoryId ?? ""}
            onChange={(e) => setCategoryId(parseInt(e.target.value))}
            className="flex-1 p-2 border rounded text-gray-900 dark:text-white dark:bg-gray-900"
          >
            <option value="">Select Category</option>
            {categories.map((cat) => (
              <option key={cat.id} value={cat.id}>
                {cat.name}
              </option>
            ))}
          </select>

          <button
            type="button"
            onClick={() => setShowModal(true)}
            className="bg-purple-600 text-white px-4 py-1.5 rounded hover:bg-purple-700"
          >
            Add
          </button>
        </div>

        <input
          type="number"
          step="0.01"
          max="1"
          min="0"
          value={priorityScore}
          onChange={(e) => setPriorityScore(parseFloat(e.target.value))}
          className="w-full p-2 border rounded text-gray-900 dark:text-white dark:bg-gray-900"
        />
        <select
          value={status}
          onChange={(e) => setStatus(e.target.value)}
          className="w-full p-2 border rounded text-gray-900 dark:text-white dark:bg-gray-900"
        >
          <option value="pending">Pending</option>
          <option value="done">Done</option>
        </select>

        <div className="flex gap-2 justify-end">
          <button
            type="button"
            onClick={handleAISuggestion}
            className="bg-purple-600 text-white px-3 py-1 rounded hover:bg-purple-700"
          >
            AI Suggest
          </button>
          <button
            type="submit"
            className="bg-blue-600 text-white px-3 py-1 rounded hover:bg-blue-700"
          >
            Save
          </button>
        </div>
      </form>
      {showModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center z-50">
          <div className="bg-white dark:bg-gray-800 p-6 rounded shadow max-w-sm w-full text-gray-900 dark:text-white">
            <h3 className="text-lg font-bold mb-4">Add New Category</h3>
            <input
              type="text"
              value={newCategoryName}
              onChange={(e) => setNewCategoryName(e.target.value)}
              placeholder="Enter category name"
              className="w-full p-2 border rounded mb-4 text-gray-900 dark:text-white dark:bg-gray-900"
            />
            <div className="flex justify-end gap-2">
              <button
                onClick={() => setShowModal(false)}
                className="bg-gray-300 dark:bg-gray-700 text-gray-900 dark:text-white px-3 py-1 rounded"
              >
                Cancel
              </button>
              <button
                onClick={async () => {
                  if (!newCategoryName.trim()) return;
                  try {
                    const res = await api.post<Category>("categories/", {
                      name: newCategoryName.trim(),
                    });
                    const newCat = res.data;
                    setCategories([...categories, newCat]);
                    setCategoryId(newCat.id);
                    setNewCategoryName("");
                    setShowModal(false);
                  } catch (err) {
                    console.error("Failed to create category", err);
                  }
                }}
                className="bg-blue-600 text-white px-4 py-1 rounded hover:bg-blue-700"
              >
                Add
              </button>
            </div>
          </div>
        </div>
      )}
    </main>
  );
}
