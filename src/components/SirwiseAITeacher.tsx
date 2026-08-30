import React, { useState, useEffect, useRef } from "react";
import { X, Send, Bot, Sparkles } from "lucide-react";

export default function SirwiseAITeacher({ isOpen, onClose }: any) {
  const [messages, setMessages] = useState<{role: "user" | "ai", content: string}[]>([
    { role: "ai", content: "Hello! I'm Sirwise AI! 🤖 Ready to teach AI & Prompting, Digital Creation, Web3 & Cyber Safety for global pupils 24/7! Say 'Start Lesson 1' or pick a topic below!" }
  ]);
  const [input, setInput] = useState("");
  const [isTyping, setIsTyping] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages, isTyping]);

  if (!isOpen) return null;

  const sirwiseKnowledge: Record<string, string> = {
    "ai": "AI is Artificial Intelligence - Like a smart robot friend that learns! 🧠 Example: When you ask me a question, I use AI to answer. You can create art, stories, and homework with AI prompts. Try: Draw a friendly dragon in space!",
    "digital": "Digital Creation is making art, stories, videos, and graphics using digital tools! 🎨 Lesson 2: If you want to create a Tree project - Excellent! Prompt: A magical golden tree with glowing leaves, kids playing under it, sunset, cartoon style - Then use AI image tools! What story do you want to tell about the tree?",
    "tree": "Great choice! Tree! 🌳 Let's create a Tree Project:\n1. Story: Write 3 sentences about a magical tree that gives knowledge.\n2. Art: Prompt: Ancient wisdom tree with books as leaves, children reading under, vibrant colors.\n3. Web3: Your tree art can become a verified NFT credential! Want to write the story now?",
    "web3": "Web3 is the new internet where YOU own your creations! 🔐 Basics:\n- Digital Identity (your avatar & wallet)\n- Online Security (never share passwords or private keys)\n- Blockchain (tamper-proof record of your work)\n- NFT (your digital art certificate). Ready to test online safety?",
    "capstone": "Capstone Showcase is your final project! 🎓 Combine AI + Digital Creation + Web3: Create your own AI storybook or digital art gallery and present it! I guide you step by step. What project idea do you have?"
  };

  const getAIResponse = (userMessage: string): string => {
    const lower = userMessage.toLowerCase();
    if (lower.includes("pay") || lower.includes("free") || lower.includes("cost") || lower.includes("price") || lower.includes("fee") || lower.includes("how much") || lower.includes("payment")) {
      return "Sirwise AI Web3 Academy offers a 4-Week Masterclass for $49.99 (or ₦74,985 NGN). 🌐 We support multiple global payment methods:\n- Paystack (Credit/Debit Cards)\n- Flutterwave (African & Global Cards)\n- USDC Crypto (Ethereum - Metamask)\n- Pi Network GCV $314,159 (Global Pi Community)\n- Direct Bank / OPay Transfer (Account: 611 354 1882 GOYEDAGOSMESS ENTERPRISE, OPay Bank in Nigeria).\n\nYou can also earn 20% referral commissions! Click 'Unlock Now' or tap any product in the store to enrol!";
    }
    if (lower.includes("tree")) return sirwiseKnowledge["tree"];
    if (lower.includes("start lesson 1") || lower.includes("lesson 1")) {
      return "Lesson 1: AI Basics! 🤖 AI stands for Artificial Intelligence. It helps computers learn and solve problems. Prompting rule: Be specific! Instead of 'draw a dog', say 'draw a fluffy golden retriever wearing sunglasses on a skateboard'. What prompt would you create?";
    }
    if (lower.includes("start lesson 2") || lower.includes("lesson 2")) {
      return sirwiseKnowledge["digital"];
    }
    if (lower.includes("start lesson 3") || lower.includes("lesson 3")) {
      return sirwiseKnowledge["web3"];
    }
    if (lower.includes("ai")) return sirwiseKnowledge["ai"];
    if (lower.includes("digital") || lower.includes("creation") || lower.includes("art") || lower.includes("story")) return sirwiseKnowledge["digital"];
    if (lower.includes("web3") || lower.includes("cyber") || lower.includes("safety") || lower.includes("crypto")) return sirwiseKnowledge["web3"];
    if (lower.includes("capstone") || lower.includes("final") || lower.includes("project")) return sirwiseKnowledge["capstone"];

    return "Excellent question about " + userMessage + "! 🌟 As your Sirwise AI tutor, I teach you AI prompting, digital art, and Web3 safety. For " + userMessage + ", try prompt: Explain " + userMessage + " for a 12-year-old with example - What would you like to create about " + userMessage + "?";
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
    }, 800);
  };

  return (
    <div className="fixed bottom-[90px] right-[10px] w-[90%] max-w-[400px] h-[70vh] bg-[#111] border-2 border-[#FFD700] rounded-3xl z-[1000] flex flex-col shadow-2xl overflow-hidden pointer-events-auto">
      <div className="bg-[#FFD700] p-4 flex items-center justify-between">
        <div className="flex items-center gap-2">
          <div className="relative">
            <Bot size={24} className="text-black" />
            <div className="absolute -bottom-1 -right-1 w-3.5 h-3.5 bg-green-500 rounded-full border-2 border-[#FFD700] animate-pulse" />
          </div>
          <div>
            <span className="font-black text-black text-sm block leading-tight">Sirwise AI Tutor Online</span>
            <span className="text-[10px] text-black font-bold flex items-center gap-1"><Sparkles size={10}/> Excellent - Ready to Teach</span>
          </div>
        </div>
        <button onClick={onClose} className="text-black hover:bg-black/10 p-1.5 rounded-full cursor-pointer pointer-events-auto z-10"><X size={20}/></button>
      </div>

      <div className="flex-1 overflow-y-auto p-4 flex flex-col gap-3 bg-[#0a0a0a]">
        {messages.map((msg, i) => (
          <div key={i} className={"max-w-[88%] rounded-2xl p-3.5 text-xs leading-relaxed whitespace-pre-wrap " + (msg.role === "ai" ? "bg-[#222] text-white self-start rounded-tl-sm border border-[#333]" : "bg-[#FFD700] text-black font-bold self-end rounded-tr-sm")}>
            {msg.content}
          </div>
        ))}
        {isTyping && (
          <div className="bg-[#222] text-[#FFD700] self-start rounded-2xl rounded-tl-sm py-2.5 px-4 border border-[#333] text-xs font-bold flex items-center gap-2 animate-pulse">
            <Bot size={14} /> Sirwise AI is thinking... 🧠
          </div>
        )}
        <div ref={messagesEndRef} />
      </div>

      <div className="p-3 border-t border-[#333] bg-[#111]">
        <div className="flex gap-2 overflow-x-auto pb-2 hide-scrollbar">
          {["Explain AI Basics", "Teach Digital Creation", "What is Web3?", "Tree Project 🌳", "Guide my Final Project"].map((tag, i) => (
            <button key={i} onClick={() => handleSend(tag)} className="whitespace-nowrap bg-[#222] hover:bg-[#333] text-[#FFD700] border border-[#444] px-3 py-1.5 rounded-full text-[10px] font-bold cursor-pointer pointer-events-auto">
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
            placeholder="Ask Sirwise AI..."
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
