from fastapi import FastAPI, HTTPException, Query
from fastapi.middleware.cors import CORSMiddleware
from pymongo import MongoClient
from models import Game
from datetime import date, datetime

app = FastAPI()

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_methods=["*"],
    allow_headers=["*"],
)

client = MongoClient("mongodb://localhost:27017")
db = client["gamesDB"]
collection = db["games"]

# 🔁 Función reutilizable para limpiar ObjectId
def clean_game(game):
    game.pop("_id", None)
    return game


@app.get("/api/games")
def get_games():
    games = list(collection.find())
    return [clean_game(g) for g in games]


@app.post("/api/games")
def add_game(game: Game):
    game_dict = game.dict(exclude={"id"})

    # Obtener el último ID personalizado
    last = collection.find_one(sort=[("id", -1)])
    last_id = int(last["id"]) if last and "id" in last else 0
    new_id = str(last_id + 1)
    game_dict["id"] = new_id

    # Validar y formatear la fecha
    try:
        if isinstance(game_dict["lastPlayed"], date):
            game_dict["lastPlayed"] = game_dict["lastPlayed"].isoformat()
        elif isinstance(game_dict["lastPlayed"], datetime):
            game_dict["lastPlayed"] = game_dict["lastPlayed"].date().isoformat()
        elif isinstance(game_dict["lastPlayed"], str):
            datetime.strptime(game_dict["lastPlayed"], "%Y-%m-%d")
    except Exception as e:
        raise HTTPException(status_code=400, detail=f"Error de fecha: {str(e)}")

    try:
        result = collection.insert_one(game_dict)

        # Evita retornar el _id si no lo necesitas
        return {
            "id": new_id,
            "name": game_dict["name"],
            "platform": game_dict["platform"],
            "score": game_dict["score"],
            "completed": game_dict["completed"],
            "hoursPlayed": game_dict["hoursPlayed"],
            "lastPlayed": game_dict["lastPlayed"]
        }

    except Exception as e:
        print("ERROR EN INSERT:", str(e))
        raise HTTPException(status_code=500, detail=f"Error interno: {repr(e)}")


@app.put("/api/games/{id}")
def update_game(id: str, game: Game):
    game_dict = game.dict(exclude={"id"})

    try:
        if isinstance(game_dict["lastPlayed"], date):
            game_dict["lastPlayed"] = game_dict["lastPlayed"].isoformat()
    except Exception as e:
        raise HTTPException(status_code=400, detail=f"Error en fecha: {str(e)}")

    result = collection.update_one({"id": id}, {"$set": game_dict})
    if result.matched_count == 0:
        raise HTTPException(status_code=404, detail="Juego no encontrado")

    updated_game = collection.find_one({"id": id})
    return clean_game(updated_game)


@app.delete("/api/games/{id}")
def delete_game(id: str):
    result = collection.delete_one({"id": id})
    if result.deleted_count == 0:
        raise HTTPException(status_code=404, detail="Juego no encontrado")
    return {"message": "Juego eliminado", "deleted_id": id}


@app.get("/api/top-games")
def get_top_games():
    games = list(collection.find().sort("score", -1).limit(5))
    return [clean_game(g) for g in games]


@app.get("/api/platform-stats")
def get_platform_stats():
    pipeline = [
        {
            "$group": {
                "_id": "$platform",
                "count": {"$sum": 1},
                "totalScore": {"$sum": "$score"}
            }
        }
    ]
    stats = list(collection.aggregate(pipeline))
    return [{"platform": s["_id"], "count": s["count"], "totalScore": s["totalScore"]} for s in stats]


@app.get("/api/games/search")
def search_games(name: str = Query(..., min_length=2)):
    regex = {"$regex": name, "$options": "i"}
    games = list(collection.find({"name": regex}))
    return [clean_game(g) for g in games]


@app.get("/api/summary")
def get_summary():
    juegos = list(collection.find())
    for j in juegos:
        j["id"] = j.get("id", "")
        j["lastPlayed"] = j.get("lastPlayed", "1970-01-01")

    total_games = len(juegos)
    total_score = sum(j.get("score", 0) for j in juegos)
    total_hours = sum(j.get("hoursPlayed", 0) for j in juegos)
    best_game = max(juegos, key=lambda j: j.get("score", 0), default=None)
    completados = [j for j in juegos if j.get("completed")]
    last_completed = max(completados, key=lambda j: j.get("lastPlayed", "1970-01-01"), default=None)

    return {
        "totalGames": total_games,
        "totalScore": total_score,
        "totalHoursPlayed": total_hours,
        "bestGame": best_game.get("name", "") if best_game else None,
        "bestScore": best_game.get("score", 0) if best_game else None,
        "currentGame": completados[-1].get("name", "") if completados else None,
        "lastCompleted": {
            "name": last_completed.get("name", ""),
            "lastPlayed": last_completed.get("lastPlayed", "")
        } if last_completed else None,
        "completedCount": len(completados),
        "inProgressCount": total_games - len(completados)
    }
