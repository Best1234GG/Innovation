import React, { useState } from 'react';
import { Bot, Send, Sparkles, MessageSquare, RefreshCw, Car } from 'lucide-react';

export const ParkingAiAssistant: React.FC = () => {
  const [messages, setMessages] = useState<Array<{ role: 'user' | 'assistant'; text: string }>>([
    {
      role: 'assistant',
      text: 'สวัสดีครับ! ผมคือ AI ผู้ช่วยจองที่จอดรถในมหาวิทยาลัย ถามข้อมูลเรื่องลานจอด ตึกเรียน ทางลัด หรือการนำทางไปยังช่อง A12 ได้เลยครับ',
    },
  ]);
  const [inputText, setInputText] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  const quickQuestions = [
    'ช่อง A12 เดินไปอาคารเรียนรวม 3 ไกลไหม?',
    'ตึกวิศวะมีที่จอดว่างเหลืออีกกี่ช่อง?',
    'หากจอดเกิน 1 ชม. 45 นาที ต้องทำอย่างไร?',
    'จุดปุ่มฉุกเฉิน SOS รปภ. อยู่ตรงไหน?',
  ];

  const handleSendMessage = async (textToSend?: string) => {
    const q = textToSend || inputText;
    if (!q.trim() || isLoading) return;

    const userMsg = { role: 'user' as const, text: q.trim() };
    setMessages((prev) => [...prev, userMsg]);
    setInputText('');
    setIsLoading(true);

    try {
      const response = await fetch('/api/parking-ai', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          question: q.trim(),
          currentSlot: 'A12',
          userLocation: 'อาคารเรียนรวม 3 ชั้น 2',
        }),
      });

      const data = await response.json();
      if (!response.ok || !data.success) {
        throw new Error(data.error || 'ไม่สามารถติดต่อ AI ได้');
      }

      setMessages((prev) => [
        ...prev,
        { role: 'assistant', text: data.answer },
      ]);
    } catch (err: any) {
      setMessages((prev) => [
        ...prev,
        { role: 'assistant', text: 'ขออภัย เกิดข้อผิดพลาดในการเชื่อมต่อ: ' + err.message },
      ]);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="max-w-2xl mx-auto bg-white rounded-3xl border border-slate-200 shadow-sm p-6 space-y-4 animate-in fade-in">
      <div className="flex items-center justify-between pb-3 border-b border-slate-100">
        <div className="flex items-center gap-2.5">
          <div className="w-9 h-9 rounded-2xl bg-gradient-to-tr from-blue-600 to-indigo-600 text-white flex items-center justify-center shadow-xs">
            <Bot className="w-5 h-5" />
          </div>
          <div>
            <h3 className="text-sm font-bold text-slate-800">
              AI Smart Parking Assistant
            </h3>
            <p className="text-xs text-slate-500">
              ผู้ช่วยอัจฉริยะแนะนำที่จอดรถและเส้นทางในมหาวิทยาลัย
            </p>
          </div>
        </div>
        <span className="text-xs font-semibold px-2 py-0.5 rounded-full bg-blue-50 text-blue-700">
          Gemini 3.8
        </span>
      </div>

      {/* Chat Messages */}
      <div className="space-y-3 max-h-[360px] overflow-y-auto pr-1">
        {messages.map((m, idx) => (
          <div
            key={idx}
            className={`flex items-start gap-2.5 ${
              m.role === 'user' ? 'justify-end' : 'justify-start'
            }`}
          >
            {m.role === 'assistant' && (
              <div className="w-7 h-7 rounded-full bg-blue-100 text-blue-600 flex items-center justify-center flex-shrink-0 text-xs font-bold mt-0.5">
                AI
              </div>
            )}
            <div
              className={`p-3.5 rounded-2xl text-xs sm:text-sm max-w-[85%] leading-relaxed ${
                m.role === 'user'
                  ? 'bg-blue-600 text-white rounded-tr-xs'
                  : 'bg-slate-100 text-slate-800 rounded-tl-xs'
              }`}
            >
              {m.text}
            </div>
          </div>
        ))}
        {isLoading && (
          <div className="flex items-center gap-2 text-xs text-slate-400 p-2">
            <RefreshCw className="w-3.5 h-3.5 animate-spin text-blue-600" />
            <span>AI กำลังวิเคราะห์ข้อมูลลานจอด...</span>
          </div>
        )}
      </div>

      {/* Suggested Quick Questions */}
      <div className="pt-2">
        <span className="text-xs text-slate-400 font-medium block mb-1.5">
          คำถามที่พบบ่อย:
        </span>
        <div className="flex flex-wrap gap-1.5">
          {quickQuestions.map((q, i) => (
            <button
              key={i}
              onClick={() => handleSendMessage(q)}
              className="text-xs px-2.5 py-1 rounded-xl bg-slate-50 hover:bg-blue-50 hover:text-blue-700 text-slate-600 border border-slate-200 transition-colors cursor-pointer text-left"
            >
              {q}
            </button>
          ))}
        </div>
      </div>

      {/* Input form */}
      <form
        onSubmit={(e) => {
          e.preventDefault();
          handleSendMessage();
        }}
        className="flex items-center gap-2 pt-2"
      >
        <input
          type="text"
          value={inputText}
          onChange={(e) => setInputText(e.target.value)}
          placeholder="พิมพ์คำถามเกี่ยวกับที่จอดรถ..."
          className="flex-1 px-4 py-2.5 rounded-2xl border border-slate-200 text-xs sm:text-sm text-slate-800 placeholder:text-slate-400 focus:outline-hidden focus:ring-2 focus:ring-blue-500 shadow-2xs"
        />
        <button
          type="submit"
          disabled={isLoading || !inputText.trim()}
          className="p-2.5 rounded-2xl bg-blue-600 hover:bg-blue-700 text-white shadow-xs transition-colors cursor-pointer disabled:opacity-50"
        >
          <Send className="w-4 h-4" />
        </button>
      </form>
    </div>
  );
};
