declare global { interface Window { dataLayer?: Record<string, unknown>[] } }
export function track(event: string) { (window.dataLayer ||= []).push({ event, page_path: location.pathname }); }
export function init() {
 document.querySelectorAll<HTMLElement>('[data-call]').forEach(el => el.addEventListener('click', () => {
  if (el instanceof HTMLAnchorElement) { if (el.dataset.mockCall !== 'true') track('call_click'); }
  else (document.querySelector('#call-dialog') as HTMLDialogElement).showModal();
 }));
 const form = document.querySelector<HTMLFormElement>('#quote-form');
 if (!form) return;
 const phone = form.elements.namedItem('phone') as HTMLInputElement;
 phone.addEventListener('input', () => phone.setCustomValidity(''));
 form.addEventListener('submit', async e => {
  e.preventDefault();
  if (phone.value.replace(/\D/g, '').length < 10) phone.setCustomValidity('Entrez un numéro de téléphone d’au moins 10 chiffres.');
  if (!form.reportValidity()) return;
  const status = document.querySelector<HTMLElement>('#form-status')!;
  const button = form.querySelector<HTMLButtonElement>('[type=submit]')!;
  if (button.disabled) return;
  button.disabled = true; form.setAttribute('aria-busy', 'true');
  status.textContent = 'Traitement de votre demande…';
  try {
   if (document.body.dataset.realQuotes !== 'true') {
    await new Promise(resolve => setTimeout(resolve, 400));
    status.textContent = 'Simulation réussie. Aucune donnée n’a été transmise et aucun entrepreneur ne vous contactera.';
   } else {
    const response = await fetch(document.body.dataset.endpoint!, { method: 'POST', headers: { 'Content-Type': 'application/json', 'Accept': 'application/json' }, body: JSON.stringify(Object.fromEntries(new FormData(form))), signal: AbortSignal.timeout(15000) });
    if (!response.ok) throw new Error('HTTP');
    const result = await response.json();
    if (result.success !== true) throw new Error('Unconfirmed');
    track('quote_submit_success');
    status.textContent = 'Votre demande a bien été transmise. Le destinataire indiqué ci-dessus pourra communiquer avec vous.';
    form.reset();
   }
  } catch { status.textContent = 'La demande n’a pas pu être confirmée. Réessayez plus tard ou utilisez le numéro affiché si les appels sont disponibles.'; }
  finally { button.disabled = false; form.removeAttribute('aria-busy'); status.focus(); }
 });
 form.querySelector<HTMLButtonElement>('[type=submit]')!.disabled = false;
}
