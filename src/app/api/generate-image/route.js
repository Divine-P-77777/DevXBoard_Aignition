import { NextResponse } from "next/server";

export async function POST(request) {
  try {
    const { prompt, numberOfImages = 1 } = await request.json();

    if (!prompt) {
      return NextResponse.json({ error: "Prompt is required" }, { status: 400 });
    }

    const API_KEY = process.env.GOOGLE_API_KEY;

    if (!API_KEY) {
      return NextResponse.json({ error: "Google API key not set" }, { status: 500 });
    }

    const response = await fetch(
      "https://generativelanguage.googleapis.com/v1beta2/images:generate",
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "Authorization": `Bearer ${API_KEY}`,
        },
        body: JSON.stringify({
          model: "imagen-4.0",
          prompt,
          size: "1024x1024",
          count: numberOfImages,
        }),
      }
    );

    const text = await response.text();
    console.log("Raw API response:", text);

    if (!response.ok) {
      return NextResponse.json({ error: text || "API Error" }, { status: response.status });
    }

    let data;
    try {
      data = JSON.parse(text);
    } catch {
      return NextResponse.json({ error: "Invalid JSON returned from API" }, { status: 500 });
    }

    if (!data.images || !Array.isArray(data.images)) {
      return NextResponse.json({ error: "No images returned from API" }, { status: 500 });
    }

    const images = data.images.map((img) => img.imageBytes);

    return NextResponse.json({ success: true, images });
  } catch (err) {
    return NextResponse.json({ error: err.message }, { status: 500 });
  }
}
