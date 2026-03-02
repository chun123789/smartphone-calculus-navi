---
slug: riemann-sum-area
title: リーマン和→面積（定積分の意味）
description: リーマン和→面積（定積分の意味）を高校生向けにスマホで理解する。
section: integration
order: 28
track: regular
intent: definition
level: 基礎
priority: S
estimatedMinutes: 6
examTag: 定期テスト対策
misconceptionPattern: リーマン和→面積（定積分の意味） を公式暗記だけで処理してしまう
cta: 次の基礎記事へ進む
tags:
  - 積分
  - 定期テスト
  - definition
interactive:
  module: riemann-sum
  controls:
    - id: 'N'
      label: 分割数 N
      min: 2
      max: 120
      step: 1
      default: 16
    - id: k
      label: 係数 k
      min: 0.5
      max: 4
      step: 0.1
      default: 1
links:
  prerequisitesCandidates:
    - integral-definition-meaning
    - limits-intro
  nextStep: definite-integral-how-to
  mistakes: common-calculus-mistakes
updates:
  - date: '2026-03-02'
    note: 構成を最新方針に更新
published: '2026-03-02'
conclusion: リーマン和→面積（定積分の意味）は「誤答→反例→正ルール」で理解すると定着が速い。
example: 本文のルールを使って、1問だけ自力で再現してみよう。
commonMistake: リーマン和→面積（定積分の意味） を公式暗記だけで処理してしまう
---
定積分の基本イメージは、**細かい長方形の合計**です。

\[
\sum_{i=0}^{N-1} f(x_i)\Delta x
\]

この和で \(N\) を増やすと、曲線下の面積に近づきます。

## 今回の関数

\[
f(x)=kx^2,\quad 0\le x\le2
\]

左端リーマン和は、面積をやや小さめに見積もることが多いです。  
Nスライダーを増やし、真値との差が減る様子を観察しましょう。
