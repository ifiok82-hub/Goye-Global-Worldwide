import React, { useState, useEffect, useRef } from 'react';
import { X, Send, Bot, Lock, CheckCircle } from 'lucide-react';

export default function SirwiseAITeacher({ isOpen, onClose, userAccessStatus, onUnlockClick }: any) {
  const [messages, setMessages] = useState<{role: 'user' | 'ai', content: string}[]>([
    { role: 'ai', content: "Hello! I'm your Sirwise AI Teacher. I can help you with orientation or answer basic questions about our Web3 Academy." }
  ]);
  const [input, setInput] = useState('');
  const [queriesUsed, setQueriesUsed] = useState(0);
  const [isTyping, setIsTyping] = useState(false);
  
  const messagesEndRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  if (!isOpen) return null;

  const handleSend = () => {
    if (!input.trim()) return;

    if (userAccessStatus === 'free' && queriesUsed >= 3) {
      return;
    }

    const newMessages = [...messages, { role: 'user' as const, content: input }];
    setMessages(newMessages);
    setInput('');
    setIsTyping(true);

    if (userAccessStatus === 'free') {
      const newQueries = queriesUsed + 1;
      setQueriesUsed(newQueries);
      
      setTimeout(() => {
        if (newQueries >= 3) {
          setMessages([...newMessages, { role: 'ai', content: "You've reached the limit of your free preview." }]);
        } else {
          setMessages([...newMessages, { role: 'ai', content: "That's a great question! As a preview, I can tell you that Web3 is the future of decentralized internet. For full masterclass answers, please unlock unlimited access." }]);
        }
        setIsTyping(false);
      }, 1000);
    } else {
      setTimeout(() => {
        setMessages([...newMessages, { role: 'ai', content: "As an unlimited member, here is the full detailed breakdown: Our academy modules cover advanced Solidity, smart contracts, and full AI integrations into decentralized networks." }]);
        setIsTyping(false);
      }, 1000);
    }
  };

  const remaining = Math.max(0, 3 - queriesUsed);
  const isLocked = userAccessStatus === 'free' && queriesUsed >= 3;

  return (
    <div className="fixed inset-0 bg-black/80 z-[10000] flex items-center justify-center p-4">
      <div className="bg-[#111] border border-[#333] rounded-2xl w-full max-w-md h-[80vh] flex flex-col relative overflow-hidden shadow-[0_0_40px_rgba(255,215,0,0.1)]">
        
        {/* Header */}
        <div className="bg-[#000] border-b border-[#333] p-4 flex items-center justify-between z-10">
          <div className="flex items-center gap-3">
            <div className="bg-[#FFD700] text-black w-10 h-10 rounded-full flex items-center justify-center">
              <Bot size={20} />
            </div>
            <div>
              <h2 className="text-white font-bold text-sm leading-tight">Sirwise AI Teacher 🤖</h2>
              <div className="text-[10px] text-gray-400 font-bold">
                {userAccessStatus === 'free' ? 
                  <span className="text-[#FFD700]">Free Preview Mode ({remaining} Queries Left)</span> : 
                  <span className="text-[#10B981]">Unlimited Access Granted</span>
                }
              </div>
            </div>
          </div>
          <button onClick={onClose} className="text-gray-500 hover:text-white transition">
            <X size={20} />
          </button>
        </div>

        {/* Chat Area */}
        <div className="flex-1 overflow-y-auto p-4 space-y-4">
          {messages.map((msg, idx) => (
            <div key={idx} className={`flex ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}>
              <div className={`max-w-[80%] p-3 rounded-2xl text-sm ${
                msg.role === 'user' 
                ? 'bg-[#FFD700] text-black rounded-tr-none font-medium' 
                : 'bg-[#222] text-white rounded-tl-none border border-[#333]'
              }`}>
                {msg.content}
              </div>
            </div>
          ))}
          {isTyping && (
            <div className="flex justify-start">
              <div className="bg-[#222] text-gray-400 p-3 rounded-2xl rounded-tl-none border border-[#333] text-sm flex gap-1">
                <span className="animate-bounce">.</span>
                <span className="animate-bounce delay-100">.</span>
                <span className="animate-bounce delay-200">.</span>
              </div>
            </div>
          )}
          
          {isLocked && (
            <div className="mt-4 bg-[#0a0a0a] border border-[#FFD700] rounded-xl p-5 text-center shadow-lg animate-in fade-in slide-in-from-bottom-4">
              <Lock className="text-[#FFD700] mx-auto mb-3" size={32} />
              <h3 className="text-white font-bold mb-2 text-sm leading-tight">🔒 Unlock Unlimited Access to Sirwise AI Teacher!</h3>
              <p className="text-gray-400 text-xs mb-4">Complete any course enrollment or academy pass on gasv.store to get 24/7 full access.</p>
              <button 
                onClick={onUnlockClick}
                className="w-full bg-[#FFD700] text-black font-bold py-3 rounded-xl flex items-center justify-center gap-2 hover:bg-[#e6c200] transition"
              >
                Unlock Now / Pay via Paystack
              </button>
            </div>
          )}
          
          <div ref={messagesEndRef} />
        </div>

        {/* Input Area */}
        <div className="p-4 bg-[#0a0a0a] border-t border-[#333]">
          <div className="relative">
            <input 
              type="text" 
              placeholder={isLocked ? "Access Locked..." : "Ask your AI Teacher..."}
              className="w-full bg-[#111] border border-[#333] text-white text-sm p-4 rounded-xl pr-12 focus:border-[#FFD700] outline-none disabled:opacity-50"
              value={input}
              onChange={(e) => setInput(e.target.value)}
              onKeyDown={(e) => e.key === 'Enter' && handleSend()}
              disabled={isLocked || isTyping}
            />
            <button 
              onClick={handleSend}
              disabled={isLocked || isTyping || !input.trim()}
              className="absolute right-2 top-1/2 -translate-y-1/2 p-2 bg-[#222] text-[#FFD700] rounded-lg disabled:opacity-50 disabled:text-gray-600 hover:bg-[#333] transition"
            >
              <Send size={18} />
            </button>
          </div>
        </div>

      </div>
    </div>
  );
}
