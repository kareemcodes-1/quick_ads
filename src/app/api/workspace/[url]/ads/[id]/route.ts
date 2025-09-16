import { NextRequest, NextResponse } from "next/server";
import connectDB from "@/config/connectDB";
import ProductAd from "@/models/ProductAd";
import Workspace from "@/models/Workspace";
import { generateImageWithHF } from "@/lib/generateImageWithHF";

export async function PUT(
  req: NextRequest,
  { params }: { params: { url: string; id: string } }
) {
  try {
    await connectDB();

    const workspace = await Workspace.findOne({ url: params.url });
    if (!workspace) {
      return NextResponse.json({ error: "Workspace not found" }, { status: 404 });
    }

    const body = await req.json();
    const { description, regenerateImage } = body;

    // Find the existing ad
    const ad = await ProductAd.findOne({
      _id: params.id,
      workspace: workspace._id,
    });
    if (!ad) {
      return NextResponse.json({ error: "Product Ad not found" }, { status: 404 });
    }

    // Update description if provided
    if (description) ad.description = description;

    // If user wants to update the image (or if description changed & they want new image)
    if (regenerateImage) {
      const newImage = await generateImageWithHF({
        description: description || ad.description,
      });
      ad.imageBase64 = newImage;
    }

    ad.updatedAt = new Date();
    await ad.save();

    return NextResponse.json(ad);
  } catch (err) {
    console.error("PUT error:", err);
    return NextResponse.json({ error: "Failed to update ad" }, { status: 500 });
  }
}


export async function DELETE(
  _req: NextRequest,
  context: { params: Promise<{ url: string; id: string }> }
) {
  try {
    await connectDB();

    const { url, id } = await context.params;

    const workspace = await Workspace.findOne({ url });
    if (!workspace) {
      return NextResponse.json({ error: "Workspace not found" }, {status: 404});
    }

    const product_ad = await ProductAd.findOneAndDelete({
      _id: id,
      workspace: workspace._id,
    });
    if (!product_ad) {
      return NextResponse.json({ error: "Product Ad not found" }, {status: 404});
    }

    return NextResponse.json({ message: "ProductAd deleted successfully" });
  } catch (error) {
    console.error("Error deleting product_ad:", error);
    return NextResponse.json({ error: "Failed to delete ProductAd" }, {status: 500});
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