import { NextRequest, NextResponse } from "next/server";
import ProductAd from "@/models/ProductAd";
import Workspace from "@/models/Workspace";
import { generateImageWithHF } from "@/lib/generateImageWithHF";
import connectDB from "@/config/connectDB";
import mongoose from "mongoose";

export async function GET(
  _req: NextRequest,
  context: { params: Promise<{ url: string }> }
) {
  try {
    await connectDB();

    const { url } = await context.params; // ✅ await params
    const workspace = await Workspace.findOne({ url });
    if (!workspace) {
      return NextResponse.json({ error: "Workspace not found" }, { status: 404 });
    }

    // 👇 also populate user details if needed
    const product_ad = await ProductAd.find();
    // console.log(product_ad)
    return NextResponse.json(product_ad);
  } catch (error) {
    console.error("Error fetching adImages:", error);
    return NextResponse.json({ error: "Failed to fetch adImages" }, { status: 500 });
  }
}


// async function toBase64FromUrl(url: string) {
//   const res = await fetch(url);
//   if (!res.ok) throw new Error(`Failed to fetch image: ${res.status}`);
//   const buf = Buffer.from(await res.arrayBuffer());
//   return `data:image/png;base64,${buf.toString("base64")}`;
// }

export async function POST(
  req: NextRequest,
  { params }: { params: { url: string } }
) {
  await connectDB();

  try {
    const { description, imageUrl, user } = await req.json();
    if (!description || !imageUrl || !user) {
      return NextResponse.json(
        { error: "Missing description, image, or user" },
        { status: 400 }
      );
    }

    // Find workspace by URL
    const workspace = await Workspace.findOne({ url: params.url });
    if (!workspace) {
      return NextResponse.json({ error: "Workspace not found" }, { status: 404 });
    }

    // Generate image with Hugging Face
    const generatedBase64 = await generateImageWithHF({ description, });

    // Save to MongoDB using actual workspace _id
    const doc = await ProductAd.create({
      description,
      user: new mongoose.Types.ObjectId(user._id),       // ✅ matches schema
      workspace: new mongoose.Types.ObjectId(workspace._id), // ✅ matches schema
      imageBase64: generatedBase64,
      createdAt: new Date(),
    });

    return NextResponse.json(doc);
  } catch (err) {
    console.error("Image generation error:", err);
    return NextResponse.json({ error: "Failed to generate image" }, { status: 500 });
  }
}




// OPTIONS for CORS
export async function OPTIONS() {
  return new NextResponse(null, {
    status: 204,
    headers: {
      "Access-Control-Allow-Origin": "*",
      "Access-Control-Allow-Methods": "GET, POST, DELETE OPTIONS",
      "Access-Control-Allow-Headers": "Content-Type",
    },
  });
}
