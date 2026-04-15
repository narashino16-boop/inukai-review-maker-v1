import { GoogleGenerativeAI } from '@google/generative-ai';
import { NextResponse } from 'next/server';

export async function POST(req: Request) {
  try {
    const API_KEY = "AIzaSyDwQX-pBkpaMI7wqswxD41Ftkom3xVFKc8";
    const genAI = new GoogleGenerativeAI(API_KEY);
    
    // 💡 確実に通信が届いていた「gemini-2.0-flash」に固定します
    const model = genAI.getGenerativeModel({ model: "gemini-2.0-flash" });

    const { reason, impression, menu, feedback, atmosphere, highlight } = await req.json();

    const systemPrompt = `
あなたは「いぬかい鍼灸指圧院」の患者です。以下の入力データを元に、Googleマップに投稿する口コミを下書きしてください。

【厳守事項】
1. 文体の多様性: 「〜ですます」「〜だ・である」「話し言葉（親しみやすい）」のいずれかをランダムで選択し、機械的な印象を排除せよ。
2. 構成のシャッフル: 毎回書き出しと結びを変えよ。
3. 誠実なトーン: 「最高」「完璧」などの過剰な表現は禁止。「救われた」「ホッとした」「体が軽い」など、実感を伴う言葉を使え。
4. V字回復の演出: 改善点（${highlight}）に不安や要望が含まれている場合、「最初は少し気になったが、結果的に大満足」というストーリーを自然に盛り込め。

【入力データ（一言メモ）】
- 来院のきっかけ: ${reason}
- 先生の印象・対応: ${impression}
- 受けた施術: ${menu}
- 施術の感想・変化: ${feedback}
- 院内の雰囲気: ${atmosphere}
- ここがよかった点・改善点: ${highlight}
`;

    const result = await model.generateContent(systemPrompt);
    const response = await result.response;
    return NextResponse.json({ text: response.text() });

  } catch (error: any) {
    if (error.message.includes("429")) {
      return NextResponse.json({ text: "【現在Googleが混雑中です】\nプログラムは100%完成しています！Googleの無料枠制限にかかっているため、少し時間を置いて（または明日）もう一度お試しください。" });
    }
    return NextResponse.json({ text: "エラーが発生しました: " + error.message });
  }
}
