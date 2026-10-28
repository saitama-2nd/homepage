// Google スプレッドシート（「ウェブに公開」した CSV）を取得して、data/ フォルダに保存するスクリプト。
//
// 使うタイミング：GitHub Actions がサイトをビルドする直前（npm run build:ci の中で自動実行）。
// 手元でも `npm run fetch-data` で試せる。
//
// 必要な設定（環境変数）：
//   SHEET_PLAYERS_CSV_URL  … 「選手」シートを CSV で公開した URL
//   SHEET_MATCHES_CSV_URL  … 「試合」シートを CSV で公開した URL
// どちらも未設定なら、何もせずに終了する（= data/ のサンプルをそのまま使う）。
//
// 安全のしくみ：取得に失敗したり、列の名前が違っていたりしたら、エラーで止まる。
// 止まると公開もされないので、前回の正しいサイトがそのまま残る。
import fs from 'node:fs';
import path from 'node:path';

const targets = [
  {
    label: '選手',
    env: 'SHEET_PLAYERS_CSV_URL',
    file: 'players.csv',
    requiredColumns: ['表示順', '名前', '背番号', 'ポジション', '写真', '表示'],
  },
  {
    label: '試合',
    env: 'SHEET_MATCHES_CSV_URL',
    file: 'matches.csv',
    requiredColumns: ['日付', '対戦相手', '会場', '大会名', '自チーム得点', '相手得点', 'メモ'],
  },
];

const dataDir = path.resolve(process.cwd(), 'data');

function stop(message) {
  console.error(`\n[取り込み失敗] ${message}\n`);
  process.exit(1);
}

let fetched = 0;

for (const t of targets) {
  const url = process.env[t.env];
  if (!url) {
    console.log(`- ${t.label}：${t.env} が未設定のため、data/${t.file} のサンプルをそのまま使います`);
    continue;
  }

  let res;
  try {
    res = await fetch(url, { redirect: 'follow' });
  } catch (e) {
    stop(`${t.label}シートに接続できませんでした（${e.message}）`);
  }
  if (!res.ok) stop(`${t.label}シートの取得に失敗しました（HTTP ${res.status}）。公開設定とURLを確認してください`);

  const text = await res.text();

  // 公開されていないと、CSV ではなくログイン画面（HTML）が返ってくる
  if (/^\s*<(!doctype|html)/i.test(text)) {
    stop(`${t.label}シートが CSV ではなく HTML でした。「ウェブに公開」→ 形式を「カンマ区切り形式(.csv)」にして、公開しているか確認してください`);
  }

  const header = text.replace(/^﻿/, '').split(/\r?\n/)[0].split(',').map((h) => h.trim());
  const missing = t.requiredColumns.filter((c) => !header.includes(c));
  if (missing.length > 0) {
    stop(`${t.label}シートの1行目に、次の列名がありません：${missing.join('、')}\n  （現在の1行目：${header.join('、')}）`);
  }

  fs.mkdirSync(dataDir, { recursive: true });
  fs.writeFileSync(path.join(dataDir, t.file), text, 'utf-8');
  const lines = text.split(/\r?\n/).filter((l) => l.trim() !== '').length - 1;
  console.log(`- ${t.label}：${lines} 行を取り込みました → data/${t.file}`);
  fetched++;
}

console.log(fetched > 0 ? `\n取り込み完了（${fetched} 件）` : '\nスプレッドシートは未設定のため、サンプルデータを使用します');
