import { NextRequest, NextResponse } from "next/server";

export const runtime = "edge";

/**
 * Google Drive file proxy for 3D GLB models.
 * Fetches the file server-side to bypass browser CORS restrictions.
 * Usage: /api/model-proxy?id=GOOGLE_DRIVE_FILE_ID
 *
 * Optimizations:
 * - Aggressive caching (30 days browser, 30 days CDN)
 * - ETag-based conditional requests
 * - Stale-while-revalidate for instant cache hits
 */
export async function GET(request: NextRequest) {
  const fileId = request.nextUrl.searchParams.get("id");
  if (!fileId) {
    return NextResponse.json({ error: "Missing file ID" }, { status: 400 });
  }

  // Support conditional requests — return 304 if client has cached version
  const ifNoneMatch = request.headers.get("if-none-match");
  const etag = `"glb-${fileId}"`;
  if (ifNoneMatch === etag) {
    return new NextResponse(null, {
      status: 304,
      headers: {
        ETag: etag,
        "Cache-Control": "public, max-age=2592000, s-maxage=2592000, stale-while-revalidate=86400",
      },
    });
  }

  // Google Drive direct download URL (with confirm=t to skip virus scan page)
  const driveUrl = `https://drive.usercontent.google.com/download?id=${encodeURIComponent(fileId)}&export=download&confirm=t`;

  try {
    const response = await fetch(driveUrl, {
      headers: {
        "User-Agent": "Mozilla/5.0",
      },
    });

    // Validate response: Google Drive may return HTML (virus scan page) instead of binary
    const contentType = response.headers.get("content-type") || "";
    const isHtml = contentType.includes("text/html");

    if (!response.ok || isHtml) {
      // Fallback: try the googleapis endpoint
      const fallbackUrl = `https://www.googleapis.com/drive/v3/files/${encodeURIComponent(fileId)}?alt=media`;
      const fallbackRes = await fetch(fallbackUrl);
      const fallbackType = fallbackRes.headers.get("content-type") || "";
      if (!fallbackRes.ok || fallbackType.includes("text/html")) {
        return NextResponse.json(
          { error: "Failed to fetch model" },
          { status: fallbackRes.ok ? 502 : fallbackRes.status },
        );
      }
      return new NextResponse(fallbackRes.body, {
        headers: {
          "Content-Type": "model/gltf-binary",
          "Cache-Control": "public, max-age=2592000, s-maxage=2592000, stale-while-revalidate=86400",
          "Access-Control-Allow-Origin": "*",
          ETag: etag,
        },
      });
    }

    // Stream the binary response back to the client
    return new NextResponse(response.body, {
      headers: {
        "Content-Type": "model/gltf-binary",
        "Cache-Control": "public, max-age=2592000, s-maxage=2592000, stale-while-revalidate=86400",
        "Access-Control-Allow-Origin": "*",
        ETag: etag,
      },
    });
  } catch (e) {
    return NextResponse.json(
      { error: "Proxy fetch failed" },
      { status: 502 },
    );
  }
}
