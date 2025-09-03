"use client";
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { DragDropImage } from "./components/drag-drop-image";
import {
  transformationOptions,
  buildTransformationUrl,
} from "@/config/imagekit";
import { Eraser, Crop, User, Search, Sparkle, Star, Check } from "lucide-react";
import Image from "next/image";

const iconMap: Record<string, React.ElementType> = {
  eraser: Eraser,
  crop: Crop,
  user: User,
  "zoom-in": Search,
  sparkles: Sparkle,
  star: Star,
};

export default function Home() {
  const [uploadedImageUrl, setUploadedImageUrl] = useState<string | null>(null);
  const [selectedTools, setSelectedTools] = useState<string[]>([]);
  const [isApplying, setIsApplying] = useState(false);
  const [imageLoading, setImageLoading] = useState(false);
  const [transformedImageUrl, setTransformedImageUrl] = useState<string | null>(
    null
  );

  const toggleTool = (id: string) => {
    setSelectedTools((prev) =>
      prev.includes(id) ? prev.filter((t) => t !== id) : [...prev, id]
    );
  };

  const applyChanges = () => {
    if (!uploadedImageUrl || selectedTools.length === 0) return;
    setIsApplying(true);
    setImageLoading(true);

    const transformations = selectedTools
      .map(
        (id) => transformationOptions.find((t) => t.id === id)?.transformation
      )
      .filter(Boolean) as string[];

    setTimeout(() => {
      const transformedUrl = buildTransformationUrl(
        uploadedImageUrl,
        transformations
      );
      setTransformedImageUrl(transformedUrl);
      setIsApplying(false);
    }, 2000);
  };

  const reset = () => {
    setUploadedImageUrl(null);
    setSelectedTools([]);
    setTransformedImageUrl(null);
  };

  const downloadImage = async () => {
  if (!transformedImageUrl) return;

  const response = await fetch(transformedImageUrl, { mode: "cors" });
  const blob = await response.blob();
  const url = window.URL.createObjectURL(blob);

  const link = document.createElement("a");
  link.href = url;
  link.download = "transformed-image.jpg";
  document.body.appendChild(link);
  link.click();
  link.remove();
  window.URL.revokeObjectURL(url);
};


  return (
    <>
      {/* Hero Section */}
      <div className="mb-12 mt-28 sm:mt-40 flex flex-col items-center justify-center text-center">
        <div className="mx-auto mb-4 flex max-w-fit items-center justify-center space-x-2 overflow-hidden rounded-full border border-gray-200 bg-white px-7 py-2 shadow-md backdrop-blur transition-all hover:border-gray-300 hover:bg-white/50">
          <p className="text-sm font-semibold text-gray-700">
            Lumina is now public!
          </p>
        </div>
        <h1 className="max-w-4xl text-5xl font-bold md:text-6xl lg:text-7xl">
          Transform your <span className="text-blue-600">images</span> in
          seconds with AI
        </h1>
        <p className="mt-5 max-w-prose text-zinc-700 sm:text-lg">
          Lumina helps you transform your images with ease. Upload any picture
          and use AI-powered tools to remove backgrounds, crop, enhance, and
          apply creative edits—all in one place.
        </p>

          <Button
          onClick={() => window.scrollTo({ 
            top: 500,
            left: 0,
            behavior: "smooth"
          })}
            variant="outline"
            size="lg"
            className="mt-6 bg-blue-600 text-white hover:bg-blue-600 hover:text-white"
          >
            Try now 👇🏽
          </Button>
      </div>

       <div>
        <div className='relative isolate'>
          <div
            aria-hidden='true'
            className='pointer-events-none absolute inset-x-0 -top-40 -z-10 transform-gpu overflow-hidden blur-3xl sm:-top-80'>
            <div
              style={{
                clipPath:
                  'polygon(74.1% 44.1%, 100% 61.6%, 97.5% 26.9%, 85.5% 0.1%, 80.7% 2%, 72.5% 32.5%, 60.2% 62.4%, 52.4% 68.1%, 47.5% 58.3%, 45.2% 34.5%, 27.5% 76.7%, 0.1% 64.9%, 17.9% 100%, 27.6% 76.8%, 76.1% 97.7%, 74.1% 44.1%)',
              }}
              className='relative left-[calc(50%-11rem)] aspect-[1155/678] w-[36.125rem] -translate-x-1/2 rotate-[30deg] bg-gradient-to-tr from-[#ff80b5] to-[#9089fc] opacity-20 sm:left-[calc(50%-30rem)] sm:w-[72.1875rem]'
            />
          </div>


        <div className="mx-auto mb-32 max-w-5xl px-6 lg:px-8">
        {!uploadedImageUrl ? (
        <div className='-m-2 rounded-xl bg-gray-900/5 p-2 ring-1 ring-inset ring-gray-900/10 lg:-m-4 lg:rounded-2xl lg:p-4'>
          <>
            <DragDropImage
              transformations={[]}
              onImageSelect={(url) => setUploadedImageUrl(url)}
              onImageRemove={() => setUploadedImageUrl(null)}
            />
          </>
          </div>
        ) : !transformedImageUrl ? (
          <div className="grid lg:grid-cols-2 gap-8">
            <div className="border rounded-lg p-6 text-center">
              <h3 className="font-semibold text-xl mb-4">Uploaded Image</h3>
              <Image
              width={500}
              height={500}
              quality={100}
                src={uploadedImageUrl}
                alt="Uploaded"
                className="mx-auto max-w-full max-h-96 object-contain rounded-lg"
              />
              <p className="mt-4 text-green-700 font-medium">
                ✅ Image uploaded successfully! You can use AI features below.
              </p>
            </div>

            <div className="border rounded-lg p-6 text-center">
              <h3 className="font-semibold text-xl mb-4">AI Features</h3>
              <p className="text-zinc-700 mb-6">
                Select one or more AI transformations to apply to your image.
              </p>
              <div className="flex flex-wrap justify-center gap-4 mb-4">
                {transformationOptions.map((option) => {
                  const IconComponent = iconMap[option.icon];
                  const isSelected = selectedTools.includes(option.id);

                  return (
                    <Button
                      key={option.id}
                      className={`w-full flex items-center justify-center gap-2 relative !cursor-pointer ${
                        isSelected
                          ? "bg-blue-600 text-white hover:bg-blue-700 hover:text-white"
                          : "bg-white text-black"
                      }`}
                      variant="outline"
                      onClick={() => toggleTool(option.id)}
                    >
                      {IconComponent && <IconComponent className="w-4 h-4" />}

                      {option.name}

                      {isSelected && <Check />}
                    </Button>
                  );
                })}
              </div>
              <Button
                onClick={applyChanges}
                disabled={selectedTools.length === 0 || isApplying}
                className="mt-4 w-full bg-blue-600 text-white hover:bg-blue-700 cursor-pointer"
              >
                {isApplying ? "Applying..." : "Apply Changes"}
              </Button>
            </div>
          </div>
        ) : (
          <div className="grid gap-8">
            <div className="grid lg:grid-cols-2 gap-8">
              <div className="border rounded-lg p-6 text-center">
                <h3 className="font-semibold text-xl mb-4">Original Image</h3>
                <div className=" rounded-lg p-4 h-96 flex items-center justify-center">
                  <Image
                    src={uploadedImageUrl!}
                    alt="Original"
                    width={500}
                    height={500}
                    quality={100}
                    className="max-w-full max-h-full object-contain rounded-lg"
                  />
                </div>
              </div>

              <div className="border rounded-lg p-6 text-center">
                <h3 className="font-semibold text-xl mb-4">
                  Transformed Image
                </h3>
                <div className="relative bg-transparent-pattern rounded-lg h-96 flex items-center justify-center">
                  {imageLoading && (
                    <div className="absolute inset-0 flex flex-col items-center justify-center bg-white/70 z-10 gap-4 p-6 text-center">
                      <div className="animate-spin rounded-full h-12 w-12 border-t-4 border-b-4 border-blue-600"></div>
                      <p className="text-gray-700">
                        Processing your image... <br /> This may take a few
                        seconds.
                      </p>
                    </div>
                  )}

                  {transformedImageUrl && (
                    <img
                    // width={500}
                    // height={500}
                    // quality={100}
                      src={transformedImageUrl}
                      alt="Transformed"
                      onLoad={() => setImageLoading(false)}
                      className="max-w-full max-h-full object-contain rounded-lg"
                    />
                  )}
                </div>
              </div>
            </div>

            <div className="flex justify-center gap-4 mt-4">
              <Button
                onClick={downloadImage}
                className="bg-green-600 text-white hover:bg-green-700 cursor-pointer"
              >
                Download Image
              </Button>
              <Button
                onClick={reset}
                className="bg-blue-600 text-white hover:bg-blue-700"
              >
                Upload New Image
              </Button>
            </div>
          </div>
        )}
      </div>

          <div
            aria-hidden='true'
            className='pointer-events-none absolute inset-x-0 -top-40 -z-10 transform-gpu overflow-hidden blur-3xl sm:-top-80'>
            <div
              style={{
                clipPath:
                  'polygon(74.1% 44.1%, 100% 61.6%, 97.5% 26.9%, 85.5% 0.1%, 80.7% 2%, 72.5% 32.5%, 60.2% 62.4%, 52.4% 68.1%, 47.5% 58.3%, 45.2% 34.5%, 27.5% 76.7%, 0.1% 64.9%, 17.9% 100%, 27.6% 76.8%, 76.1% 97.7%, 74.1% 44.1%)',
              }}
              className='relative left-[calc(50%-13rem)] aspect-[1155/678] w-[36.125rem] -translate-x-1/2 rotate-[30deg] bg-gradient-to-tr from-[#ff80b5] to-[#9089fc] opacity-10 sm:left-[calc(50%-36rem)] sm:w-[72.1875rem]'
            />
          </div>
        </div>
      </div>

      <div className="mx-auto mb-32 max-w-5xl px-6 lg:px-8">
        <div className="mx-auto max-w-2xl sm:text-center mb-12">
          <h2 className="mt-2 font-bold text-4xl text-gray-900 sm:text-5xl">
            Start transforming in minutes
          </h2>
          <p className="mt-4 text-lg text-gray-600">
            Upload any image and see it transformed instantly with AI-powered
            tools.
          </p>
        </div>

        <ol className="my-8 space-y-4 pt-8 md:flex md:space-x-12 md:space-y-0">
          <li className="md:flex-1">
            <div className="flex flex-col space-y-2 border-l-4 border-zinc-300 py-2 pl-4 md:border-l-0 md:border-t-2 md:pb-0 md:pl-0 md:pt-4">
              <span className="text-sm font-medium text-blue-600">Step 1</span>
              <span className="text-xl font-semibold">Upload your image</span>
              <span className="mt-2 text-zinc-700">
                Easily select any image from your device. Our platform securely uploads it and prepares it for smart AI enhancements instantly.
              </span>
            </div>
          </li>
          <li className="md:flex-1">
            <div className="flex flex-col space-y-2 border-l-4 border-zinc-300 py-2 pl-4 md:border-l-0 md:border-t-2 md:pb-0 md:pl-0 md:pt-4">
              <span className="text-sm font-medium text-blue-600">Step 2</span>
              <span className="text-xl font-semibold">Choose Your AI Transformations</span>
              <span className="mt-2 text-zinc-700">
                Pick effects like enhancement, cropping, or background removal
              </span>
            </div>
          </li>
          <li className="md:flex-1">
            <div className="flex flex-col space-y-2 border-l-4 border-zinc-300 py-2 pl-4 md:border-l-0 md:border-t-2 md:pb-0 md:pl-0 md:pt-4">
              <span className="text-sm font-medium text-blue-600">Step 3</span>
              <span className="text-xl font-semibold">
                Apply & Download
              </span>
              <span className="mt-2 text-zinc-700">
                Transform your image instantly and download it
              </span>
            </div>
          </li>
        </ol>
      </div>
    </>
  );
}
