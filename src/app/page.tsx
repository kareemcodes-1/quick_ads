"use client";

import React, { useEffect, useState } from "react";
import toast from "react-hot-toast";
import { Navbar } from "@/components/navbar";
import { Workspace } from "../../types";
import { Button } from "@/components/ui/button";
import { useSession } from "next-auth/react";
import Link from "next/link";

function AuthButton() {
  const { data: session } = useSession();

  

  return session ? (
    <Button
      onClick={() => (window.location.href = "/dashboard")}
      size="lg"
      className="mt-8 bg-gradient-to-r from-purple-600 to-pink-500 text-white hover:opacity-90"
    >
      Get Started
    </Button>
  ) : (
    <Button
      size="lg"
      className="mt-8 bg-gradient-to-r from-purple-600 to-pink-500 text-white hover:opacity-90"
    >
      <Link href="/auth/login">Sign In</Link>
    </Button>
  );
}

export default function Home() {
  const [workspaces, setWorkspaces] = useState<Workspace[]>([]);

  useEffect(() => {
    async function fetchWorkspaces() {
      try {
        const res = await fetch(`${process.env.NEXT_PUBLIC_URL}/api/workspace`);
        if (!res.ok) throw new Error("Failed to fetch workspaces");
        const data = await res.json();
        setWorkspaces(data);
      } catch (err) {
        console.error(err);
        toast.error("Failed to load workspaces");
      }
    }
    fetchWorkspaces();
  }, []);

  return (
    <div className="relative min-h-screen bg-gradient-to-br from-violet-100 via-white to-pink-100">
      <Navbar workspaces={workspaces} />

      {/* ===== HERO SECTION ===== */}
      <main className="container mx-auto px-4 py-20 text-center">
        <div className="inline-flex items-center px-6 py-2 mb-6 text-sm font-semibold text-gray-700 bg-white rounded-full shadow-sm shadow-purple-300 border">
          🚀 QuickAds is live
        </div>

        <h1 className="mx-auto max-w-4xl text-5xl font-extrabold leading-tight tracking-tight text-gray-900 md:text-6xl lg:text-7xl">
          Create Stunning Product Ads in{" "}
          <span className="text-purple-600">Seconds</span>
        </h1>

        <p className="mt-6 max-w-2xl mx-auto text-lg text-gray-700">
          Upload an image, describe your offer, and let AI instantly design
          scroll-stopping ads. Boost your reach and turn conversations into
          conversions — all in one place.
        </p>

        <AuthButton />

        <div className="relative mt-20">
          <div className="rounded-2xl shadow-xl ring-1 ring-gray-200 overflow-hidden max-w-5xl mx-auto">
            <video
              src="/Quickads.mp4"
              className="w-full h-auto object-contain"
              autoPlay
              loop
              muted
              playsInline
            />
          </div>
        </div>
      </main>

      {/* ===== HOW IT WORKS ===== */}
      <section className="py-24 bg-white/60 backdrop-blur-sm">
        <div className="container mx-auto px-6">
          <h2 className="text-4xl font-bold text-center text-gray-900">
            How It Works
          </h2>
          <p className="mt-4 text-center text-gray-600 text-lg">
            Build and launch your ads in just three easy steps.
          </p>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-10 mt-16">
            {[
              {
                step: "1",
                title: "Create a Workspace",
                desc: "Set up a workspace to organize and manage all your campaigns in one place.",
              },
              {
                step: "2",
                title: "Customize Your Ads",
                desc: "Upload images, videos, and copy — then watch AI craft high-performing banners.",
              },
              {
                step: "3",
                title: "Launch & Download",
                desc: "Publish or download your creatives instantly and start driving conversions.",
              },
            ].map(({ step, title, desc }) => (
              <div
                key={step}
                className="bg-white rounded-xl p-8 text-center shadow hover:shadow-lg transition"
              >
                <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-full bg-purple-100 text-purple-600 text-2xl font-bold">
                  {step}
                </div>
                <h3 className="mt-6 text-xl font-semibold text-gray-900">
                  {title}
                </h3>
                <p className="mt-3 text-gray-600">{desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>
    </div>
  );
}
