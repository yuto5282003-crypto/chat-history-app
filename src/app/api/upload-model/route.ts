import { NextRequest, NextResponse } from "next/server";
import { writeFile, mkdir } from "fs/promises";
import path from "path";

export async function POST(req: NextRequest) {
  const formData = await req.formData();
  const file = formData.get("file") as File | null;
  const name = (formData.get("name") as string | null) ?? file?.name;

  if (!file || !name) {
    return NextResponse.json({ error: "ファイルが必要です" }, { status: 400 });
  }

  // Only allow GLB/GLTF
  if (!name.endsWith(".glb") && !name.endsWith(".gltf")) {
    return NextResponse.json({ error: "GLB/GLTFファイルのみ対応" }, { status: 400 });
  }

  // Sanitize filename
  const safeName = name.replace(/[^a-zA-Z0-9._-]/g, "-").toLowerCase();

  const buffer = Buffer.from(await file.arrayBuffer());
  const dir = path.join(process.cwd(), "public", "models");
  await mkdir(dir, { recursive: true });
  await writeFile(path.join(dir, safeName), buffer);

  return NextResponse.json({ ok: true, name: safeName, path: `/models/${safeName}` });
}
