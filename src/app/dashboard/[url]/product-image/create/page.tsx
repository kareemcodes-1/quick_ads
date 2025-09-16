"use client";

import { useState} from "react";
import { DragDropImage } from "@/components/drag-drop-image";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import { Loader2 } from "lucide-react";
import { SectionCards } from "@/components/section-cards";
import { useParams } from "next/navigation";
import { useSession } from "next-auth/react";
import toast from "react-hot-toast";

export default function Page() {
  const [uploadedUrl, setUploadedUrl] = useState<string | null>(null);
  const [desc, setDesc] = useState("");
  const [loading, setLoading] = useState(false);
  const { url } = useParams();
  const { data: session } = useSession();

  

  async function handleGenerate() {
    if (!uploadedUrl || !desc) return;
    setLoading(true);

    try {
      const res = await fetch(`${process.env.NEXT_PUBLIC_URL}/api/workspace/${url}/ads`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          imageUrl: uploadedUrl,
          description: desc,
          user: session?.user?.id,
        }),
      });

      if (!res.ok) throw new Error("Failed to generate ad");
      const data = await res.json();

      toast.success("✅ Product image ad generated!");
    } catch (err) {
      console.error(err);
      toast.error("❌ Something went wrong while generating the ad");
    } finally {
      setLoading(false);
    }
  }


  return (
    <div className="flex min-h-screen w-full flex-col gap-6 bg-gray-50 p-6">
      <h1 className="text-[2rem] font-semibold">AI Product Images</h1>
      <div className="flex flex-col w-full gap-6  rounded-2xl border bg-white p-6 shadow">
        <div className="grid grid-cols-2 gap-6 ">
          <DragDropImage
          onImageSelect={(url) => setUploadedUrl(url)}
          onImageRemove={() => setUploadedUrl(null)}
        />

        <div className="flex flex-col gap-[1rem]">
          <h1 className="text-2xl font-semibold">Product Description</h1>

        <Textarea
          value={desc}
          onChange={(e) => setDesc(e.target.value)}
          placeholder="Write product description / ad style"
          className="h-[17rem] w-full resize-none rounded-xl border border-gray-300 p-3 focus:border-gray-500 focus:outline-none"
        />
        </div>
        </div>
      </div>

      
        {uploadedUrl && (
          <div className="text-xs text-gray-500">
            Uploaded image URL:
            <span className="block truncate text-primary">{uploadedUrl}</span>
          </div>
        )}

        <Button
          onClick={handleGenerate}
          disabled={!uploadedUrl || !desc || loading}
          className="w-full"
        >
          {loading ? (
            <>
              <Loader2 className="mr-2 h-4 w-4 animate-spin" /> Generating...
            </>
          ) : (
            "Generate Ad"
          )}
        </Button>

      {/* Generated Results */}
      <div className="flex w-full flex-col gap-4 rounded-2xl border bg-white p-6 shadow">
        <h1 className="text-[1.7rem] font-semibold">Generated Results</h1>
        <SectionCards url={url as string} />
      </div>
    </div>
  );
}
