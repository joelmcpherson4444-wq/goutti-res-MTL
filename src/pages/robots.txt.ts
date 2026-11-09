import { business, publicOrigin } from '../config.mjs';
export function GET() {
 const origin = publicOrigin();
 const enabled = business.mode === 'production' && business.indexable && origin;
 return new Response(enabled ? `User-agent: *\nAllow: /\nSitemap: ${origin}/sitemap.xml\n` : 'User-agent: *\nDisallow: /\n', { headers: { 'Content-Type': 'text/plain; charset=utf-8' } });
}
