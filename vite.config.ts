import { defineConfig } from 'vite'

export default defineConfig({
  server: {
    host: true,
    port: 5173
  },
  // HACK: fix link path because endpoint of GitHub pages is https://syuparn.github.io/clock/ (not root)
  base: process.env.GITHUB_PAGES
    ? ''
    : './'
})
