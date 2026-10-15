(() => {
  'use strict';
  const dialog = document.getElementById('preview-dialog');
  // Keep the original image links functional without native dialog support.
  if (typeof dialog?.showModal !== 'function') return;
  const image = document.getElementById('preview-image');
  const title = document.getElementById('preview-title');
  const caption = document.getElementById('preview-caption');
  const status = document.getElementById('preview-load-status');
  const original = document.getElementById('preview-original');
  const stage = document.getElementById('preview-stage');
  const zoom = document.getElementById('preview-zoom');
  let opener;
  const fitImage = () => {
    stage.classList.remove('is-zoomed');
    stage.scrollTop = stage.scrollLeft = 0;
    zoom.setAttribute('aria-pressed', 'false');
    zoom.textContent = 'Ampliar detalhes';
  };
  image.addEventListener('load', () => {
    if (!dialog.open) return;
    image.width = image.naturalWidth;
    image.height = image.naturalHeight;
    image.hidden = false;
    zoom.disabled = false;
    status.textContent = '';
  });
  image.addEventListener('error', () => {
    if (!dialog.open) return;
    image.hidden = true;
    zoom.disabled = true;
    status.textContent = 'Não foi possível carregar a imagem. Use “Abrir original” ou tente novamente.';
  });
  document.addEventListener('click', event => {
    const link = event.target.closest?.('a[data-preview]');
    if (!link || event.defaultPrevented || event.button !== 0 || event.ctrlKey || event.metaKey || event.shiftKey || event.altKey) return;
    const url = new URL(link.href, location.href);
    if (url.origin !== location.origin) return;
    title.textContent = link.dataset.previewTitle || 'Prévia do projeto';
    caption.textContent = link.dataset.previewCaption || '';
    image.alt = link.dataset.previewAlt || title.textContent;
    original.href = url.href;
    original.setAttribute('aria-label', `Abrir imagem original de ${title.textContent} em nova aba`);
    image.hidden = true;
    zoom.disabled = true;
    fitImage();
    status.textContent = 'Carregando imagem…';
    try { dialog.showModal(); } catch { return; }
    event.preventDefault();
    opener = link;
    document.body.classList.add('preview-open');
    image.src = url.href;
  });
  document.getElementById('preview-close').addEventListener('click', () => dialog.close());
  dialog.addEventListener('click', event => {
    if (event.target !== dialog) return;
    const bounds = dialog.getBoundingClientRect();
    if (event.clientX < bounds.left || event.clientX > bounds.right || event.clientY < bounds.top || event.clientY > bounds.bottom) dialog.close();
  });
  dialog.addEventListener('close', () => {
    document.body.classList.remove('preview-open');
    image.hidden = true;
    image.removeAttribute('src');
    status.textContent = '';
    fitImage();
    opener?.focus({preventScroll: true});
  });
  zoom.addEventListener('click', () => {
    const expanded = !stage.classList.contains('is-zoomed');
    stage.classList.toggle('is-zoomed', expanded);
    zoom.setAttribute('aria-pressed', String(expanded));
    zoom.textContent = expanded ? 'Ajustar à tela' : 'Ampliar detalhes';
    stage.scrollTop = stage.scrollLeft = 0;
  });
})();
