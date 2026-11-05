import { useState, useRef, useEffect } from "react";
import { 
  Bot, 
  X, 
  Send, 
  Sparkles, 
  Volume2, 
  VolumeX, 
  ChevronDown, 
  Lightbulb,
  CornerDownLeft,
  CheckCircle2,
  TrendingUp,
  AlertCircle
} from "lucide-react";

const SUGGESTED_PROMPTS = [
  "🌾 NPK dosage calculation for Cotton",
  "🦠 How to identify Late Blight in Tomatoes?",
  "💰 Mandi price outlook for Guntur Chili",
  "🌦️ Best time of day for pesticide spraying",
  "💧 Drip irrigation schedule for summer"
];

const KNOWLEDGE_BASE = {
  npk: {
    title: "NPK Ratio & Dosage Guide",
    answer: "For Cotton in black cotton/alluvial soil: \n• Recommended NPK ratio is generally **120:60:60 kg/ha**.\n• **Basal dose**: Apply 100% P and 50% K at sowing.\n• **Split Nitrogen**: 50% N at 30 days (vegetative), 25% N at 60 days (squaring/flowering), and 25% at boll formation along with remaining K.\n• Foliar spray of 1% DAP or 1% Potassium Nitrate (13-0-45) during flowering dramatically prevents boll drop.",
    badge: "Fertilizer Advisory"
  },
  blight: {
    title: "Tomato Late Blight Identification & Cure",
    answer: "Late Blight (*Phytophthora infestans*) symptoms: \n• Dark, water-soaked necrotic lesions on leaf margins & stems.\n• White fuzzy mildew growth on underside in humid morning weather.\n\n**Immediate Treatment:**\n1. Spray **Metalaxyl 8% + Mancozeb 64% WP** (Ridomil MZ @ 2g/L water).\n2. Organic control: Spray 0.5% Trichoderma viride or Bordeaux mixture (1%).\n3. Avoid overhead sprinkler irrigation to keep canopy dry.",
    badge: "Disease Protocol"
  },
  mandi: {
    title: "Guntur Chili & Commodity Price Outlook",
    answer: "• **Guntur Teja/Fatki Chili**: Trading strong around **₹16,500 – ₹19,200 per quintal** due to high export demand from SE Asia.\n• **Prediction**: Bullish momentum (+4.8% likely next 10 days) as cold storage arrivals remain controlled.\n• **Strategic Advice**: Sell 40% stock at current peak levels, hold 60% if moisture content is certified below 10%.",
    badge: "Market Intel"
  },
  spray: {
    title: "Optimal Pesticide Spray Window",
    answer: "• **Best Window**: Early Morning (**6:30 AM – 9:30 AM**) or Late Afternoon (**4:30 PM – 6:30 PM**).\n• **Conditions Required**: Wind speed < 12 km/h (prevents drift), relative humidity 50-70%, and zero rainfall forecast for 6 hours.\n• Avoid spraying at midday (high heat degrades chemical efficacy and causes phytotoxicity scorch on leaves).",
    badge: "Weather Advisory"
  },
  irrigation: {
    title: "Drip Irrigation Schedule",
    answer: "• Schedule watering in early morning cycles to minimize evaporative loss.\n• For vegetable crops (Tomatoes, Chilies, Cucurbits): 4 to 6 liters per plant every alternate day during fruiting.\n• Check soil moisture: Maintain root zone between 60% - 75% field capacity. Install tensiometer or capacitance sensor at 15cm & 30cm depth.",
    badge: "Water Management"
  }
};

