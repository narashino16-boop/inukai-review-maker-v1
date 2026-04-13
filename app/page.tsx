"use client";
import React, { useState } from 'react';
import { Copy, MapPin, Sparkles, Check, Send } from 'lucide-react';

export default function ReviewMaker() {
  const [reason, setReason] = useState('');
  const [impression, setImpression] = useState('');
  const [menus, setMenus] = useState<string[]>([]);
  const [feedback, setFeedback] = useState('');
  const [atmosphere, setAtmosphere] = useState('');
  const [highlight, setHighlight] = useState('');
  const [generatedText, setGeneratedText] = useState('');
  const [loading, setLoading] = useState(false);
  const [copied, setCopied] = useState(false);

  const GOOGLE_MAPS_URL = "https://g.page/r/CX_2Jt5a-GDeEBE/review";
  const MENU_OPTIONS = ["マッサージ", "鍼灸", "美容鍼", "訪問マッサージ", "訪問施術"];

  const toggleMenu = (m: string) => {
    setMenus(prev => prev.includes(m) ? prev.filter(i => i !== m) : [...prev, m]);
  };

  const generateReview = async () => {
    setLoading(true);
    setGeneratedText('');
    try {
      const res = await fetch('/api/generate', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ 
          reason, impression, menu: menus.join("と"), feedback, atmosphere, highlight 
        }),
      });
      const data = await res.json();
      setGeneratedText(data.text || "応答が空でした。再度お試しください。");
    } catch (error: any) {
      setGeneratedText("通信エラーが発生しました: " + error.message);
    } finally {
      setLoading(false);
    }
  };

  const copyToClipboard = () => {
    navigator.clipboard.writeText(generatedText);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="min-h-screen bg-[#F5F5DC] text-[#1A3C34] p-4 md:p-8 font-sans text-sm">
      <div className="max-w-xl mx-auto bg-white rounded-2xl shadow-xl overflow-hidden border-t-8 border-[#1A3C34]">
        
        {/* ヘッダー部分に「入力のヒント」を追加しました */}
        <header className="p-6 text-center border-b bg-[#f9f9f2]">
          <h1 className="text-2xl font-bold mb-2 tracking-tighter">いぬかい鍼灸指圧院口コミメーカー</h1>
          <p className="text-gray-600 mb-4">患者様の声をカタチにするサポートツール</p>
          
          <div className="bg-white border border-[#1A3C34]/20 p-4 rounded-lg text-sm text-[#1A3C34] inline-block text-left shadow-sm">
            <p className="font-bold mb-1">💡 入力のヒント</p>
            <p>各項目は一言でOK！<br/><span className="font-bold text-[#c96244]">わからない所は空欄のままで大丈夫です。</span></p>
            <p className="text-xs text-gray-500 mt-2">※「3. 施術メニュー」だけは選択してください。</p>
          </div>
        </header>

        <main className="p-6 space-y-5">
          <section>
            <label className="block font-bold mb-2">1. 来院のきっかけ</label>
            <input type="text" value={reason} onChange={e => setReason(e.target.value)} className="w-full border-gray-300 rounded-lg p-3 bg-gray-50 focus:ring-1 focus:ring-[#1A3C34] outline-none" placeholder="例：肩こり、腰痛、膝痛など" />
          </section>

          <section>
            <label className="block font-bold mb-2">2. 先生の印象・対応</label>
            <input type="text" value={impression} onChange={e => setImpression(e.target.value)} className="w-full border-gray-300 rounded-lg p-3 bg-gray-50 focus:ring-1 focus:ring-[#1A3C34] outline-none" placeholder="例：優しい、説明が丁寧など" />
          </section>

          <section>
            <label className="block font-bold mb-3">3. 施術メニュー（複数選択可）</label>
            <div className="flex flex-wrap gap-2">
              {MENU_OPTIONS.map(m => (
                <button key={m} onClick={() => toggleMenu(m)} className={`px-4 py-2 rounded-full border transition font-medium ${menus.includes(m) ? 'bg-[#1A3C34] text-white' : 'bg-white border-gray-300 text-gray-600'}`}>{m}</button>
              ))}
            </div>
          </section>

          <section>
            <label className="block font-bold mb-2">4. 感想・受けた後の変化</label>
            <input type="text" value={feedback} onChange={e => setFeedback(e.target.value)} className="w-full border-gray-300 rounded-lg p-3 bg-gray-50 focus:ring-1 focus:ring-[#1A3C34] outline-none" placeholder="例：体が軽くなった、痛みが消えたなど" />
          </section>

          <section>
            <label className="block font-bold mb-2">5. 院内の雰囲気</label>
            <input type="text" value={atmosphere} onChange={e => setAtmosphere(e.target.value)} className="w-full border-gray-300 rounded-lg p-3 bg-gray-50 focus:ring-1 focus:ring-[#1A3C34] outline-none" placeholder="例：清潔感がある、落ち着くなど" />
          </section>

          <section>
            <label className="block font-bold mb-2">6. ここがよかった点・改善点があれば教えてください</label>
            <textarea value={highlight} onChange={e => setHighlight(e.target.value)} className="w-full border-gray-300 rounded-lg p-3 bg-gray-50 focus:ring-1 focus:ring-[#1A3C34] outline-none" placeholder="例：待ち時間が少なくて良かった、もっとこうしてほしい等" rows={3} />
          </section>

          <button onClick={generateReview} disabled={loading || menus.length === 0} className="w-full py-4 bg-[#1A3C34] text-white rounded-xl font-bold flex items-center justify-center gap-2 hover:bg-[#2a5a4e] transition disabled:bg-gray-400">
            {loading ? "AIが執筆中..." : <><Sparkles size={20} /> 口コミを作成する</>}
          </button>

          {generatedText && (
            <div className="mt-8 p-6 bg-[#f9f9f2] rounded-xl border-2 border-dashed border-[#1A3C34] animate-in fade-in">
              <h3 className="font-bold mb-3 flex items-center gap-2 text-[#1A3C34]"><Send size={18} /> 生成された口コミ</h3>
              <p className="text-gray-800 leading-relaxed mb-6 whitespace-pre-wrap bg-white p-4 rounded-lg border border-gray-100">{generatedText}</p>
              
              {!generatedText.includes('エラー') && (
                <div className="flex flex-col sm:flex-row gap-3">
                  <button onClick={copyToClipboard} className="flex-1 py-3 bg-white border-2 border-[#1A3C34] text-[#1A3C34] rounded-lg font-bold flex items-center justify-center gap-2 hover:bg-gray-50 transition shadow-sm">
                    {copied ? <><Check size={18} /> コピーしました</> : <><Copy size={18} /> 文章をコピー</>}
                  </button>
                  <a href={GOOGLE_MAPS_URL} target="_blank" rel="noopener noreferrer" className="flex-1 py-3 bg-[#D4AF37] text-white rounded-lg font-bold flex items-center justify-center gap-2 hover:bg-[#b8962e] transition shadow-lg text-center">
                    <MapPin size={18} /> Googleマップへ貼り付け
                  </a>
                </div>
              )}
            </div>
          )}
        </main>
      </div>
    </div>
  );
}