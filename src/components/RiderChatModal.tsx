import React, { useState, useEffect, useRef } from 'react';
import { DeliveryRider, ChatMessage } from '../types';
import { Send, X, Phone, ShieldCheck, CheckCheck } from 'lucide-react';
import { sounds } from '../services/audio';

interface RiderChatModalProps {
  rider: DeliveryRider;
  isOpen: boolean;
  onClose: () => void;
}

export const RiderChatModal: React.FC<RiderChatModalProps> = ({ rider, isOpen, onClose }) => {
  const [messages, setMessages] = useState<ChatMessage[]>([
    {
      id: 'msg-init-1',
      sender: 'rider',
      text: `Hi! I'm ${rider.name}, your delivery partner. I've picked up your order from the dark store and am on my way to your address.`,
      timestamp: 'Just now'
    }
  ]);
  const [inputText, setInputText] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const scrollRef = useRef<HTMLDivElement>(null);

  const quickReplies = [
    'Leave at doorstep please',
    'Don\'t ring bell, baby is sleeping',
    'Please give to building security',
    'Gate code is #402'
  ];

  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  }, [messages, isTyping]);

  if (!isOpen) return null;

  const handleSendMessage = (textToSend: string) => {
    if (!textToSend.trim()) return;

    sounds.playPing();
    const userMsg: ChatMessage = {
      id: `usr-${Date.now()}`,
      sender: 'user',
      text: textToSend.trim(),
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
    };

    setMessages((prev) => [...prev, userMsg]);
    setInputText('');

    // Simulate Rider Response
    setIsTyping(true);
    setTimeout(() => {
      setIsTyping(false);
      sounds.playPing();

      let reply = "Understood! I will take care of this right away.";
      const lower = textToSend.toLowerCase();
      if (lower.includes('doorstep') || lower.includes('door')) {
        reply = "Sure! I'll place the thermal grocery bag carefully at your doorstep.";
      } else if (lower.includes('bell') || lower.includes('sleeping')) {
        reply = "Noted! I won't ring the bell, will just drop a missed call when outside.";
      } else if (lower.includes('security') || lower.includes('guard')) {
        reply = "Sure, I will hand over the bag to the security guard with your flat number.";
      } else if (lower.includes('code') || lower.includes('gate')) {
        reply = "Got the entry code, thanks for letting me know!";
      }

      setMessages((prev) => [
        ...prev,
        {
          id: `rdr-${Date.now()}`,
          sender: 'rider',
          text: reply,
          timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
        }
      ]);
    }, 1200);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm animate-in fade-in duration-200">
      <div className="bg-neutral-900 border border-neutral-800 w-full max-w-md rounded-2xl flex flex-col h-[520px] shadow-2xl overflow-hidden">
        {/* Header */}
        <div className="p-4 bg-neutral-950 border-b border-neutral-800 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="relative">
              <img
                src={rider.avatar}
                alt={rider.name}
                className="w-10 h-10 rounded-full object-cover border-2 border-emerald-500"
              />
              <span className="absolute bottom-0 right-0 w-3 h-3 bg-emerald-500 border-2 border-neutral-950 rounded-full" />
            </div>
            <div>
              <div className="flex items-center gap-1.5">
                <h4 className="font-bold text-sm text-white">{rider.name}</h4>
                <ShieldCheck className="w-3.5 h-3.5 text-emerald-400" />
              </div>
              <p className="text-xs text-neutral-400 font-mono">{rider.vehicle} · {rider.vehicleNumber}</p>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <a
              href={`tel:${rider.phone}`}
              className="p-2 rounded-full bg-neutral-800 hover:bg-neutral-700 text-emerald-400 transition-colors"
              title="Call Rider"
            >
              <Phone className="w-4 h-4" />
            </a>
            <button
              onClick={onClose}
              className="p-2 rounded-full bg-neutral-800 hover:bg-neutral-700 text-neutral-400 hover:text-white transition-colors"
            >
              <X className="w-4 h-4" />
            </button>
          </div>
        </div>

        {/* Message Thread */}
        <div ref={scrollRef} className="flex-1 overflow-y-auto p-4 space-y-3 bg-neutral-900/50">
          <div className="text-center">
            <span className="text-[11px] text-neutral-400 bg-neutral-800/80 px-2.5 py-1 rounded-full font-mono">
              Encrypted delivery communication
            </span>
          </div>

          {messages.map((m) => {
            const isUser = m.sender === 'user';
            return (
              <div
                key={m.id}
                className={`flex flex-col ${isUser ? 'items-end' : 'items-start'}`}
              >
                <div
                  className={`max-w-[80%] rounded-2xl px-3.5 py-2 text-sm shadow-sm ${
                    isUser
                      ? 'bg-emerald-600 text-white rounded-br-none'
                      : 'bg-neutral-800 text-neutral-100 rounded-bl-none border border-neutral-700/60'
                  }`}
                >
                  <p>{m.text}</p>
                </div>
                <div className="flex items-center gap-1 mt-1 px-1">
                  <span className="text-[10px] text-neutral-400">{m.timestamp}</span>
                  {isUser && <CheckCheck className="w-3 h-3 text-emerald-400" />}
                </div>
              </div>
            );
          })}

          {isTyping && (
            <div className="flex items-center gap-2 text-neutral-400 text-xs py-1">
              <span className="italic">{rider.name} is typing...</span>
              <div className="flex space-x-1">
                <div className="w-1.5 h-1.5 bg-emerald-500 rounded-full animate-bounce [animation-delay:-0.3s]" />
                <div className="w-1.5 h-1.5 bg-emerald-500 rounded-full animate-bounce [animation-delay:-0.15s]" />
                <div className="w-1.5 h-1.5 bg-emerald-500 rounded-full animate-bounce" />
              </div>
            </div>
          )}
        </div>

        {/* Quick Suggestion Chips */}
        <div className="p-2 bg-neutral-950/80 border-t border-neutral-800/80 flex gap-1.5 overflow-x-auto no-scrollbar">
          {quickReplies.map((qr) => (
            <button
              key={qr}
              onClick={() => handleSendMessage(qr)}
              className="text-xs whitespace-nowrap bg-neutral-800/90 hover:bg-neutral-700 text-neutral-300 hover:text-white px-2.5 py-1 rounded-full border border-neutral-700/60 transition-colors"
            >
              {qr}
            </button>
          ))}
        </div>

        {/* Input Bar */}
        <form
          onSubmit={(e) => {
            e.preventDefault();
            handleSendMessage(inputText);
          }}
          className="p-3 bg-neutral-950 border-t border-neutral-800 flex items-center gap-2"
        >
          <input
            type="text"
            value={inputText}
            onChange={(e) => setInputText(e.target.value)}
            placeholder="Type message to delivery partner..."
            className="flex-1 bg-neutral-900 border border-neutral-700/80 rounded-xl px-3 py-2 text-sm text-white placeholder-neutral-500 focus:outline-none focus:border-emerald-500"
          />
          <button
            type="submit"
            disabled={!inputText.trim()}
            className="p-2 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white disabled:opacity-40 disabled:hover:bg-emerald-600 transition-colors"
          >
            <Send className="w-4 h-4" />
          </button>
        </form>
      </div>
    </div>
  );
};
