import React, { useState } from 'react';
import axios from 'axios';

const DiseasePredictor = ({ isPanel = false }) => {
  const [symptoms, setSymptoms] = useState(['']);
  const [predictions, setPredictions] = useState([]);
  const [loading, setLoading] = useState(false);

  const handleSymptomChange = (index, value) => {
    const updated = [...symptoms];
    updated[index] = value;
    setSymptoms(updated);
  };

  const addSymptomField = () => {
    setSymptoms([...symptoms, '']);
  };

  const removeSymptomField = (index) => {
    const updated = symptoms.filter((_, i) => i !== index);
    setSymptoms(updated);
  };

  const submitSymptoms = async () => {
    setLoading(true);
    try {
      const res = await axios.post('http://localhost:5001/predict', {
        symptoms: symptoms.filter((s) => s.trim() !== ''),
      });
      setPredictions(res.data.predictions);
    } catch (err) {
      alert('Prediction failed. Check backend.');
    }
    setLoading(false);
  };

  return (
    <div className={`bg-emerald-950 text-emerald-100 rounded-2xl shadow-xl border border-emerald-800 ${isPanel ? 'p-6 w-[340px] max-w-full' : 'p-6 w-full mb-8'}`}>
      <h1 className="text-xl font-bold mb-4 text-emerald-400 flex items-center gap-2">
        🧬 Disease Predictor
      </h1>

      {symptoms.map((sym, i) => (
        <div key={i} className="flex gap-2 mb-2">
          <input
            type="text"
            value={sym}
            onChange={(e) => handleSymptomChange(i, e.target.value)}
            className="flex-1 px-3 py-2 rounded-full border border-emerald-700 bg-emerald-900 text-emerald-100 placeholder:text-emerald-400 focus:outline-none focus:ring-2 focus:ring-emerald-600 text-sm"
            placeholder={`Symptom ${i + 1}`}
          />
          <button
            onClick={() => removeSymptomField(i)}
            className="text-red-400 hover:text-red-600 font-bold px-2 rounded-full focus:outline-none"
            aria-label="Remove symptom"
          >
            ✕
          </button>
        </div>
      ))}

      <button onClick={addSymptomField} className="text-emerald-400 hover:text-emerald-200 text-xs font-semibold mb-2">
        + Add Symptom
      </button>

      <button
        onClick={submitSymptoms}
        className="w-full mt-2 bg-emerald-600 hover:bg-emerald-700 text-white px-4 py-2 rounded-full font-semibold transition"
      >
        {loading ? 'Predicting...' : 'Predict Disease'}
      </button>

      {predictions.length > 0 && (
        <div className="mt-5">
          <h2 className="font-semibold text-emerald-300 mb-2">Top Predictions:</h2>
          <ul className="list-disc list-inside text-emerald-100">
            {predictions.map((p, i) => (
              <li key={i}>
                <span className="font-semibold text-emerald-200">{p.disease}</span> — <span className="text-emerald-400">{p.probability.toFixed(2)}%</span>
              </li>
            ))}
          </ul>
        </div>
      )}
    </div>
  );
};

export default DiseasePredictor; 