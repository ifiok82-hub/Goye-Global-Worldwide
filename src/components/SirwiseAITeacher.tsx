import React, { useState, useEffect, useRef } from 'react';
import { X, Send, Bot } from 'lucide-react';

export default function SirwiseAITeacher({ isOpen, onClose }: any) {
  const [messages, setMessages] = useState<{role: 'user' | 'ai', content: string}[]>([
    { role: 'ai', content: "Hello! I'm Sirwise AI! Ready to teach AI & Prompting, Digital Creation, Web3 & Cyber Safety for global pupils 24/7! Say Start Lesson 1" }
  ]);
  const [input, setInput] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages, isTyping]);

  if (!isOpen) return null;

  const handleSend = (text: string) => {
    if (!text.trim()) return;
    const newMessages = [...messages, { role: 'user' as const, content: text }];
    setMessages(newMessages);
    setInput('');
    setIsTyping(true);

    setTimeout(() => {
      let response = "That's an interesting idea! Let's explore that with AI. What else would you like to learn about?";
      const lowerText = text.toLowerCase();
      if (lowerText.includes('start lesson 1') || lowerText.includes('ai basics')) {
        response = "Lesson 1: AI Basics! AI stands for Artificial Intelligence. It's like giving computers a brain to learn and help us. Can you think of one thing AI helps us with every day?";
      } else if (lowerText.includes('digital creation')) {
        response = "Lesson 2: Digital Creation! You can create art, stories, and videos using digital tools. What would you like to create first?";
      } else if (lowerText.includes('web3') || lowerText.includes('cyber')) {
        response = "Lesson 3: Web3 & Cyber Safety! Web3 is the next internet where you own what you create. Always remember to keep your passwords secret! Are you ready to secure your digital wallet?";
      } else if (lowerText.includes('final project')) {
        response = "Lesson 4: Final Project! Let's build your Capstone. Will it be an AI storybook or a digital gallery? Tell me your idea!";
      } else if (lowerText.includes('tree') || lowerText.includes('story') || lowerText.includes('art')) {
        response = "Great! Let's create a beautiful digital art piece or story with AI! Step 1: Think of a prompt like 'A magical tree with golden leaves'. Ready to try?";
      }

      setMessages([...newMessages, { role: 'ai', content: response }]);
      setIsTyping(false);
    }, 1000);
  };

  return (
    <div className="fixed bottom-[90px] right-[10px] w-[90%] max-w-[400px] h-[70vh] bg-[#111] border-2 border-[#FFD700] rounded-3xl z-[1000] flex flex-col shadow-2xl overflow-hidden pointer-events-auto">
      <div className="bg-[#FFD700] p-4 flex items-center justify-between">
        <div className="flex items-center gap-2">
          <div className="relative">
            <Bot size={24} className="text-black" />
            <div className="absolute -bottom-1 -right-1 w-3 h-3 bg-green-500 rounded-full border-2 border-[#FFD700]" />
          </div>
          <span className="font-black text-black text-sm">Sirwise AI Tutor Online</span>
        </div>
        <button onClick={onClose} className="text-black hover:bg-black/10 p-1 rounded-full"><X size={20}/></button>
      </div>

      <div className="flex-1 overflow-y-auto p-4 flex flex-col gap-4 bg-[#0a0a0a]">
        {messages.map((msg, i) => (
          <div key={i} className={`max-w-[85%] rounded-2xl p-3 text-sm ${msg.role === 'ai' ? 'bg-[#222] text-white self-start rounded-tl-sm border border-[#333]' : 'bg-[#FFD700] text-black font-bold self-end rounded-tr-sm'}`}>
            {msg.content}
          </div>
        ))}
        {isTyping && (
          <div className="bg-[#222] text-gray-400 self-start rounded-2xl rounded-tl-sm py-3 px-4 border border-[#333] text-sm">
            Sirwise AI is typing...
          </div>
        )}
        <div ref={messagesEndRef} />
      </div>

      <div className="p-3 border-t border-[#333] bg-[#111]">
        <div className="flex gap-2 overflow-x-auto pb-2 hide-scrollbar">
          {['Explain AI Basics', 'Teach Digital Creation', 'What is Web3?', 'Guide my Final Project'].map((tag, i) => (
            <button key={i} onClick={() => handleSend(tag)} className="whitespace-nowrap bg-[#222] text-[#FFD700] border border-[#333] px-3 py-1.5 rounded-full text-[10px] font-bold">
              {tag}
            </button>
          ))}
        </div>
        <div className="flex gap-2 items-center mt-1">
          <input 
            type="text" 
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyPress={(e) => e.key === 'Enter' && handleSend(input)}
            placeholder="Ask Sirwise AI..."
            className="flex-1 bg-black border border-[#333] rounded-xl py-2 px-3 text-white text-sm outline-none focus:border-[#FFD700]"
          />
          <button onClick={() => handleSend(input)} className="bg-[#FFD700] text-black p-2 rounded-xl">
            <Send size={18} />
          </button>
        </div>
      </div>
    </div>
  );
}