export default function AICopilotWidget() {
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState([
    {
      id: "welcome",
      sender: "bot",
      text: "Hello! I am your AgriNova AI Copilot. Ask me anything about crop diseases, N-P-K fertilizer schedules, mandi price forecasts, or weather spraying windows.",
      timestamp: "Just now"
    }
  ]);
  const [input, setInput] = useState("");
  const [isTyping, setIsTyping] = useState(false);
  const [isSpeaking, setIsSpeaking] = useState(false);
  const messagesEndRef = useRef(null);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages, isTyping]);

  const speakText = (text) => {
    if (!('speechSynthesis' in window)) return;
    if (isSpeaking) {
      window.speechSynthesis.cancel();
      setIsSpeaking(false);
      return;
    }
    const cleanText = text.replace(/[*#•_-]/g, "");
    const utterance = new SpeechSynthesisUtterance(cleanText);
    utterance.rate = 1.0;
    utterance.pitch = 1.0;
    utterance.onend = () => setIsSpeaking(false);
    utterance.onerror = () => setIsSpeaking(false);
    setIsSpeaking(true);
    window.speechSynthesis.speak(utterance);
  };

  const handleSend = async (userText) => {
    const textToSend = userText || input;
    if (!textToSend.trim()) return;

    const userMessage = {
      id: Date.now().toString(),
      sender: "user",
      text: textToSend,
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
    };

    setMessages(prev => [...prev, userMessage]);
    if (!userText) setInput("");
    setIsTyping(true);

    // Simulate AI synthesis & knowledge lookup
    setTimeout(() => {
      const lower = textToSend.toLowerCase();
      let reply = "";
      let matchedBadge = "AI Insight";

      if (lower.includes("npk") || lower.includes("fertilizer") || lower.includes("cotton") || lower.includes("dose")) {
        reply = KNOWLEDGE_BASE.npk.answer;
        matchedBadge = KNOWLEDGE_BASE.npk.badge;
      } else if (lower.includes("blight") || lower.includes("tomato") || lower.includes("disease") || lower.includes("fungus") || lower.includes("spot")) {
        reply = KNOWLEDGE_BASE.blight.answer;
        matchedBadge = KNOWLEDGE_BASE.blight.badge;
      } else if (lower.includes("mandi") || lower.includes("price") || lower.includes("chili") || lower.includes("market") || lower.includes("rate")) {
        reply = KNOWLEDGE_BASE.mandi.answer;
        matchedBadge = KNOWLEDGE_BASE.mandi.badge;
      } else if (lower.includes("spray") || lower.includes("weather") || lower.includes("wind") || lower.includes("rain")) {
        reply = KNOWLEDGE_BASE.spray.answer;
        matchedBadge = KNOWLEDGE_BASE.spray.badge;
      } else if (lower.includes("irrigation") || lower.includes("water") || lower.includes("drip")) {
        reply = KNOWLEDGE_BASE.irrigation.answer;
        matchedBadge = KNOWLEDGE_BASE.irrigation.badge;
      } else {
        reply = `Based on current agricultural best practices:\n• Ensure proper soil testing before the next crop cycle.\n• Current weather indicators show stable temperatures; maintain normal irrigation intervals.\n• To optimize yield for "${textToSend.slice(0, 30)}...", keep weed competition zero in the initial 45 days and apply bio-stimulant foliar spray during flowering.`;
      }

      setMessages(prev => [
        ...prev,
        {
          id: (Date.now() + 1).toString(),
          sender: "bot",
          text: reply,
          badge: matchedBadge,
          timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
        }
      ]);
      setIsTyping(false);
    }, 700);
  };

  return (
    <div style={{ position: "fixed", bottom: "24px", right: "24px", zIndex: 9999 }}>
      {/* EXPANDED CHAT PANEL */}
      {isOpen && (
        <div 
          style={{
            width: "380px",
            maxWidth: "calc(100vw - 32px)",
            height: "540px",
            maxHeight: "calc(100vh - 100px)",
            borderRadius: "24px",
            background: "rgba(255, 255, 255, 0.96)",
            backdropFilter: "blur(20px)",
            WebkitBackdropFilter: "blur(20px)",
            border: "1px solid rgba(16, 76, 38, 0.15)",
            boxShadow: "0 24px 60px rgba(10, 51, 25, 0.18), 0 0 0 1px rgba(34, 197, 94, 0.12)",
            display: "flex",
            flexDirection: "column",
            overflow: "hidden",
            marginBottom: "16px",
            animation: "fadeInUp 0.25s cubic-bezier(0.16, 1, 0.3, 1)"
          }}
        >
          {/* HEADER */}
          <div 
            style={{
              padding: "16px 20px",
              background: "linear-gradient(135deg, #0a3319 0%, #166534 100%)",
              color: "#ffffff",
              display: "flex",
              alignItems: "center",
              justifyContent: "space-between"
            }}
          >
            <div style={{ display: "flex", alignItems: "center", gap: "10px" }}>
              <div 
                style={{
                  width: "36px",
                  height: "36px",
                  borderRadius: "10px",
                  background: "rgba(255, 255, 255, 0.15)",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  color: "#a3e635"
                }}
              >
                <Sparkles size={20} />
              </div>
              <div>
                <div style={{ display: "flex", alignItems: "center", gap: "6px" }}>
                  <h3 style={{ margin: 0, fontSize: "15px", fontWeight: "700", color: "#ffffff" }}>
                    AgriNova Copilot
                  </h3>
                  <span 
                    style={{
                      fontSize: "10px",
                      padding: "2px 6px",
                      background: "rgba(163, 230, 53, 0.2)",
                      color: "#a3e635",
                      borderRadius: "6px",
                      fontWeight: "700"
                    }}
                  >
                    AI 2.0
                  </span>
                </div>
                <p style={{ margin: 0, fontSize: "11px", color: "rgba(255, 255, 255, 0.75)" }}>
                  Online • 24/7 Agro Intelligence
                </p>
              </div>
            </div>

            <div style={{ display: "flex", alignItems: "center", gap: "6px" }}>
              <button
                onClick={() => speakText(messages[messages.length - 1]?.text || "")}
                title={isSpeaking ? "Mute audio" : "Read aloud"}
                style={{
                  background: "rgba(255, 255, 255, 0.12)",
                  border: "none",
                  borderRadius: "8px",
                  padding: "6px",
                  color: isSpeaking ? "#a3e635" : "#ffffff",
                  cursor: "pointer"
                }}
              >
                {isSpeaking ? <VolumeX size={16} /> : <Volume2 size={16} />}
              </button>
              <button
                onClick={() => setIsOpen(false)}
                style={{
                  background: "rgba(255, 255, 255, 0.12)",
                  border: "none",
                  borderRadius: "8px",
                  padding: "6px",
                  color: "#ffffff",
                  cursor: "pointer"
                }}
              >
                <X size={16} />
              </button>
            </div>
          </div>

          {/* CHAT MESSAGES */}
          <div 
            style={{
              flex: 1,
              overflowY: "auto",
              padding: "16px",
              display: "flex",
              flexDirection: "column",
              gap: "12px",
              background: "#f8faf8"
            }}
          >
            {messages.map((msg) => (
              <div
                key={msg.id}
                style={{
                  display: "flex",
                  flexDirection: "column",
                  alignSelf: msg.sender === "user" ? "flex-end" : "flex-start",
                  maxWidth: "88%"
                }}
              >
                {msg.sender === "bot" && msg.badge && (
                  <span 
                    style={{
                      fontSize: "10px",
                      fontWeight: "700",
                      color: "#166534",
                      background: "#dcfce7",
                      padding: "2px 8px",
                      borderRadius: "6px",
                      alignSelf: "flex-start",
                      marginBottom: "4px"
                    }}
                  >
                    {msg.badge}
                  </span>
                )}
                <div
                  style={{
                    padding: "12px 14px",
                    borderRadius: msg.sender === "user" ? "18px 18px 4px 18px" : "18px 18px 18px 4px",
                    background: msg.sender === "user" ? "#166534" : "#ffffff",
                    color: msg.sender === "user" ? "#ffffff" : "#17301f",
                    boxShadow: msg.sender === "user" 
                      ? "0 4px 12px rgba(22, 101, 52, 0.2)" 
                      : "0 2px 8px rgba(0, 0, 0, 0.05)",
                    fontSize: "13px",
                    lineHeight: "1.55",
                    whiteSpace: "pre-line",
                    border: msg.sender === "user" ? "none" : "1px solid rgba(0, 0, 0, 0.06)"
                  }}
                >
                  {msg.text}
                </div>
                <span 
                  style={{
                    fontSize: "10px",
                    color: "#94a3b8",
                    marginTop: "3px",
                    alignSelf: msg.sender === "user" ? "flex-end" : "flex-start"
                  }}
                >
                  {msg.timestamp}
                </span>
              </div>
            ))}

            {isTyping && (
              <div 
                style={{
                  alignSelf: "flex-start",
                  padding: "10px 14px",
                  background: "#ffffff",
                  borderRadius: "18px",
                  boxShadow: "0 2px 8px rgba(0, 0, 0, 0.05)",
                  fontSize: "12px",
                  color: "#166534",
                  display: "flex",
                  alignItems: "center",
                  gap: "6px"
                }}
              >
                <span className="pulse-dot" />
                Analyzing farm data...
              </div>
            )}
            <div ref={messagesEndRef} />
          </div>

          {/* QUICK PROMPTS CHIPS */}
          <div 
            style={{
              padding: "8px 12px",
              background: "#ffffff",
              borderTop: "1px solid rgba(0, 0, 0, 0.06)",
              display: "flex",
              gap: "6px",
              overflowX: "auto",
              whiteSpace: "nowrap"
            }}
          >
            {SUGGESTED_PROMPTS.map((prompt, idx) => (
              <button
                key={idx}
                onClick={() => handleSend(prompt)}
                style={{
                  fontSize: "11px",
                  fontWeight: "600",
                  padding: "5px 10px",
                  borderRadius: "20px",
                  border: "1px solid rgba(22, 101, 52, 0.15)",
                  background: "#f0fdf4",
                  color: "#166534",
                  cursor: "pointer",
                  flexShrink: 0
                }}
              >
                {prompt}
              </button>
            ))}
          </div>

          {/* INPUT FORM */}
          <form
            onSubmit={(e) => {
              e.preventDefault();
              handleSend();
            }}
            style={{
              padding: "10px 12px",
              background: "#ffffff",
              borderTop: "1px solid rgba(0, 0, 0, 0.05)",
              display: "flex",
              gap: "8px",
              alignItems: "center"
            }}
          >
            <input
              type="text"
              value={input}
              onChange={(e) => setInput(e.target.value)}
              placeholder="Ask anything (e.g. Cotton fertilizer, Tomato blight)..."
              style={{
                flex: 1,
                padding: "10px 14px",
                borderRadius: "12px",
                border: "1px solid rgba(0, 0, 0, 0.12)",
                fontSize: "13px",
                outline: "none"
              }}
            />
            <button
              type="submit"
              disabled={!input.trim()}
              style={{
                width: "38px",
                height: "38px",
                borderRadius: "12px",
                background: input.trim() ? "#166534" : "#e2e8f0",
                color: input.trim() ? "#ffffff" : "#94a3b8",
                border: "none",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                cursor: input.trim() ? "pointer" : "default",
                transition: "all 0.2s ease"
              }}
            >
              <Send size={16} />
            </button>
          </form>
        </div>
      )}

      {/* FLOATING TRIGGER BUTTON */}
      <button
        onClick={() => setIsOpen(!isOpen)}
        style={{
          width: "60px",
          height: "60px",
          borderRadius: "50%",
          background: "linear-gradient(135deg, #104c26 0%, #16a34a 60%, #84cc16 100%)",
          color: "#ffffff",
          border: "2px solid rgba(255, 255, 255, 0.8)",
          boxShadow: "0 10px 25px rgba(22, 101, 52, 0.4), 0 0 15px rgba(163, 230, 53, 0.4)",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          cursor: "pointer",
          position: "relative",
          transition: "transform 0.25s cubic-bezier(0.175, 0.885, 0.32, 1.275)"
        }}
        onMouseEnter={(e) => (e.currentTarget.style.transform = "scale(1.08)")}
        onMouseLeave={(e) => (e.currentTarget.style.transform = "scale(1)")}
        title="AgriNova AI Copilot"
      >
        {isOpen ? <X size={26} /> : <Bot size={26} />}
        {!isOpen && (
          <span
            style={{
              position: "absolute",
              top: "-2px",
              right: "-2px",
              width: "14px",
              height: "14px",
              borderRadius: "50%",
              backgroundColor: "#a3e635",
              border: "2px solid #ffffff"
            }}
          />
        )}
      </button>
    </div>
  );
}
