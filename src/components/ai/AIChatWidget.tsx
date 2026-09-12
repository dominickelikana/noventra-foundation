import React, { useState, useRef, useEffect } from 'react';
import { 
  MessageSquare, 
  X, 
  Send, 
  Bot, 
  Sparkles, 
  User, 
  Heart, 
  ChevronDown,
  Minimize2,
  RefreshCw
} from 'lucide-react';
import { Language } from '../../types';

interface Message {
  id: string;
  role: 'user' | 'assistant';
  text: string;
  timestamp: string;
}

interface AIChatWidgetProps {
  currentLang: Language;
  onOpenDonate: () => void;
  onOpenVolunteer: () => void;
}

export const AIChatWidget: React.FC<AIChatWidgetProps> = ({
  currentLang,
  onOpenDonate,
  onOpenVolunteer
}) => {
  const [isOpen, setIsOpen] = useState(false);
  const [inputMessage, setInputMessage] = useState('');
  const [messages, setMessages] = useState<Message[]>([
    {
      id: 'welcome',
      role: 'assistant',
      text: currentLang === 'sw'
        ? 'Habari! Karibu Noventra Charity Foundation. Mimi ni msaidizi wako wa akili unde (AI Assistant). Je, nikusaidie vipi kuhusu michango (M-Pesa 5678901), kujitolea, au miradi yetu?'
        : 'Hello and welcome to Noventra Charity Foundation! I am your AI Guide. How can I assist you today with projects, volunteer applications, or donations?',
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
    }
  ]);
  const [loading, setLoading] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const quickPrompts = currentLang === 'sw' ? [
    'Jinsi ya kuchangia kwa M-Pesa?',
    'Fomu ya kujitolea inajazwaje?',
    'Miradi mikubwa ya Noventra ni ipi?',
    'Ofisi zenu ziko wapi Dar es Salaam?'
  ] : [
    'How do I donate via Mobile Money?',
    'How do I apply as a volunteer?',
    'What are your main projects in Tanzania?',
    'Where is your headquarters located?'
  ];

  useEffect(() => {
    if (isOpen) {
      messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
    }
  }, [messages, isOpen]);

  const handleSend = async (textToSend?: string) => {
    const text = (textToSend || inputMessage).trim();
    if (!text || loading) return;

    const userMsg: Message = {
      id: `user-${Date.now()}`,
      role: 'user',
      text,
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
    };

    setMessages(prev => [...prev, userMsg]);
    setInputMessage('');
    setLoading(true);

    try {
      const res = await fetch('/api/ai/chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          message: text,
          history: messages.slice(-5).map(m => ({ role: m.role, text: m.text })),
          language: currentLang
        })
      });

      const data = await res.json();
      const botReply = data.reply || (currentLang === 'sw' 
        ? 'Asante kwa kuwasiliana na Noventra Foundation.' 
        : 'Thank you for reaching out to Noventra Foundation.');

      const botMsg: Message = {
        id: `bot-${Date.now()}`,
        role: 'assistant',
        text: botReply,
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
      };

      setMessages(prev => [...prev, botMsg]);
    } catch (err) {
      console.error('Chat error:', err);
      const errorMsg: Message = {
        id: `bot-${Date.now()}`,
        role: 'assistant',
        text: currentLang === 'sw'
          ? 'Unaweza kuchangia kupitia Lipa Namba 5678901 au kuwasiliana nasi kwa simu +255 754 889 900 / barua pepe info@noventrafoundation.org.'
          : 'You can support us directly via Lipa No: 5678901 or reach out to info@noventrafoundation.org / +255 754 889 900.',
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
      };
      setMessages(prev => [...prev, errorMsg]);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed bottom-6 right-6 z-40">
      
      {/* Floating Trigger Button */}
      {!isOpen && (
        <button
          id="open-ai-chat-btn"
          type="button"
          onClick={() => setIsOpen(true)}
          className="group relative flex items-center gap-2.5 px-4 py-3.5 rounded-full bg-gradient-to-r from-emerald-600 to-teal-700 hover:from-emerald-500 hover:to-teal-600 text-white shadow-xl shadow-emerald-700/30 hover:scale-105 transition-all duration-200"
          aria-label="Open AI Assistant"
        >
          <div className="relative">
            <Bot className="w-5 h-5" />
            <span className="absolute -top-1 -right-1 w-2.5 h-2.5 rounded-full bg-emerald-300 animate-ping"></span>
          </div>
          <span className="text-xs font-bold tracking-wide">
            {currentLang === 'sw' ? 'Msaidizi wa AI' : 'Noventra AI'}
          </span>
        </button>
      )}

      {/* Expanded Chat Box */}
      {isOpen && (
        <div className="bg-white rounded-3xl shadow-2xl border border-slate-200 w-[90vw] sm:w-[380px] h-[520px] flex flex-col overflow-hidden animate-in fade-in slide-in-from-bottom-6 duration-200">
          
          {/* Top Bar */}
          <div className="bg-gradient-to-r from-slate-900 to-emerald-950 text-white p-4 flex items-center justify-between">
            <div className="flex items-center gap-2.5">
              <div className="w-9 h-9 rounded-xl bg-emerald-600 flex items-center justify-center text-white shadow-md">
                <Sparkles className="w-4 h-4" />
              </div>
              <div>
                <h4 className="text-sm font-bold text-white flex items-center gap-1.5">
                  <span>Noventra AI</span>
                  <span className="w-2 h-2 rounded-full bg-emerald-400"></span>
                </h4>
                <p className="text-[10px] text-emerald-300">
                  {currentLang === 'sw' ? 'Msaidizi Rasmi wa Taasisi' : 'Foundation Virtual Assistant'}
                </p>
              </div>
            </div>

            <button
              id="close-ai-chat-btn"
              type="button"
              onClick={() => setIsOpen(false)}
              className="p-1.5 rounded-lg text-slate-400 hover:text-white hover:bg-slate-800 transition-colors"
            >
              <Minimize2 className="w-4 h-4" />
            </button>
          </div>

          {/* Messages Area */}
          <div className="flex-1 p-4 overflow-y-auto space-y-3 bg-slate-50/50">
            {messages.map((m) => (
              <div
                key={m.id}
                className={`flex gap-2.5 ${m.role === 'user' ? 'justify-end' : 'justify-start'}`}
              >
                {m.role === 'assistant' && (
                  <div className="w-7 h-7 rounded-lg bg-emerald-600 text-white flex items-center justify-center shrink-0 mt-1">
                    <Bot className="w-3.5 h-3.5" />
                  </div>
                )}

                <div
                  className={`max-w-[80%] rounded-2xl p-3 text-xs leading-relaxed ${
                    m.role === 'user'
                      ? 'bg-emerald-600 text-white font-medium rounded-tr-xs shadow-xs'
                      : 'bg-white border border-slate-200 text-slate-800 rounded-tl-xs shadow-xs'
                  }`}
                >
                  <p className="whitespace-pre-line">{m.text}</p>
                  <span className={`block text-[9px] mt-1 text-right ${
                    m.role === 'user' ? 'text-emerald-200' : 'text-slate-400'
                  }`}>
                    {m.timestamp}
                  </span>
                </div>
              </div>
            ))}

            {loading && (
              <div className="flex items-center gap-2 text-xs text-slate-500 italic p-2">
                <div className="w-2 h-2 rounded-full bg-emerald-600 animate-bounce"></div>
                <div className="w-2 h-2 rounded-full bg-emerald-600 animate-bounce [animation-delay:0.2s]"></div>
                <div className="w-2 h-2 rounded-full bg-emerald-600 animate-bounce [animation-delay:0.4s]"></div>
                <span>{currentLang === 'sw' ? 'Noventra AI inaandika...' : 'Noventra AI is thinking...'}</span>
              </div>
            )}

            <div ref={messagesEndRef} />
          </div>

          {/* Quick Prompts Carousel */}
          <div className="p-2 bg-white border-t border-slate-100 flex items-center gap-1.5 overflow-x-auto scrollbar-none">
            {quickPrompts.map((prompt, idx) => (
              <button
                key={idx}
                type="button"
                onClick={() => handleSend(prompt)}
                className="px-2.5 py-1 rounded-lg text-[11px] font-medium bg-slate-100 hover:bg-emerald-50 hover:text-emerald-700 text-slate-700 whitespace-nowrap transition-colors"
              >
                {prompt}
              </button>
            ))}
          </div>

          {/* Input Footer */}
          <form
            onSubmit={(e) => {
              e.preventDefault();
              handleSend();
            }}
            className="p-3 bg-white border-t border-slate-100 flex items-center gap-2"
          >
            <input
              id="ai-chat-input-field"
              type="text"
              placeholder={currentLang === 'sw' ? 'Uliza swali lolote...' : 'Ask about projects, donations...'}
              value={inputMessage}
              onChange={(e) => setInputMessage(e.target.value)}
              className="flex-1 px-3.5 py-2 text-xs rounded-xl border border-slate-200 text-slate-800 placeholder-slate-400 focus:outline-none focus:border-emerald-500"
            />
            <button
              id="send-ai-chat-btn"
              type="submit"
              disabled={loading || !inputMessage.trim()}
              className="p-2 rounded-xl bg-emerald-600 hover:bg-emerald-500 disabled:opacity-40 text-white transition-colors"
            >
              <Send className="w-4 h-4" />
            </button>
          </form>

        </div>
      )}

    </div>
  );
};
