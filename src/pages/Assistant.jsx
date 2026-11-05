import { useState, useRef, useEffect } from "react";
import {
  Bot,
  Send,
  Sparkles,
  Volume2,
  VolumeX,
  Copy,
  Check,
  RotateCcw,
  Lightbulb,
  Droplets,
  Sprout,
  TrendingUp,
  ShieldAlert,
  Flame,
  User,
  ArrowRight
} from "lucide-react";
import Navbar from "../components/Navbar";

const PROMPT_CATEGORIES = [
  {
    category: "Crop Nutrition & NPK",
    icon: <Sprout size={16} color="#16a34a" />,
    prompts: [
      "Calculate optimal NPK ratio for Bt Cotton in black soil",
      "How to correct Zinc deficiency in Basmati Paddy?",
      "Best organic bio-fertilizer mix for high vegetable yield"
    ]
  },
  {
    category: "Pest & Pathogen Control",
    icon: <ShieldAlert size={16} color="#ef4444" />,
    prompts: [
      "Immediate cure for Early Blight in Hybrid Tomato",
      "Organic management of Pink Bollworm in Cotton",
      "Preventive foliar spray schedule before monsoon showers"
    ]
  },
  {
    category: "Market Timing & Profit",
    icon: <TrendingUp size={16} color="#f59e0b" />,
    prompts: [
      "Mandi price forecast for Guntur Teja Chili this month",
      "Is now the right time to sell wheat or hold in cold storage?",
      "How to find highest paying APMC mandi for vegetable produce"
    ]
  },
  {
    category: "Precision Irrigation",
    icon: <Droplets size={16} color="#0284c7" />,
    prompts: [
      "Drip irrigation schedule for summer season crops",
      "How to measure soil moisture without expensive sensors?",
      "Preventing flower drop during sudden high temperature spikes"
    ]
  }
];

const EXPERT_KNOWLEDGE = {
  cotton_npk: {
    match: ["cotton", "npk", "fertilizer", "dose", "black soil"],
    title: "Cotton Precision Nutrition Plan",
    text: `### 🌿 Bt Cotton Precision Nutrition Protocol:
- **Recommended Ratio**: 120 : 60 : 60 kg N-P-K per Hectare (for irrigated hybrid).
- **Basal Dressing**: Apply 100% of Phosphorus (DAP/SSP) and 50% of Potassium (MOP) at land preparation.
- **Split Nitrogen Strategy**:
  1. *30 Days (Vegetative)*: 50% Nitrogen (Urea) along with 5kg Zinc Sulphate per acre.
  2. *60 Days (Squaring/Budding)*: 25% Nitrogen + 25% Potassium.
  3. *90 Days (Boll Formation)*: Remaining 25% Nitrogen + 25% Potassium.
- **Foliar Secret**: Spray 1% **Potassium Nitrate (13-0-45)** + 1g Boron/L water during flowering. This reduces boll shedding by up to 34%!`
  },
  tomato_blight: {
    match: ["blight", "tomato", "leaf spot", "fungus"],
    title: "Tomato Early & Late Blight Protocol",
    text: `### 🍅 Tomato Blight Rapid Intervention:
1. **Diagnosis**: Dark water-soaked concentric lesions with yellow halos (Early Blight) or white fuzzy mold under damp leaves (Late Blight).
2. **Immediate Chemical Treatment**:
   - Spray **Azoxystrobin 18.2% + Difenoconazole 11.4% SC** @ 1ml/L water, OR
   - **Metalaxyl 8% + Mancozeb 64% WP** (Ridomil MZ @ 2.5g/L water).
3. **Biological / Organic Alternative**:
   - Spray *Trichoderma viride* (10g/L) mixed with 5ml cold-pressed Neem oil.
4. **Cultural Control**: Prune infected leaves up to 30cm above soil line to eliminate soil splash spores.`
  },
  chili_mandi: {
    match: ["chili", "chilli", "guntur", "price", "mandi", "market", "sell"],
    title: "Guntur Chili APMC Market Intelligence",
    text: `### 🌶️ Guntur Teja / 334 Chili Market Outlook:
- **Current Modal Rate**: **₹18,200 – ₹19,600 / Quintal** (High grade cold-storage stock).
- **Trend Forecast**: **Bullish (+4.5% to +6%)** over the next 15 days due to intense procurement demand from Southeast Asian export contracts.
- **Trader Strategy**:
  - If your moisture is below **10%**, hold stock for early festival procurement peak.
  - If moisture is >12%, sell 50% immediately to avoid fungal aflatoxin discount in open auction yards.`
  },
  irrigation_schedule: {
    match: ["drip", "irrigation", "water", "schedule", "summer"],
    title: "Precision Drip Irrigation Architecture",
    text: `### 💧 Micro-Irrigation Schedule for Summer:
- **Operational Window**: Early morning (5:30 AM – 8:30 AM) to curb evaporative transpiration losses.
- **Vegetable Cycles (Tomatoes/Chilies)**: 4 to 6 Litres per emitter every alternate day during fruit bulking.
- **Cotton / Field Crops**: 2 to 3 hours run-time every 3 days in sandy loam; every 5 days in heavy black clay.
- **Mulching Advantage**: Silver-black polyethylene mulch (25 micron) cuts water consumption by 40% and keeps root rhizosphere 4°C cooler.`
  }
};

