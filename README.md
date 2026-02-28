# スマホで微積ナビ

高校生向け・スマホ中心の微積インタラクティブ解説サイトです。  
静的ビルド（Vite + Nodeスクリプト）で生成し、Cloudflare Pagesにそのままデプロイできます。

- 主要テーマ: 微分・積分・微積の基本定理
- 数式: MathJax (CDN)
- 可視化: D3.js（記事ページで動的ロード）
- 収益導線: AdSense想定の広告枠コンポーネント（ダミー実装）
- AI利用方針: 制作時のみ利用、閲覧時の外部LLM/API通信なし

## セットアップ手順

前提:
- Node.js 20 以上
- npm 10 以上

```bash
npm install
npm run dev
```

ローカル確認:
- 開発: `npm run dev`
- テスト: `npm test`
- 本番ビルド: `npm run build`
- ビルド結果プレビュー: `npm run preview`

## npm scripts

- `npm run dev`  
  `build:content` 実行後に Vite 開発サーバを起動
- `npm run build:content`  
  Markdown記事を `.site/` に静的生成（内部リンク検証、sitemap更新込み）
- `npm run build`  
  コンテンツ生成 + Viteビルドで `dist/` 出力
- `npm run preview`  
  ビルド後の静的サイト確認
- `npm test`  
  Jestで数値検算（乱数200件以上を含む）
- `npm run lint`  
  ESLint実行

## 記事追加手順

1. `src/articles/<section>/<slug>.md` を追加する。
2. frontmatterに必須項目を入れる:
   - `slug`, `title`, `description`, `section`, `order`, `tags`, `links`, `updates`, `published`
3. 必要なら `interactive` を追加する:
   - `module`: `secant-tangent` または `riemann-sum`
   - `controls`: スライダー定義（`id`, `min`, `max`, `step`, `default`, `label`）
4. 新規可視化モジュールが必要なら `src/js/viz/` に追加し、`src/js/page-article.js` の `loaders` に登録する。
5. `npm run build:content` を実行し、リンク規約（合計6リンク）が満たされることを確認する。

## 内部リンク規約（自動挿入）

各記事に以下を必須化しています。
- 前提: 2件
- 同階層: 2件（同セクション優先、足りない場合は近いorderから補完）
- 次ステップ: 1件
- ミス集: 1件

合計6リンク。重複・自己リンク・リンク切れがあれば `build:content` で失敗します。

## SEOと運用ファイル

- 自動生成: `public/sitemap.xml`（`build:content` 時）
- 固定: `public/robots.txt`, `public/manifest.json`
- 自動meta: 各ページで `title/description/canonical/og` を生成
- パンくず: UI表示 + `BreadcrumbList` JSON-LD

本番URL差し替え:
- `scripts/lib/route-utils.mjs` の `SITE_URL` を `https://example.com` から本番ドメインへ変更
- `public/robots.txt` の Sitemap URL も同時に変更

## AdSense導入手順（差し替え箇所）

広告枠は `src/components/ad-slot.mjs` の `renderAdSlot` で管理しています。

差し替え手順:
1. `ad-slot-box` のダミー `div` を `ins.adsbygoogle` に置換
2. 記事テンプレート内の配置（冒頭直後・中盤）を維持
3. 連続広告を避ける（コンポーネント内コメントにルール記載済み）

## Cloudflare Pages デプロイ手順（概念）

1. GitHubリポジトリをCloudflare Pagesに接続
2. Build command: `npm run build`
3. Build output directory: `dist`
4. Node version: 20系を指定
5. （任意）Pages Functionsを有効化する場合は `functions/` をそのまま利用

## MathJaxアクセシビリティ方針

- `src/js/mathjax-config.js` で MathJax の支援機能（Assistive MathML）を有効化
- 記事のスライダー値は `aria-live` で読み上げ可能
- フォーカス可能な主要領域とスキップリンクを常設

## 人間レビューチェックリスト

- [ ] 数式が教科書の定義と一致している
- [ ] 図と式の対応説明に飛躍がない
- [ ] スマホ縦画面で横スクロールが発生しない
- [ ] スライダー操作時に値表示と説明文が更新される
- [ ] 内部リンク6本ルールを満たす
- [ ] 誤字・記号ミス（特に符号と積分範囲）がない
- [ ] 広告位置が読みやすさを壊していない
- [ ] title/description/canonical/og が適切
- [ ] パンくずとsitemapのURL整合が取れている
- [ ] `npm test` と `npm run build` が通る

## 収益KPIの追い方（PV / RPM / 必要PV）

月利益目標: **5,000円**

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

運用メモ:
- まずは「微分導入」「積分導入」記事のCTRと滞在時間を改善
- PVより先に回遊率（内部リンククリック率）を改善するとRPM改善にも効きやすい

## 次にやること（10項目）

- [ ] 本番ドメインへ `SITE_URL` を差し替える
- [ ] `owner@example.com` を実運用メールアドレスへ変更する
- [ ] AdSenseコードを `ad-slot.mjs` に実装する
- [ ] Cloudflare Pages プロジェクトを作成して初回デプロイする
- [ ] Search Console/Bing Webmasterにsitemapを登録する
- [ ] 記事をあと3本追加して同階層リンクの密度を上げる
- [ ] OGP画像を記事別に用意する
- [ ] 誤り報告API（Pages Functions）の保存先を接続する
- [ ] 週次でPV/RPM/回遊率を記録する
- [ ] ミス集ページを定期更新する運用フローを決める
