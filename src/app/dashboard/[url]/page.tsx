"use client";

import { useState, useEffect } from "react";
import { SectionCards } from "@/components/section-cards";
import { AdItem } from "../../../../types/index";
import { useParams } from "next/navigation";

export default function Page() {
  const [ads, setAds] = useState<AdItem[]>([]);
  const [loading, setLoading] = useState(false);
  const { url } = useParams(); // workspace URL/id

  useEffect(() => {
    async function fetchAds() {
      setLoading(true);
      try {
        const res = await fetch(`/api/workspace/${url}/ads`);
        if (!res.ok) throw new Error("Failed to fetch ads");
        const data: AdItem[] = await res.json();
        setAds(data);
      } catch (err) {
        console.error("Error fetching ads:", err);
      } finally {
        setLoading(false);
      }
    }

    fetchAds();
  }, [url]);

  return (
    <div className="flex flex-1 flex-col overflow-y-auto px-6 py-4 ">
      <h1 className="text-[2.5rem] mb-6 font-semibold">My Ads</h1>
        <SectionCards url={url as string} />
    </div>
  );
}
