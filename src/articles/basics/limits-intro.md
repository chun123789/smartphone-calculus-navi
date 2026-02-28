---
slug: limits-intro
title: 極限の入口（近づくとは何か）
description: 微分と積分の前提になる「近づく」の感覚をグラフでつかむ。
section: basics
order: 5
tags:
  - 極限
  - 基礎
  - 微積準備
links:
  prerequisitesCandidates:
    - function-graph-reading
    - riemann-sum-area
    - secant-to-tangent
  nextStep: secant-to-tangent
  mistakes: common-calculus-mistakes
updates:
  - date: 2026-02-28
    note: 初版公開
published: 2026-02-28
conclusion: xをある値に近づけるときの関数のふるまいを見れば、微分係数と定積分の意味がつながる。
example: f(x)=x^2 で x→2 のときの値を表とグラフの両方で説明しよう。
commonMistake: x=2を代入できない式まで同じ扱いにしてしまう。極限は「近づき方」の観察。
---

微積は「一気に答えを出す計算」ではなく、**変化の途中をどう見るか**の学習です。  
その最初の道具が極限です。

## 近づくの意味

たとえば \(f(x)=x^2\) のとき、\(x\) を 2 に近づけると \(f(x)\) は 4 に近づきます。  
この「近づく」は、\(x=2\) そのものよりも、周辺の値に注目する見方です。

## 微分・積分とのつながり

- 微分: \(dx\) を 0 に近づけると割線が接線へ近づく
- 積分: 分割数 \(N\) を増やすと面積近似が真値へ近づく

どちらも「極限」を使って定義されます。
