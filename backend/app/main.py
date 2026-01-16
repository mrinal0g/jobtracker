from fastapi import FastAPI
from contextlib import asynccontextmanager
from app.db import connect_to_mongo, close_mongo_connection
from app.schemas import JobCreate
from app.db import get_collection

@asynccontextmanager
async def lifespan(app: FastAPI):
    await connect_to_mongo()
    yield
    await close_mongo_connection()

app = FastAPI(lifespan=lifespan)

@app.post("/jobs")
async def create_job(job: JobCreate):
    collection = get_collection()
    doc = job.model_dump()
    result = await collection.insert_one(doc)
    doc["_id"] = str(result.inserted_id)
    return doc

@app.get("/health")
async def health():
    return {"status": "ok"}
