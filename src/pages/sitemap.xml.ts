import { business, publicOrigin } from '../config.mjs';
export function GET() {
 const origin = publicOrigin();
 const paths = business.mode === 'production' && business.indexable && origin ? ['/', '/installation-de-gouttieres/', '/descentes-pluviales/', '/secteurs/', '/reparer-ou-remplacer-ses-gouttieres/', '/soumission/'] : [];
 const escape = (s: string) => s.replaceAll('&', '&amp;').replaceAll('<', '&lt;').replaceAll('"', '&quot;');
 return new Response(`<?xml version="1.0" encoding="UTF-8"?><urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">${paths.map(p => `<url><loc>${escape(new URL(p, origin).href)}</loc></url>`).join('')}</urlset>`, { headers: { 'Content-Type': 'application/xml; charset=utf-8' } });
}
