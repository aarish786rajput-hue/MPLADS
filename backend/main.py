from fastapi import FastAPI, HTTPException
from fastapi.middleware.cors import CORSMiddleware
import pandas as pd
import numpy as np
from sklearn.ensemble import IsolationForest
import sqlite3
import os

app = FastAPI(title="MPLADS ML API", description="Production-ready ML backend with SQLite")

app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:3000", "http://localhost:3001"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

def get_db_connection():
    db_path = os.path.join(os.path.dirname(__file__), 'mplads.db')
    conn = sqlite3.connect(db_path)
    conn.row_factory = sqlite3.Row
    return conn

@app.get("/")
def read_root():
    return {"message": "FastAPI DB+ML Backend is running securely!"}

@app.get("/api/works")
def get_works():
    """Returns all projects from the SQLite Database"""
    conn = get_db_connection()
    works = conn.execute('SELECT * FROM works').fetchall()
    conn.close()
    return [dict(w) for w in works]

@app.get("/api/predict")
def predict_anomalies():
    """Runs Machine Learning Anomaly Detection on Database records"""
    conn = get_db_connection()
    works = conn.execute('SELECT * FROM works').fetchall()
    conn.close()
    
    if len(works) < 5:
        return {"anomalies": [], "message": "Need more data for accurate ML prediction."}

    df = pd.DataFrame([dict(w) for w in works])
    
    # ML Logic: Isolation Forest for Anomaly Detection (Costs that are unusually high)
    X = df[['costLakh']].values
    
    # Contamination 0.20 means we expect roughly 20% anomalies for demonstration
    model = IsolationForest(contamination=0.20, random_state=42)
    model.fit(X)
    
    predictions = model.predict(X)
    scores = model.decision_function(X) 
    
    df['isAnomaly'] = predictions == -1
    df['anomalyScore'] = (scores * -100).round(2)
    
    anomalies_df = df[df['isAnomaly'] == True]
    results = anomalies_df.to_dict(orient="records")
    
    return {
        "processed_count": len(df),
        "anomalies_found": len(results),
        "anomalies": results,
    }
