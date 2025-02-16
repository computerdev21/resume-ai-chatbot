# 🤖 ResuM8 – AI-Powered Internship Assistant

ResuM8 is a blazing-fast full-stack AI chatbot designed to help students and professionals improve their resumes, prepare for internships, and get personalized job-hunting advice.

Powered by **Groq's LLaMA-4**, built with **Next.js**, **Express**, **Docker**, and **Tailwind CSS**.

![Build](https://img.shields.io/badge/build-passing-brightgreen)  
![Powered by Groq](https://img.shields.io/badge/Groq-LLM-blue)  
![Made with ❤️ by Dev Chetal](https://img.shields.io/badge/made%20by-Dev%20Chetal-orange)

---

### ✨ Features

- 🔥 Instant responses via **Groq's LLMs (LLaMA-4, Mixtral, etc.)**
- 📩 Chat UI built with **Next.js** and **Tailwind CSS**
- 🧠 Smart AI prompts for resume tips, interview advice, and tech role prep
- 🐳 Fully containerized with **Docker + docker-compose**
- 🚀 Local dev optimized with split frontend/backend for speed

---

### 🛠️ Tech Stack

- **Frontend**: Next.js 15, TypeScript, Tailwind CSS
- **Backend**: Node.js + Express
- **AI Model**: [Groq](https://console.groq.com/) with LLaMA-4
- **Infra**: Docker + Docker Compose

---

### 📦 Getting Started

#### 1. Clone the Repo

```bash
git clone https://github.com/devchetal/ResuM8-ai-chatbot.git
cd ResuM8-ai-chatbot
```
#### 2.Set Environment Variable
- Create a .env file in the root or backend folder:
```bash
GROQ_API_KEY=your-groq-api-key

```
#### 3. Start Everything

```bash
docker-compose up --build
```

