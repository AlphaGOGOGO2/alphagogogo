import { test, expect, devices } from '@playwright/test';

// 모바일 디바이스 설정
const mobileDevices = [
  { name: 'iPhone 12', device: devices['iPhone 12'] },
  { name: 'iPhone 12 Pro', device: devices['iPhone 12 Pro'] },
  { name: 'Pixel 5', device: devices['Pixel 5'] },
  { name: 'Galaxy S21', device: devices['Galaxy S9+'] }
];

// 테스트할 주요 페이지 목록
const pages = [
  { name: '홈페이지', url: '/' },
  { name: '블로그 메인', url: '/blog' },
  { name: 'AI 소식', url: '/blog/ai-news' },
  { name: '화제의 이슈', url: '/blog/trending' },
  { name: '라이프스타일', url: '/blog/lifestyle' },
  { name: 'GPTs', url: '/gpts' },
  { name: '서비스', url: '/services' },
  { name: '리소스', url: '/resources' },
  { name: '오픈채팅방', url: '/open-chat-rooms' },
  { name: '사업문의', url: '/business-inquiry' }
];

// 각 디바이스별로 테스트
for (const { name: deviceName, device } of mobileDevices) {
  test.describe(`${deviceName} 모바일 최적화 점검`, () => {
    test.use(device);

    for (const page of pages) {
      test(`${page.name} 페이지 - ${deviceName}`, async ({ page: browserPage }) => {
        // 페이지 로드
        await browserPage.goto(`http://localhost:8080${page.url}`, {
          waitUntil: 'networkidle',
          timeout: 30000
        });

        // 1. 뷰포트 검증
        const viewport = browserPage.viewportSize();
        expect(viewport).not.toBeNull();

        // 2. 가로 스크롤 확인 (가로 스크롤이 없어야 함)
        const hasHorizontalScroll = await browserPage.evaluate(() => {
          return document.documentElement.scrollWidth > document.documentElement.clientWidth;
        });
        expect(hasHorizontalScroll).toBe(false);

        // 3. 터치 타겟 크기 검증 (버튼, 링크 등이 최소 44x44px 이상이어야 함)
        const touchTargets = await browserPage.evaluate(() => {
          const elements = document.querySelectorAll('a, button, [role="button"]');
          const smallTargets: any[] = [];

          elements.forEach(el => {
            const rect = el.getBoundingClientRect();
            if (rect.width > 0 && rect.height > 0) {
              if (rect.width < 44 || rect.height < 44) {
                smallTargets.push({
                  tag: el.tagName,
                  text: (el as HTMLElement).innerText?.slice(0, 50),
                  width: rect.width,
                  height: rect.height
                });
              }
            }
          });

          return smallTargets;
        });

        // 터치 타겟이 너무 작은 경우 경고 (전체 실패는 하지 않음)
        if (touchTargets.length > 0) {
          console.warn(`⚠️ ${page.name} - ${deviceName}: ${touchTargets.length}개의 작은 터치 타겟 발견`);
          touchTargets.slice(0, 5).forEach(target => {
            console.warn(`  - ${target.tag}: "${target.text}" (${Math.round(target.width)}x${Math.round(target.height)}px)`);
          });
        }

        // 4. 텍스트 가독성 검증 (폰트 크기가 최소 12px 이상)
        const smallTextElements = await browserPage.evaluate(() => {
          const elements = document.querySelectorAll('p, span, a, li, div');
          const smallText: any[] = [];

          elements.forEach(el => {
            const style = window.getComputedStyle(el);
            const fontSize = parseFloat(style.fontSize);
            const text = (el as HTMLElement).innerText?.trim();

            if (text && text.length > 0 && fontSize < 12) {
              smallText.push({
                tag: el.tagName,
                text: text.slice(0, 50),
                fontSize: fontSize
              });
            }
          });

          return smallText.slice(0, 10);
        });

        if (smallTextElements.length > 0) {
          console.warn(`⚠️ ${page.name} - ${deviceName}: ${smallTextElements.length}개의 작은 텍스트 발견`);
          smallTextElements.slice(0, 5).forEach(el => {
            console.warn(`  - ${el.tag}: "${el.text}" (${el.fontSize}px)`);
          });
        }

        // 5. 이미지 최적화 확인
        const images = await browserPage.evaluate(() => {
          const imgs = document.querySelectorAll('img');
          const imageInfo: any[] = [];

          imgs.forEach(img => {
            if (img.naturalWidth > 0) {
              imageInfo.push({
                src: img.src.slice(0, 100),
                naturalWidth: img.naturalWidth,
                displayWidth: img.clientWidth,
                hasAlt: !!img.alt
              });
            }
          });

          return imageInfo;
        });

        // alt 태그 없는 이미지 확인
        const missingAlt = images.filter(img => !img.hasAlt);
        if (missingAlt.length > 0) {
          console.warn(`⚠️ ${page.name} - ${deviceName}: ${missingAlt.length}개 이미지에 alt 태그 없음`);
        }

        // 6. 네비게이션 접근성 확인
        const hasNav = await browserPage.evaluate(() => {
          return document.querySelector('nav') !== null;
        });
        expect(hasNav).toBe(true);

        // 7. 페이지 스크롤 가능 여부 확인
        const isScrollable = await browserPage.evaluate(() => {
          return document.documentElement.scrollHeight > document.documentElement.clientHeight;
        });
        // 홈페이지나 컨텐츠가 많은 페이지는 스크롤 가능해야 함
        if (['/blog', '/resources', '/'].includes(page.url)) {
          expect(isScrollable).toBe(true);
        }

        // 8. 메타 뷰포트 태그 확인
        const hasViewportMeta = await browserPage.evaluate(() => {
          const meta = document.querySelector('meta[name="viewport"]');
          return meta !== null && meta.getAttribute('content')?.includes('width=device-width');
        });
        expect(hasViewportMeta).toBe(true);

        // 9. 스크린샷 캡처 (시각적 검증용)
        await browserPage.screenshot({
          path: `tests/screenshots/mobile-${deviceName.replace(/\s/g, '-')}-${page.name.replace(/\s/g, '-')}.png`,
          fullPage: false
        });

        // 10. 성능 메트릭 수집
        const performanceMetrics = await browserPage.evaluate(() => {
          const perfData = window.performance.timing;
          return {
            domContentLoaded: perfData.domContentLoadedEventEnd - perfData.navigationStart,
            loadComplete: perfData.loadEventEnd - perfData.navigationStart
          };
        });

        console.log(`✅ ${page.name} - ${deviceName}: DOM ${performanceMetrics.domContentLoaded}ms, Load ${performanceMetrics.loadComplete}ms`);
      });
    }
  });
}

