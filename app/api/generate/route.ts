import { GoogleGenerativeAI } from '@google/generative-ai';
import { NextResponse } from 'next/server';

export async function POST(req: Request) {
  try {
    // 💡 先生のAPIキーをそのまま使います
    const API_KEY = "AIzaSyDwQX-pBkpaMI7wqswxD41Ftkom3xVFKc8"; 
    const genAI = new GoogleGenerativeAI(API_KEY);
    
    // 💡 ここが重要！名前を「gemini-1.5-flash-latest」に変更しました
    const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash-latest" });

    const { reason, impression, menu, feedback, atmosphere, highlight } = await req.json();

    const systemPrompt = `あなたは「いぬかい鍼灸指圧院」の患者として、Googleマップに投稿する温かみのある口コミを下書きしてください。

【構成案】
- 先生の誠実な対応や院の安心感に触れる
- 5歳と3歳のパパである先生の親しみやすさを強調
- 「〜ですます」「〜だ・である」「話し言葉」を混ぜて自然に

【入力データ】
- きっかけ: ${reason}
- 先生の印象: ${impression}
- メニュー: ${menu}
- 感想: ${feedback}
- 雰囲気: ${atmosphere}
- 特徴: ${highlight}`;

    const result = await model.generateContent(systemPrompt);
    const response = await result.response;
    return NextResponse.json({ text: response.text() });

  } catch (error: any) {
    // エラーが出た場合、診断用の生メッセージを表示します
    return NextResponse.json({ 
      text: "【診断中】\nエラー内容: " + error.message 
    });
  }
}
      text: "【診断中】\n" + error.message 
    });
  }
}
