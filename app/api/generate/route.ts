import { GoogleGenerativeAI } from '@google/generative-ai';
import { NextResponse } from 'next/server';

export async function POST(req: Request) {
  try {
    // 💡 犬飼先生からいただいた新しいAPIキーを直接組み込みました
    const API_KEY = "AIzaSyDwQX-pBkpaMI7wqswxD41Ftkom3xVFKc8"; 
    const genAI = new GoogleGenerativeAI(API_KEY);
    
    // 💡 404エラーを回避するため、最も標準的な呼び名に変更しました
    const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash" });

    const { reason, impression, menu, feedback, atmosphere, highlight } = await req.json();

    const systemPrompt = `あなたは「いぬかい鍼灸指圧院」の患者です。以下のデータを元に、Googleマップに投稿する温かみのある口コミを下書きしてください。

【指示】
1. 5歳と3歳の子を持つ父である先生の親しみやすさや、1人で運営されている誠実さを感じさせる内容にせよ。
2. 文体（ですます、だである、話し言葉）をランダムに使い分け、機械っぽさを消せ。
3. 過剰な褒め言葉ではなく、「体が軽くなった」「相談してよかった」という実感を優先せよ。

【データ】
- きっかけ: \${reason}
- 先生の印象: \${impression}
- メニュー: \${menu}
- 感想: \${feedback}
- 雰囲気: \${atmosphere}
- 特徴: \${highlight}`;

    const result = await model.generateContent(systemPrompt);
    const response = await result.response;
    return NextResponse.json({ text: response.text() });

  } catch (error: any) {
    // エラーが出た場合、診断のためにメッセージを表示します
    return NextResponse.json({ 
      text: "【診断中】\n" + error.message 
    });
  }
}
