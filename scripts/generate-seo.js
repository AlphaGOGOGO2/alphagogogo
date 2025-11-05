/**
 * Sitemap 및 RSS 자동 생성 스크립트
 *
 * 실행 방법:
 * - npm run generate:seo
 * - 블로그 글 작성 후 자동 실행
 * - npm run build 시 자동 실행
 */

import fs from 'fs/promises';
import path from 'path';
import { fileURLToPath } from 'url';
import matter from 'gray-matter';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const SITE_DOMAIN = 'https://alphagogogo.com';
const BLOG_DIR = path.join(__dirname, '../src/content/blog');
const PUBLIC_DIR = path.join(__dirname, '../public');

// 카테고리 URL 매핑
const CATEGORY_URL_MAP = {
  '최신 AI소식': '/blog/ai-news',
  '화제의 이슈': '/blog/trending',
  '라이프스타일': '/blog/lifestyle',
};

/**
 * 모든 블로그 포스트 읽기
 */
async function getAllBlogPosts() {
  try {
    const files = await fs.readdir(BLOG_DIR);
    const posts = [];

    for (const file of files) {
      if (!file.endsWith('.md')) continue;

      try {
        const filePath = path.join(BLOG_DIR, file);
        const fileContent = await fs.readFile(filePath, 'utf-8');
        const { data: frontmatter, content: markdown } = matter(fileContent);

        const slug = frontmatter.slug || file.replace(/\.md$/, '');

        posts.push({
          slug,
          title: frontmatter.title || 'Untitled',
          excerpt: frontmatter.excerpt || markdown.slice(0, 200) + '...',
          content: markdown,
          category: frontmatter.category || 'Uncategorized',
          author: frontmatter.author || 'Anonymous',
          publishedAt: frontmatter.date || new Date().toISOString(),
          readTime: frontmatter.readTime || Math.ceil(markdown.length / 1000),
          coverImage: frontmatter.coverImage || '',
          tags: Array.isArray(frontmatter.tags) ? frontmatter.tags : [],
        });
      } catch (parseError) {
        console.error(`⚠️  파싱 오류 (${file}):`, parseError.message);
        // 개별 파일 오류는 무시하고 계속 진행
        continue;
      }
    }

    // 최신순 정렬
    posts.sort((a, b) => new Date(b.publishedAt).getTime() - new Date(a.publishedAt).getTime());

    console.log(`✅ ${posts.length}개의 블로그 포스트를 찾았습니다.`);
    return posts;
  } catch (error) {
    console.error('❌ 블로그 포스트 읽기 오류:', error);
    return [];
  }
}

/**
 * Sitemap.xml 생성
 */
