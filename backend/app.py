from fastapi import FastAPI, Query
from fastapi.middleware.cors import CORSMiddleware
import math, json

app = FastAPI()

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

with open("laptops.json") as f:
    laptops = json.load(f)

def normalize(value, min_val, max_val, reverse=False):
    if max_val == min_val:
        return 0.5
    score = (value - min_val) / (max_val - min_val)
    return 1 - score if reverse else score

def get_stats():
    return {
        "cpu_min": min(l["cpu_score"] for l in laptops),
        "cpu_max": max(l["cpu_score"] for l in laptops),
        "ram_min": min(l["ram_gb"] for l in laptops),
        "ram_max": max(l["ram_gb"] for l in laptops),
        "price_min": min(l["price"] for l in laptops),
        "price_max": max(l["price"] for l in laptops),
        "weight_min": min(l["weight_kg"] for l in laptops),
        "weight_max": max(l["weight_kg"] for l in laptops),
        "bat_min": min(l["battery_hours"] for l in laptops),
        "bat_max": max(l["battery_hours"] for l in laptops),
        "storage_min": min(l["storage_gb"] for l in laptops),
        "storage_max": max(l["storage_gb"] for l in laptops),
    }

def calculate_score(l, w, s):
    cpu = normalize(l["cpu_score"], s["cpu_min"], s["cpu_max"]) ** 1.3
    ram = normalize(l["ram_gb"], s["ram_min"], s["ram_max"])
    battery = normalize(l["battery_hours"], s["bat_min"], s["bat_max"])
    weight = normalize(l["weight_kg"], s["weight_min"], s["weight_max"], True)
    price = normalize(l["price"], s["price_min"], s["price_max"], True)
    storage = normalize(l["storage_gb"], s["storage_min"], s["storage_max"])

    score = (
        cpu*w["cpu"] + ram*w["ram"] + battery*w["battery"] +
        weight*w["weight"] + price*w["price"] + storage*w["storage"]
    )

    return round(score, 4)

def parse_user_intent(text):
    text = text.lower()
    weights = {"cpu":0.2,"ram":0.15,"battery":0.2,"weight":0.2,"price":0.15,"storage":0.1}
    if "travel" in text or "seyahat" in text:
        weights["weight"] += 0.3
        weights["battery"] += 0.3
    total = sum(weights.values())
    return {k:v/total for k,v in weights.items()}

@app.get("/recommend")
def recommend(q: str = Query(...)):
    weights = parse_user_intent(q)
    stats = get_stats()
    results = []

    for l in laptops:
        score = calculate_score(l, weights, stats)
        results.append({"name": l["name"], "price": l["price"], "score": score})

    results.sort(key=lambda x: x["score"], reverse=True)
    return results[:5]
