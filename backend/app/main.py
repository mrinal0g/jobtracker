from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
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

# Add CORS middleware
app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:5173"], # Vite default port
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

@app.post("/jobs")
async def create_job(job: JobCreate):
    collection = get_collection()
    doc = job.model_dump()
    result = await collection.insert_one(doc)
    doc["_id"] = str(result.inserted_id)
    return doc

@app.get("/jobs")
async def get_jobs():
    collection = get_collection()
    jobs = []
    async for job in collection.find():
        job["_id"] = str(job["_id"])
        jobs.append(job)
    return jobs

@app.delete("/jobs/{job_id}")
async def delete_job(job_id: str):
    print(f"Deleting job with id: {job_id}")
    collection = get_collection()
    result = await collection.delete_one({"_id": job_id})
    if result.deleted_count == 1:
        return {"status": "deleted"}
    return {"status": "not found"}

@app.get("/health")
async def health():
    return {"status": "ok"}