import { NextRequest, NextResponse } from "next/server";
import connectDB from "@/config/connectDB";
import ProductAd from "@/models/ProductAd";
import { exec } from "child_process";
import fs from "fs";
import path from "path";
import util from "util";

const execPromise = util.promisify(exec);

export async function POST(
  req: NextRequest,
  { params }: { params: { url: string; id: string } }
) {
  await connectDB();

  try {
    const { id: adId } = params;

    // Find the ad
    const ad = await ProductAd.findById(adId);
    if (!ad) {
      return NextResponse.json({ error: "Ad not found" }, { status: 404 });
    }

    // Ensure tmp folder exists
    const tmpDir = path.join(process.cwd(), "tmp");
    if (!fs.existsSync(tmpDir)) fs.mkdirSync(tmpDir, { recursive: true });

    const tempImagePath = path.join(tmpDir, `${adId}.png`);
    const tempVideoPath = path.join(tmpDir, `${adId}.mp4`);

    // Write the image
    const imageBuffer = Buffer.from(ad.imageBase64.split(",")[1], "base64");
    fs.writeFileSync(tempImagePath, imageBuffer);

    // FFmpeg Ken Burns effect (5s)
    const ffmpegCmd = `ffmpeg -y -loop 1 -i "${tempImagePath}" -vf "zoompan=z='min(zoom+0.004,1.2)':d=125" -c:v libx264 -t 5 -pix_fmt yuv420p "${tempVideoPath}"`;
    await execPromise(ffmpegCmd);

    // Save video to a public folder
    const publicDir = path.join(process.cwd(), "public", "videos");
    if (!fs.existsSync(publicDir)) fs.mkdirSync(publicDir, { recursive: true });

    const finalVideoPath = path.join(publicDir, `${adId}.mp4`);
    fs.renameSync(tempVideoPath, finalVideoPath);

    // Save URL to DB
    ad.videoUrl = `/videos/${adId}.mp4`;
    await ad.save();

    // Cleanup temp image
    fs.unlinkSync(tempImagePath);

    return NextResponse.json({ videoUrl: ad.videoUrl });
  } catch (err) {
    console.error("Video generation error:", err);
    return NextResponse.json({ error: "Failed to generate video" }, { status: 500 });
  }
}
