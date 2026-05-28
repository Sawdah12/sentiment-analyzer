from transformers import pipeline

# Load pipeline (downloads model on first run ~250MB)
print("Loading model...")
classifier = pipeline("sentiment-analysis")
print("Model loaded!\n")

# 15 test sentences — mix of positive, negative, neutral
test_sentences = [
    "I love building AI projects!",
    "This is the worst day of my life.",
    "The weather is okay today.",
    "I am so happy I finally finished my FYP!",
    "This code is giving me a headache.",
    "Machine learning is really fascinating.",
    "I don't like slow internet connections.",
    "Today's lecture was incredibly boring.",
    "My tea is perfect this morning.",
    "I failed the exam and I'm devastated.",
    "The new update broke everything.",
    "I genuinely enjoy learning new things every day.",
    "The pizza was neither good nor bad.",
    "I can't believe how fast this project came together!",
    "I'm feeling really overwhelmed with deadlines.",
]

print(f"{'Sentence':<55} {'Label':<12} {'Score'}")
print("-" * 80)

results = classifier(test_sentences)

for sentence, result in zip(test_sentences, results):
    label = result["label"]
    score = f"{result['score'] * 100:.1f}%"
    # Truncate long sentences for display
    display = sentence[:52] + "..." if len(sentence) > 52 else sentence
    print(f"{display:<55} {label:<12} {score}")

print("\nDone! Model is working correctly.")
