// src/app/api/workspace/[url]/ads/[id]/video/route.ts
import { NextResponse } from "next/server";
import fs from "fs";
import path from "path";

export async function GET(
  _req: Request,
  { params }: { params: { id: string } }
) {
  const videoPath = path.join("C:/tmp", `${params.id}.mp4`);
  if (!fs.existsSync(videoPath)) {
    return NextResponse.json({ error: "Video not found" }, { status: 404 });
  }

  const videoStream = fs.readFileSync(videoPath);
  return new NextResponse(videoStream, {
    headers: {
      "Content-Type": "video/mp4",
    },
  });
}
