import { GoogleGenerativeAI } from '@google/generative-ai';
import { NextResponse } from 'next/server';

export async function POST(req: Request) {
  try {
    const API_KEY = "AIzaSyDwQX-pBkpaMI7wqswxD41Ftkom3xVFKc8"; 
    const genAI = new GoogleGenerativeAI(API_KEY);
    // 安定版の1.5-flashを使用
    const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash" });

    const { reason, impression, menu, feedback, atmosphere, highlight } = await req.json();

    const systemPrompt = `口コミを下書きしてください。来院理由:${reason}, 先生:${impression}, メニュー:${menu}, 感想:${feedback}, 雰囲気:${atmosphere}, 特徴:${highlight}`;

    const result = await model.generateContent(systemPrompt);
    const response = await result.response;
    return NextResponse.json({ text: response.text() });

  } catch (error: any) {
    // 💡 あえて日本語の「混雑中」を出さず、Googleの生のエラーを画面に出します
    return NextResponse.json({ 
      text: "【診断結果】\n" + error.message 
    });
  }
}
