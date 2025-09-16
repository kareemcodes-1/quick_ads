
import { NextResponse } from "next/server";
import fs from "fs";
import path from "path";

export async function GET(
  _req: Request,
  context: { params: Promise<{ id: string }> }
) {
  // ✅ Await the params
  const { id } = await context.params;

  const videoPath = path.join("C:/tmp", `${id}.mp4`);

  if (!fs.existsSync(videoPath)) {
    return NextResponse.json({ error: "Video not found" }, { status: 404 });
  }

  // ✅ Use a readable stream so large files don’t block memory
  const stream = fs.createReadStream(videoPath);

  return new NextResponse(stream as any, {
    headers: {
      "Content-Type": "video/mp4",
      "Content-Disposition": `inline; filename="${id}.mp4"`,
    },
  });
}

