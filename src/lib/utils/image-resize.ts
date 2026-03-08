// ========================================
// 画像リサイズユーティリティ
// Claude API の many-image リクエスト制限 (2000px) に対応
// ========================================

import sharp from "sharp";

const MAX_DIMENSION = 2000;

export interface ResizedImage {
  buffer: Buffer;
  mediaType: "image/jpeg" | "image/png" | "image/webp" | "image/gif";
  width: number;
  height: number;
  wasResized: boolean;
}

/**
 * 画像バッファを受け取り、幅・高さが MAX_DIMENSION を超えていたら
 * アスペクト比を維持したまま縮小して返す。
 * 超えていなければそのまま返す。
 */
export async function resizeImageForAPI(
  input: Buffer,
  maxDimension: number = MAX_DIMENSION
): Promise<ResizedImage> {
  const image = sharp(input);
  const metadata = await image.metadata();

  const width = metadata.width || 0;
  const height = metadata.height || 0;
  const format = metadata.format || "jpeg";

  const mediaType = toMediaType(format);
  const needsResize = width > maxDimension || height > maxDimension;

  if (!needsResize) {
    return {
      buffer: input,
      mediaType,
      width,
      height,
      wasResized: false,
    };
  }

  const resized = await image
    .resize({
      width: maxDimension,
      height: maxDimension,
      fit: "inside",
      withoutEnlargement: true,
    })
    .toBuffer({ resolveWithObject: true });

  return {
    buffer: resized.data,
    mediaType,
    width: resized.info.width,
    height: resized.info.height,
    wasResized: true,
  };
}

/**
 * Base64 エンコードされた画像を受け取り、リサイズして Base64 で返す
 */
export async function resizeBase64ImageForAPI(
  base64Data: string,
  maxDimension: number = MAX_DIMENSION
): Promise<{ base64: string; mediaType: ResizedImage["mediaType"]; wasResized: boolean }> {
  const buffer = Buffer.from(base64Data, "base64");
  const result = await resizeImageForAPI(buffer, maxDimension);

  return {
    base64: result.buffer.toString("base64"),
    mediaType: result.mediaType,
    wasResized: result.wasResized,
  };
}

/**
 * URL から画像を取得してリサイズし、Base64 で返す
 */
export async function fetchAndResizeImageForAPI(
  url: string,
  maxDimension: number = MAX_DIMENSION
): Promise<{ base64: string; mediaType: ResizedImage["mediaType"]; wasResized: boolean }> {
  const res = await fetch(url);
  if (!res.ok) {
    throw new Error(`Failed to fetch image: ${res.status} ${res.statusText}`);
  }

  const arrayBuffer = await res.arrayBuffer();
  const buffer = Buffer.from(arrayBuffer);
  const result = await resizeImageForAPI(buffer, maxDimension);

  return {
    base64: result.buffer.toString("base64"),
    mediaType: result.mediaType,
    wasResized: result.wasResized,
  };
}

function toMediaType(
  format: string
): ResizedImage["mediaType"] {
  switch (format) {
    case "png":
      return "image/png";
    case "webp":
      return "image/webp";
    case "gif":
      return "image/gif";
    default:
      return "image/jpeg";
  }
}
