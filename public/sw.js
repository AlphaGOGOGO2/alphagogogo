
// 서비스 워커 버전
const CACHE_VERSION = 'v5'; // 개발 환경 제외 및 소스 파일 캐싱 방지
const CACHE_NAME = `alphagogogo-cache-${CACHE_VERSION}`;

// 개발 환경 감지
const isDevelopment = self.location.hostname === 'localhost' || self.location.hostname === '127.0.0.1';

// 사전 캐시할 자산 목록
const PRECACHE_ASSETS = [
  '/',
  '/index.html',
  '/favicon.ico'
];

// 서비스 워커 설치 시
self.addEventListener('install', event => {
  console.log('[서비스워커] 설치됨');
  
  // 사전 캐시 작업 수행
  event.waitUntil(
    caches.open(CACHE_NAME)
      .then(cache => {
        console.log('[서비스워커] 자산 사전 캐시 중');
        return cache.addAll(PRECACHE_ASSETS);
      })
      .then(() => {
        // 이전 서비스워커 대기 없이 즉시 활성화
        console.log('[서비스워커] 즉시 활성화 중');
        return self.skipWaiting();
      })
  );
});

// 서비스 워커 활성화 시
self.addEventListener('activate', event => {
  console.log('[서비스워커] 활성화됨');
  
  // 이전 캐시 삭제
  event.waitUntil(
    caches.keys().then(cacheNames => {
      return Promise.all(
        cacheNames.map(cacheName => {
          if (cacheName !== CACHE_NAME) {
            console.log('[서비스워커] 이전 캐시 삭제:', cacheName);
            return caches.delete(cacheName);
          }
        })
      );
    }).then(() => {
      console.log('[서비스워커] 클라이언트 요청 처리 준비 완료');
      return self.clients.claim();
    })
  );
});

// 페치 이벤트 처리
self.addEventListener('fetch', event => {
  const url = new URL(event.request.url);

  // 개발 환경에서는 서비스 워커 비활성화
  if (isDevelopment) {
    return;
  }

  // robots.txt, sitemap.xml, rss.xml은 Service Worker를 완전히 bypass
  if (url.pathname === '/robots.txt' ||
      url.pathname === '/sitemap.xml' ||
      url.pathname === '/rss.xml') {
    console.log('[서비스워커] SEO 파일 bypass:', url.pathname);
    return; // Service Worker 완전 우회
  }

  // 소스 파일 (.tsx, .ts, .jsx, .js 등)은 절대 캐싱하지 않음
  if (url.pathname.match(/\.(tsx|ts|jsx|js|css|scss)$/)) {
    return;
  }

  // API 요청 및 동적 콘텐츠는 네트워크만 사용
  if (
    event.request.url.includes('/api/') ||
    event.request.url.includes('/src/') ||
    event.request.url.includes('sockjs-node') ||
    event.request.url.includes('hot-update.json') ||
    event.request.url.includes('supabase.co')
  ) {
    return;
  }

  // 정적 자산 및 HTML 페이지는 네트워크 우선, 캐시 폴백 전략 사용
  event.respondWith(
    fetch(event.request)
      .then(response => {
        // 유효한 응답인 경우 캐시에 복사본 저장
        if (response && response.status === 200) {
          const responseClone = response.clone();
          caches.open(CACHE_NAME).then(cache => {
            cache.put(event.request, responseClone);
          });
        }
        return response;
      })
      .catch(() => {
        console.log('[서비스워커] 오프라인 모드로 캐시에서 응답:', event.request.url);
        return caches.match(event.request);
      })
  );
});
