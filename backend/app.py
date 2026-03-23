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
