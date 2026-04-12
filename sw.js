const CACHE_NAME = 'service-v07';
const ASSETS_TO_CACHE = [
  './',
  './index.html',
  './manifest.json',
  'https://fonts.googleapis.com/css2?family=Inter:wght@400;700;900&display=swap',
  'https://raw.githubusercontent.com/mesaque-zake/Service-Itaquera/refs/heads/main/SescLogo.png'
];

// Instalação: Salva os arquivos essenciais no cache do celular
self.addEventListener('install', (event) => {
  event.waitUntil(
    caches.open(CACHE_NAME)
      .then((cache) => cache.addAll(ASSETS_TO_CACHE))
      .then(() => self.skipWaiting())
  );
});

// Ativação: Limpa caches antigos se você atualizar a versão (v2, v3...)
self.addEventListener('activate', (event) => {
  event.waitUntil(
    caches.keys().then((cacheNames) => {
      return Promise.all(
        cacheNames.filter((name) => name !== CACHE_NAME)
          .map((name) => caches.delete(name))
      );
    })
  );
  self.clients.claim();
});

// Interceptação de requisições: Serve do cache primeiro, depois da rede
self.addEventListener('fetch', (event) => {
  // Ignora a URL do GAS, pois ela é dinâmica e não deve ser cacheada
  if (event.request.url.includes('script.google.com')) return;

  event.respondWith(
    caches.match(event.request).then((response) => {
      return response || fetch(event.request);
    })
  );
});
