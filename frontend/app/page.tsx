"use client";
import { useState } from "react";

export default function Home() {
  const [query, setQuery] = useState("");
  const [products, setProducts] = useState<any[]>([]);
  const [selected, setSelected] = useState<any[]>([]); // Karşılaştırma için

  const handleSearch = async () => {
    const res = await fetch(`${process.env.NEXT_PUBLIC_BACKEND_URL}/recommend?q=${query}`);
    const data = await res.json();
    setProducts(data);
  };

  const toggleSelect = (product: any) => {
    let newSelected = [...selected];
    if (selected.find(p => p.id === product.id)) {
      newSelected = newSelected.filter(p => p.id !== product.id);
    } else if (selected.length < 2) {
      newSelected.push(product);
    } else {
      newSelected.shift(); // İlk seçilen çıkar
      newSelected.push(product);
    }
    setSelected(newSelected);
  };

  return (
    <div className="p-8">
      <input
        type="text"
        value={query}
        onChange={(e) => setQuery(e.target.value)}
        placeholder="Ürün ara..."
        className="border p-2 mr-2"
      />
      <button onClick={handleSearch} className="bg-blue-600 text-white px-4 py-2 rounded">
        Bul
      </button>

      <div className="mt-4 grid grid-cols-1 md:grid-cols-2 gap-4">
        {products.map((p:any) => (
          <div
            key={p.id}
            className={`border p-2 cursor-pointer ${selected.find(s => s.id===p.id) ? 'bg-yellow-100' : ''}`}
            onClick={() => toggleSelect(p)}
          >
            <h2 className="font-bold">{p.name}</h2>
            <p>Tip: {p.type}</p>
            <p>RAM: {p.ram}</p>
            <p>Depolama: {p.storage}</p>
            <p>Skor: {p.score}</p>
          </div>
        ))}
      </div>

      {selected.length === 2 && (
        <div className="mt-8 border-t pt-4">
          <h2 className="text-xl font-bold mb-2">Karşılaştırma</h2>
          <div className="grid grid-cols-3 gap-2 border p-2">
            <div className="font-bold">Özellik</div>
            <div className="font-bold">{selected[0].name}</div>
            <div className="font-bold">{selected[1].name}</div>

            <div>Tip</div>
            <div>{selected[0].type}</div>
            <div>{selected[1].type}</div>

            <div>RAM</div>
            <div>{selected[0].ram}</div>
            <div>{selected[1].ram}</div>

            <div>Depolama</div>
            <div>{selected[0].storage}</div>
            <div>{selected[1].storage}</div>

            <div>Skor</div>
            <div>{selected[0].score}</div>
            <div>{selected[1].score}</div>
          </div>
        </div>
      )}
    </div>
  );
}