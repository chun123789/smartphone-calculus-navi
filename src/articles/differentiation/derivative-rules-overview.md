---
slug: derivative-rules-overview
title: 微分公式の見取り図（和・積・合成）
description: 微分公式の見取り図（和・積・合成）を高校生向けにスマホで理解する。
section: differentiation
order: 16
track: regular
intent: procedure
level: 標準
priority: A
estimatedMinutes: 8
examTag: 定期テスト対策
misconceptionPattern: 微分公式の見取り図（和・積・合成） を公式暗記だけで処理してしまう
cta: 次の基礎記事へ進む
tags:
  - 微分
  - 定期テスト
  - procedure
interactive:
  module: chain-rule-flow
  controls:
    - id: x
      label: 入力 x
      min: -2
      max: 2
      step: 0.1
      default: 1
    - id: p
      label: 係数 p
      min: 0.5
      max: 3
      step: 0.1
      default: 1.5
links:
  prerequisitesCandidates:
    - derivative-sign-chart
    - tangent-line-equation
  nextStep: local-max-min-judge
  mistakes: common-calculus-mistakes
updates:
  - date: '2026-03-02'
    note: 構成を最新方針に更新
published: '2026-03-02'
conclusion: 微分公式の見取り図（和・積・合成）は「誤答→反例→正ルール」で理解すると定着が速い。
example: 本文のルールを使って、1問だけ自力で再現してみよう。
commonMistake: 微分公式の見取り図（和・積・合成） を公式暗記だけで処理してしまう
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
