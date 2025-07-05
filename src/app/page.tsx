"use client";
import { useEffect, useState } from "react";
import api from "@/lib/axios";
import Link from "next/link";

interface Task {
  id: number;
  title: string;
  description: string;
  priority_score: number;
  deadline: string;
  status: string;
}

export default function Dashboard() {
  const [tasks, setTasks] = useState<Task[]>([]);
  type SortOption = "default" | "priority" | "deadline";
  const [sortBy, setSortBy] = useState<SortOption>("default");
  const [filter, setFilter] = useState<"all" | "pending" | "done">("all");
  const [search, setSearch] = useState("");

  useEffect(() => {
    fetchTasks();
  }, []);

  const fetchTasks = async () => {
    try {
      const res = await api.get<Task[]>("tasks/");
      setTasks(res.data);
    } catch (err) {
      console.error("Failed to fetch tasks", err);
    }
  };

  return (
    <main className="max-w-3xl mx-auto p-6">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 mb-6">
        <h1 className="text-3xl font-bold text-white-700">Let's Work Smart</h1>
        <div className="flex flex-wrap gap-2 items-center">
          <select
            className="border rounded px-2 py-1 text-sm text-amber-950"
            value={filter}
            onChange={(e) =>
              setFilter(e.target.value as "all" | "pending" | "done")
            }
          >
            <option value="all">All</option>
            <option value="pending">Pending</option>
            <option value="done">Done</option>
          </select>

          <select
            className="border rounded px-2 py-1 text-sm text-amber-950"
            value={sortBy}
            onChange={(e) => setSortBy(e.target.value as SortOption)}
          >
            <option value="default">Sort: Newest</option>
            <option value="priority">Sort: Priority</option>
            <option value="deadline">Sort: Deadline</option>
          </select>

          <Link
            href="/add-task"
            className="bg-blue-600 text-white px-3 py-2 text-sm rounded shadow hover:bg-blue-700"
          >
            Add Task
          </Link>
        </div>
      </div>
      <input
        type="text"
        value={search}
        onChange={(e) => setSearch(e.target.value)}
        placeholder="Search tasks..."
        className="border px-2 py-1 rounded text-sm mb-6 w-full"
      />
      {tasks.length === 0 ? (
        <p className="text-gray-600">No tasks available.</p>
      ) : (
        <ul className="space-y-4">
          {tasks
            .filter((task) => filter === "all" || task.status === filter)
            .filter(
              (task) =>
                task.title.toLowerCase().includes(search.toLowerCase()) ||
                task.description.toLowerCase().includes(search.toLowerCase())
            )
            .sort((a, b) => {
              if (sortBy === "priority")
                return b.priority_score - a.priority_score;
              if (sortBy === "deadline") {
                return (
                  new Date(a.deadline).getTime() -
                  new Date(b.deadline).getTime()
                );
              }
              return new Date(b.id).getTime() - new Date(a.id).getTime();
            })
            .map((task) => (
              <li
                key={task.id}
                className="p-4 bg-white border border-gray-200 rounded-lg shadow-sm hover:shadow-md transition"
              >
                <h2 className="text-xl font-semibold text-gray-800">
                  {task.title}
                </h2>
                <p className="text-sm text-gray-600 mb-1">{task.description}</p>
                <div className="flex flex-wrap gap-4 text-sm text-gray-500 mt-2">
                  <span>⏳ Priority: {task.priority_score}</span>
                  <span>🗓️ Deadline: {task.deadline || "N/A"}</span>
                  <span
                    className={`font-semibold ${
                      task.status === "done"
                        ? "text-green-600"
                        : "text-yellow-600"
                    }`}
                  >
                    {task.status === "done" ? "✅ Completed" : "🕒 Pending"}
                  </span>
                </div>
              </li>
            ))}
        </ul>
      )}
    </main>
  );
}