// 추가 테스트: 공통 UI 컴포넌트
test.describe('공통 모바일 UI 컴포넌트 테스트', () => {
  test.use(devices['iPhone 12']);

  test('모바일 네비게이션 메뉴 동작', async ({ page }) => {
    await page.goto('http://localhost:8080', { waitUntil: 'networkidle' });

    // 햄버거 메뉴 버튼 찾기
    const menuButton = page.locator('button[aria-label*="메뉴"], button[aria-label*="menu"], [class*="mobile-menu"]').first();

    if (await menuButton.count() > 0) {
      await menuButton.click();
      await page.waitForTimeout(500);

      // 메뉴가 열렸는지 확인
      const menuVisible = await page.evaluate(() => {
        const menu = document.querySelector('[role="menu"], [class*="mobile-menu"][class*="open"]');
        return menu !== null;
      });

      console.log('모바일 메뉴 표시 상태:', menuVisible);
    }
  });

  test('터치 제스처 지원', async ({ page }) => {
    await page.goto('http://localhost:8080/blog', { waitUntil: 'networkidle' });

    // 스와이프 가능한 요소가 있는지 확인
    const hasTouchElements = await page.evaluate(() => {
      const elements = document.querySelectorAll('[class*="swipe"], [class*="carousel"], [class*="slider"]');
      return elements.length > 0;
    });

    if (hasTouchElements) {
      console.log('✅ 터치 제스처 지원 요소 발견');
    }
  });
});
