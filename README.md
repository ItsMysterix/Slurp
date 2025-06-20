# 🍓 Slurp - Fruity Mood Tracking App

**Slurp** is a fun, fruit-themed mental wellness app that makes mood tracking playful, visual, and insightful. Built with modern web tech and AI integration, Slurp helps users log their emotions, gain self-awareness, and build healthier daily habits — all through the power of fruit metaphors.

---

## 🌈 Core Features

### 🍇 Mood Tracking System
- 16 unique fruit moods (e.g., *Strawberry Bliss*, *Sour Lemon*)
- Mood entries with optional notes, location, and privacy settings
- Real-time save to Supabase with timestamps

### 📊 Mood Analytics
- Pie charts, frequency bars, and weekly trend graphs
- Streak tracking and mood density calendar
- 7-day emotional energy scoring system

### 🗓️ Calendar View
- Neubrutalist design with mood icons on each day
- Filter moods by fruit type
- Color-coded density per date

### 🤖 AI Assistant - *Slurpy*
- Emotion-aware chatbot using Groq/OpenAI APIs
- Understands user's mood history for personalized chats
- Fallback mode for offline interaction

### 📝 Journaling & Gratitude
- AI-enhanced journaling with emotion detection
- Gratitude prompts and category-based reflection
- Energy level scoring based on journal content

### 🧘 Wellness Tools
- Guided breathing, grounding, and meditation
- Custom session timer
- Mental health emergency resource directory

---

## 🧠 Tech Stack

### 🖥 Frontend
- **Next.js 14 (App Router)**
- **TypeScript** for full type safety
- **Tailwind CSS** + **Shadcn/UI** for a custom neubrutalist UI
- **Framer Motion** for smooth transitions

### 🛠 Backend & DB
- **Supabase** (PostgreSQL, Auth, Storage)
- Row Level Security for user-specific data
- Real-time data subscriptions for instant feedback

### 🤖 AI Integration
- **Groq API** for low-latency LLM responses
- **OpenAI API** as fallback
- Emotion scoring, journal analysis, and contextual bot chat

---

## 📁 Database Schema (Supabase)
- `mood_entries`: mood, timestamp, notes, user_id
- `profiles`: user preferences and fruit persona
- `journal_entries`: text, mood tags, emotion scores
- `weekly_goals`, `daily_challenges`: gamified engagement
- `exercise_usage`: breathwork, meditation logs
- `resources`: mental health and crisis tools

---

## 🎨 Design System

- **Neubrutalist** layout with bold black borders and pastel fruit tones
- Accessible and responsive across devices
- ARIA support + keyboard navigation

---

## 🚀 Status

Slurp is currently in **active development**. Core features are functional, and backend integrations are live. Analytics, journaling AI, and mood-based recommendations are being fine-tuned.

---

## 📦 Future Plans

- Offline journaling support
- Habit stacking integrations
- Social fruit-sharing circles (opt-in)

---

> 🍍 *Feel your feelings. Log your lemons. Slurp your soul back to peace.*

