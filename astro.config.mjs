import { defineConfig } from 'astro/config';
import { business, publicOrigin } from './src/config.mjs';
const pages = process.env.GITHUB_PAGES === 'true';
const site = pages ? 'https://joelmcpherson4444-wq.github.io' : publicOrigin();
if (business.indexable && (business.mode !== 'production' || !site || !business.images.ready)) throw new Error('Indexation: production, URL publique et images requises.');
export default defineConfig({ site, base: pages ? '/goutti-res-MTL/' : '/', output: 'static', trailingSlash: 'always' });
