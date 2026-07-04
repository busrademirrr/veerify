import sys
import os
from sqlalchemy import create_engine
from sqlalchemy.schema import CreateTable

# Add root folder to sys.path
sys.path.append(os.path.dirname(os.path.dirname(os.path.abspath(__file__))))

from backend.app.core.models import Base

def generate_sql():
    engine = create_engine('postgresql://')
    
    with open('schema.sql', 'w', encoding='utf-8') as f:
        for table_name, table in Base.metadata.tables.items():
            create_stmt = str(CreateTable(table).compile(engine))
            f.write(create_stmt + ";\n\n")

if __name__ == "__main__":
    generate_sql()
    print("Schema generated in schema.sql")
