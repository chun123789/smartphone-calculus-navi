# 競合UX調査レポート（多角比較）

- 作成日: 2026-03-02
- 対象: 日本の高校生向けスマホ中心・微積学習サイト

## 1. 調査対象

### 競合プロダクト
- Try IT（高校数学 微分法と積分法）
- 高校数学の美しい物語（manabitimes）
- Desmos（スライダー/グラフ操作UI）
- GeoGebra（微分定義系アプレット）

### UX原則ソース
- NN/g: Information Scent, Progressive Disclosure, Visual Design, F-pattern
- web.dev: responsive/accessibility/content hierarchy
- WCAG 2.2: Target Size, Focus Appearance
- Chrome Lighthouse: tap-target guidance

## 2. 競合から抽出した実装観点

1. Try IT型（授業導線型）
- 単元一覧が最初に明快
- 「何から始めるか」が迷いにくい
- 改善反映: トップを4ブロック固定 + 最初の1本を1カード化

2. 美しい物語型（辞書型）
- 記事の網羅性が強い
- 反面、初学者には「次の一手」が見えにくい
- 改善反映: 記事に「次の1本」を必ず固定表示

3. Desmos/GeoGebra型（操作体験型）
- 変化が即時反映される
- 凡例と操作部が近く、意味づけが明瞭
- 改善反映: 再生/停止、リセット、意味色凡例を全可視化に共通化

## 3. 問題点の再定義（旧デザイン）

- 情報が多く「最初の20秒」で判断しにくい
- 記事説明文が定型的で信頼感を下げる
- 記事中の重複セクションでスクロール疲労がある
- 可視化色がテーマ非連動でダーク時視認性が低下

## 4. デザイン反映方針

1. 情報香りを最優先
- ラベルを見るだけで「読後に何ができるか」が分かる文面へ統一

2. 段階的開示
- 関連6リンクは折りたたみ表示
- 主要導線は「次の1本」に絞る

3. モバイル最適化
- 操作領域は44px最低、主要操作は48px
- 1画面内の主CTAを1つに抑制

4. 視覚言語の統一
- 学習ノート系配色（可読性優先）
- 可視化色はCSSトークンでライト/ダーク連動

## 5. 実装に落とした具体策

- ホーム: `30秒で選ぶ / 最初の1本 / 今日の10分 / 最近の更新`
- 記事: `問い → 結論1行 → 可視化 → 60秒要点 → ミス反例 → 確認2問 → 次の1本`
- 可視化: `再生/停止`, `初期値へ戻す`, `意味色凡例`, `aria-live`
- 品質ガード: descriptionの長さ・重複・到達表現の自動検査

## 6. 参照URL

- https://www.try-it.jp/chapters-6916/
- https://manabitimes.jp/math/2706
- https://www.desmos.com/
- https://www.geogebra.org/m/WGCsKBeM
- https://www.nngroup.com/articles/information-scent/
- https://www.nngroup.com/articles/progressive-disclosure/
- https://www.nngroup.com/articles/principles-visual-design/
- https://www.nngroup.com/articles/f-shaped-pattern-reading-web-content/
- https://web.dev/articles/accessible-responsive-design
- https://web.dev/articles/content-reordering
- https://www.w3.org/WAI/WCAG22/Understanding/target-size-minimum
- https://www.w3.org/WAI/WCAG22/Understanding/focus-appearance
- https://developer.chrome.com/docs/lighthouse/seo/tap-targets/
