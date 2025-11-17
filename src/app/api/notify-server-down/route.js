import { Resend } from "resend";
import { NextResponse } from "next/server";

export async function POST() {
  try {
    const resend = new Resend(process.env.RESEND_API_KEY);
    

    const { data, error } = await resend.emails.send({
      from: "Alert <onboarding@resend.dev>",
      to: "dynamicphillic77777@gmail.com",
      subject: "🚨 Server Down Alert - DevXBoard, Supabase BAAS",
      html: `
      <div style="
        font-family: Arial, sans-serif;
        background: linear-gradient(135deg, #f3e8ff, #e0f2ff);
        padding: 20px;
        border-radius: 12px;
        box-shadow: 0 4px 12px rgba(0,0,0,0.15);
      ">
        <div style="text-align: center; margin-bottom: 15px;">
          <img 
            src="https://gifdb.com/images/high/anime-banner-gif-file-1415kb-szpf8lw51a9qo6gl.gif"
            alt="Server Down Banner"
            style="width: 100%; max-width: 480px; border-radius: 10px;"
          />
        </div>

        <h2 style="color: #6a0dad; font-size: 26px; text-align: center;">
          🚨 Supabase Server is Down!
        </h2>

        <p style="font-size: 16px; color: #333; text-align: center;">
          Hey developer! 👋 Your Supabase instance is taking a dramatic anime nap 😴
        </p>

        <p style="font-size: 16px; color: #333; text-align: center;">
          We detected that your backend is currently 
          <strong style="color:#d00000;">DOWN</strong>.
        </p>

        <div style="
          margin: 20px auto; 
          padding: 15px;
          background: white; 
          border-radius: 10px; 
          max-width: 450px;
          box-shadow: 0 2px 8px rgba(0,0,0,0.1);
        ">
          <p style="font-size: 15px; color: #444; text-align:center;">
            👉 To fix this, simply<br/>
           <a href="https://supabase.com/dashboard/project/${process.env.SUPABASE_PROJECT_ID}" target="_blank" rel="noopener noreferrer">resume your Supabase project</a>
            and restore DevXBoard’s magical powers 🪄✨
          </p>
        </div>

        <p style="margin-top: 25px; font-size: 13px; color: #666; text-align: center;">
          This is an automated alert from <strong>DevXBoard</strong>. Stay productive! 💙
        </p>
      </div>
      `,
    });

    if (error) {
      return NextResponse.json({ error }, { status: 400 });
    }

    return NextResponse.json({ success: true, data });
  } catch (err) {
    return NextResponse.json({ error: err.message }, { status: 500 });
  }
}
