---
name: quiz
description: スクショや状況説明から「ベスト案を初心者にもわかる例えで簡潔に説明」し、その学びを engineer-quiz の選択式クイズに追加してpushする。判断・トラブル対応・設計選択の定着用。
---

# quiz — 学びをクイズ化する

スクリーンショット（IDEの選択ダイアログ、エラー画面、設計案の比較など）や状況説明を受け取り、
**(1) どれがベストかを初心者にもわかる例えを交えて簡潔に説明** し、
**(2) その理解を engineer-quiz の選択式クイズに追加して commit & push** する。

対象ファイル: `/Users/tkhr/development/engineer-quiz/index.html`（このリポジトリのトップにある単一HTML。`QUESTIONS` 配列と `GLOSSARY` オブジェクトを持つ）。

## このスキルの狙い

「その場でわかること」と「覚えて定着すること」は別。判断やトラブル対応の学びを、
後日自分（や近いスキルセットの新メンバー）に出題できる**再出題できる形**で残す。

## ワークフロー

### Step 1. 説明する（先に人へ）
ユーザーが貼ったスクショ／状況について、まず次を満たす説明を返す:
- **結論（どれがベストか）を最初に1行で**言い切る。
- **初心者にもわかる「例え」を必ず1つ**入れる（引っ越し・家系図・空港の保安検査など、身近なもの）。
- **各選択肢の位置づけを簡潔に**（表が有効。◎○△で評価＋理由ひとことずつ）。
- 冗長にしない。シンプルで読み切れる長さに。
- 可能なら、過去に追加した関連クイズの考え方（「1PR=1目的」「最小マイグレーション」など）と地続きであることに触れる。

### Step 2. クイズ化する（データ追加）
学びを `QUESTIONS` 配列の**末尾に追記**する。1つの事象から複数問に分けてよい。

各問のオブジェクト形式（既存に厳密に合わせる）:
```js
{cat:"カテゴリ名",situation:"状況説明",q:"設問",options:["A","B","C","D"],answer:1,explain:"解説"}
```

**厳守ルール:**
- **選択肢は必ず4つ以下**（5択以上は不可。ラベルはA〜Fまで対応するが4択を基本とする）。
- **誤答（distractor）はもっともらしく**作る。「放置する」「何もしない」「常に〜」のような投げやりな誤答は禁止。正解と同程度の長さ・具体度で、ありがちな誤解・一見筋が良さそうな誤りにする。消去法で当てられないように。
- `answer` の値は気にしすぎなくてよい（**出題時に選択肢は自動シャッフルされる**ので位置の偏りは表示側で吸収される）。ただし内容の正しさは厳密に。
- **`cat`+`q` が既存と重複しないこと**（重複すると削除機能が誤動作する）。既存に似た問題がないか先に確認し、**同じ結論の繰り返しは避け、新しい角度・前提・一段深い土台**を問う。
- 状況に候補列挙「(1)…=…、(2)…」がある場合、`situation` は素のテキストで書いてよい（表示時に箇条書きカードへ自動整形される）。

### Step 3. 用語を追記（GLOSSARY）
問題文・解説に出てくる**専門用語**で `GLOSSARY` に未登録のものを追記する。
- 形式: `"用語":"一言の平易な説明",`
- 既に同じキーがあれば追記しない（重複キー可だが避ける）。
- 初心者向けに、なるべくやさしい言葉で。

### Step 4. 検証（必須・自己申告に頼らない）
追加後、必ず次を Node で機械チェックする。1つでも落ちたら直してから進む:

```bash
node -e "
const fs=require('fs');const h=fs.readFileSync('/Users/tkhr/development/engineer-quiz/index.html','utf8');
const m=h.match(/const QUESTIONS = \[[\s\S]*?\n\];/)[0].replace('const QUESTIONS','globalThis.QUESTIONS');
const g=h.match(/const GLOSSARY=\{[\s\S]*?\n\};/)[0].replace('const GLOSSARY','globalThis.GLOSSARY');
eval(m);eval(g);
let ok=true;
const keys=QUESTIONS.map(q=>q.cat+'|'+q.q);const dup=keys.filter((k,i)=>keys.indexOf(k)!==i);
if(dup.length){console.log('NG 重複:',dup);ok=false;}
QUESTIONS.forEach((q,i)=>{
  if(q.options.length>4||q.options.length<2){console.log('NG 択数',i);ok=false;}
  if(q.answer<0||q.answer>=q.options.length){console.log('NG answer範囲外',i);ok=false;}
  if(new Set(q.options).size!==q.options.length){console.log('NG 選択肢重複',i);ok=false;}
  if(q.options.some(o=>!o||!String(o).trim())){console.log('NG 空選択肢',i);ok=false;}
});
new Function(h.match(/<script>([\s\S]*?)<\/script>/)[1]); // script全体の構文
console.log('QUESTIONS:',QUESTIONS.length,'GLOSSARY:',Object.keys(GLOSSARY).length,'dup:',dup.length||'なし');
console.log(ok?'=== PASS ===':'=== NG ===');
process.exit(ok?0:1);
"
```

チェック内容: JSON/JS構文・`cat|q`重複なし・全問2〜4択・answer範囲内・選択肢の重複/空なし・script全体がパースできること。

### Step 5. commit & push
- コミットメッセージは `feat: <日本語で何のクイズを足したか簡潔に>`。
- `--no-verify` は使わない（フックを通す）。落ちたら原因を直す。
- main ブランチで作業してよい（このリポはGitHub Pagesで公開、HTMLキャッシュは抑止済み）。

```bash
cd /Users/tkhr/development/engineer-quiz && git add index.html && git commit -m "feat: ..." && git push
```

### Step 6. 報告
追加した問題の一覧（カテゴリ｜設問の要点）を表で示し、何問→何問になったか・反映はGitHub Pagesに数分かかる旨を伝える。

## カテゴリの考え方
既存に合わせる。実例ベースは具体カテゴリ（例: `設計判断` `スコープ設計` `セキュリティ` `デバッグ / 環境` `Prisma / ORM`）、
前提知識を補う土台問題は `基礎 / Git` `基礎 / DB` のように `基礎 / xxx` を使う。

## 注意
- index.html の作り（出題ロジック・SRS・用語ポップアップ・選択肢シャッフル・状況整形）は壊さない。触るのは原則 `QUESTIONS` と `GLOSSARY` だけ。
- 大量（数十問）を一度に足すときは並列サブエージェントで分担してよいが、**同一ファイルの同時編集は競合する**ので範囲を分け、最後に呼び出し元がまとめて検証・commitする。
- 1問の事象でも、それを理解するのに必要な前提が未出題なら、土台クイズも併せて足すと定着しやすい。
