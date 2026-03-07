"use client";
import { useState, useCallback } from "react";

export default function UploadModelPage() {
  const [status, setStatus] = useState("");
  const [progress, setProgress] = useState(0);
  const [uploadedPath, setUploadedPath] = useState("");

  const upload = useCallback(async (file: File) => {
    setStatus("アップロード中...");
    setProgress(10);

    const fd = new FormData();
    fd.append("file", file);

    // Use XMLHttpRequest for progress tracking
    const xhr = new XMLHttpRequest();
    xhr.upload.onprogress = (e) => {
      if (e.lengthComputable) {
        setProgress(Math.round((e.loaded / e.total) * 90) + 10);
      }
    };

    xhr.onload = () => {
      if (xhr.status === 200) {
        const data = JSON.parse(xhr.responseText);
        setStatus("完了!");
        setProgress(100);
        setUploadedPath(data.path);
      } else {
        setStatus("エラー: " + xhr.responseText);
        setProgress(0);
      }
    };

    xhr.onerror = () => {
      setStatus("ネットワークエラー");
      setProgress(0);
    };

    xhr.open("POST", "/api/upload-model");
    xhr.send(fd);
  }, []);

  const handleDrop = useCallback(
    (e: React.DragEvent) => {
      e.preventDefault();
      const file = e.dataTransfer.files[0];
      if (file) upload(file);
    },
    [upload]
  );

  return (
    <div style={{ maxWidth: 600, margin: "40px auto", fontFamily: "sans-serif", padding: 20 }}>
      <h1 style={{ fontSize: 24, marginBottom: 8 }}>3Dモデル アップロード</h1>
      <p style={{ color: "#666", marginBottom: 24 }}>
        Tripo AIで作成したGLBファイルをここにドラッグ&ドロップしてください。
        <br />
        広場の「はるか」アバターが3Dで表示されるようになります。
      </p>

      <div
        onDragOver={(e) => e.preventDefault()}
        onDrop={handleDrop}
        onClick={() => {
          const input = document.createElement("input");
          input.type = "file";
          input.accept = ".glb,.gltf";
          input.onchange = () => {
            const file = input.files?.[0];
            if (file) upload(file);
          };
          input.click();
        }}
        style={{
          border: status === "完了!" ? "3px solid #22c55e" : "3px dashed #9b8afb",
          borderRadius: 16,
          padding: 40,
          textAlign: "center",
          background: status === "完了!" ? "#f0fdf4" : "linear-gradient(135deg, #f8f7ff 0%, #fff0f5 100%)",
          cursor: "pointer",
          transition: "all 0.3s",
        }}
      >
        {status === "完了!" ? (
          <>
            <div style={{ fontSize: 48, marginBottom: 8 }}>&#10003;</div>
            <p style={{ fontSize: 18, fontWeight: 600, color: "#16a34a" }}>アップロード完了!</p>
            <p style={{ fontSize: 13, color: "#666", marginTop: 8 }}>
              保存先: <code style={{ background: "#e5e7eb", padding: "2px 6px", borderRadius: 4 }}>{uploadedPath}</code>
            </p>
          </>
        ) : (
          <>
            <div style={{ fontSize: 48, marginBottom: 8 }}>&#128230;</div>
            <p style={{ fontSize: 16, fontWeight: 600, color: "#333" }}>
              GLBファイルをドラッグ&ドロップ
            </p>
            <p style={{ fontSize: 13, color: "#999", marginTop: 4 }}>
              またはクリックしてファイルを選択 (.glb / .gltf)
            </p>
          </>
        )}

        {/* Progress bar */}
        {progress > 0 && progress < 100 && (
          <div
            style={{
              marginTop: 16,
              height: 6,
              borderRadius: 3,
              background: "#e5e7eb",
              overflow: "hidden",
            }}
          >
            <div
              style={{
                width: `${progress}%`,
                height: "100%",
                borderRadius: 3,
                background: "linear-gradient(90deg, #667eea, #764ba2)",
                transition: "width 0.3s",
              }}
            />
          </div>
        )}

        {status && status !== "完了!" && (
          <p style={{ fontSize: 13, color: "#666", marginTop: 12 }}>{status}</p>
        )}
      </div>

      {/* Info section */}
      <div
        style={{
          marginTop: 24,
          padding: 16,
          background: "#f8f7ff",
          borderRadius: 12,
          border: "1px solid #e8e5ff",
        }}
      >
        <p style={{ fontSize: 13, fontWeight: 600, color: "#333", marginBottom: 8 }}>
          対応ファイル形式
        </p>
        <ul style={{ fontSize: 12, color: "#666", margin: 0, paddingLeft: 20 }}>
          <li><strong>.glb</strong> — GL Transmission Format Binary（推奨）</li>
          <li><strong>.gltf</strong> — GL Transmission Format</li>
        </ul>
        <p style={{ fontSize: 11, color: "#999", marginTop: 12 }}>
          Tripo AIからダウンロードした chibi+girl+3d+model.glb をアップロードしてください。
        </p>
      </div>

      {status === "完了!" && (
        <div style={{ marginTop: 24, textAlign: "center" }}>
          <a
            href="/square"
            style={{
              display: "inline-block",
              padding: "12px 32px",
              background: "linear-gradient(135deg, #667eea 0%, #764ba2 100%)",
              color: "white",
              borderRadius: 24,
              fontWeight: 600,
              textDecoration: "none",
              fontSize: 15,
            }}
          >
            広場で確認する →
          </a>
        </div>
      )}
    </div>
  );
}
