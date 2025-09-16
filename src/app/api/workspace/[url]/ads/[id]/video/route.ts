import { NextResponse } from "next/server";
import fs from "fs";
import path from "path";

export async function GET(
  _req: Request,
  context: { params: Promise<{ id: string }> }
) {
  const { id } = await context.params;
  const videoPath = path.join("C:/tmp", `${id}.mp4`);

  if (!fs.existsSync(videoPath)) {
    return NextResponse.json({ error: "Video not found" }, { status: 404 });
  }

  const nodeStream = fs.createReadStream(videoPath);

  // Wrap Node stream in a Web ReadableStream
  const webStream = new ReadableStream({
    start(controller) {
      nodeStream.on("data", (chunk) => controller.enqueue(chunk));
      nodeStream.on("end", () => controller.close());
      nodeStream.on("error", (err) => controller.error(err));
    },
  });

  return new NextResponse(webStream, {
    headers: {
      "Content-Type": "video/mp4",
      "Content-Disposition": `inline; filename="${id}.mp4"`,
    },
  });
}

