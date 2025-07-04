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
    <main className="p-6">
      <h1 className="text-3xl font-bold mb-4">📋 Smart Todo Dashboard</h1>
      <Link href="/add-task" className="text-blue-600 underline">
        ➕ Add New Task
      </Link>
      {tasks.length === 0 ? (
        <p>No tasks available.</p>
      ) : (
        <ul className="space-y-4">
          {tasks.map((task) => (
            <li
              key={task.id}
              className="p-4 border rounded-md shadow-sm bg-white"
            >
              <h2 className="text-xl font-semibold">{task.title}</h2>
              <p>{task.description}</p>
              <p className="text-sm text-gray-500">
                Priority: {task.priority_score}
              </p>
              <p className="text-sm text-gray-500">Deadline: {task.deadline}</p>
              <p className="text-sm text-green-600">Status: {task.status}</p>
            </li>
          ))}
        </ul>
      )}
    </main>
  );
}
