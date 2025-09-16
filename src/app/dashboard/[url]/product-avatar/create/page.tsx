"use client";

import { SectionCards } from "@/components/section-cards";
import { DragDropImage } from "@/components/drag-drop-image";
import { useState } from "react";
import { Textarea } from "@/components/ui/textarea";
import { useParams } from "next/navigation";

export default function Page() {
  const [uploadedUrl, setUploadedUrl] = useState<string | null>(null);
  const [desc, setDesc] = useState("");
  const {url} = useParams()

  return (
    <div className="flex min-h-screen w-full flex-col gap-6 p-6 bg-gray-50">
      {/* Upload + Description */}
      <div className="flex w-full flex-col gap-6 rounded-2xl border bg-white p-6 shadow">
        <DragDropImage
          onImageSelect={(url) => setUploadedUrl(url)}
          onImageRemove={() => setUploadedUrl(null)}
        />

        <h1 className="text-2xl font-semibold">Product Description</h1>

        <Textarea
          value={desc}
          onChange={(e) => setDesc(e.target.value)}
          placeholder="Write product description / ad style"
          className="h-28 w-full resize-none rounded-xl border border-gray-300 p-3 focus:border-gray-500 focus:outline-none"
        />

        {uploadedUrl && (
          <div className="text-xs text-gray-500">
            Uploaded image URL:
            <span className="block truncate text-primary">{uploadedUrl}</span>
          </div>
        )}
      </div>

      {/* Generated Results */}
      <div className="flex w-full flex-col gap-4 rounded-2xl border bg-white p-6 shadow">
        <SectionCards url={url as string}/>
      </div>
    </div>
  );
}
