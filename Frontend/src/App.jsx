import { useState, useRef } from "react";

const API_URL = "http://localhost:5000";

const EXAMPLE_TEXTS = [
  "I absolutely love this project!",
  "This bug is driving me crazy.",
  "The results are quite impressive.",
  "I'm so tired of debugging this.",
  "Machine learning is genuinely exciting.",
];

function MeterBar({ score, label }) {
  const isPositive = label === "POSITIVE";
  const color = isPositive ? "#22c55e" : "#ef4444";
  const width = `${score}%`;

  return (
    <div style={{ marginTop: "12px" }}>
      <div style={{
        display: "flex",
        justifyContent: "space-between",
        fontSize: "12px",
        color: "#9ca3af",
        marginBottom: "6px",
      }}>
        <span>Confidence</span>
        <span style={{ color, fontWeight: 600 }}>{score}%</span>
      </div>
      <div style={{
        height: "8px",
        background: "#1f2937",
        borderRadius: "99px",
        overflow: "hidden",
      }}>
        <div style={{
          height: "100%",
          width,
          background: isPositive
            ? "linear-gradient(90deg, #16a34a, #4ade80)"
            : "linear-gradient(90deg, #b91c1c, #f87171)",
          borderRadius: "99px",
          transition: "width 0.8s cubic-bezier(0.34, 1.56, 0.64, 1)",
        }} />
      </div>
    </div>
  );
}

function HistoryItem({ item, index }) {
  const isPositive = item.label === "POSITIVE";
  return (
    <div style={{
      display: "flex",
      alignItems: "center",
      gap: "10px",
      padding: "10px 12px",
      background: "#111827",
      borderRadius: "10px",
      border: `1px solid ${isPositive ? "#14532d33" : "#7f1d1d33"}`,
      animation: "fadeIn 0.3s ease",
    }}>
      <span style={{ fontSize: "20px" }}>{item.emoji}</span>
      <div style={{ flex: 1, minWidth: 0 }}>
        <p style={{
          margin: 0,
          fontSize: "13px",
          color: "#d1d5db",
          whiteSpace: "nowrap",
          overflow: "hidden",
          textOverflow: "ellipsis",
        }}>
          {item.text}
        </p>
        <p style={{ margin: "2px 0 0", fontSize: "11px", color: "#6b7280" }}>
          {isPositive ? "Positive" : "Negative"} · {item.score}% · {item.time_ms}ms
        </p>
      </div>
      <span style={{
        fontSize: "11px",
        fontWeight: 600,
        padding: "2px 8px",
        borderRadius: "99px",
        background: isPositive ? "#14532d44" : "#7f1d1d44",
        color: isPositive ? "#4ade80" : "#f87171",
        flexShrink: 0,
      }}>
        {isPositive ? "+" : "−"}
      </span>
    </div>
  );
}

