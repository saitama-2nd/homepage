# SAITAMA 2nd. 公式サイト

さいたま市南部支部1部リーグ所属の社会人サッカーチームのホームページです。
Astro（静的サイトを作る道具）で作っています。

## 動かし方（自分のパソコンで見る）

1. Node.js（LTS 版）をインストールしておく
2. このフォルダをターミナルで開いて、次を実行

```bash
npm install     # 初回だけ。必要な部品をダウンロード
npm run dev     # 開発用サーバーを起動
```

3. ブラウザで表示されたアドレス（`http://localhost:4321/saitama2nd-hp/`）を開く
4. ファイルを保存すると、画面が自動で更新される

公開用のファイルを作るときは `npm run build`（`dist/` に出力）。

## フォルダの見方

| 場所 | 役割 |
|---|---|
| `src/site.ts` | チーム名、メニュー、Instagram、問い合わせ受信先など。**まずここを見る** |
| `src/pages/` | 各ページ（1ファイル＝1ページ） |
| `src/components/` | ヘッダー・フッターなどの部品 |
| `src/styles/global.css` | 色とデザイン。一番上の `--navy` `--yellow` などを変えると全体の配色が変わる |
| `src/lib/` | CSV を読み込む処理 |
| `data/players.csv` | 選手のデータ（いまはサンプル） |
| `data/matches.csv` | 試合の日程・結果のデータ（いまはサンプル） |
| `public/images/` | 画像。エンブレムは `emblem.png` |
| `public/images/players/` | 選手の写真を置く場所 |

## よく使う作業

- **Instagram・問い合わせ先を設定**：`src/site.ts` の `instagramUrl` と `contactEmail` を設定する
- **エンブレムを差し替え**：`public/images/emblem.png` を同じ名前で上書き（正方形で 600px 以上がおすすめ）
- **選手を追加・編集・削除**：`data/players.csv` を編集。「表示」を × にすると、行を消さずに非表示にできる
- **選手の写真**：`public/images/players/` に画像を入れ、CSV の「写真」列にファイル名だけ書く。空欄なら代替画像
- **試合を追加**：`data/matches.csv` に 1 行足す。得点が空なら「日程」、入っていれば「結果」に自動で表示される
- **日付の形式**：`2026-11-03` のように、年-月-日で入力する（違うとビルド時にエラーで教えてくれる）

## 公開と、スプレッドシートからの更新

公開のしかた、スプレッドシートのつなぎ方、日常の更新、困ったときの対処は
**[docs/運用ガイド.md](docs/運用ガイド.md)** にまとめています。

- 公開：GitHub Pages（`.github/workflows/deploy.yml` が自動で行う）
- 取り込み：`scripts/fetch-sheets.mjs` が、公開した CSV を `data/` に保存する
- `site` / `base` は、GitHub 上では自動で決まる（`astro.config.mjs`）

## このあとの予定

- チーム紹介・入団案内・スポンサー案内の文章
- 問い合わせフォームの受信先メールアドレスを設定（手順は `docs/運用ガイド.md`）
