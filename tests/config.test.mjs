import { test } from 'node:test';
import assert from 'node:assert/strict';
import { business, runtime, publicOrigin } from '../src/config.mjs';
const copy = () => structuredClone(business);
test('preview never enables calls or submissions', () => {
 const c = copy(); c.phone.verified = true; c.quote = { enabled: true, endpoint: 'https://example.com/quote', recipient: 'Partenaire' };
 assert.deepEqual(runtime(c), {calls:false,quotes:false});
});
test('production refuses fictitious and unverified phone numbers', () => {
 const c = copy(); c.mode = 'production'; c.phone.verified = true;
 assert.equal(runtime(c).calls, false);
 c.phone.e164 = '+15145551234'; c.phone.verified = false;
 assert.equal(runtime(c).calls, false);
 c.phone.verified = true; assert.equal(runtime(c).calls, true);
});
test('form needs HTTPS endpoint and recipient', () => {
 const c = copy(); c.mode = 'production'; c.quote.enabled = true;
 assert.equal(runtime(c).quotes, false);
 c.quote.endpoint = 'https://example.com/quote'; assert.equal(runtime(c).quotes, false);
 c.quote.recipient = 'Le partenaire confirmé recevra votre demande.'; assert.equal(runtime(c).quotes, true);
 c.quote.endpoint = 'http://example.com/quote'; assert.equal(runtime(c).quotes, false);
});
test('canonical origin rejects invalid configuration', () => {
 const c = copy(); assert.equal(publicOrigin(c), undefined);
 for (const url of ['http://example.com', 'https://localhost', 'https://example.com/path', 'https://user:pass@example.com']) { c.publicUrl=url; assert.throws(() => publicOrigin(c)); }
 c.publicUrl='https://example.com'; assert.equal(publicOrigin(c), 'https://example.com');
});
