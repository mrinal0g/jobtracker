from dotenv import load_dotenv
import os

load_dotenv()

class Settings:
    MONGO_URL: str = os.getenv("MONGO_URL", "mongodb://localhost:27017")
    DB_NAME: str = os.getenv("DB_NAME", "jobtracker")
    COLLECTION_NAME: str = os.getenv("COLLECTION_NAME","jobtracker")

settings = Settings()
