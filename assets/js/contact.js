import { SERVICE_LABELS, LEGACY_SERVICES, cleanText, validateFields, createPayload, sendContact } from './contact-core.js';
const form = document.getElementById('secure-contact-form');
if (form) {
  form.dataset.enhanced = 'true';
  form.noValidate = true;
  const status = document.getElementById('form-status');
  const button = form.querySelector('[type=submit]');
  const buttonLabel = [...button.childNodes].map(node => node.cloneNode(true));
  const params = new URLSearchParams(location.search);
  const requestedService = params.get('service');
  const mapped = Object.hasOwn(SERVICE_LABELS,requestedService) ? requestedService : (Object.hasOwn(LEGACY_SERVICES,requestedService) ? LEGACY_SERVICES[requestedService] : undefined);
  if (mapped && !form.elements.service.value) form.elements.service.value = mapped;
  const interest = document.getElementById('contact-interest');
  const updateInterest = () => {
    if (interest) interest.textContent = form.elements.service.value ? form.elements.service.selectedOptions[0]?.textContent : 'Vamos descobrir juntos o que você precisa.';
  };
  form.elements.service.addEventListener('change', updateInterest);
  updateInterest();
  const project = cleanText(params.get('project'),100), plan = cleanText(params.get('plan'),60);
  if ((project || plan) && !form.elements.message.value) form.elements.message.value = `Tenho interesse em ${project || 'uma solução'}${plan ? `, com ${plan} como referência` : ''}. Gostaria de conversar sobre o escopo. `;
  const count = document.getElementById('message-length');
  const updateLength = () => { if (count) count.textContent = `${form.elements.message.value.length.toLocaleString('pt-BR')} / 2.500`; };
  form.elements.message.addEventListener('input', updateLength);
  updateLength();
  const attemptKey = 'matriz-contact-attempt';
  const getLast = () => { try { return Number(sessionStorage.getItem(attemptKey)) || 0; } catch { return 0; } };
  const saveLast = value => { try { sessionStorage.setItem(attemptKey,String(value)); } catch { /* Private mode can disable storage. */ } };
  let lastAttempt = getLast();
  let sending = false;
  const message = (text, state) => { status.textContent=text; status.dataset.state=state; };
  addEventListener('online', () => {
    if (status.dataset.state === 'offline') message('A conexão voltou. Você pode tentar enviar novamente.','ready');
  });
  const clearError = event => {
    if (!event.target.name) return;
    event.target.removeAttribute('aria-invalid');
    const note = document.getElementById(`${event.target.id}-error`);
    if (note) { note.hidden=true; note.textContent=''; }
  };
  form.addEventListener('input', clearError);
  form.addEventListener('change', clearError);
  form.addEventListener('submit', async event => {
    event.preventDefault();
    if (sending || form.elements.botcheck.checked) return;
    const fields = Object.fromEntries(new FormData(form));
    const errors = validateFields(fields);
    for (const input of form.querySelectorAll('[aria-invalid]')) clearError({target:input});
    for (const [name,text] of Object.entries(errors)) {
      const input = form.elements[name], note = document.getElementById(`${name}-error`);
      input.setAttribute('aria-invalid','true');
      const optional = input.closest('details');
      if (optional) optional.open = true;
      if (note) { note.textContent=text; note.hidden=false; }
    }
    if (Object.keys(errors).length || !form.reportValidity()) {
      form.elements[Object.keys(errors)[0]]?.focus();
      message('Confira os campos indicados antes de enviar.','error'); return;
    }
    if (navigator.onLine === false) { message('Você está sem conexão. Seus campos continuam aqui; envie quando a conexão voltar.','offline'); return; }
    const remaining = Math.ceil((15000-(Date.now()-lastAttempt))/1000);
    if (remaining > 0) { message(`Aguarde ${remaining} ${remaining === 1 ? 'segundo' : 'segundos'} antes de tentar novamente.`,'error'); return; }
    lastAttempt=Date.now();saveLast(lastAttempt);sending=true;
    button.disabled=true;button.textContent='Enviando…';form.setAttribute('aria-busy','true');
    message('Enviando sua mensagem.','pending');
    try {
      await sendContact(createPayload(fields,form.elements.access_key.value));
      location.assign('thanks.html');
    } catch (error) {
      if (error.name === 'AbortError') message('O envio demorou mais que o esperado. Seus campos foram preservados. Tente novamente.','error');
      else if (error.message === 'RATE_LIMIT') message('O serviço recebeu muitas tentativas. Aguarde um pouco e tente novamente.','error');
      else message('Não foi possível enviar agora. Seus campos foram preservados. Tente novamente ou use o LinkedIn indicado nesta página.','error');
    } finally {
      sending=false;button.disabled=false;button.replaceChildren(...buttonLabel.map(node => node.cloneNode(true)));form.removeAttribute('aria-busy');
    }
  });
}
