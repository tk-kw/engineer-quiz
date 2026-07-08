#!/usr/bin/env node
// QUESTIONS / GLOSSARY の機械チェック。1つでも落ちたら exit 1。
// 対象 index.html はリポジトリルート直下。パス解決の優先順:
//   1) 第1引数  2) $CLAUDE_PROJECT_DIR/index.html  3) このスクリプトからの相対(../../../../)
const fs = require('fs');
const path = require('path');

const target =
  process.argv[2] ||
  (process.env.CLAUDE_PROJECT_DIR && path.join(process.env.CLAUDE_PROJECT_DIR, 'index.html')) ||
  path.resolve(__dirname, '../../../../index.html');

const h = fs.readFileSync(target, 'utf8');
const m = h.match(/const QUESTIONS = \[[\s\S]*?\n\];/)[0].replace('const QUESTIONS', 'globalThis.QUESTIONS');
const g = h.match(/const GLOSSARY=\{[\s\S]*?\n\};/)[0].replace('const GLOSSARY', 'globalThis.GLOSSARY');
eval(m);
eval(g);

let ok = true;
const keys = QUESTIONS.map(q => q.cat + '|' + q.q);
const dup = keys.filter((k, i) => keys.indexOf(k) !== i);
if (dup.length) { console.log('NG 重複:', dup); ok = false; }

QUESTIONS.forEach((q, i) => {
  if (q.options.length > 4 || q.options.length < 2) { console.log('NG 択数', i); ok = false; }
  if (q.answer < 0 || q.answer >= q.options.length) { console.log('NG answer範囲外', i); ok = false; }
  if (new Set(q.options).size !== q.options.length) { console.log('NG 選択肢重複', i); ok = false; }
  if (q.options.some(o => !o || !String(o).trim())) { console.log('NG 空選択肢', i); ok = false; }
});

new Function(h.match(/<script>([\s\S]*?)<\/script>/)[1]); // <script> 全体の構文

console.log('QUESTIONS:', QUESTIONS.length, 'GLOSSARY:', Object.keys(GLOSSARY).length, 'dup:', dup.length || 'なし');
console.log(ok ? '=== PASS ===' : '=== NG ===');
process.exit(ok ? 0 : 1);
