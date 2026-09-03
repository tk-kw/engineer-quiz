# タクソノミー（知識単位）

出題の最小単位を定義する。**問題を人が思いついた順に足すと粒度がバラけ前提が抜ける**ため、
先に単位を固定し、そこへ問題を埋めに行く順序にする。

## 単位: 219

| 分野 | 単位数 | 出典 |
|---|---|---|
| backend | 95 | roadmap.sh + 自前14 |
| frontend | 43 | roadmap.sh + 自前10 |
| git-github | 74 | roadmap.sh + 自前3 |
| overview（開発の全体像） | 7 | 自前7 |

`overview` は roadmap.sh に対応物がない横断軸。既存問題の写像で「どこにも入らない」ものが
35問出たので、そこから逆算して定義した。

## 剪定の経緯

土台は [roadmap.sh](https://roadmap.sh)（kamranahmedse/developer-roadmap）の backend / frontend / git-github。
描画順（上から下）を学習順として保持している。

| 工程 | 件数 |
|---|---|
| 元ノード（topic 94 + subtopic 336） | 430 |
| 重複除去（backend と frontend で HTTP・DNS・HTML・Git 等が重複） | -51 |
| AI関連（Claude Code / Cursor / MCP / RAGs 等。題材の対象外） | -18 |
| 現行PJで使わない製品（PHP / Rust / MySQL / Nginx / React 等） | -45 |
| 見出しノード（Introduction / Learn about APIs 等。問えない） | -8 |
| 製品名の取りこぼし・GitHubのコミュニティ機能・親不明ラベル | -84 |
| git-github の再剪定（下記） | -39 |
| 自前定義の追加 | +34 |
| **知識単位** | **219** |

### 製品ノードの線引き

現行PJのスタックを実測して照合した。残したのは
JavaScript / Go / PostgreSQL / npm / Vue.js / Tailwind / Prettier / ESLint / Vitest / Nuxt.js の10件。

実測元: zb-kintai（Go 1.25 / Gin / ent / JWT / PostgreSQL 17 / Docker / GCP / Terraform）、
ShabekuriAI（Go / pgvector）、vericerts-corporate-site（Nuxt / Vue / TypeScript / Tailwind / Vitest）。

### git-github の再剪定（110 → 74）

「エンジニアになる必要はない層の基礎知識」という要件に照らして落とした:

- **GitHub API / Apps 系**（7）— REST API / GraphQL API / GitHub Apps / Webhooks 等。基礎知識ではない
- **Actions の内部構造**（9）— YAML Syntax / Workflow Triggers / Runners 等。CI/CD の理解には `GitHub Actions` 1件で足りる
- **hooks の個別イベント**（6）— commit-msg / post-checkout / pre-push 等。`Git hooks` に集約
- **上級・専用機能**（6）— git filter-branch / Submodules / Git LFS / Git Patch 等
- **曖昧・重複**（11）— `git reset --soft/--mixed/--hard` は `git reset` に集約。`Viewing Diffs: 〜` も同様

## ファイル

- `units.json` — 知識単位219件。`id` / `label` / `roadmap` / `level` / `source`（roadmap.sh or self）
- `dropped.json` — 落としたもの。理由ごとに分類。再検討用
- `mapping.json` — 既存150問 → 知識単位の対応

## ジャンル（19）

219単位を19のジャンルへ割り当てている（`units.json` の `genre`）。
既存の `cat` と同じ区切りで、単位より粗く、分野より細かい。

| 分野 | ジャンル |
|---|---|
| 全体像 | リクエストの流れ / 登場人物と役割 / 開発フローとチーム / つながりの切り分け |
| サーバー | HTTPとAPI / データベース / 実行環境とインフラ / ネットワークとDNS / 認証とセキュリティ |
| フロント | ブラウザの仕組み / HTML と CSS / JavaScript と型 / フレームワークと描画 / 通信とパフォーマンス |
| Git | 仕組みと3つの領域 / ブランチ運用 / リモート操作 / 履歴の修正 / チーム開発とPR |

## 使い方

各問に `unit`（知識単位のラベル）を持たせると、次が機械的に出せる。

- **カバレッジ** — 219単位のうち何件に問題があるか
- **空いている単位** — 作問すべき対象の一覧
- **ジャンルごとの在庫** — どの領域が薄いか

「体系のどこが埋まっていて、どこが空いているか」を目視ではなく数えられる状態にするのが、
このファイルの目的。
