const VERSION='4.0.0';
const SHELL_CACHE=`mediaforge-404-shell-v${VERSION}`;
const RUNTIME_CACHE='mediaforge-404-runtime-v4';
const SHELL=["./","./assets/index-DPa7T7_t.css","./assets/index-XZLnVThK.js","./assets/worker-BAOIWoxA.js","./icons/icon-192.png","./icons/icon-512.png","./icons/icon.svg","./index.html","./manifest.webmanifest"]; // __PRECACHE__

self.addEventListener('install',event=>{
  event.waitUntil(caches.open(SHELL_CACHE).then(cache=>cache.addAll(SHELL)));
});

self.addEventListener('activate',event=>{
  event.waitUntil((async()=>{
    const keys=await caches.keys();
    await Promise.all(keys.filter(key=>key.startsWith('mediaforge-404-')&&![SHELL_CACHE,RUNTIME_CACHE].includes(key)).map(key=>caches.delete(key)));
    await self.clients.claim();
  })());
});

self.addEventListener('message',event=>{
  if(event.data?.type==='SKIP_WAITING')self.skipWaiting();
  if(event.data?.type==='CLEAR_RUNTIME')event.waitUntil(caches.delete(RUNTIME_CACHE));
});

self.addEventListener('fetch',event=>{
  const request=event.request;
  if(request.method!=='GET'||request.headers.has('range')||!request.url.startsWith(self.location.origin))return;
  const url=new URL(request.url);
  if(request.mode==='navigate'){
    event.respondWith(networkFirst(request,'./'));
    return;
  }
  if(url.pathname.includes('/vendor/ffmpeg/')){
    event.respondWith(cacheFirst(request,RUNTIME_CACHE));
    return;
  }
  if(/\.(?:js|css|png|svg|webmanifest)$/i.test(url.pathname)){
    event.respondWith(staleWhileRevalidate(request,SHELL_CACHE));
    return;
  }
  event.respondWith(cacheFirst(request,RUNTIME_CACHE));
});

async function networkFirst(request,fallback){
  try{
    const response=await fetch(request);
    if(response?.ok){const cache=await caches.open(SHELL_CACHE);cache.put(request,response.clone());}
    return response;
  }catch{
    return (await caches.match(request))||(await caches.match(fallback))||Response.error();
  }
}

async function cacheFirst(request,cacheName){
  const cached=await caches.match(request);
  if(cached)return cached;
  const response=await fetch(request);
  if(response?.ok){const cache=await caches.open(cacheName);cache.put(request,response.clone());}
  return response;
}

async function staleWhileRevalidate(request,cacheName){
  const cache=await caches.open(cacheName);
  const cached=await cache.match(request);
  const network=fetch(request).then(response=>{if(response?.ok)cache.put(request,response.clone());return response;}).catch(()=>null);
  return cached||(await network)||Response.error();
}
