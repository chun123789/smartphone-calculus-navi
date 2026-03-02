# スマホで微積ナビ

高校生向け・スマホ中心の微積インタラクティブ解説サイトです。  
静的ビルド（Vite + Nodeスクリプト）で生成し、Cloudflare Pages にそのままデプロイできます。

- テーマ: 微分・積分・微積の基本定理
- IA: 定期テスト導線（`/`） + 共通テスト導線（`/exam/`）
- 数式: MathJax CDN
- 可視化: D3.js（記事ページで動的ロード）
- 記事運用: CSV台帳 (`content-plan/articles.csv`) から30本を同期
- 収益導線: AdSense想定の広告枠コンポーネント（ダミー実装）
- AI利用方針: 制作時のみ。閲覧時の外部LLM/API生成なし

## セットアップ

前提:
- Node.js 20+
- npm 10+

```bash
npm install
npm run dev
```

## npm scripts

- `npm run dev`
  - `build:content` を先に実行してからVite開発サーバ起動
- `npm run validate:plan`
  - `content-plan/articles.csv` の整合性検証（重複slug、リンク欠損など）
- `npm run sync:articles`
  - CSV台帳から `src/articles/**/*.md` のfrontmatterを同期（不足ファイルは生成）
- `npm run build:content`
  - CSV検証 + 記事同期 + HTML生成 + 内部リンク検証 + sitemap/kpi JSON更新
- `npm run build`
  - コンテンツ生成 + Vite build（`dist/`）
- `npm run preview`
  - 本番ビルド確認
- `npm test`
  - Jest（数値検算 + スキーマ/CSVテスト）
- `npm run lint`
  - ESLint

## ディレクトリ要点

- `content-plan/articles.csv`
  - 30本の台帳。記事順・導線・優先度・可視化モジュールを一元管理
- `scripts/content/`
  - `import-plan.mjs`: CSV読込
  - `validate-plan.mjs`: 台帳検証
  - `generate-articles.mjs`: Markdown同期
- `scripts/build-content.mjs`
  - 静的HTML生成の本体（`/exam/`、SEO、内部リンク、`kpi-content.json`）
- `src/js/viz/`
  - 10種類の可視化モジュール

## 記事追加手順（CSV起点）

1. `content-plan/articles.csv` に1行追加
2. `npm run validate:plan`
3. `npm run sync:articles`
4. 生成された `src/articles/<section>/<slug>.md` の本文を執筆
5. `npm run build` で導線/SEO/リンク検証

## 内部リンク規約（自動検証）

各記事に次を強制します。
- 前提 2
- 同階層 2（同セクション優先）
- 次ステップ 1
- ミス集 1

合計6リンク。重複・自己リンク・リンク切れがあると `build:content` が失敗します。

## テーマ切替（ライト/ダーク）

- 初回は `prefers-color-scheme` を採用
- ヘッダの「テーマ」ボタンで切替
- 選択状態は `localStorage(theme-preference)` に保存

## KPI運用

ビルド時に `public/kpi-content.json` を生成します。

含まれる主な集計:
- 記事数
- インタラクティブ記事数
- track別記事数（regular/exam）
- section別記事数
- priority別記事数
- 平均学習時間（推定）

週次運用:
1. Search ConsoleでCTR/掲載順位を確認
2. Cloudflare Web AnalyticsでPV/回遊率を確認
3. `kpi-content.json` と照合し、優先記事を更新

## SEO実装

- 各ページで `title/description/canonical/og` を自動生成
- `BreadcrumbList` JSON-LD を自動出力
- 記事ページは `Article` JSON-LD を自動出力
- `public/sitemap.xml` を自動更新
- `public/robots.txt` と `public/manifest.json` 同梱

本番URL差し替え:
- `scripts/lib/route-utils.mjs` の `SITE_URL`
- `public/robots.txt` の sitemap URL

## AdSense導入手順（差し替え箇所）

広告枠コンポーネント: `src/components/ad-slot.mjs`

1. `ad-slot-box` を `ins.adsbygoogle` に置換
2. 連続広告回避、操作UI近接回避、CTA近接回避のガードレールを維持
3. 記事テンプレ内の配置（冒頭/下部）を維持

## Cloudflare Pages デプロイ（概念）

1. GitHubリポジトリをCloudflare Pagesに接続
2. Build command: `npm run build`
3. Output directory: `dist`
4. Node: 20系
5. （任意）`functions/` を有効化して誤り報告API拡張

## テスト範囲

- 微分・積分の乱数検算（200件超）
- 境界値と例外系
- frontmatter拡張スキーマ検証
- content plan CSV検証

## 収益KPIの目安（利益5,000円/月）

計算式:
- 月収益 = `PV / 1000 * RPM`
- 必要PV = `目標収益 / RPM * 1000`

| 想定RPM(円) | 目標利益5,000円に必要な月PV |
|---:|---:|
| 100 | 50,000 |
| 150 | 33,334 |
| 200 | 25,000 |
| 250 | 20,000 |
| 300 | 16,667 |

## 人間レビューチェックリスト

- [ ] 30記事の導線（定期/共テ）に破綻がない
- [ ] 10可視化がスマホで操作できる
- [ ] 44px以上の操作領域を維持している
- [ ] スライダー操作時に`aria-live`で値が更新される
- [ ] internal links 6本規約を満たす
- [ ] title/description/canonical/og/JSON-LDが妥当
- [ ] 広告枠と操作UIが近接していない
- [ ] `npm test`, `npm run build`, `npm run preview` が通る

## 次にやること

- [ ] 本番ドメインへ `SITE_URL` を差し替える
- [ ] `owner@example.com` を運用メールへ変更する
- [ ] Cloudflare Web Analytics token を設定する
- [ ] Search Consoleで`/sitemap.xml`を登録する
- [ ] AdSense審査用の運営者情報/プライバシーページを整備する
- [ ] 記事本文を台帳優先順にリライトする
- [ ] OGP画像を記事ごとに用意する
- [ ] 共通テスト導線(`/exam/`)の離脱ポイントを計測して改善する
- [ ] ミス集を週次で更新する
- [ ] 収益KPI（PV/RPM/回遊率）を週次ログ化する
