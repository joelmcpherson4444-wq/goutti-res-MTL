import { defineConfig } from 'astro/config';
import { business, publicOrigin } from './src/config.mjs';
const site = publicOrigin();
if (business.indexable && (business.mode !== 'production' || !site || !business.images.ready)) throw new Error('Indexation: production, URL publique et images requises.');
export default defineConfig({ site, output: 'static', trailingSlash: 'always' });
