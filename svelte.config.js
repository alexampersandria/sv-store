import { mdsvex } from 'mdsvex'
import rehypeSlug from 'rehype-slug'
import adapter from '@sveltejs/adapter-static'
import { vitePreprocess } from '@sveltejs/vite-plugin-svelte'

/** @type {import('@sveltejs/kit').Config} */
const config = {
  kit: {
    adapter: adapter({
      pages: 'build',
      assets: 'build',
      precompress: false,
      strict: true,
      fallback: 'index.html',
    }),
  },
  extensions: ['.svelte', '.svx', '.md'],
  preprocess: [
    mdsvex({
      extensions: ['.svx', '.md'],
      rehypePlugins: [rehypeSlug],
    }),
    vitePreprocess(),
  ],
}

export default config
