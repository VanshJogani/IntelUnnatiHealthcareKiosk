# app.py
from flask import Flask, request, jsonify
from symptom_data import all_symptoms, severity_map
import pandas as pd
import numpy as np
import pickle
from flask_cors import CORS


app = Flask(__name__)
CORS(app)
# Load trained model
with open('disease_model.pkl', 'rb') as f:
    clf = pickle.load(f)

@app.route('/predict', methods=['POST'])
def predict():
    data = request.json
    symptoms = [s.strip().lower() for s in data.get('symptoms', [])]
    input_vec = pd.Series(0, index=all_symptoms, dtype=float)
    for sym in symptoms:
        if sym in input_vec.index:
            input_vec[sym] = severity_map.get(sym, 0)
    df = pd.DataFrame([input_vec])
    proba = clf.predict_proba(df)[0]
    top3_idx = np.argsort(proba)[-3:][::-1]
    top3 = [
        {"disease": clf.classes_[i], "probability": proba[i] * 100}
        for i in top3_idx
    ]
    return jsonify({"predictions": top3})

if __name__ == "__main__":
    app.run(debug=True, port=5001, host='0.0.0.0')

    print()
