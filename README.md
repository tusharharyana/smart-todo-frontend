# 🧠 Tudu – Smart Todo Frontend

A modern, AI-powered task management web app built with **Next.js**, **TypeScript**, and **Tailwind CSS**. Features include smart AI suggestions, deadline prioritization, editable tasks, dark/light theme toggle, and contextual task training.

---

## 🚀 Features

- 📋 Create, edit, delete tasks
- 🧠 AI-powered task suggestions using context
- ⏰ Priority & deadline-based sorting
- 🧪 Context training system (Train Tudu)
- 💬 AI recommendation for what to do first
- 📅 Task creation time display
- 🔍 Task filtering and search
- 🗂️ Task categorization (with dynamic add option)

---

## 🛠️ Tech Stack

- **Framework:** Next.js 14 with App Router
- **Language:** TypeScript
- **Styling:** Tailwind CSS
- **API Communication:** Axios
- **Icons:** Heroicons
- **Backend:** Django REST API (see backend folder)

---

## 📦 Installation & Setup

1. **Clone the repository:**
   ```bash
   git clone https://github.com/tusharharyana/smart-todo-frontend.git
   cd smart-todo-frontend
2. **Install packages:**
   ```bash
   npm install
3. **⚙️ Configuration:**
- Edit /lib/axios.ts to match your backend API URL:
    ```bash
    const api = axios.create({
  baseURL: "http://localhost:8000/api/",
    });
    ```
4. **Development**
    ```bash
    npm run dev
## UI Screenshots

- Fiters [Status, Priority, Search]

![alt text](image.png)
![alt text](image-1.png)
![alt text](image-2.png)

- Search filter

![alt text](image-3.png)

- AI Suggest on create new task

![alt text](image-4.png)
![alt text](image-5.png)


- Manually add new categeory

![alt text](image-6.png)

- Train Tudu [Daily context input]

![alt text](image-7.png)
![alt text](image-8.png)

- Ask AI

![alt text](image-9.png)

