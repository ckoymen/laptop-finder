"use client";

import { useState } from "react";

export default function Home() {
  const [query, setQuery] = useState("");
  const [results, setResults] = useState([]);

  const search = async () => {
    const res = await fetch(
      `${process.env.NEXT_PUBLIC_API_URL}/recommend?q=${query}`
    );
    const data = await res.json();
    setResults(data);
  };

  return (
    <div style={{ padding: 40 }}>
      <h1>AI Laptop Finder</h1>

      <input
        value={query}
        onChange={(e) => setQuery(e.target.value)}
        placeholder="travel laptop"
      />

      <button onClick={search}>Bul</button>

      {results.map((item, i) => (
        <div key={i}>
          <h3>{item.name}</h3>
          <p>{item.score}</p>
        </div>
      ))}
    </div>
  );
}