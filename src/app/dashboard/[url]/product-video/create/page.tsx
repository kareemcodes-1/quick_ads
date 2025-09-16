"use client";

// import { useState } from "react";
// import { DragDropImage } from "@/components/drag-drop-image";
// import { Textarea } from "@/components/ui/textarea";
// import { Button } from "@/components/ui/button";
// import { Loader2 } from "lucide-react";
import { SectionCards } from "@/components/section-cards";
import { useParams } from "next/navigation";
// import { useSession } from "next-auth/react";

export default function Page() {
  // const [uploadedUrl, setUploadedUrl] = useState<string | null>(null);
  const {url} = useParams();
  // const {data: session} = useSession();
  

  // async function handleGenerate() {
  //   if (!uploadedUrl || !desc) return;
  //   setLoading(true);
  //   try {
  //     const res = await fetch(`${process.env.NEXT_PUBLIC_URL}/api/workspace/${url}/ads`, {
  //       method: "POST",
  //       headers: { "Content-Type": "application/json" },
  //       body: JSON.stringify({ imageUrl: uploadedUrl, description: desc, user: session?.user.id }),
  //     });

  //     if (!res.ok) throw new Error("Failed to generate");
  //     const data = await res.json();
  //     setResults((prev) => [data, ...prev]);
  //   } catch (err) {
  //     console.error(err);
  //   } finally {
  //     setLoading(false);
  //   }
  // }

  return (
    <div className="flex min-h-screen w-full flex-col gap-[.5rem] p-6">
      {/* Generated Results */}
      <h1 className="text-[2rem] font-semibold">AI Product Videos</h1>
      <div className="flex w-full flex-col gap-4 p-6">
        <SectionCards url={url as string} />
      </div>
    </div>
  );
}

