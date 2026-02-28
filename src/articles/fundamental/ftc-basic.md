---
slug: ftc-basic
title: 微積の基本定理の入口
description: 微分と積分が逆操作でつながることを最短で理解する。
section: fundamental
order: 42
tags:
  - 微積の基本定理
  - 微分
  - 積分
links:
  prerequisitesCandidates:
    - derivative-rules-overview
    - definite-integral-properties
    - secant-to-tangent
  nextStep: common-calculus-mistakes
  mistakes: function-graph-reading
updates:
  - date: 2026-02-28
    note: 初版公開
published: 2026-02-28
conclusion: 積分で作った関数を微分すると元の関数に戻る、という往復が基本定理の核心。
example: F(x)=∫[0,x]t^2dt を定義し、F'(x)=x^2 を確認しよう。
commonMistake: 不定積分の定数Cと定積分の値を混同する。
---

微積の基本定理は次の2つを結びます。

- 微分: 一点の変化率
- 積分: 区間の蓄積量

\[
F(x)=\int_a^x f(t)dt \Rightarrow F'(x)=f(x)
\]

この関係により、面積計算（積分）が微分公式とつながります。  
高校範囲では「逆操作として対応する」感覚を持てれば十分です。