export default function Assistant() {
  const [messages, setMessages] = useState([
    {
      id: "intro",
      sender: "bot",
      text: "Hello! I am your AgriNova AI Agronomist. Powered by real-time crop pathology models and APMC market intelligence. What crop challenges can we solve today?",
      timestamp: "Ready"
    }
  ]);
  const [input, setInput] = useState("");
  const [isTyping, setIsTyping] = useState(false);
  const [isSpeaking, setIsSpeaking] = useState(false);
  const [copiedId, setCopiedId] = useState(null);
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
    const clean = text.replace(/[*#•_]/g, "");
    const utter = new SpeechSynthesisUtterance(clean);
    utter.rate = 1.0;
    utter.onend = () => setIsSpeaking(false);
    utter.onerror = () => setIsSpeaking(false);
    setIsSpeaking(true);
    window.speechSynthesis.speak(utter);
  };

  const copyMessage = (id, text) => {
    navigator.clipboard.writeText(text);
    setCopiedId(id);
    setTimeout(() => setCopiedId(null), 2000);
  };

  const handleSend = (textInput) => {
    const query = textInput || input;
    if (!query.trim()) return;

    const userMsg = {
      id: Date.now().toString(),
      sender: "user",
      text: query,
      timestamp: new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" })
    };

    setMessages(prev => [...prev, userMsg]);
    if (!textInput) setInput("");
    setIsTyping(true);

    setTimeout(() => {
      const qLower = query.toLowerCase();
      let responseText = "";

      if (qLower.includes("cotton") || qLower.includes("npk") || qLower.includes("fertilizer") || qLower.includes("dose")) {
        responseText = EXPERT_KNOWLEDGE.cotton_npk.text;
      } else if (qLower.includes("blight") || qLower.includes("tomato") || qLower.includes("disease") || qLower.includes("spot")) {
        responseText = EXPERT_KNOWLEDGE.tomato_blight.text;
      } else if (qLower.includes("chili") || qLower.includes("chilli") || qLower.includes("mandi") || qLower.includes("price") || qLower.includes("sell") || qLower.includes("market")) {
        responseText = EXPERT_KNOWLEDGE.chili_mandi.text;
      } else if (qLower.includes("drip") || qLower.includes("water") || qLower.includes("irrigation") || qLower.includes("moisture")) {
        responseText = EXPERT_KNOWLEDGE.irrigation_schedule.text;
      } else {
        responseText = `### 🌾 AgriNova Agronomic Advisory for "${query}":\n\n- **Field Protocol**: Maintain balanced soil fertility using verified soil test parameters.\n- **Preventive Care**: Regularly scout the undersides of leaves early morning for sucking pests (whiteflies, thrips, jassids).\n- **Foliar Nutrition**: Apply Seaweed extract or Bio-stimulants during vegetative transitions to strengthen plant vigor against heat shock.\n\n*Need tailored calculations? Ask for specific acreage dosage or current mandi price projections.*`;
      }

      setMessages(prev => [
        ...prev,
        {
          id: (Date.now() + 1).toString(),
          sender: "bot",
          text: responseText,
          timestamp: new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" })
        }
      ]);
      setIsTyping(false);
    }, 800);
  };

  return (
    <div className="assistant-page-wrapper">
      <Navbar />

      <main className="assistant-main-content">
        {/* ========================================
            HEADER ROW
        ======================================== */}
        <div className="assistant-header-cluster">
          <div>
            <div className="live-status-pill">
              <span className="pulse-dot" />
              <span>GEN-AI AGRONOMIST 2.0</span>
            </div>
            <h1>Autonomous AI Farming Intelligence</h1>
            <p>
              Direct consultation with our agronomy neural models. Ask questions
              about soil testing, chemical dosages, IPM pest control, and mandi trade timings.
            </p>
          </div>

          <button
            onClick={() =>
              setMessages([
                {
                  id: "reset",
                  sender: "bot",
                  text: "Conversation refreshed. What crop challenge can I help diagnose today?",
                  timestamp: "Ready"
                }
              ])
            }
            className="btn-icon-refresh"
            title="Reset Conversation"
          >
            <RotateCcw size={16} />
            <span>New Chat</span>
          </button>
        </div>

        {/* ========================================
            PROMPT SUGGESTION TILES (GEN-Z UI)
        ======================================== */}
        <div className="assistant-prompts-grid">
          {PROMPT_CATEGORIES.map((cat, idx) => (
            <div key={idx} className="prompt-category-card glass-panel">
              <div className="cat-title-row">
                {cat.icon}
                <strong>{cat.category}</strong>
              </div>
              <div className="cat-prompts-list">
                {cat.prompts.map((p, pIdx) => (
                  <button
                    key={pIdx}
                    onClick={() => handleSend(p)}
                    className="prompt-pill-action"
                  >
                    <span>{p}</span>
                    <ArrowRight size={13} />
                  </button>
                ))}
              </div>
            </div>
          ))}
        </div>

        {/* ========================================
            CONVERSATION TERMINAL BOX
        ======================================== */}
        <div className="assistant-chat-container glass-panel">
          <div className="chat-terminal-header">
            <div className="bot-status-cluster">
              <div className="bot-avatar-glowing">
                <Bot size={20} color="#a3e635" />
              </div>
              <div>
                <strong>AgriNova Autonomous Copilot</strong>
                <small>Connected to Crop Vision & APMC Knowledge Graph</small>
              </div>
            </div>

            <div className="chat-terminal-actions">
              <button
                onClick={() => speakText(messages[messages.length - 1]?.text || "")}
                className={`terminal-action-btn ${isSpeaking ? "active" : ""}`}
                title={isSpeaking ? "Stop voice" : "Read aloud response"}
              >
                {isSpeaking ? <VolumeX size={16} /> : <Volume2 size={16} />}
                <span>{isSpeaking ? "Stop Audio" : "Voice Readout"}</span>
              </button>
            </div>
          </div>

          <div className="chat-messages-scroll-area">
            {messages.map((msg) => (
              <div
                key={msg.id}
                className={`chat-bubble-row ${msg.sender === "user" ? "user-row" : "bot-row"}`}
              >
                <div className="bubble-avatar">
                  {msg.sender === "user" ? <User size={16} /> : <Bot size={16} />}
                </div>

                <div className="bubble-content-box">
                  <div className="bubble-header-meta">
                    <strong>{msg.sender === "user" ? "You" : "AgriNova Copilot"}</strong>
                    <small>{msg.timestamp}</small>
                  </div>

                  <div className="bubble-text-body">
                    {msg.text}
                  </div>

                  {msg.sender === "bot" && (
                    <div className="bubble-footer-actions">
                      <button
                        onClick={() => copyMessage(msg.id, msg.text)}
                        className="btn-copy-bubble"
                        title="Copy to clipboard"
                      >
                        {copiedId === msg.id ? <Check size={14} color="#16a34a" /> : <Copy size={14} />}
                        <span>{copiedId === msg.id ? "Copied" : "Copy Advice"}</span>
                      </button>
                    </div>
                  )}
                </div>
              </div>
            ))}

            {isTyping && (
              <div className="chat-bubble-row bot-row">
                <div className="bubble-avatar">
                  <Bot size={16} />
                </div>
                <div className="bubble-content-box typing-box">
                  <span className="pulse-dot" />
                  <span>Synthesizing agricultural protocol...</span>
                </div>
              </div>
            )}
            <div ref={messagesEndRef} />
          </div>

          {/* INPUT BAR */}
          <form
            onSubmit={(e) => {
              e.preventDefault();
              handleSend();
            }}
            className="assistant-input-form"
          >
            <input
              type="text"
              value={input}
              onChange={(e) => setInput(e.target.value)}
              placeholder="Ask anything (e.g. Cotton NPK ratio, Tomato blight, Mandi price predictions)..."
              className="assistant-text-input"
            />
            <button
              type="submit"
              disabled={!input.trim()}
              className="assistant-submit-btn"
            >
              <span>Ask Copilot</span>
              <Send size={16} />
            </button>
          </form>
        </div>
      </main>
    </div>
  );
}
