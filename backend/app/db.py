from motor.motor_asyncio import AsyncIOMotorClient
from app.config import settings

mongo_client = None
db = None

async def connect_to_mongo():
    global mongo_client, db
    mongo_client = AsyncIOMotorClient(settings.MONGO_URL)
    await mongo_client.server_info()  # forces actual connection
    db = mongo_client[settings.DB_NAME]
    print("Mongo connected!")

async def close_mongo_connection():
    mongo_client.close()
    print("Mongo disconnected.")

def get_collection():
    return db[settings.COLLECTION_NAME]
