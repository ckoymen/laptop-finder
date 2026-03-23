#!/bin/bash
set -e

echo "🚀 Laptop Finder Fullstack Setup Başlıyor..."

PROJECT_DIR="laptop-finder"

# 1️⃣ Backend oluştur (FastAPI)
echo "1️⃣ Backend kuruluyor..."
mkdir -p backend
cd backend

cat > app.py <<EOL
from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware

app = FastAPI()

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

@app.get("/recommend")
def recommend(q: str = ""):
    return [
        {"name": "MacBook Air M2", "score": 9.5},
        {"name": "Dell XPS 13", "score": 9.2},
        {"name": "Lenovo ThinkPad X1", "score": 8.9},
    ]
EOL

cat > requirements.txt <<EOL
fastapi
uvicorn
EOL

cd ..

# 2️⃣ Frontend oluştur (Next.js)
echo "2️⃣ Frontend kuruluyor..."
npx create-next-app@latest frontend --typescript --app --use-npm

cd frontend

# Tailwind kur
npm install -D tailwindcss postcss autoprefixer
npx tailwindcss init -p || true

# Tailwind config
cat > tailwind.config.js <<EOL
module.exports = {
  content: ["./app/**/*.{ts,tsx,js,jsx}"],
  theme: { extend: {} },
  plugins: [],
}
EOL

# globals.css
mkdir -p app
cat > app/globals.css <<EOL
@tailwind base;
@tailwind components;
@tailwind utilities;
EOL

# layout.tsx
cat > app/layout.tsx <<EOL
import './globals.css'

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  )
}
EOL

# page.tsx
cat > app/page.tsx <<EOL
'use client';

import { useState } from 'react';

export default function HomePage() {
  const [query, setQuery] = useState('');
  const [results, setResults] = useState<any[]>([]);

  const handleSearch = async () => {
    try {
      const res = await fetch(
        \`\${process.env.NEXT_PUBLIC_BACKEND_URL}/recommend?q=\${query}\`
      );
      const data = await res.json();
      setResults(data);
    } catch (err) {
      console.error(err);
    }
  };

  return (
    <div className="p-10">
      <h1 className="text-2xl font-bold mb-4">AI Laptop Finder</h1>

      <input
        value={query}
        onChange={(e) => setQuery(e.target.value)}
        className="border p-2 mr-2"
        placeholder="travel laptop"
      />

      <button
        onClick={handleSearch}
        className="bg-blue-500 text-white px-4 py-2 rounded"
      >
        Bul
      </button>

      <div className="mt-6">
        {results.map((item, i) => (
          <div key={i} className="border p-3 mb-2 rounded">
            <h3>{item.name}</h3>
            <p>Score: {item.score}</p>
          </div>
        ))}
      </div>
    </div>
  );
}
EOL

cd ..

# 3️⃣ Git setup
echo "3️⃣ Git repo hazırlanıyor..."
git init || true
git add .
git commit -m "initial fullstack setup" || true

echo "✅ FULLSTACK SETUP TAMAMLANDI!"
echo ""
echo "🔹 Backend local çalıştır:"
echo "cd backend && python3 -m venv venv && source venv/bin/activate && pip install -r requirements.txt && uvicorn app:app --reload"
echo ""
echo "🔹 Frontend local:"
echo "cd frontend && npm run dev"
echo ""
echo "🔹 Deploy:"
echo "Frontend → Vercel (root: frontend)"
echo "Backend → Render (start: uvicorn app:app --host 0.0.0.0 --port 10000)"
echo ""
echo "🔹 Vercel ENV:"
echo "NEXT_PUBLIC_BACKEND_URL=https://your-render-url"