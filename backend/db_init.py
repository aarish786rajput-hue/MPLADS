import sqlite3
import os

def init_db():
    db_path = os.path.join(os.path.dirname(__file__), 'mplads.db')
    conn = sqlite3.connect(db_path)
    c = conn.cursor()
    
    # Purana table delete karke naya banayenge jisme latitude aur longitude hoga
    c.execute('DROP TABLE IF EXISTS works')
    
    # Create table with lat and lng
    c.execute('''
        CREATE TABLE works (
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            workName TEXT,
            costLakh REAL,
            status TEXT,
            category TEXT,
            lat REAL,
            lng REAL
        )
    ''')
    
    # New Delhi ke aas-paas ke real coordinates ke sath dummy data
    dummy_data = [
        ("Road Construction in Sector 4", 25.5, "Ongoing", "Infrastructure", 28.6139, 77.2090), # Connaught Place
        ("Water Tank Installation", 12.0, "Completed", "Water", 28.5355, 77.2410), # Okhla
        ("Solar Panel for School", 8.5, "Pending", "Education", 28.6448, 77.2167), # Jama Masjid area
        ("Suspiciously Expensive Bench", 105.0, "Ongoing", "Infrastructure", 28.5921, 77.2273), # India Gate area
        ("Community Hall Repair", 15.0, "Ongoing", "Infrastructure", 28.7041, 77.1025), # Rohini
        ("Street Lights Phase 2", 10.0, "Completed", "Infrastructure", 28.5562, 77.1000), # Vasant Kunj
        ("Library Computers", 9.0, "Pending", "Education", 28.6692, 77.0927), # Paschim Vihar
        ("Park Renovation", 14.5, "Completed", "Infrastructure", 28.5244, 77.1855), # Saket
        ("Public Toilets", 11.2, "Pending", "Sanitation", 28.6505, 77.2303), # Chandni Chowk
        ("Overpriced Dustbins", 85.0, "Completed", "Sanitation", 28.5800, 77.3300) # Noida Border
    ]
    
    c.executemany('INSERT INTO works (workName, costLakh, status, category, lat, lng) VALUES (?, ?, ?, ?, ?, ?)', dummy_data)
    conn.commit()
    conn.close()

if __name__ == "__main__":
    init_db()
    print("Database recreated with location coordinates.")
