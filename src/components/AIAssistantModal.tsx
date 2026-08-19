import React, { useState, useRef, useEffect } from 'react';
import { 
  X, 
  Sparkles, 
  Send, 
  Cpu, 
  Bot, 
  User, 
  HelpCircle, 
  Flame, 
  MapPin, 
  ShieldAlert,
  Loader2
} from 'lucide-react';
import { askAIAssistant } from '../services/aiService';
import { Incident, CityAnalytics } from '../types';

interface AIAssistantModalProps {
  isOpen: boolean;
  onClose: () => void;
  analytics: CityAnalytics;
  incidents: Incident[];
}

interface ChatMessage {
  id: string;
  sender: 'user' | 'assistant';
  text: string;
  timestamp: string;
}

export const AIAssistantModal: React.FC<AIAssistantModalProps> = ({
  isOpen,
  onClose,
  analytics,
  incidents
}) => {
  if (!isOpen) return null;

  const [inputMessage, setInputMessage] = useState('');
  const [loading, setLoading] = useState(false);
  const [messages, setMessages] = useState<ChatMessage[]>([
    {
      id: 'msg-init',
      sender: 'assistant',
      text: `Hello! I'm Aria, CivicLens's AI assistant. Ask about the incident records available to your account. AI responses may contain errors, so verify important decisions.`,
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
    }
  ]);

  const chatEndRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    chatEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages, loading]);

  const handleSendMessage = async (textToSend = inputMessage) => {
    if (!textToSend.trim() || loading) return;

    const userMsg: ChatMessage = {
      id: `usr-${Date.now()}`,
      sender: 'user',
      text: textToSend,
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
    };

    setMessages((prev) => [...prev, userMsg]);
    setInputMessage('');
    setLoading(true);

    try {
      const reply = await askAIAssistant(textToSend, {
        totalComplaints: analytics.totalComplaints,
        activeComplaints: analytics.activeComplaints,
        resolvedComplaints: analytics.resolvedComplaints,
        incidentCount: incidents.length
      });

      const assistantMsg: ChatMessage = {
        id: `ai-${Date.now()}`,
        sender: 'assistant',
        text: reply,
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
      };
      setMessages((prev) => [...prev, assistantMsg]);
    } catch (e) {
      setMessages((prev) => [...prev, { id: `error-${Date.now()}`, sender: 'assistant', text: e instanceof Error ? e.message : 'The AI assistant is unavailable. Please try again later.', timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }) }]);
    } finally {
      setLoading(false);
    }
  };

  const suggestedPrompts = ['Summarize my open incidents', 'Which categories are most common?', 'What should I review next?'];

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto bg-black/80 backdrop-blur-md flex items-center justify-center p-4">
      <div className="relative w-full max-w-2xl glass-panel-glow rounded-3xl border border-cyan-500/40 p-6 shadow-2xl space-y-4 max-h-[85vh] flex flex-col">
        
        {/* Header */}
        <div className="flex items-center justify-between pb-3 border-b border-slate-800 shrink-0">
          <div className="flex items-center space-x-3">
            <div className="w-10 h-10 rounded-2xl bg-gradient-to-tr from-blue-600 to-cyan-400 p-[1px] shadow-lg shadow-cyan-500/20">
              <div className="w-full h-full bg-[#090d16] rounded-[15px] flex items-center justify-center">
                <Sparkles className="w-5 h-5 text-cyan-400" />
              </div>
            </div>
            <div>
              <h2 className="text-base font-bold text-white flex items-center space-x-2 font-heading">
                <span>Aria • Smart City Copilot</span>
                <span className="px-1.5 py-0.5 rounded text-[9px] font-mono bg-cyan-500/10 text-cyan-300 border border-cyan-500/30">
                  AI assistant
                </span>
              </h2>
              <p className="text-xs text-slate-400">AI-generated guidance from your available records</p>
            </div>
          </div>

          <button
            onClick={onClose}
            className="p-2 rounded-xl bg-slate-900 border border-slate-800 text-slate-400 hover:text-white transition"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Message Thread */}
        <div className="flex-1 overflow-y-auto space-y-3.5 pr-1 text-xs">
          {messages.map((m) => (
            <div
              key={m.id}
              className={`flex items-start space-x-2.5 ${m.sender === 'user' ? 'justify-end' : 'justify-start'}`}
            >
              {m.sender === 'assistant' && (
                <div className="w-7 h-7 rounded-xl bg-cyan-500/20 border border-cyan-500/40 flex items-center justify-center text-cyan-400 shrink-0 mt-0.5">
                  <Bot className="w-4 h-4" />
                </div>
              )}

              <div
                className={`max-w-[82%] p-3.5 rounded-2xl ${
                  m.sender === 'user'
                    ? 'bg-blue-600 text-white rounded-tr-none shadow-md shadow-blue-500/20'
                    : 'bg-slate-900/90 border border-slate-800 text-slate-200 rounded-tl-none space-y-1'
                }`}
              >
                <div className="whitespace-pre-wrap leading-relaxed">
                  {m.text}
                </div>
                <span className="block text-[9px] text-slate-400 text-right mt-1 opacity-70">
                  {m.timestamp}
                </span>
              </div>

              {m.sender === 'user' && (
                <div className="w-7 h-7 rounded-xl bg-blue-600/30 border border-blue-500/40 flex items-center justify-center text-blue-300 shrink-0 mt-0.5">
                  <User className="w-4 h-4" />
                </div>
              )}
            </div>
          ))}

          {loading && (
            <div className="flex items-center space-x-2 text-cyan-400 p-2 bg-slate-900/80 rounded-xl w-fit border border-cyan-500/30">
              <Loader2 className="w-4 h-4 animate-spin" />
              <span className="text-[11px] font-mono">Aria is querying municipal graph...</span>
            </div>
          )}

          <div ref={chatEndRef} />
        </div>

        {/* Suggested Prompts */}
        <div className="flex items-center space-x-1.5 overflow-x-auto pb-1 text-[11px] shrink-0 scrollbar-none">
          {suggestedPrompts.map((p, i) => (
            <button
              key={i}
              onClick={() => handleSendMessage(p)}
              className="whitespace-nowrap px-2.5 py-1 rounded-lg bg-slate-900 border border-slate-800 hover:border-cyan-500/40 text-slate-300 hover:text-white transition"
            >
              {p}
            </button>
          ))}
        </div>

        {/* Input Bar */}
        <form
          onSubmit={(e) => {
            e.preventDefault();
            handleSendMessage();
          }}
          className="flex items-center space-x-2 pt-2 border-t border-slate-800 shrink-0"
        >
          <input
            type="text"
            value={inputMessage}
            onChange={(e) => setInputMessage(e.target.value)}
            placeholder="Ask Aria about smart city metrics, ward hotspots..."
            className="flex-1 bg-slate-900 border border-slate-800 rounded-xl px-3.5 py-2.5 text-xs text-white placeholder-slate-500 focus:ring-1 focus:ring-cyan-500 focus:outline-none"
          />

          <button
            type="submit"
            disabled={!inputMessage.trim() || loading}
            className="px-4 py-2.5 bg-gradient-to-r from-blue-600 to-cyan-600 hover:from-blue-500 hover:to-cyan-500 text-white rounded-xl text-xs font-bold flex items-center space-x-1 shadow-lg shadow-cyan-500/20 transition disabled:opacity-50"
          >
            <Send className="w-3.5 h-3.5" />
          </button>
        </form>

      </div>
    </div>
  );
};
