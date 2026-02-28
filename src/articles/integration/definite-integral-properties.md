---
slug: definite-integral-properties
title: 定積分の性質（線形性と区間分割）
description: 面積としての意味を保ったまま式変形できる、定積分の基本性質を整理する。
section: integration
order: 34
tags:
  - 積分
  - 定積分
  - 性質
links:
  prerequisitesCandidates:
    - riemann-sum-area
    - limits-intro
    - function-graph-reading
  nextStep: ftc-basic
  mistakes: common-calculus-mistakes
updates:
  - date: 2026-02-28
    note: 初版公開
published: 2026-02-28
conclusion: 定積分の性質は、面積の分け方と足し方に対応している。
example: ∫[0,2](x^2+1)dx を線形性で2つに分けて求めよう。
commonMistake: 積分範囲を変えたのに符号を反転し忘れる。
---

定積分で最低限押さえる性質は次の3つです。

1. 線形性  
   \[
   \int_a^b (cf(x)+g(x))dx=c\int_a^b f(x)dx+\int_a^b g(x)dx
   \]
2. 区間分割  
   \[
   \int_a^b f(x)dx=\int_a^c f(x)dx+\int_c^b f(x)dx
   \]
3. 逆向き区間  
   \[
   \int_b^a f(x)dx=-\int_a^b f(x)dx
   \]

これらは公式暗記ではなく、面積の足し引きで理解すると忘れにくくなります。

