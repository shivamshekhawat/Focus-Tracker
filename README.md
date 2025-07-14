Focus Tracker - Web APIs Project
A simple productivity tracking app that helps students stay focused using modern Web APIs. This project is a great way to learn how to use browser features to solve real-life problems like distraction and low productivity.

🧩 Problem Statement
Students often struggle with:

Losing focus while studying

Not knowing how long they stay focused

Studying in unproductive places

💡 Simple Solution
Focus Tracker uses a few helpful Web APIs to:

Track where you're studying

Visualize your study time with a timer

Detect when you're getting distracted

Show a simple report of your weekly focus

🔧 Web APIs Used
API	What It Does
📍 Geolocation API	Get your current location to mark study spots
🎨 Canvas API	Draw a visual countdown timer
👁️ Intersection Observer API	Check if you're staying on the study screen

✨ Key Features
📍 Study Location Tracking
Mark your current location as a study spot

Get reminded if you move away

⏱️ Focus Timer
25-minute timer (Pomodoro technique)

Pause and resume options

Beautiful visual display

👁️ Distraction Detection
Detects when the timer is not visible on screen

Increases distraction count when you're not focusing

📊 Simple Analytics
See how many sessions you completed this week

Track how often you got distracted

🚀 Getting Started
Prerequisites
Node.js 18+

Modern browser with location support

Installation

git clone https://github.com/yourusername/focus-tracker.git
cd focus-tracker
npm install
npm run dev
Then visit: http://localhost:3000

🧠 What You'll Learn
How to use Geolocation API, Canvas API, and Intersection Observer API

How to manage state and effects in React

How to write clean UI using Tailwind CSS

How to structure a real-world project with Next.js + TypeScript

📁 Project Structure
bash
Copy
Edit
src/
├── app/
│   └── page.tsx               # Main app layout
├── components/
│   ├── LocationTracker.tsx    # Geolocation logic
│   ├── FocusTimer.tsx         # Canvas-based timer
│   └── DistractionDetector.tsx # Focus visibility tracking


🔐 Permissions & Privacy
Location is only used to mark study spots

All data is stored locally in your browser

No external servers or data sharing

✅ Future Ideas (Optional)
You can add these later:

Daily/weekly goals

Notification sounds

Export data

Mobile support



👨‍💻 Author
Software Developer
Email: shivamshekhawat860@gmail.com
