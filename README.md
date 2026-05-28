# 🧠 Sentiment Analyzer

A full-stack AI-powered Sentiment Analyzer built with **HuggingFace Transformers**, **Flask**, and **React**. Detects whether text is Positive or Negative with a confidence score.

![Python](https://img.shields.io/badge/Python-3.10+-blue?style=flat-square&logo=python)
![Flask](https://img.shields.io/badge/Flask-3.0-black?style=flat-square&logo=flask)
![React](https://img.shields.io/badge/React-18-61DAFB?style=flat-square&logo=react)
![HuggingFace](https://img.shields.io/badge/HuggingFace-Transformers-yellow?style=flat-square)

---

## 📸 Demo

> Type any sentence → Get instant sentiment prediction with confidence score.

---

## 🏗️ Project Structure

```
sentiment-analyzer/
├── backend/
│   ├── app.py               # Flask API
│   ├── test_sentiment.py    # Day 1 test script
│   └── requirements.txt
└── frontend/
    ├── src/
    │   └── App.jsx          # React UI
    ├── package.json
    └── index.html
```

---

## ⚙️ Setup & Run

### Backend (Flask)

```bash
cd backend

# Install dependencies
pip install -r requirements.txt

# Day 1: Test the model on 15 sentences
python test_sentiment.py

# Day 2: Start the API server
python app.py
# Running on http://localhost:5000
```

### Frontend (React + Vite)

```bash
cd frontend

npm install
npm run dev
# Running on http://localhost:5173
```

---

## 🔌 API Endpoints

### `POST /analyze`
Analyze a single sentence.

**Request:**
```json
{ "text": "I love building AI projects!" }
```

**Response:**
```json
{
  "text": "I love building AI projects!",
  "label": "POSITIVE",
  "score": 99.84,
  "confidence": 99.8,
  "emoji": "😊",
  "time_ms": 42.1
}
```

### `POST /analyze-batch`
Analyze up to 20 sentences at once.

**Request:**
```json
{ "texts": ["Great day!", "Terrible experience."] }
```

---

## 🤖 Model

- **Model:** `distilbert-base-uncased-finetuned-sst-2-english`
- **Source:** HuggingFace Transformers
- **Task:** Binary Sentiment Classification (POSITIVE / NEGATIVE)
- **Performance:** ~91% accuracy on SST-2 benchmark

---

## 🛠️ Tech Stack

| Layer     | Technology                        |
|-----------|-----------------------------------|
| ML Model  | HuggingFace Transformers (DistilBERT) |
| Backend   | Flask, Flask-CORS                 |
| Frontend  | React 18, Vite                    |
| Styling   | Inline CSS (no dependencies)      |

---

## 🚀 What I Learned

- Loading and using pre-trained NLP models from HuggingFace
- Building a REST API with Flask and serving ML predictions
- Connecting a React frontend to a Python backend
- Handling CORS, loading states, and error handling in a full-stack app

---

## 👩‍💻 Author

**Sawda** — Computer Engineering Student  
[LinkedIn](#) · [GitHub](#)

---

## 📄 License

MIT License — free to use and modify.
