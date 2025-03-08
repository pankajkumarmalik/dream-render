import { NextRequest, NextResponse } from "next/server";

export async function POST(request: NextRequest) {
  const { prompt } = await request.json();

  function generateRandomNumber(): number {
    return Math.floor(Math.random() * 1000000) + 1;
  }

  const randomSeed = generateRandomNumber();
  const imageURL = `https://image.pollinations.ai/prompt/${encodeURIComponent(
    prompt
  )}?seed=${randomSeed}&nologo=True&width=512&height=512`;

  await fetch(imageURL);

  return NextResponse.json({ url: imageURL });
}
