// Astro の設定ファイル
//
// GitHub Actions で公開するときは、リポジトリの名前から site / base を自動で決める。
//   例）アカウント taro、リポジトリ saitama2nd-hp
//       → site: https://taro.github.io  base: /saitama2nd-hp
// 手元（npm run dev）では、下の「ローカル用」の値が使われる。
import { defineConfig } from 'astro/config';

const repository = process.env.GITHUB_REPOSITORY; // 例: "taro/saitama2nd-hp"（GitHub 上でだけ入っている）

let site = 'https://YOUR-GITHUB-USERNAME.github.io'; // ローカル用
let base = '/saitama2nd-hp'; // ローカル用

if (repository) {
  const [owner, repo] = repository.split('/');
  site = `https://${owner.toLowerCase()}.github.io`;
  // リポジトリ名が「<アカウント名>.github.io」なら、base は不要
  base = repo.toLowerCase() === `${owner.toLowerCase()}.github.io` ? '/' : `/${repo}`;
}

export default defineConfig({
  site,
  base,
  devToolbar: { enabled: false },
});
