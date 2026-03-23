{\rtf1\ansi\ansicpg1252\cocoartf2867
\cocoatextscaling0\cocoaplatform0{\fonttbl\f0\fswiss\fcharset0 Helvetica;}
{\colortbl;\red255\green255\blue255;}
{\*\expandedcolortbl;;}
\paperw11900\paperh16840\margl1440\margr1440\vieww11520\viewh8400\viewkind0
\pard\tx566\tx1133\tx1700\tx2267\tx2834\tx3401\tx3968\tx4535\tx5102\tx5669\tx6236\tx6803\pardirnatural\partightenfactor0

\f0\fs24 \cf0 "use client";\
\
import \{ useState \} from "react";\
\
export default function Home() \{\
  const [query, setQuery] = useState("");\
  const [results, setResults] = useState([]);\
\
  const search = async () => \{\
    const res = await fetch(\
      `$\{process.env.NEXT_PUBLIC_API_URL\}/recommend?q=$\{query\}`\
    );\
    const data = await res.json();\
    setResults(data);\
  \};\
\
  return (\
    <div style=\{\{ padding: 40 \}\}>\
      <h1>AI Laptop Finder</h1>\
\
      <input\
        value=\{query\}\
        onChange=\{(e) => setQuery(e.target.value)\}\
        placeholder="travel laptop"\
      />\
\
      <button onClick=\{search\}>Bul</button>\
\
      \{results.map((item, i) => (\
        <div key=\{i\}>\
          <h3>\{item.name\}</h3>\
          <p>\{item.score\}</p>\
        </div>\
      ))\}\
    </div>\
  );\
\}}