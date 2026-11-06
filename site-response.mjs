// Keep shared static files usable at the GitHub Pages prefix and Railway root.
export function publicText(body, production = false) {
  if (!production) return body;
  return Buffer.from(body.toString('utf8')
    .replaceAll('https://gabrielsantanabr.github.io/matriz', 'https://matriz.up.railway.app')
    .replaceAll('"/matriz/', '"/')
    .replaceAll('Disallow: /matriz/', 'Disallow: /'));
}
