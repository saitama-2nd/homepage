// サイト全体の設定。チーム名・リンク先など「後で変えそうなもの」はここに集める。
export const site = {
  teamName: 'Saitama 2nd.',
  league: 'さいたま市南部支部 1部リーグ所属',
  tagline: '仕事と両立しながら、サッカーに真剣に取り組む。',
  instagramUrl: '', // 例: 'https://www.instagram.com/チームのID/'
  // 問い合わせを受信するメールアドレス。設定後、FormSubmit.co の初回確認が必要。
  contactEmail: 'mikihito.hakuta@gmail.com',
};

// ナビゲーション。ページを増やしたらここに足す。
export const nav = [
  { label: 'TOP', href: '' },
  { label: 'チーム紹介', href: 'about' },
  { label: '選手', href: 'players' },
  { label: '試合', href: 'matches' },
  { label: '入団・体験', href: 'join' },
  { label: 'スポンサー', href: 'sponsor' },
  { label: 'お問い合わせ', href: 'contact' },
];
