# Affi OS — Affiliate Operating System

アフィリエイト運用を半自動化する自分専用Webアプリケーション。

AIが素材収集・候補選定・投稿文生成・投稿予約・分析を自動化し、
人間の作業は**最終承認のみ**に集約します。

## 技術スタック

| レイヤー | 技術 |
|---------|------|
| Frontend | Next.js 15 (App Router) + TypeScript |
| UI | Tailwind CSS + カスタムコンポーネント |
| Backend/DB/Auth | Supabase |
| AI連携 | Claude API (primary) / OpenAI API (switchable) |
| Hosting | Vercel |
| Background Jobs | Vercel Cron Jobs |

## 画面構成

| パス | 画面 | 機能 |
|------|------|------|
| `/` | ダッシュボード | KPI、承認待ち件数、システム状況 |
| `/candidates` | 投稿候補一覧 | AIが選んだ候補の承認・却下 |
| `/candidates/[id]` | 投稿候補詳細 | スコア内訳、文面案、リスク確認 |
| `/queue` | 予約一覧 | 予約済み投稿の管理 |
| `/analytics` | 成績分析 | CTR、カテゴリ別、時間帯別分析 |
| `/settings` | 設定 | 投稿ルール、AI、コンテンツ設定 |

## セットアップ

### 1. 依存関係のインストール

```bash
npm install
```

### 2. 環境変数の設定

```bash
cp .env.example .env.local
```

### 3. 開発サーバー起動

```bash
npm run dev
```

http://localhost:3000 でアクセス

### 4. DB構築（本番時）

Supabase SQL Editorで `supabase/schema.sql` を実行してください。

## 自動化フロー

```
06:00  素材収集 → 新着・ランキング・無料導線を取得
07:00  スコアリング → 各候補にAIスコアを付与
08:00  文面生成 → 上位候補に3案ずつ投稿文を生成
  ↓
随時   ユーザーがダッシュボードで承認
  ↓
15分毎  投稿実行 → 承認済み・時間到来の投稿を実行
```

## 安全設計

- 最終承認は必ず人間が行う
- 自動フォロー、自動DM、自動リプは実装しない
- 重複投稿・過剰連投を防止するルールエンジン内蔵
- NGワード・NGカテゴリフィルタ
- リスクフラグによる危険検知
- 連投間隔の強制

## 環境変数一覧

| 変数名 | 必須 | 説明 |
|--------|------|------|
| `NEXT_PUBLIC_DEMO_MODE` | - | 1でデモモード |
| `NEXT_PUBLIC_SUPABASE_URL` | 本番 | Supabase URL |
| `NEXT_PUBLIC_SUPABASE_ANON_KEY` | 本番 | Supabase Anon Key |
| `SUPABASE_SERVICE_ROLE_KEY` | 本番 | Supabase Service Role Key |
| `ANTHROPIC_API_KEY` | AI使用時 | Claude API Key |
| `OPENAI_API_KEY` | AI使用時 | OpenAI API Key |
| `AI_PROVIDER` | - | claude or openai |
| `X_API_KEY` | 投稿時 | X API Key |
| `X_API_SECRET` | 投稿時 | X API Secret |
| `X_ACCESS_TOKEN` | 投稿時 | X Access Token |
| `X_ACCESS_TOKEN_SECRET` | 投稿時 | X Access Token Secret |
| `CRON_SECRET` | 本番 | Cron認証用シークレット |
| `TZ` | - | タイムゾーン (default: Asia/Tokyo) |

## ライセンス

Private — 個人利用専用
