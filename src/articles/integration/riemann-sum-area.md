---
slug: riemann-sum-area
title: リーマン和→面積（定積分の意味）
description: 矩形の和を細かくしていくと面積に近づくことを可視化で理解する。
section: integration
order: 28
tags:
  - 積分
  - リーマン和
  - 面積
interactive:
  module: riemann-sum
  controls:
    - id: N
      label: 分割数 N
      min: 2
      max: 120
      step: 1
      default: 12
    - id: k
      label: 係数 k
      min: 0.5
      max: 4
      step: 0.1
      default: 1
links:
  prerequisitesCandidates:
    - limits-intro
    - function-graph-reading
    - secant-to-tangent
  nextStep: definite-integral-properties
  mistakes: common-calculus-mistakes
updates:
  - date: 2026-02-28
    note: 初版公開（リーマン矩形可視化）
published: 2026-02-28
conclusion: 定積分は「幅を細かくした長方形の和の極限」で、面積の意味を持つ。
example: k=1, N=4 と N=40 で近似値の差を比べよう。
commonMistake: Nを増やせば常に過大評価と思い込む（方法次第で過小評価にもなる）。
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

