from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from contextlib import asynccontextmanager
from app.db import connect_to_mongo, close_mongo_connection
from app.schemas import JobCreate
from app.db import get_collection
from bson import ObjectId
from fastapi import HTTPException

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
    result = await collection.delete_one({"_id": ObjectId(job_id)})
    if result.deleted_count == 1:
        return {"status": "deleted"}
    return {"status": "not found"}

@app.patch("/update-job/{job_id}")
async def update_job(job_id: str,updates:dict):
    print(f"Updating job with id: {job_id}")
    collection = get_collection()
    try:
       oid = ObjectId(job_id)
    except:
      raise HTTPException(status_code=400, detail="Invalid job ID format")
    if "_id" in updates:
        updates.pop("_id")  # Prevent changing the _id field
    result = await collection.update_one(
        {"_id": oid},
        {"$set": updates}
    )
    if result.matched_count == 0:
        raise HTTPException(status_code=404, detail="Job not found")
    updated = await collection.find_one({"_id": oid})
    updated["_id"] = str(updated["_id"])
    return updated

@app.get("/health")
async def health():
    return {"status": "ok"}