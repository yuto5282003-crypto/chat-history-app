# SLOTY — 時間共有マーケット

時間をスロット単位で売買できるマーケットプレイスアプリ。

## デモモード（UI確認用）

DB・認証・Stripe の設定不要でUI/動線を確認できます。

### ローカル起動

```bash
cp .env.example .env.local
npm install
npm run dev
```

ブラウザで http://localhost:3000 を開く（スマホ幅で確認推奨）。

### Vercel デプロイ手順

1. GitHub にリポジトリを push（済み）
2. [vercel.com](https://vercel.com) にログイン → **Add New Project**
3. GitHub リポジトリを選択してインポート
4. **Environment Variables** に `NEXT_PUBLIC_DEMO_MODE` = `1` を追加
5. **Deploy** をクリック
6. デプロイ完了後、発行された URL をスマホで開いて確認

## 主要パス一覧

| パス | 画面 | 内容 |
|------|------|------|
| `/market` | マーケット | 時間から探す / 今から探す（スロット一覧） |
| `/market/sell` | スロット出品 | 日時・形式・カテゴリ・価格を入力して出品 |
| `/market/slots/[id]` | スロット詳細 | 料金・出品者情報・予約ボタン |
| `/square` | 広場 | 投稿一覧（いいね・依頼ボタン） |
| `/square/new` | 新規投稿 | テキスト・タグ・形式を選んで投稿（2🎫消費） |
| `/square/request/[id]` | 時間共有依頼 | 日時・形式・予算を指定して依頼（5🎫消費） |
| `/friends` | フレンド一覧 | 権限設定・カレンダーリンク・非公開予定リンク |
| `/friends/invite` | フレンド招待 | QR/リンクで招待 |
| `/friends/calendar/[id]` | フレンドカレンダー | 週/月表示のFree/Busy |
| `/friends/events` | 非公開予定 | 予定CRUD（衝突チェック付き） |
| `/bookings` | 予約一覧 | 進行中/過去の予約管理 |
| `/requests/inbox` | 依頼受信箱 | 依頼の承認/拒否 |
| `/profile` | 設定 | ダークモード切替・チケット残高・チャージ・履歴 |

## デモで確認できる操作一覧

1. **起動画面** — 2秒のスプラッシュ（セッション毎に1回）
2. **ダークモード** — /profile のトグルで切替（localStorage保存）
3. **スロット出品→購入フロー** — /market/sell で出品 → /market で検索 → 詳細で予約 → /bookings で確認
4. **広場→依頼→成立** — /square で投稿 → 他の投稿で「依頼」→ /requests/inbox で承認 → /bookings に追加
5. **カレンダー共有** — /friends でフレンドのカレンダー表示（週/月）、権限切替
6. **非公開予定＋衝突チェック** — /friends/events で予定追加 → /market/sell で同時間に出品試行 → エラー表示
7. **チケット消費** — 投稿(2🎫)・依頼(5🎫)でリアルに減算、/profile でチャージ可能

## 技術スタック

- **Next.js 15** (App Router)
- **React 19**
- **Tailwind CSS 3**
- **Prisma 6** + PostgreSQL（本番時）
- **NextAuth.js v5**（本番時）
- **Stripe**（本番時）
