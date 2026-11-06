export const SERVICE_LABELS = Object.freeze({financeiro:'Sistema financeiro',web:'Sites',sistemas:'Sistemas para negócios',planilhas:'Planilhas de controle',outro:'Preciso de ajuda para escolher'});
export const LEGACY_SERVICES = Object.freeze({clientflow:'sistemas',finance:'financeiro',custom:'sistemas',vertical:'sistemas',landing:'web',site:'web',sites:'web','site-panel':'web',commerce:'web',spreadsheet:'planilhas',automacao:'planilhas',dados:'planilhas',data:'planilhas',analytics:'planilhas',ia:'sistemas',ai:'sistemas',api:'sistemas',mvp:'sistemas',evolucao:'sistemas',deploy:'sistemas',security:'sistemas',other:'outro'});
export const cleanText = (value, max = 2500) => String(value ?? '').replace(/[\u0000-\u0008\u000B\u000C\u000E-\u001F\u007F]/g,' ').replace(/[ \t]{3,}/g,' ').trim().slice(0,max);
export function validateFields(fields) {
  const errors = {};
  if (cleanText(fields.name,80).length < 2) errors.name='Informe seu nome com pelo menos 2 caracteres.';
  if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(cleanText(fields.email,160))) errors.email='Confira o email informado.';
  const phone = cleanText(fields.phone,25);
  if (phone && (!/^\+?[\d\s().-]+$/.test(phone) || phone.replace(/\D/g,'').length < 10 || phone.replace(/\D/g,'').length > 15)) errors.phone='Informe um telefone com DDD ou deixe este campo vazio.';
  if (!Object.hasOwn(SERVICE_LABELS,fields.service)) errors.service='Selecione um produto ou a opção de ajuda para escolher.';
  if (cleanText(fields.message).length < 10) errors.message='Conte em uma frase o que você precisa, com pelo menos 10 caracteres.';
  return errors;
}
export function createPayload(fields, accessKey) {
  return {access_key:accessKey,subject:'Novo contato — MATRIZ',from_name:'Site MATRIZ',name:cleanText(fields.name,80),email:cleanText(fields.email,160),Empresa:cleanText(fields.company,100),WhatsApp:cleanText(fields.phone,25),Projeto:SERVICE_LABELS[fields.service] || 'Outro',Investimento:cleanText(fields.budget,100),message:cleanText(fields.message),botcheck:''};
}
export async function sendContact(payload, {fetchImpl = fetch, timeoutMs = 12000} = {}) {
  const controller = new AbortController();
  const timer = setTimeout(() => controller.abort(), timeoutMs);
  try {
    const response = await fetchImpl('https://api.web3forms.com/submit', {method:'POST',mode:'cors',cache:'no-store',credentials:'omit',referrerPolicy:'no-referrer',headers:{'Content-Type':'application/json','Accept':'application/json'},body:JSON.stringify(payload),signal:controller.signal});
    const result = await response.json().catch(() => ({}));
    if (response.status === 429) throw new Error('RATE_LIMIT');
    if (!response.ok || result.success !== true) throw new Error('SUBMIT_FAILED');
    return true;
  } finally { clearTimeout(timer); }
}
