

export async function fetchBase64FromUrl(url: string) {
  const res = await fetch(url);
  if (!res.ok) throw new Error(`Failed to fetch image: ${res.status}`);
  const buf = Buffer.from(await res.arrayBuffer());
  return `data:image/png;base64,${buf.toString("base64")}`;
}

export async function generateImageWithHF({
  description,
}: {
  description: string;
}): Promise<string> {
  const HF_TOKEN = process.env.HUGGING_FACE_TOKEN;
  if (!HF_TOKEN) throw new Error("Missing HUGGING_FACE_TOKEN");

  const res = await fetch(
    "https://router.huggingface.co/hf-inference/models/stabilityai/stable-diffusion-xl-base-1.0",
    {
      method: "POST",
      headers: {
        Authorization: `Bearer ${HF_TOKEN}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ inputs: description }),
    }
  );

  if (!res.ok) {
    throw new Error(`HF request failed: ${res.status} – ${await res.text()}`);
  }

  const arrayBuffer = await res.arrayBuffer();
  return `data:image/png;base64,${Buffer.from(arrayBuffer).toString("base64")}`;
}

