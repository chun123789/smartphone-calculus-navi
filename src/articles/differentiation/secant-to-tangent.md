---
slug: secant-to-tangent
title: 割線→接線（微分係数の定義）
description: 割線→接線（微分係数の定義）を図と式で結び、意味と使いどころを整理して見た瞬間に手順を再現できるようにする。
section: differentiation
order: 10
track: regular
intent: definition
level: 基礎
priority: S
estimatedMinutes: 6
examTag: 定期テスト対策
misconceptionPattern: 割線→接線（微分係数の定義） を公式暗記だけで処理してしまう
cta: 次の基礎記事へ進む
hookQuestion: 割線→接線（微分係数の定義）で、最初にどこを見れば迷わず進めるか？
oneLineAnswer: 定義を図と式で往復し、割線→接線（微分係数の定義）を自分の言葉で説明できる状態を目指す。
keyTakeaways:
  - 条件を言葉にし、変化する量と固定する量を分ける
  - 式変形の前にグラフで符号と範囲を確認する
  - 最後に符号・区間・単位を30秒で点検する
checkpointQuestions:
  - 割線→接線（微分係数の定義）の要点を30秒で口頭説明できるか。
  - 割線→接線（微分係数の定義）の同型問題で同じ手順を再現できるか。
tags:
  - 微分
  - 定期テスト
  - definition
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
  nextStep: tangent-line-equation
  mistakes: common-calculus-mistakes
updates:
  - date: '2026-03-02'
    note: 構成を最新方針に更新
published: '2026-03-02'
conclusion: 割線→接線（微分係数の定義）は「誤答→反例→正ルール」で理解すると定着が速い。
example: 本文のルールを使って、1問だけ自力で再現してみよう。
commonMistake: 割線→接線（微分係数の定義） を公式暗記だけで処理してしまう
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
