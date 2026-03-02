---
slug: definite-integral-properties
title: 定積分の性質（線形性と区間分割）
description: 定積分の性質（線形性と区間分割）で迷う分岐を整理し、問題を見たら手順を再現できるようにする。
section: integration
order: 36
track: regular
intent: procedure
level: 標準
priority: A
estimatedMinutes: 8
examTag: 定期テスト対策
misconceptionPattern: 定積分の性質（線形性と区間分割） を公式暗記だけで処理してしまう
cta: 次の基礎記事へ進む
hookQuestion: 定積分の性質（線形性と区間分割）で、最初にどこを見れば迷わず進めるか？
oneLineAnswer: 定積分の性質（線形性と区間分割）の手順を固定し、条件を見たら次の一手を再現できる状態を作る。
keyTakeaways:
  - 条件を言葉にし、変化する量と固定する量を分ける
  - 式変形の前にグラフで符号と範囲を確認する
  - 最後に符号・区間・単位を30秒で点検する
checkpointQuestions:
  - 定積分の性質（線形性と区間分割）の要点を30秒で口頭説明できるか。
  - 定積分の性質（線形性と区間分割）の同型問題で同じ手順を再現できるか。
tags:
  - 積分
  - 定期テスト
  - procedure
interactive: null
links:
  prerequisitesCandidates:
    - indefinite-integral-constant
    - riemann-sum-area
  nextStep: signed-area-vs-absolute
  mistakes: common-calculus-mistakes
updates:
  - date: '2026-03-02'
    note: 構成を最新方針に更新
published: '2026-03-02'
conclusion: 定積分の性質（線形性と区間分割）は「誤答→反例→正ルール」で理解すると定着が速い。
example: 本文のルールを使って、1問だけ自力で再現してみよう。
commonMistake: 定積分の性質（線形性と区間分割） を公式暗記だけで処理してしまう
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
