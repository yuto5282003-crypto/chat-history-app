import { NextRequest, NextResponse } from "next/server";

export const runtime = "edge";

/**
 * Google Drive file proxy for 3D GLB models.
 * Fetches the file server-side to bypass browser CORS restrictions.
 * Usage: /api/model-proxy?id=GOOGLE_DRIVE_FILE_ID
 */
export async function GET(request: NextRequest) {
  const fileId = request.nextUrl.searchParams.get("id");
  if (!fileId) {
    return NextResponse.json({ error: "Missing file ID" }, { status: 400 });
  }

  // Google Drive direct download URL (with confirm=t to skip virus scan page)
  const driveUrl = `https://drive.usercontent.google.com/download?id=${encodeURIComponent(fileId)}&export=download&confirm=t`;

  try {
    const response = await fetch(driveUrl, {
      headers: {
        "User-Agent": "Mozilla/5.0",
      },
    });

    if (!response.ok) {
      // Fallback: try the googleapis endpoint
      const fallbackUrl = `https://www.googleapis.com/drive/v3/files/${encodeURIComponent(fileId)}?alt=media`;
      const fallbackRes = await fetch(fallbackUrl);
      if (!fallbackRes.ok) {
        return NextResponse.json(
          { error: "Failed to fetch model" },
          { status: fallbackRes.status },
        );
      }
      return new NextResponse(fallbackRes.body, {
        headers: {
          "Content-Type": "model/gltf-binary",
          "Cache-Control": "public, max-age=604800, s-maxage=604800",
          "Access-Control-Allow-Origin": "*",
        },
      });
    }

    // Stream the response back to the client
    return new NextResponse(response.body, {
      headers: {
        "Content-Type": "model/gltf-binary",
        "Cache-Control": "public, max-age=604800, s-maxage=604800",
        "Access-Control-Allow-Origin": "*",
      },
    });
  } catch (e) {
    return NextResponse.json(
      { error: "Proxy fetch failed" },
      { status: 502 },
    );
  }
}
