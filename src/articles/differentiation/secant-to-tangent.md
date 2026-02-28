---
slug: secant-to-tangent
title: 割線→接線（微分係数の定義）
description: 割線の傾きが接線の傾きへ近づく様子から微分係数を理解する。
section: differentiation
order: 12
tags:
  - 微分
  - 微分係数
  - 極限
interactive:
  module: secant-tangent
  controls:
    - id: k
      label: 係数 k
      min: -2
      max: 4
      step: 0.1
      default: 1
    - id: a
      label: 注目点 a
      min: -2
      max: 2
      step: 0.1
      default: 1
    - id: dx
      label: 差分 dx
      min: 0.05
      max: 2
      step: 0.05
      default: 0.8
links:
  prerequisitesCandidates:
    - limits-intro
    - function-graph-reading
    - derivative-rules-overview
  nextStep: derivative-rules-overview
  mistakes: common-calculus-mistakes
updates:
  - date: 2026-02-28
    note: 初版公開（D3スライダー対応）
published: 2026-02-28
conclusion: 微分係数は「dxを0に近づけた割線の傾き」で、f(x)=kx^2なら2kaになる。
example: k=2, a=1, dx=0.2 のとき割線の傾きを計算し、2ka=4との違いを見よう。
commonMistake: dxを0に置いて分母0にしてしまう。0にするのではなく0に近づける。
---

微分係数は次で定義されます。

\[
f'(a)=\lim_{dx\to 0}\frac{f(a+dx)-f(a)}{dx}
\]

## 割線から接線へ

2点 \(A(a,f(a))\), \(B(a+dx,f(a+dx))\) を結ぶ直線の傾きが割線です。  
このとき \(dx\) を小さくすると点Bが点Aに近づき、割線は接線へ近づきます。

## f(x)=kx^2 の場合

\[
\frac{k(a+dx)^2-ka^2}{dx}=k(2a+dx)\to 2ka
\]

スライダーで \(dx\) を下げると、赤い割線の傾きが青い接線の傾きに近づきます。

