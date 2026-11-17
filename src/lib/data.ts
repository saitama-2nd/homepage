// 選手・試合のデータを読み込む場所。
// いまは data/ フォルダのサンプル CSV を読む。
// 将来は、Google スプレッドシートから取り込んだ CSV を同じ場所（data/）に置くだけで差し替わる。
import fs from 'node:fs';
import path from 'node:path';
import { parseCsv } from './csv';

export interface Player {
  order: number;
  name: string;
  number: string;
  position: string;
  photo: string; // 画像ファイル名（public/images/players/ に置く）。空欄なら代替画像
}

export type ForfeitResult = '不戦勝' | '不戦敗';
export type MatchScore = number | ForfeitResult | null;

export interface Match {
  date: string; // YYYY-MM-DD
  opponent: string;
  venue: string;
  competition: string;
  ourScore: MatchScore;
  theirScore: MatchScore;
  note: string;
  played: boolean; // 結果が入っていれば true
  result: 'win' | 'lose' | 'draw' | null;
}

function readCsv(name: string) {
  const file = path.resolve(process.cwd(), 'data', name);
  if (!fs.existsSync(file)) return [];
  return parseCsv(fs.readFileSync(file, 'utf-8'));
}

// ここでデータの形をチェックする。入力ミスがあると、ビルドが止まって「どの行が悪いか」を教えてくれる。
function fail(sheet: string, line: number, msg: string): never {
  throw new Error(`【${sheet}】${line}行目: ${msg}`);
}

export function loadPlayers(): Player[] {
  return readCsv('players.csv')
    .map((r, i) => ({ r, line: i + 2 }))
    .filter(({ r }) => r['表示'] !== '×') // 「表示」が × の人は載せない
    .map(({ r, line }) => {
      if (!r['名前']) fail('選手', line, '「名前」が空です');
      return {
        order: Number(r['表示順']) || 999,
        name: r['名前'],
        number: r['背番号'] ?? '',
        position: r['ポジション'] ?? '',
        photo: r['写真'] ?? '',
      };
    })
    .sort((a, b) => a.order - b.order);
}

export function loadMatches(): Match[] {
  return readCsv('matches.csv')
    .map((r, i) => ({ r, line: i + 2 }))
    .map(({ r, line }) => {
      if (!/^\d{4}-\d{2}-\d{2}$/.test(r['日付'] ?? '')) {
        fail('試合', line, `「日付」は 2026-11-03 の形で入力してください（現在: "${r['日付'] ?? ''}"）`);
      }
      if (!r['対戦相手']) fail('試合', line, '「対戦相手」が空です');
      const ourValue = r['自チーム得点'] ?? '';
      const theirValue = r['相手得点'] ?? '';
      const forfeit = [ourValue, theirValue].find(
        (score): score is ForfeitResult => score === '不戦勝' || score === '不戦敗',
      );
      let ourScore: MatchScore = null;
      let theirScore: MatchScore = null;
      let played = false;
      let result: Match['result'] = null;

      if (forfeit) {
        if (ourValue !== '' && theirValue !== '') {
          fail('試合', line, '「不戦勝」「不戦敗」を入力する場合、もう一方の得点欄は空欄にしてください');
        }
        ourScore = ourValue === forfeit ? forfeit : null;
        theirScore = theirValue === forfeit ? forfeit : null;
        played = true;
        result = forfeit === '不戦勝' ? 'win' : 'lose';
      } else {
        const our = ourValue === '' ? null : Number(ourValue);
        const their = theirValue === '' ? null : Number(theirValue);
        if ((our === null) !== (their === null)) {
          fail('試合', line, '得点は「自チーム」「相手」の両方を入力してください');
        }
        if ((our !== null && Number.isNaN(our)) || (their !== null && Number.isNaN(their))) {
          fail('試合', line, '得点は数字、または「不戦勝」「不戦敗」で入力してください');
        }
        ourScore = our;
        theirScore = their;
        if (our !== null && their !== null) {
          played = true;
          result = our > their ? 'win' : our < their ? 'lose' : 'draw';
        }
      }
      return {
        date: r['日付'],
        opponent: r['対戦相手'],
        venue: r['会場'] ?? '',
        competition: r['大会名'] ?? '',
        ourScore,
        theirScore,
        note: r['メモ'] ?? '',
        played,
        result,
      } satisfies Match;
    })
    .sort((a, b) => a.date.localeCompare(b.date));
}

// 今日の日付（日本時間）を 2026-11-03 の形で返す。サイトは毎日作り直されるので、日付はその日の朝の時点。
export function todayJst(): string {
  return new Date(Date.now() + 9 * 60 * 60 * 1000).toISOString().slice(0, 10);
}

export function formatDate(iso: string) {
  const [year, month, day] = iso.split('-').map(Number);
  const weekday = new Date(Date.UTC(year, month - 1, day)).getUTCDay();
  const week = ['日', '月', '火', '水', '木', '金', '土'][weekday];
  return { md: `${month}/${day}`, week: `${year} (${week})` };
}
