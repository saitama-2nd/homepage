// サイト全体の設定。チーム名・リンク先など「後で変えそうなもの」はここに集める。
export const site = {
  teamName: 'SAITAMA 2nd.',
  teamNameJa: 'さいたま セカンド',
  league: 'さいたま市南部支部 1部リーグ所属',
  tagline: '仕事のあとも、本気で蹴る。',
  instagramUrl: '', // 例: 'https://www.instagram.com/チームのID/'
  // 問い合わせ先（Googleフォーム / LINE など）。決まったらここに URL を入れるだけ。
  contactUrl: '',
  sponsorContactUrl: '',
};

// ナビゲーション。ページを増やしたらここに足す。
export const nav = [
  { label: 'TOP', href: '' },
  { label: 'チーム紹介', href: 'about' },
  { label: '選手', href: 'players' },
  { label: '試合', href: 'matches' },
  { label: '入団・体験', href: 'join' },
  { label: 'スポンサー', href: 'sponsor' },
];
