---
slug: derivative-rules-overview
title: 微分公式の見取り図（和・積・合成）
description: 公式を丸暗記せず、傾きの意味から使い分けるための整理。
section: differentiation
order: 20
tags:
  - 微分
  - 公式
  - 導関数
links:
  prerequisitesCandidates:
    - secant-to-tangent
    - limits-intro
    - function-graph-reading
  nextStep: riemann-sum-area
  mistakes: common-calculus-mistakes
updates:
  - date: 2026-02-28
    note: 初版公開
published: 2026-02-28
conclusion: 公式は「変化率の分解ルール」と考えると使い分けしやすい。
example: y=(x^2+1)(x-3) を積の微分で計算し、展開してから微分した結果と照合しよう。
commonMistake: 合成関数で内側の微分を掛け忘れる。
---

微分公式は、次の4つを軸に整理すると混乱しません。

1. 定数倍
2. 和と差
3. 積と商
4. 合成（連鎖律）

## 覚える順序

まず \(x^n\) の微分、次に和・差、最後に積・商・合成へ進むのが安全です。

## 公式を意味で見る

- 積の微分は「片方を固定してもう片方を変える」
- 合成の微分は「外側の変化率 × 内側の変化率」

グラフの傾きの積として読むと、式処理だけより定着が早いです。

