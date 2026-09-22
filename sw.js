/* Sondaj İş Takip – çevrimdışı önbellek */
const SURUM='sondaj-v3';
const TEMEL=['./','./index.html','./manifest.webmanifest','./icon-192.png','./icon-512.png'];
const CDN=/^https:\/\/(cdnjs\.cloudflare\.com|www\.gstatic\.com\/firebasejs|fonts\.googleapis\.com|fonts\.gstatic\.com|[abc]\.tile\.openstreetmap\.org)\//;
self.addEventListener('install',e=>{e.waitUntil(caches.open(SURUM).then(c=>c.addAll(TEMEL)).then(()=>self.skipWaiting()))});
self.addEventListener('activate',e=>{e.waitUntil(caches.keys().then(ks=>Promise.all(ks.filter(k=>k!==SURUM).map(k=>caches.delete(k)))).then(()=>self.clients.claim()))});
self.addEventListener('fetch',e=>{const r=e.request;if(r.method!=='GET')return;const u=r.url;
  /* Uygulama sayfası: önce ağ, yoksa önbellek (güncellemeler hemen gelir) */
  if(r.mode==='navigate'||(u.startsWith(self.location.origin)&&/\/(index\.html)?$/.test(new URL(u).pathname))){
    e.respondWith(fetch(r).then(res=>{const k=res.clone();caches.open(SURUM).then(c=>c.put('./index.html',k));return res}).catch(()=>caches.match('./index.html').then(m=>m||caches.match('./'))));return}
  /* Kütüphaneler, yazı tipleri, harita karoları: önce önbellek */
  if(CDN.test(u)||u.startsWith(self.location.origin)){
    e.respondWith(caches.match(r).then(m=>m||fetch(r).then(res=>{if(res&&(res.ok||res.type==='opaque')){const k=res.clone();caches.open(SURUM).then(c=>c.put(r,k))}return res})));}
  /* Firebase veritabanı/kimlik istekleri önbelleğe alınmaz */
});
