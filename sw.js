// Chess Coach service worker — cc-202607022216
const V='cc-202607022216';
const SHELL=['./','./index.html','./manifest.webmanifest','./icon-192.png','./icon-512.png','./icon-maskable-512.png','./apple-touch-icon.png'];
self.addEventListener('install',e=>{e.waitUntil(caches.open(V).then(c=>c.addAll(SHELL)).then(()=>self.skipWaiting()))});
self.addEventListener('activate',e=>{e.waitUntil(caches.keys().then(ks=>Promise.all(ks.filter(k=>k!==V).map(k=>caches.delete(k)))).then(()=>self.clients.claim()))});
self.addEventListener('fetch',e=>{
  const u=e.request.url;
  if(u.includes('api.chess.com')){return;} // live data: network only
  if(u.includes('fonts.g')){ // fonts: cache, then network
    e.respondWith(caches.open(V).then(async c=>{const hit=await c.match(e.request);if(hit)return hit;const r=await fetch(e.request);c.put(e.request,r.clone());return r;}));
    return;
  }
  e.respondWith(caches.match(e.request).then(hit=>hit||fetch(e.request)));
});
