import { useState } from "react";

export default function Home() {
  const [query, setQuery] = useState("");
  const [results, setResults] = useState([]);

  const search = async () => {
    const res = await fetch("http://127.0.0.1:8000/recommend?q=" + query);
    const data = await res.json();
    setResults(data);
  };

  return (
    <div style={{padding:40}}>
      <h1>AI Laptop Finder</h1>
      <input value={query} onChange={(e)=>setQuery(e.target.value)} />
      <button onClick={search}>Find</button>

      {results.map((r,i)=>(
        <div key={i}>
          <h3>{r.name}</h3>
          <p>Score: {r.score}</p>
        </div>
      ))}
    </div>
  );
}
