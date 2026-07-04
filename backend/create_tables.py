import asyncio
import sys
import os
from dotenv import load_dotenv

# Load .env file
load_dotenv()

# Add root folder to sys.path
sys.path.append(os.path.dirname(os.path.dirname(os.path.abspath(__file__))))

from backend.app.core.database import init_models
from backend.app.core import models # Important: import models to populate Base.metadata

async def main():
    print("Connecting to Supabase and creating tables...")
    try:
        await init_models()
        print("All tables created successfully!")
    except Exception as e:
        print(f"Error creating tables: {e}")

if __name__ == "__main__":
    asyncio.run(main())
