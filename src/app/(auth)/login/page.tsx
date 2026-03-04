"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { loginUser } from "@/lib/demo-store";

export default function LoginPage() {
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  function handleLogin() {
    setError("");
    if (!email || !password) { setError("メールアドレスとパスワードを入力してください"); return; }
    setLoading(true);
    const result = loginUser(email, password);
    if (result.ok) {
      router.replace("/home");
    } else {
      setError(result.error ?? "ログインに失敗しました");
      setLoading(false);
    }
  }

  return (
    <div className="mx-auto max-w-sm min-h-screen flex flex-col items-center justify-center p-6">
      <div className="w-full">
        <h1
          className="text-center text-4xl font-extrabold tracking-wide"
          style={{
            background: "linear-gradient(135deg, #7B8CFF 0%, #B79DFF 45%, #F3A7C6 100%)",
            WebkitBackgroundClip: "text",
            WebkitTextFillColor: "transparent",
          }}
        >
          SLOTY
        </h1>
        <p className="mt-1 text-center text-xs" style={{ color: "var(--muted)" }}>
          〜あなたの時間を価値に〜
        </p>

        <div className="card mt-8 p-5">
          <h2 className="text-lg font-bold text-center">ログイン</h2>

          <div className="mt-4 space-y-3">
            <div>
              <label className="text-xs font-medium" style={{ color: "var(--muted)" }}>メールアドレス</label>
              <input
                type="email"
                className="input mt-1"
                placeholder="example@sloty.app"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                onKeyDown={(e) => e.key === "Enter" && handleLogin()}
              />
            </div>
            <div>
              <label className="text-xs font-medium" style={{ color: "var(--muted)" }}>パスワード</label>
              <input
                type="password"
                className="input mt-1"
                placeholder="パスワード"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                onKeyDown={(e) => e.key === "Enter" && handleLogin()}
              />
            </div>
          </div>

          {error && <p className="mt-2 text-xs text-center" style={{ color: "var(--danger)" }}>{error}</p>}

          <button onClick={handleLogin} disabled={loading} className="btn-primary w-full mt-4 text-sm">
            {loading ? "ログイン中..." : "ログイン"}
          </button>

          <div className="mt-4 flex items-center justify-between text-xs">
            <button onClick={() => router.push("/forgot")} style={{ color: "var(--accent)" }}>
              パスワードを忘れた方
            </button>
            <button onClick={() => router.push("/signup")} style={{ color: "var(--accent)" }}>
              新規登録はこちら
            </button>
          </div>
        </div>

        <p className="mt-4 text-center text-[10px]" style={{ color: "var(--muted)" }}>
          デモ用: demo@sloty.app / password123
        </p>
      </div>
    </div>
  );
}
