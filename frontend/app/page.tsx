'use client';

import { useState } from 'react';

export default function HomePage() {
  const [query, setQuery] = useState('');
  const [results, setResults] = useState<any[]>([]);

  const handleSearch = async () => {
    try {
      const res = await fetch(
        `${process.env.NEXT_PUBLIC_BACKEND_URL}/recommend?q=${query}`
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
