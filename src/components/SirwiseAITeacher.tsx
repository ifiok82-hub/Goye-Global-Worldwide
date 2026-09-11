import React, { useState, useEffect, useRef } from "react";
import { X, Send, Bot, Sparkles, Globe, DollarSign, Award, CheckCircle, Lock } from "lucide-react";

export default function SirwiseAITeacher({ isOpen, onClose }: any) {
  const checkEnrolledStatus = (): boolean => {
    try {
      const isPaid = localStorage.getItem("sirwise_paid") === "true";
      const isVerified = localStorage.getItem("payment_verified") === "true";
      const isUnlocked = localStorage.getItem("academy_unlocked") === "true";
      const isEnrolled = localStorage.getItem("is_enrolled") === "true";
      const isAdmin = localStorage.getItem("is_admin") === "true";
      return isPaid || isVerified || isUnlocked || isEnrolled || isAdmin;
    } catch (e) {
      return false;
    }
  };

  const [isEnrolled, setIsEnrolled] = useState<boolean>(checkEnrolledStatus());
  const [messages, setMessages] = useState<{role: "user" | "ai", content: string}[]>([
    { 
      role: "ai", 
      content: "Hello! I am Sirwise AI, your global Master Tutor! 🤖🌐\nI speak English, Français, Español, and Pidgin!\n\nWelcome to Sirwise AI Web3 Academy (8 Global Modules) recognized in 190+ countries.\nHow can I guide you today? Say 'Start Module 1', 'How to earn $1000/mo', or pick a topic below!" 
    }
  ]);
  const [input, setInput] = useState("");
  const [isTyping, setIsTyping] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    setIsEnrolled(checkEnrolledStatus());
    const handleUnlocked = () => setIsEnrolled(true);
    window.addEventListener("academyUnlocked", handleUnlocked);
    return () => window.removeEventListener("academyUnlocked", handleUnlocked);
  }, []);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages, isTyping]);

  if (!isOpen) return null;

  const sirwiseKnowledge: Record<string, string> = {
    "m1": "MODULE 1: AI & Prompt Engineering Mastery 🚀\nMaster ChatGPT, Claude, and Gemini prompts for homework assistance, research, and prompt building for global businesses. Includes 50+ viral prompts to supercharge your productivity worldwide!",
    "m2": "MODULE 2: Generative AI for Business & Content Creation 🎨\nCreate logos, videos, websites, and social media media with AI without coding. Learn to package services on Fiverr, Upwork, and social media to earn $500–$2,000/month globally!",
    "m3": "MODULE 3: No-Code AI Automation & Digital Assets ⚙️\nBuild custom AI bots, Notion productivity dashboards, and automated business workflows using Zapier & Make.com. Create digital assets to sell globally on autopilot!",
    "m4": "MODULE 4: Web3 Fundamentals & Blockchain for Everyone 🔗\nUnderstand blockchain, Metamask crypto wallets, smart contracts, and Web3 jobs in the USA, UAE, UK, and Singapore — completely jargon-free for beginners!",
    "m5": "MODULE 5: Web3 & Cyber Safety - Global Security Standard 🛡️\nMaster online security, digital identity, scam protection, 2FA, and CISSP cybersecurity fundamentals to safeguard your digital assets globally.",
    "m6": "MODULE 6: Crypto, DeFi & Pi Network GCV $314,159 🌐\nDeep dive into Pi Network Global Consensus Value ($314,159), DeFi yield staking, USDC Ethereum transactions, and building wealth in the global Pi community!",
    "m7": "MODULE 7: Digital Marketing & Remote Income - Work From Anywhere 💼\nSet up winning Fiverr, Upwork, and LinkedIn profiles. Use our proposal templates to pitch $49.99 - $500 AI services and earn USD from Nigeria, India, USA, or anywhere!",
    "m8": "MODULE 8: Capstone Showcase & Global Career Launch 🎓\nSubmit your final portfolio project, get peer-reviewed, and download your official Blockchain Verified E-Certificate (RC BN3583773) with QR code verification at www.gasv.store/verify!",
    "pidgin": "Howfar my friend! 🇳🇬 No shaking! Sirwise AI dey here to sharp your brain with AI & Web3 skills! Complete our 8 modules make you fit sharp money in USD ($500-$2000/month) on Fiverr & Upwork. Sharp questions? Ask me now!",
    "francais": "Bonjour! 🇫🇷 Je suis Sirwise AI, votre tuteur mondial. Notre Académie AI & Web3 comprend 8 modules internationaux. Vous apprendrez le Prompt Engineering, l'IA Générative, et comment gagner des dollars ($500-$2000/mois) en ligne!",
    "espanol": "¡Hola! 🇪🇸 Soy Sirwise AI, tu tutor global. Nuestra Academia AI & Web3 incluye 8 módulos reconocidos en más de 190 países. ¡Aprende ingeniería de prompts, Web3 y genera ingresos remotos en USD!"
  };

  const getAIResponse = (userMessage: string): string => {
    const lower = userMessage.toLowerCase();
    
    if (lower.includes("pay") || lower.includes("free") || lower.includes("cost") || lower.includes("price") || lower.includes("fee") || lower.includes("how much") || lower.includes("enroll") || lower.includes("unlock")) {
      return "Sirwise AI Web3 Academy offers Lifetime Access to all 8 Global Modules for just $49.99 USD (NGN 74,985) — Compare to $299 elsewhere!\n\n🌐 We support 100% SECURE SSL ENCRYPTED payments worldwide:\n- Paystack (Debit/Credit Cards & Bank Transfer)\n- Flutterwave (African & Global Cards)\n- PayPal (Instant USD Transfer)\n- Crypto USDC (Base Network) / USDT (BNB Smart Chain - BEP20)\n- Pi Network GCV $314,159\n- Direct OPay Bank Transfer (Account: 611 354 1882 GOYEDAGOSMESS ENTERPRISE)\n\nSupport Email: goyedagosmess@gmail.com\nClick 'Unlock Now' to enrol instantly!";
    }

    if (lower.includes("pidgin")) return sirwiseKnowledge["pidgin"];
    if (lower.includes("francais") || lower.includes("french") || lower.includes("bonjour")) return sirwiseKnowledge["francais"];
    if (lower.includes("espanol") || lower.includes("spanish") || lower.includes("hola")) return sirwiseKnowledge["espanol"];

    // Gating check for guest / unpaid users on deep lesson requests
    const isDeepLessonQuery = 
      lower.includes("module") || 
      lower.includes("prompt") || 
      lower.includes("chatgpt") || 
      lower.includes("generative") || 
      lower.includes("fiverr") || 
      lower.includes("automation") || 
      lower.includes("no-code") || 
      lower.includes("blockchain") || 
      lower.includes("metamask") || 
      lower.includes("cyber") || 
      lower.includes("security") || 
      lower.includes("pi") || 
      lower.includes("gcv") || 
      lower.includes("crypto") || 
      lower.includes("defi") || 
      lower.includes("marketing") || 
      lower.includes("remote") || 
      lower.includes("earn") || 
      lower.includes("usd") || 
      lower.includes("income") || 
      lower.includes("capstone") || 
      lower.includes("certificate") ||
      lower.includes("lesson") ||
      lower.includes("teach") ||
      lower.includes("exercise") ||
      lower.includes("how to");

    if (!isEnrolled && isDeepLessonQuery) {
      return "To unlock full interactive step-by-step tutoring across all 8 modules, please complete your Academy enrollment above.";
    }

    if (lower.includes("module 1") || lower.includes("prompt") || lower.includes("chatgpt")) return sirwiseKnowledge["m1"];
    if (lower.includes("module 2") || lower.includes("generative") || lower.includes("fiverr")) return sirwiseKnowledge["m2"];
    if (lower.includes("module 3") || lower.includes("automation") || lower.includes("no-code")) return sirwiseKnowledge["m3"];
    if (lower.includes("module 4") || lower.includes("blockchain") || lower.includes("metamask")) return sirwiseKnowledge["m4"];
    if (lower.includes("module 5") || lower.includes("cyber") || lower.includes("safety") || lower.includes("security")) return sirwiseKnowledge["m5"];
    if (lower.includes("module 6") || lower.includes("pi") || lower.includes("gcv") || lower.includes("crypto") || lower.includes("defi")) return sirwiseKnowledge["m6"];
    if (lower.includes("module 7") || lower.includes("marketing") || lower.includes("remote") || lower.includes("earn") || lower.includes("usd") || lower.includes("income")) return sirwiseKnowledge["m7"];
    if (lower.includes("module 8") || lower.includes("capstone") || lower.includes("certificate")) return sirwiseKnowledge["m8"];

    return "Excellent question about " + userMessage + "! 🌟 As your global Sirwise AI tutor, I guide you across our 8 international modules. Whether you want to master prompt engineering, build AI automations, navigate Pi Network GCV ($314k), or earn $500–$2000/month remotely, I am here 24/7! What specific module or skill would you like to explore?";
  };

  const handleSend = (text: string) => {
    if (!text.trim()) return;
    const newMessages = [...messages, { role: "user" as const, content: text }];
    setMessages(newMessages);
    setInput("");
    setIsTyping(true);

    setTimeout(() => {
      const response = getAIResponse(text);
      setMessages([...newMessages, { role: "ai", content: response }]);
      setIsTyping(false);
    }, 600);
  };

  return (
    <div className="fixed bottom-[90px] right-[10px] w-[92%] max-w-[420px] h-[72vh] bg-[#111] border-2 border-[#FFD700] rounded-3xl z-[1000] flex flex-col shadow-2xl overflow-hidden pointer-events-auto">
      <div className="bg-[#FFD700] p-4 flex items-center justify-between">
        <div className="flex items-center gap-2">
          <div className="relative">
            <Bot size={24} className="text-black" />
            <div className="absolute -bottom-1 -right-1 w-3.5 h-3.5 bg-green-500 rounded-full border-2 border-[#FFD700] animate-pulse" />
          </div>
          <div>
            <span className="font-black text-black text-sm block leading-tight">Sirwise AI Global Tutor 🌍</span>
            <span className="text-[10px] text-black font-bold flex items-center gap-1">
              {isEnrolled ? (
                <><CheckCircle size={10} className="text-emerald-800" /> Verified Enrolled Student</>
              ) : (
                <><Lock size={10} className="text-amber-800" /> Guest Mode • Enrollment Required</>
              )}
            </span>
          </div>
        </div>
        <button onClick={onClose} className="text-black hover:bg-black/10 p-1.5 rounded-full cursor-pointer pointer-events-auto z-10"><X size={20}/></button>
      </div>

      <div className="flex-1 overflow-y-auto p-4 flex flex-col gap-3 bg-[#0a0a0a]">
        {messages.map((msg, i) => (
          <div key={i} className={"max-w-[88%] rounded-2xl p-3.5 text-xs leading-relaxed whitespace-pre-wrap " + (msg.role === "ai" ? "bg-[#222] text-white self-start rounded-tl-sm border border-[#333]" : "bg-[#FFD700] text-black font-bold self-end rounded-tr-sm")}>
            {msg.content}
            {msg.role === "ai" && msg.content.includes("To unlock full interactive step-by-step tutoring") && (
              <button 
                onClick={() => {
                  onClose();
                  if ((window as any).goToAcademyPaywall) {
                    (window as any).goToAcademyPaywall();
                  } else {
                    window.location.hash = "#academy";
                  }
                }}
                className="mt-3 w-full bg-[#FFD700] hover:bg-[#ffe033] text-black font-extrabold py-2 px-3 rounded-xl text-xs flex items-center justify-center gap-1.5 shadow-md transition cursor-pointer pointer-events-auto"
              >
                <Sparkles size={14} /> 🚀 Complete Enrollment $49.99 Now
              </button>
            )}
          </div>
        ))}
        {isTyping && (
          <div className="bg-[#222] text-[#FFD700] self-start rounded-2xl rounded-tl-sm py-2.5 px-4 border border-[#333] text-xs font-bold flex items-center gap-2 animate-pulse">
            <Bot size={14} /> Sirwise AI is analyzing globally... 🧠
          </div>
        )}
        <div ref={messagesEndRef} />
      </div>

      <div className="p-3 border-t border-[#333] bg-[#111]">
        <div className="flex gap-2 overflow-x-auto pb-2 hide-scrollbar">
          {["Start Module 1 🚀", "Earn $1000/mo 💰", "Pi Network GCV 🌐", "Teach in Pidgin 🇳🇬", "En Français 🇫🇷", "En Español 🇪🇸"].map((tag, i) => (
            <button key={i} onClick={() => handleSend(tag)} className="whitespace-nowrap bg-[#222] hover:bg-[#333] text-[#FFD700] border border-[#444] px-3 py-1.5 rounded-full text-[10px] font-bold cursor-pointer pointer-events-auto transition">
              {tag}
            </button>
          ))}
        </div>
        <div className="flex gap-2 items-center mt-1">
          <input 
            type="text" 
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyPress={(e) => e.key === "Enter" && handleSend(input)}
            placeholder="Ask Sirwise AI Tutor in any language..."
            className="flex-1 bg-black border border-[#333] rounded-xl py-2.5 px-3 text-white text-xs outline-none focus:border-[#FFD700] pointer-events-auto"
          />
          <button onClick={() => handleSend(input)} className="bg-[#FFD700] text-black p-2.5 rounded-xl cursor-pointer pointer-events-auto hover:bg-[#ffe033]">
            <Send size={16} />
          </button>
        </div>
      </div>
    </div>
  );
}
