# CLAUDE.md - Project Instructions

## Project Overview
Next.js 15 + React 19 app ("Sloty") with Prisma ORM, NextAuth v5, Stripe, Tailwind CSS.

## Commands
- `npm run dev` - Start dev server
- `npm run build` - Production build
- `npm run lint` - ESLint
- `npm run db:generate` - Prisma generate
- `npm run db:migrate` - Prisma migrate dev
- `npm run db:push` - Push schema to DB
- `npm run db:seed` - Seed database

## Code Style
- TypeScript strict mode
- Tailwind CSS for styling
- Prisma for database access
- Zod for validation
- App Router (Next.js 15)

## Automation Preferences
- 確認なしで実行してよい: ファイル読み書き、検索、ビルド、lint、テスト、git操作
- 日本語でコミュニケーション
- コードコメントは英語
- エラーが出たら自動修正を試みる
- 必要なパッケージは自動でインストールしてよい
