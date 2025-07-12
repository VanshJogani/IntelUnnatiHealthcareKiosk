# 🏥 HealDesk - Healthcare Kiosks  
**Intel Unnati Project 6**  
**Team Members:** Vansh Jogani, Adithi N R

HealDesk is a smart healthcare kiosk solution designed to simplify and automate patient check-ins, diagnostics, and data handling. It integrates modern web technologies, machine learning for disease prediction, and biometric authentication via face recognition.

📄 **Project Report:**  
See the full documentation in [Healthcare_Kiosk_Detailed_Report.pdf](./Healthcare_Kiosk_Detailed_Report.pdf)

---

## 📦 Project Structure

The project includes:
- ✅ **Frontend** (`/kiosk`) — React-based UI
- 🧠 **Disease Prediction Backend** (`/disease_predictor_backend`) — Python + ML
- 🔐 **Face ID Login Backend** (`/faceidloginbackend/backend`) — Node.js + face-api.js
- 🌐 **General Backend** (`/backend`) — Node.js API and database handling

---

## 🚀 How to Run the Project

### 1️⃣ Start General Backend

```bash
cd backend
npm install
npm start
```
### 2️⃣ Start Disease Predictor Backend
```bash
cd disease_predictor_backend
pip install -r requirements.txt
python predict_disease.py
```

### 3️⃣ Start Face ID Login Backend
```bash
cd faceidloginbackend/backend
npm install
npm start
```

### 4️⃣ Start the Frontend (React App)
```bash
cd kiosk
npm install
npm start
```
