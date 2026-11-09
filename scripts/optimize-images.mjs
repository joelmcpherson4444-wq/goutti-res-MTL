import sharp from 'sharp';
import { mkdir } from 'node:fs/promises';
const [duplex, downspout] = process.argv.slice(2);
if (!duplex || !downspout) throw new Error('Usage: npm run images -- chemin/duplex.png chemin/descente.png');
await mkdir('public/images', { recursive: true });
for (const [kind, source] of [['duplex', duplex], ['downspout', downspout]]) {
 await sharp(source).rotate().resize(1200, 1284, { fit: 'cover', position: 'east', withoutEnlargement: true }).webp({ quality: 82 }).toFile(`public/images/${kind}.webp`);
 await sharp(source).rotate().resize(720, 626, { fit: 'cover', position: 'east', withoutEnlargement: true }).webp({ quality: 80 }).toFile(`public/images/${kind}-mobile.webp`);
}
console.log('Images optimisées. Inspecter les recadrages, puis passer business.images.ready à true.');
