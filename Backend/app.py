from flask import Flask, request, jsonify
from flask_cors import CORS
from transformers import pipeline
import time

app = Flask(__name__)
CORS(app)  # Allow React frontend to call this API

# Load model once at startup (not on every request)
print("Loading sentiment model... please wait")
classifier = pipeline("sentiment-analysis")
print("Model ready!")


@app.route("/", methods=["GET"])
def home():
    return jsonify({"message": "Sentiment Analyzer API is running!", "status": "ok"})


@app.route("/analyze", methods=["POST"])
def analyze():
    data = request.get_json()

    if not data or "text" not in data:
        return jsonify({"error": "Please provide 'text' in request body"}), 400

    text = data["text"].strip()

    if not text:
        return jsonify({"error": "Text cannot be empty"}), 400

    if len(text) > 512:
        return jsonify({"error": "Text too long. Max 512 characters."}), 400

    start = time.time()
    result = classifier(text)[0]
    elapsed = round((time.time() - start) * 1000, 1)  # ms

    label = result["label"]      # "POSITIVE" or "NEGATIVE"
    score = result["score"]      # 0.0 to 1.0

    # Map to emoji for fun
    emoji_map = {"POSITIVE": "😊", "NEGATIVE": "😔"}

    return jsonify({
        "text": text,
        "label": label,
        "score": round(score * 100, 2),        # percentage
        "confidence": round(score * 100, 1),
        "emoji": emoji_map.get(label, "😐"),
        "time_ms": elapsed,
    })


@app.route("/analyze-batch", methods=["POST"])
def analyze_batch():
    """Analyze multiple sentences at once"""
    data = request.get_json()

    if not data or "texts" not in data:
        return jsonify({"error": "Please provide 'texts' array in request body"}), 400

    texts = data["texts"]

    if not isinstance(texts, list) or len(texts) == 0:
        return jsonify({"error": "texts must be a non-empty array"}), 400

    if len(texts) > 20:
        return jsonify({"error": "Max 20 sentences per batch"}), 400

    results = classifier(texts)

    output = []
    for text, result in zip(texts, results):
        output.append({
            "text": text,
            "label": result["label"],
            "score": round(result["score"] * 100, 2),
            "emoji": "😊" if result["label"] == "POSITIVE" else "😔",
        })

    return jsonify({"results": output, "count": len(output)})


if __name__ == "__main__":
    app.run(debug=True, port=5000)