export default function App() {
  const [text, setText] = useState("");
  const [result, setResult] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [history, setHistory] = useState([]);
  const textareaRef = useRef(null);

  const analyze = async (inputText) => {
    const t = (inputText ?? text).trim();
    if (!t) return;

    setLoading(true);
    setError("");
    setResult(null);

    try {
      const res = await fetch(`${API_URL}/analyze`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ text: t }),
      });

      const data = await res.json();

      if (!res.ok) {
        setError(data.error || "Something went wrong");
        return;
      }

      setResult(data);
      setHistory((prev) => [data, ...prev].slice(0, 10)); // keep last 10
    } catch {
      setError("Cannot connect to Flask server. Make sure it's running on port 5000.");
    } finally {
      setLoading(false);
    }
  };

  const handleKey = (e) => {
    if (e.key === "Enter" && (e.metaKey || e.ctrlKey)) analyze();
  };

  const isPositive = result?.label === "POSITIVE";

  return (
    <div style={{
      minHeight: "100vh",
      background: "#030712",
      color: "#f9fafb",
      fontFamily: "'Inter', system-ui, sans-serif",
      display: "flex",
      flexDirection: "column",
      alignItems: "center",
      padding: "48px 16px",
    }}>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700&display=swap');
        * { box-sizing: border-box; }
        textarea { resize: none; outline: none; }
        textarea::placeholder { color: #4b5563; }
        @keyframes fadeIn { from { opacity: 0; transform: translateY(8px); } to { opacity: 1; transform: translateY(0); } }
        @keyframes pulse { 0%,100% { opacity: 1; } 50% { opacity: 0.5; } }
        @keyframes spin { to { transform: rotate(360deg); } }
        .example-btn:hover { background: #1f2937 !important; border-color: #374151 !important; }
        .analyze-btn:hover:not(:disabled) { background: #6d28d9 !important; transform: translateY(-1px); box-shadow: 0 8px 24px #7c3aed44; }
        .analyze-btn:active:not(:disabled) { transform: translateY(0); }
      `}</style>

      {/* Header */}
      <div style={{ textAlign: "center", marginBottom: "40px" }}>
        <div style={{
          display: "inline-flex",
          alignItems: "center",
          gap: "8px",
          background: "#1f2937",
          border: "1px solid #374151",
          borderRadius: "99px",
          padding: "4px 14px",
          fontSize: "12px",
          color: "#9ca3af",
          marginBottom: "20px",
          letterSpacing: "0.05em",
        }}>
          <span style={{ width: 7, height: 7, borderRadius: "50%", background: "#4ade80", display: "inline-block" }} />
          DISTILBERT · HuggingFace Transformers
        </div>
        <h1 style={{
          margin: 0,
          fontSize: "clamp(32px, 5vw, 52px)",
          fontWeight: 700,
          letterSpacing: "-0.03em",
          background: "linear-gradient(135deg, #f9fafb 30%, #9ca3af)",
          WebkitBackgroundClip: "text",
          WebkitTextFillColor: "transparent",
          lineHeight: 1.1,
        }}>
          Sentiment Analyzer
        </h1>
        <p style={{ margin: "12px 0 0", color: "#6b7280", fontSize: "15px" }}>
          Type anything — find out if it's positive or negative
        </p>
      </div>

      {/* Main Card */}
      <div style={{
        width: "100%",
        maxWidth: "640px",
        background: "#0f172a",
        border: "1px solid #1e293b",
        borderRadius: "20px",
        padding: "28px",
        boxShadow: "0 25px 50px rgba(0,0,0,0.5)",
      }}>

        {/* Textarea */}
        <textarea
          ref={textareaRef}
          value={text}
          onChange={(e) => setText(e.target.value)}
          onKeyDown={handleKey}
          placeholder="Write something... (Ctrl+Enter to analyze)"
          rows={4}
          maxLength={512}
          style={{
            width: "100%",
            background: "#020617",
            border: "1px solid #1e293b",
            borderRadius: "12px",
            padding: "14px 16px",
            fontSize: "15px",
            color: "#e2e8f0",
            lineHeight: 1.6,
            fontFamily: "inherit",
            transition: "border-color 0.2s",
          }}
        />
        <div style={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          marginTop: "8px",
          marginBottom: "16px",
        }}>
          <span style={{ fontSize: "12px", color: "#374151" }}>
            {text.length}/512
          </span>
          <span style={{ fontSize: "12px", color: "#374151" }}>
            Ctrl+Enter to analyze
          </span>
        </div>

        {/* Analyze Button */}
        <button
          className="analyze-btn"
          onClick={() => analyze()}
          disabled={loading || !text.trim()}
          style={{
            width: "100%",
            padding: "13px",
            background: loading || !text.trim() ? "#1e293b" : "#7c3aed",
            color: loading || !text.trim() ? "#4b5563" : "#fff",
            border: "none",
            borderRadius: "12px",
            fontSize: "15px",
            fontWeight: 600,
            cursor: loading || !text.trim() ? "not-allowed" : "pointer",
            transition: "all 0.2s",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            gap: "8px",
            fontFamily: "inherit",
          }}
        >
          {loading ? (
            <>
              <span style={{
                width: 16, height: 16,
                border: "2px solid #4b5563",
                borderTopColor: "#7c3aed",
                borderRadius: "50%",
                animation: "spin 0.7s linear infinite",
                display: "inline-block",
              }} />
              Analyzing...
            </>
          ) : "Analyze Sentiment"}
        </button>

        {/* Error */}
        {error && (
          <div style={{
            marginTop: "16px",
            padding: "12px 14px",
            background: "#7f1d1d22",
            border: "1px solid #7f1d1d",
            borderRadius: "10px",
            fontSize: "13px",
            color: "#fca5a5",
          }}>
            ⚠️ {error}
          </div>
        )}

        {/* Result */}
        {result && (
          <div style={{
            marginTop: "20px",
            padding: "20px",
            background: isPositive ? "#052e1622" : "#2d060622",
            border: `1px solid ${isPositive ? "#14532d55" : "#7f1d1d55"}`,
            borderRadius: "14px",
            animation: "fadeIn 0.4s ease",
          }}>
            <div style={{ display: "flex", alignItems: "center", gap: "14px" }}>
              <span style={{ fontSize: "44px", lineHeight: 1 }}>{result.emoji}</span>
              <div>
                <div style={{
                  fontSize: "22px",
                  fontWeight: 700,
                  color: isPositive ? "#4ade80" : "#f87171",
                  letterSpacing: "-0.02em",
                }}>
                  {isPositive ? "Positive" : "Negative"}
                </div>
                <div style={{ fontSize: "13px", color: "#6b7280", marginTop: "2px" }}>
                  Analyzed in {result.time_ms}ms
                </div>
              </div>
            </div>
            <MeterBar score={result.score} label={result.label} />
          </div>
        )}

        {/* Example Sentences */}
        <div style={{ marginTop: "24px" }}>
          <p style={{ fontSize: "12px", color: "#4b5563", marginBottom: "10px", letterSpacing: "0.06em" }}>
            TRY AN EXAMPLE
          </p>
          <div style={{ display: "flex", flexWrap: "wrap", gap: "8px" }}>
            {EXAMPLE_TEXTS.map((ex, i) => (
              <button
                key={i}
                className="example-btn"
                onClick={() => {
                  setText(ex);
                  analyze(ex);
                }}
                style={{
                  background: "#111827",
                  border: "1px solid #1f2937",
                  color: "#9ca3af",
                  borderRadius: "8px",
                  padding: "6px 11px",
                  fontSize: "12px",
                  cursor: "pointer",
                  fontFamily: "inherit",
                  transition: "all 0.15s",
                  maxWidth: "200px",
                  whiteSpace: "nowrap",
                  overflow: "hidden",
                  textOverflow: "ellipsis",
                }}
              >
                {ex}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* History */}
      {history.length > 0 && (
        <div style={{ width: "100%", maxWidth: "640px", marginTop: "28px" }}>
          <div style={{
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
            marginBottom: "12px",
          }}>
            <p style={{ margin: 0, fontSize: "12px", color: "#4b5563", letterSpacing: "0.06em" }}>
              RECENT ANALYSES
            </p>
            <button
              onClick={() => setHistory([])}
              style={{
                background: "none",
                border: "none",
                color: "#4b5563",
                fontSize: "12px",
                cursor: "pointer",
                fontFamily: "inherit",
                padding: 0,
              }}
            >
              Clear
            </button>
          </div>
          <div style={{ display: "flex", flexDirection: "column", gap: "8px" }}>
            {history.map((item, i) => (
              <HistoryItem key={i} item={item} index={i} />
            ))}
          </div>
        </div>
      )}

      {/* Footer */}
      <p style={{ marginTop: "48px", fontSize: "12px", color: "#374151", textAlign: "center" }}>
        Built with HuggingFace Transformers · Flask · React 
      </p>
    </div>
  );
}
