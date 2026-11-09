export const business = {
  name: 'Gouttières Montréal',
  phone: {
    display: '514-123-4567', // Seul numéro à remplacer.
    get e164() { return '+1' + this.display.replace(/\D/g, ''); },
    verified: false
  },
  // Independent gates: a real phone can be enabled before the form.
  mode: 'preview', publicUrl: '', indexable: false,
  quote: { endpoint: '', recipient: '', enabled: false },
  services: [
    { name: 'Remplacement de gouttières', href: '/', summary: 'Repartir avec un système adapté lorsque les gouttières sont usées ou déformées.' },
    { name: 'Installation de gouttières', href: '/installation-de-gouttieres/', summary: 'Équiper un bâtiment et prévoir le parcours de l’eau dès le départ.' },
    { name: 'Descentes pluviales', href: '/descentes-pluviales/', summary: 'Acheminer l’eau recueillie vers un point d’évacuation approprié.' }
  ],
  sectors: ['Ahuntsic-Cartierville', 'Rosemont–La Petite-Patrie', 'Villeray–Saint-Michel–Parc-Extension', 'Mercier–Hochelaga-Maisonneuve', 'Saint-Laurent', 'Verdun', 'Le Sud-Ouest', 'Rivière-des-Prairies–Pointe-aux-Trembles'],
  images: { ready: true, duplexAlt: 'Façade d’un duplex en brique avec des gouttières et une descente pluviale noires.', downspoutAlt: 'Gouttière blanche reliée à une descente pluviale sur un mur de brique.' }
};
export function runtime(c = business) {
 const production = c.mode === 'production';
 const validPhone = /^\+1[2-9]\d{2}[2-9]\d{6}$/.test(c.phone.e164);
 let endpoint = false;
 try { endpoint = new URL(c.quote.endpoint).protocol === 'https:'; } catch {}
 return { calls: production && c.phone.verified && validPhone, quotes: production && c.quote.enabled && endpoint && !!c.quote.recipient.trim() };
}
export function publicOrigin(c = business) {
 if (!c.publicUrl) return undefined;
 const u = new URL(c.publicUrl);
 if (u.protocol !== 'https:' || u.username || u.password || u.pathname !== '/' || u.search || u.hash || /^(localhost|127\.)/.test(u.hostname)) throw new Error('Configurer une origine publique HTTPS sans chemin.');
 return u.origin;
}
