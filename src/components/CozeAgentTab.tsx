import React, { useState } from 'react';
import {
  Bot,
  ExternalLink,
  Code2,
  Copy,
  Check,
  Sparkles,
  Layers,
  Terminal,
  FileSpreadsheet,
} from 'lucide-react';

export const CozeAgentTab: React.FC = () => {
  const [copiedCode, setCopiedCode] = useState(false);
  const botId = '7691273048167022597';
  const cozeAgentUrl = `https://www.coze.com/store/agent/${botId}?bot_id=true`;

  const embedScriptCode = `<!-- Coze Web SDK Chat Widget Embed -->
<script src="https://sf-cdn.coze.com/obj/unpkg-va/flow-platform/chat-app-sdk/1.1.0-beta.3/libs/oversea/index.js"></script>
<script>
  const cozeToken = 'pat_bj7nnFLewQkjWbM0Yk1VG4XOrbIHHFvTYQNrwzYtQg0DkOGMF9ZkvEQux18WUKax';

  new CozeWebSDK.WebChatClient({
    config: {
      bot_id: '${botId}',
    },
    auth: {
      type: 'token',
      token: cozeToken,
      onRefreshToken: function () {
        return cozeToken;
      },
    },
    componentProps: {
      title: 'Parking AI Assistant',
    },
  });
</script>`;

  const handleCopy = () => {
    navigator.clipboard.writeText(embedScriptCode);
    setCopiedCode(true);
    setTimeout(() => setCopiedCode(false), 2000);
  };

  return (
    <div className="space-y-8 animate-in fade-in duration-300">
      {/* Overview Card */}
      <div className="bg-white rounded-3xl p-6 sm:p-8 border border-slate-200 shadow-sm flex flex-col md:flex-row items-start md:items-center justify-between gap-6">
        <div className="space-y-2 max-w-2xl">
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold bg-blue-50 text-blue-700 border border-blue-200">
            <Bot className="w-3.5 h-3.5" />
            Coze Agent ID: {botId}
          </div>
          <h2 className="text-xl sm:text-2xl font-bold text-slate-900">
            Coze AI Agent &amp; Google Sheets Integration
          </h2>
          <p className="text-sm text-slate-600 leading-relaxed">
            บอต AI ที่คุณสร้างขึ้นบน Coze Store พร้อมให้คุณใช้งานทั้งแบบฝัง Web Chat บนหน้าเว็บ
            และแบบเชื่อมตรงกับ Google Sheets Database เพื่อเก็บสถิติและประวัติอาหาร
          </p>
        </div>

        <div className="flex flex-col sm:flex-row items-center gap-3 w-full md:w-auto">
          <a
            href={cozeAgentUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-5 py-3 rounded-2xl bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 text-white text-sm font-bold shadow-md shadow-blue-500/20 transition-all"
          >
            <span>เปิดหน้าร้าน Coze Store</span>
            <ExternalLink className="w-4 h-4" />
          </a>
        </div>
      </div>

      {/* 2-Column: Live Coze Iframe / Preview & Integration Details */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        {/* Left Column: Embedded Web Frame */}
        <div className="lg:col-span-7 space-y-4">
          <div className="bg-white rounded-3xl border border-slate-200 shadow-sm overflow-hidden flex flex-col h-[580px]">
            <div className="p-4 bg-slate-900 text-white flex items-center justify-between">
              <div className="flex items-center gap-2 text-xs font-medium">
                <span className="w-3 h-3 rounded-full bg-red-500 inline-block" />
                <span className="w-3 h-3 rounded-full bg-yellow-500 inline-block" />
                <span className="w-3 h-3 rounded-full bg-green-500 inline-block" />
                <span className="ml-2 font-mono text-slate-300">coze.com/store/agent/{botId}</span>
              </div>
              <a
                href={cozeAgentUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="text-xs text-blue-300 hover:text-white flex items-center gap-1"
              >
                เปิดเต็มจอ <ExternalLink className="w-3 h-3" />
              </a>
            </div>

            <div className="flex-1 bg-slate-50 relative flex flex-col items-center justify-center p-6 text-center">
              <iframe
                src={cozeAgentUrl}
                title="Coze Agent Live"
                className="w-full h-full border-0 rounded-b-2xl shadow-inner bg-white"
                sandbox="allow-scripts allow-same-origin allow-popups allow-forms"
              />
            </div>
          </div>
          <p className="text-xs text-slate-500 text-center">
            * หากเบราว์เซอร์แสดงหน้าต่างข้อจำกัดของ iframe สามารถกดปุ่ม &quot;เปิดเต็มจอ&quot; หรือใช้งานผ่านกล่องแชต Web SDK ได้โดยตรง
          </p>
        </div>

        {/* Right Column: Integration Specs, Prompt & Web SDK Script */}
        <div className="lg:col-span-5 space-y-5">
          {/* Prompt & Persona */}
          <div className="bg-white rounded-3xl p-5 border border-slate-200 shadow-sm space-y-3">
            <h3 className="text-sm font-bold text-slate-800 flex items-center gap-2">
              <Sparkles className="w-4 h-4 text-emerald-600" />
              คำสั่ง Prompt &amp; Persona ของบอต (ตามสไลด์สอน)
            </h3>
            <div className="p-3.5 rounded-2xl bg-slate-50 border border-slate-200/80 text-xs font-mono text-slate-700 space-y-1.5 max-h-48 overflow-y-auto">
              <div className="font-bold text-emerald-700"># Role</div>
              <div>คุณคือโภชนากรและเชฟมืออาชีพที่เชี่ยวชาญการออกแบบเมนูอาหารเพื่อสุขภาพและการลดน้ำหนัก</div>
              <div className="font-bold text-emerald-700 pt-1"># Objective</div>
              <div>ทำหน้าที่รับข้อมูลวัตถุดิบจากผู้ใช้งาน จากนั้นคิดค้นเมนูอาหารลดน้ำหนัก 1 เมนู พร้อมคำนวณแคลอรี</div>
              <div className="font-bold text-emerald-700 pt-1"># Workflows</div>
              <div>1. วิเคราะห์วัตถุดิบและคิดเมนูที่ดีต่อสุขภาพ 1 เมนู</div>
              <div>2. คำนวณจำนวนแคลอรีโดยประมาณของเมนูนั้น</div>
              <div>3. เรียกใช้ปลั๊กอิน Google Sheets ฟังก์ชัน Add Row</div>
              <div>- User_Ingredients = วัตถุดิบที่ผู้ใช้ป้อน</div>
              <div>- Recommended_Menu = ชื่อเมนูอาหารที่คิดให้</div>
              <div>- Calories = จำนวนแคลอรี (kcal)</div>
            </div>
          </div>

          {/* Web SDK Code Snippet */}
          <div className="bg-white rounded-3xl p-5 border border-slate-200 shadow-sm space-y-3">
            <div className="flex items-center justify-between">
              <h3 className="text-sm font-bold text-slate-800 flex items-center gap-2">
                <Code2 className="w-4 h-4 text-blue-600" />
                โค้ดนำไปใส่ในเว็บไซต์ (Coze Web SDK)
              </h3>
              <button
                type="button"
                onClick={handleCopy}
                className="inline-flex items-center gap-1 px-2.5 py-1 rounded-lg text-xs font-medium text-slate-700 bg-slate-100 hover:bg-slate-200 transition-colors cursor-pointer"
              >
                {copiedCode ? (
                  <>
                    <Check className="w-3.5 h-3.5 text-emerald-600" /> คัดลอกแล้ว
                  </>
                ) : (
                  <>
                    <Copy className="w-3.5 h-3.5" /> คัดลอกโค้ด
                  </>
                )}
              </button>
            </div>

            <pre className="p-3 rounded-2xl bg-slate-900 text-slate-200 text-[11px] font-mono overflow-x-auto leading-relaxed">
              {embedScriptCode}
            </pre>
            <p className="text-[11px] text-slate-500 leading-normal">
              นำโค้ดนี้ไปวางก่อนปิดแท็ก <code>&lt;/body&gt;</code> ในไฟล์ <code>index.html</code> พร้อมระบุ Token ที่สร้างจาก Coze
            </p>
          </div>

          {/* Architecture Card */}
          <div className="bg-gradient-to-br from-slate-900 to-slate-800 rounded-3xl p-5 text-white shadow-sm space-y-3">
            <h4 className="text-xs font-bold text-emerald-400 uppercase tracking-wider flex items-center gap-1.5">
              <Layers className="w-4 h-4" />
              โครงสร้างระบบตาม Prototype Architecture
            </h4>
            <div className="space-y-2 text-xs text-slate-300">
              <div className="flex items-center gap-2 p-2 rounded-xl bg-white/5 border border-white/10">
                <Terminal className="w-4 h-4 text-amber-400" />
                <span>Frontend: React + Tailwind CSS (ตอบสนองรวดเร็ว)</span>
              </div>
              <div className="flex items-center gap-2 p-2 rounded-xl bg-white/5 border border-white/10">
                <Bot className="w-4 h-4 text-blue-400" />
                <span>AI Logic: Coze Agent / Gemini 3.8 Flash (คำนวณแคลอรี &amp; เมนู)</span>
              </div>
              <div className="flex items-center gap-2 p-2 rounded-xl bg-white/5 border border-white/10">
                <FileSpreadsheet className="w-4 h-4 text-emerald-400" />
                <span>Database: Google Sheets (Diet_AI_Database ไม่ต้องเสียค่า Server)</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};