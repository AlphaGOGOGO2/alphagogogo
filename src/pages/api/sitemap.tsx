
import { useEffect, useState } from 'react';
import { getAllBlogPosts } from '@/services/blogPostService';
import { BlogPost } from '@/types/blog';

// 도메인 설정 - 일관된 도메인 사용
const SITE_DOMAIN = 'https://alphagogogo.com';

export default function SitemapPage() {
  const [xml, setXml] = useState<string>('');

  useEffect(() => {
    const generateSitemap = async () => {
      try {
        // 모든 블로그 포스트 가져오기
        const allPosts = await getAllBlogPosts();
        
        // 현재 날짜 포맷팅
        const today = new Date().toISOString().split('T')[0];
        
        // 실제 존재하는 기본 URL들에 대한 sitemap 항목 생성
        const staticUrls = [
          { loc: `${SITE_DOMAIN}/`, lastmod: today, priority: '1.0', changefreq: 'daily' },
          { loc: `${SITE_DOMAIN}/blog`, lastmod: today, priority: '0.9', changefreq: 'daily' },
          { loc: `${SITE_DOMAIN}/blog/latest-updates`, lastmod: today, priority: '0.8', changefreq: 'daily' },
          { loc: `${SITE_DOMAIN}/blog/trending`, lastmod: today, priority: '0.8', changefreq: 'weekly' },
          { loc: `${SITE_DOMAIN}/blog/lifestyle`, lastmod: today, priority: '0.7', changefreq: 'weekly' },
          { loc: `${SITE_DOMAIN}/gpts`, lastmod: today, priority: '0.7', changefreq: 'weekly' },
          { loc: `${SITE_DOMAIN}/services`, lastmod: today, priority: '0.7', changefreq: 'monthly' },
          { loc: `${SITE_DOMAIN}/community`, lastmod: today, priority: '0.6', changefreq: 'daily' },
          { loc: `${SITE_DOMAIN}/blog-button-creator`, lastmod: today, priority: '0.6', changefreq: 'monthly' },
          { loc: `${SITE_DOMAIN}/business-inquiry`, lastmod: today, priority: '0.5', changefreq: 'monthly' },
        ];
        
        // 모든 블로그 포스트에 대한 sitemap 항목 생성
        const postUrls = allPosts.map(post => {
          const url = post.slug 
            ? `${SITE_DOMAIN}/blog/${post.slug}` 
            : `${SITE_DOMAIN}/blog/post/${post.id}`;
          
          return {
            loc: url,
            lastmod: (post.updatedAt || post.publishedAt).split('T')[0],
            priority: '0.7',
            changefreq: 'weekly'
          };
        });
        
        // 정적 URL과 포스트 URL 결합
        const urlItems = [...staticUrls, ...postUrls];
        
        // XML 생성
        let sitemapXml = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
${urlItems.map(item => `  <url>
    <loc>${item.loc}</loc>
    <lastmod>${item.lastmod || today}</lastmod>
    <changefreq>${item.changefreq}</changefreq>
    <priority>${item.priority}</priority>
  </url>`).join('\n')}
</urlset>`;
        
        setXml(sitemapXml);
        console.log(`사이트맵 생성 완료: 총 ${urlItems.length}개 URL (정적: ${staticUrls.length}, 블로그: ${postUrls.length})`);
      } catch (error) {
        console.error("Sitemap 생성 중 오류 발생:", error);
        setXml(`<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
  <!-- 오류로 인해 완전한 sitemap을 생성하지 못했습니다 -->
</urlset>`);
      }
    };
    
    generateSitemap();
  }, []);

  // XML 컨텐츠 타입으로 반환
  return (
    <pre style={{ display: 'none' }}>
      {xml}
    </pre>
  );
}

// 서버로 직접 전송될 때 올바른 HTTP 헤더 추가를 위한 getServerSideProps
export async function getServerSideProps({ res }: { res: any }) {
  if (res) {
    res.setHeader('Content-Type', 'application/xml');
  }
  return { props: {} };
}