async function generateSitemap(posts) {
  const today = new Date().toISOString().split('T')[0];

  let sitemap = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
  <!-- 홈페이지 -->
  <url>
    <loc>${SITE_DOMAIN}</loc>
    <lastmod>${today}</lastmod>
    <changefreq>daily</changefreq>
    <priority>1.0</priority>
  </url>

  <!-- 블로그 메인 -->
  <url>
    <loc>${SITE_DOMAIN}/blog</loc>
    <lastmod>${today}</lastmod>
    <changefreq>daily</changefreq>
    <priority>0.9</priority>
  </url>

  <!-- 블로그 카테고리 -->
  <url>
    <loc>${SITE_DOMAIN}/blog/ai-news</loc>
    <lastmod>${today}</lastmod>
    <changefreq>daily</changefreq>
    <priority>0.8</priority>
  </url>
  <url>
    <loc>${SITE_DOMAIN}/blog/trending</loc>
    <lastmod>${today}</lastmod>
    <changefreq>daily</changefreq>
    <priority>0.8</priority>
  </url>
  <url>
    <loc>${SITE_DOMAIN}/blog/lifestyle</loc>
    <lastmod>${today}</lastmod>
    <changefreq>weekly</changefreq>
    <priority>0.7</priority>
  </url>

  <!-- 기타 주요 페이지 -->
  <url>
    <loc>${SITE_DOMAIN}/gpts</loc>
    <lastmod>${today}</lastmod>
    <changefreq>weekly</changefreq>
    <priority>0.7</priority>
  </url>
  <url>
    <loc>${SITE_DOMAIN}/services</loc>
    <lastmod>${today}</lastmod>
    <changefreq>monthly</changefreq>
    <priority>0.7</priority>
  </url>
  <url>
    <loc>${SITE_DOMAIN}/resources</loc>
    <lastmod>${today}</lastmod>
    <changefreq>daily</changefreq>
    <priority>0.8</priority>
  </url>
  <url>
    <loc>${SITE_DOMAIN}/community</loc>
    <lastmod>${today}</lastmod>
    <changefreq>daily</changefreq>
    <priority>0.6</priority>
  </url>
  <url>
    <loc>${SITE_DOMAIN}/open-chat-rooms</loc>
    <lastmod>${today}</lastmod>
    <changefreq>daily</changefreq>
    <priority>0.6</priority>
  </url>
  <url>
    <loc>${SITE_DOMAIN}/business-inquiry</loc>
    <lastmod>${today}</lastmod>
    <changefreq>monthly</changefreq>
    <priority>0.5</priority>
  </url>

  <!-- 개별 블로그 포스트 -->
`;

  for (const post of posts) {
    const postDate = new Date(post.publishedAt).toISOString().split('T')[0];
    sitemap += `  <url>
    <loc>${SITE_DOMAIN}/blog/${post.slug}</loc>
    <lastmod>${postDate}</lastmod>
    <changefreq>weekly</changefreq>
    <priority>0.6</priority>
  </url>
`;
  }

  sitemap += `</urlset>
`;

  const sitemapPath = path.join(PUBLIC_DIR, 'sitemap.xml');
  await fs.writeFile(sitemapPath, sitemap, 'utf-8');
  console.log(`✅ Sitemap 생성 완료: ${sitemapPath}`);
  console.log(`   📄 총 ${posts.length + 11}개 URL 포함`);
}

/**
 * RSS Feed 생성
 */
async function generateRSS(posts) {
  const now = new Date();
  const buildDate = now.toUTCString();

  // 최근 20개 포스트만 RSS에 포함
  const recentPosts = posts.slice(0, 20);

  let rss = `<?xml version="1.0" encoding="UTF-8"?>
<rss version="2.0" xmlns:content="http://purl.org/rss/1.0/modules/content/" xmlns:atom="http://www.w3.org/2005/Atom" xmlns:dc="http://purl.org/dc/elements/1.1/">
  <channel>
    <title>알파고고고 - 최신 AI 소식 &amp; 인사이트</title>
    <link>${SITE_DOMAIN}</link>
    <description>최신 AI 뉴스, 연구 및 인사이트로 업데이트하세요. 알파고고고는 인공지능 발전에 대한 최신 정보를 제공합니다.</description>
    <language>ko-KR</language>
    <lastBuildDate>${buildDate}</lastBuildDate>
    <pubDate>${buildDate}</pubDate>
    <ttl>60</ttl>
    <atom:link href="${SITE_DOMAIN}/rss.xml" rel="self" type="application/rss+xml"/>
    <managingEditor>support@alphagogogo.com (알파고고고)</managingEditor>
    <copyright>Copyright ${now.getFullYear()} 알파고고고. All rights reserved.</copyright>
    <image>
      <url>${SITE_DOMAIN}/images/logo.png</url>
      <title>알파고고고</title>
      <link>${SITE_DOMAIN}</link>
    </image>

`;

  for (const post of recentPosts) {
    const pubDate = new Date(post.publishedAt).toUTCString();
    const postUrl = `${SITE_DOMAIN}/blog/${post.slug}`;

    // HTML 특수문자 이스케이프
    const escapeXml = (str) => {
      return str
        .replace(/&/g, '&amp;')
        .replace(/</g, '&lt;')
        .replace(/>/g, '&gt;')
        .replace(/"/g, '&quot;')
        .replace(/'/g, '&apos;');
    };

    const title = escapeXml(post.title);
    const excerpt = escapeXml(post.excerpt);
    const author = escapeXml(post.author);
    const category = escapeXml(post.category);

    rss += `    <item>
      <title>${title}</title>
      <link>${postUrl}</link>
      <guid isPermaLink="true">${postUrl}</guid>
      <description>${excerpt}</description>
      <pubDate>${pubDate}</pubDate>
      <author>support@alphagogogo.com (${author})</author>
      <category>${category}</category>
`;

    // 태그 추가
    for (const tag of post.tags) {
      rss += `      <category>${escapeXml(tag)}</category>
`;
    }

    // 커버 이미지가 있는 경우
    if (post.coverImage) {
      let imageUrl;
      if (post.coverImage.startsWith('http')) {
        imageUrl = post.coverImage;
      } else if (post.coverImage.startsWith('/')) {
        imageUrl = `${SITE_DOMAIN}${post.coverImage}`;
      } else {
        // 상대 경로인 경우 /blog-images/ 추가
        imageUrl = `${SITE_DOMAIN}/blog-images/${post.coverImage}`;
      }
      rss += `      <enclosure url="${imageUrl}" type="image/jpeg"/>
`;
    }

    rss += `    </item>
`;
  }

  rss += `  </channel>
</rss>
`;

  const rssPath = path.join(PUBLIC_DIR, 'rss.xml');
  await fs.writeFile(rssPath, rss, 'utf-8');
  console.log(`✅ RSS Feed 생성 완료: ${rssPath}`);
  console.log(`   📄 최근 ${recentPosts.length}개 포스트 포함`);
}

/**
 * 메인 실행 함수
 */
async function main() {
  console.log('\n🚀 SEO 파일 생성 시작...\n');

  const posts = await getAllBlogPosts();

  if (posts.length === 0) {
    console.log('⚠️  블로그 포스트가 없습니다.');
    return;
  }

  await generateSitemap(posts);
  await generateRSS(posts);

  console.log('\n✅ SEO 파일 생성 완료!\n');
  console.log(`📊 통계:`);
  console.log(`   - 블로그 포스트: ${posts.length}개`);
  console.log(`   - Sitemap URL: ${posts.length + 11}개`);
  console.log(`   - RSS 항목: ${Math.min(posts.length, 20)}개`);
  console.log('');
}

// 스크립트 실행
main().catch(error => {
  console.error('❌ 오류 발생:', error);
  process.exit(1);
});
