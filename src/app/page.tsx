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
  const [editTask, setEditTask] = useState<Task | null>(null);
  const [editTitle, setEditTitle] = useState("");
  const [editDesc, setEditDesc] = useState("");
  const [editDeadline, setEditDeadline] = useState("");
  const [editPriority, setEditPriority] = useState(0.5);
  const [editStatus, setEditStatus] = useState("pending");

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

  const handleDelete = async (id: number) => {
    if (!confirm("Are you sure you want to delete this task?")) return;
    try {
      await api.delete(`tasks/${id}/`);
      fetchTasks();
    } catch (err) {
      console.error("Error deleting task", err);
    }
  };

  return (
    <main className="max-w-3xl mx-auto p-6 bg-gray-50 dark:bg-gray-900 text-gray-900 dark:text-white min-h-screen">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 mb-6">
        <h1 className="text-3xl font-bold">Let's Work Smart</h1>
        <div className="flex flex-wrap gap-2 items-center">
          <select
            className="border rounded px-2 py-1 text-sm text-gray-900 dark:text-white dark:bg-gray-800"
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
            className="border rounded px-2 py-1 text-sm text-gray-900 dark:text-white dark:bg-gray-800"
            value={sortBy}
            onChange={(e) => setSortBy(e.target.value as SortOption)}
          >
            <option value="default">Sort: Newest</option>
            <option value="priority">Sort: Priority</option>
            <option value="deadline">Sort: Deadline</option>
          </select>

          <Link
            href="/add-task"
            className="bg-blue-600 text-white px-3 py-1 text-sm rounded shadow hover:bg-blue-700"
          >
            New Task
          </Link>
        </div>
      </div>

      <input
        type="text"
        value={search}
        onChange={(e) => setSearch(e.target.value)}
        placeholder="Search tasks..."
        className="border px-2 py-1 rounded text-sm mb-6 w-full text-gray-900 dark:text-white dark:bg-gray-800"
      />

      {tasks.length === 0 ? (
        <p className="text-gray-600 dark:text-gray-400">No tasks available.</p>
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
              if (sortBy === "deadline")
                return (
                  new Date(a.deadline).getTime() -
                  new Date(b.deadline).getTime()
                );
              return new Date(b.id).getTime() - new Date(a.id).getTime();
            })
            .map((task) => (
              <li
                key={task.id}
                className="p-4 bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-lg shadow-sm hover:shadow-md transition"
              >
                <h2 className="text-xl font-semibold text-gray-800 dark:text-white">
                  {task.title}
                </h2>
                <p className="text-sm text-gray-600 dark:text-gray-300 mb-1">
                  {task.description}
                </p>
                <div className="flex flex-wrap gap-4 text-sm text-gray-500 dark:text-gray-400 mt-2">
                  <span>⏳ Priority: {task.priority_score}</span>
                  <span>🗓️ Deadline: {task.deadline || "N/A"}</span>
                  <span
                    className={`font-semibold ${
                      task.status === "done"
                        ? "text-green-600"
                        : "text-yellow-600"
                    }`}
                  >
                    {task.status === "done" ? "Completed" : "Pending"}
                  </span>
                </div>
                <div className="flex gap-3 mt-3">
                  <button
                    onClick={() => {
                      setEditTask(task);
                      setEditTitle(task.title);
                      setEditDesc(task.description);
                      setEditDeadline(task.deadline);
                      setEditPriority(task.priority_score);
                      setEditStatus(task.status);
                    }}
                    className="text-sm text-blue-600 hover:underline"
                  >
                    Edit
                  </button>
                  <button
                    onClick={() => handleDelete(task.id)}
                    className="text-sm text-red-600 hover:underline"
                  >
                    Delete
                  </button>
                </div>
              </li>
            ))}
        </ul>
      )}

      {editTask && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center z-50">
          <div className="bg-white dark:bg-gray-800 p-6 rounded shadow max-w-md w-full text-gray-900 dark:text-white">
            <h2 className="text-lg font-bold mb-4">Edit Task</h2>
            <input
              type="text"
              value={editTitle}
              onChange={(e) => setEditTitle(e.target.value)}
              className="w-full p-2 border rounded mb-2 text-gray-900 dark:text-white dark:bg-gray-900"
            />
            <textarea
              value={editDesc}
              onChange={(e) => setEditDesc(e.target.value)}
              className="w-full p-2 border rounded mb-2 text-gray-900 dark:text-white dark:bg-gray-900"
            />
            <input
              type="date"
              value={editDeadline}
              onChange={(e) => setEditDeadline(e.target.value)}
              className="w-full p-2 border rounded mb-2 text-gray-900 dark:text-white dark:bg-gray-900"
            />
            <input
              type="number"
              step="0.01"
              max="1"
              min="0"
              value={editPriority}
              onChange={(e) => setEditPriority(parseFloat(e.target.value))}
              className="w-full p-2 border rounded mb-2 text-gray-900 dark:text-white dark:bg-gray-900"
            />
            <select
              value={editStatus}
              onChange={(e) => setEditStatus(e.target.value)}
              className="w-full p-2 border rounded mb-4 text-gray-900 dark:text-white dark:bg-gray-900"
            >
              <option value="pending">Pending</option>
              <option value="done">Done</option>
            </select>
            <div className="flex justify-end gap-2">
              <button
                onClick={() => setEditTask(null)}
                className="bg-gray-300 dark:bg-gray-700 px-3 py-1 rounded"
              >
                Cancel
              </button>
              <button
                onClick={async () => {
                  try {
                    await api.put(`tasks/${editTask.id}/`, {
                      title: editTitle,
                      description: editDesc,
                      deadline: editDeadline,
                      priority_score: editPriority,
                      status: editStatus,
                    });
                    setEditTask(null);
                    fetchTasks();
                  } catch (err) {
                    console.error("Error updating task", err);
                  }
                }}
                className="bg-blue-600 text-white px-4 py-1 rounded hover:bg-blue-700"
              >
                Save
              </button>
            </div>
          </div>
        </div>
      )}
    </main>
  );
}
