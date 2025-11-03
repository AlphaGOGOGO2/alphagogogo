/**
 * Generate SEO files (sitemap.xml and rss.xml) from local blog posts data
 * This is a simple script that creates static SEO files for the local-only mode
 */

import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const SITE_DOMAIN = 'https://alphagogogo.com';

// Read and parse the blogPosts.ts file
function getBlogPosts() {
  const blogPostsPath = path.join(__dirname, '../src/data/blogPosts.ts');
  let content = fs.readFileSync(blogPostsPath, 'utf-8');

  // Remove TypeScript import/export and type annotations
  content = content.replace(/import.*from.*;/g, '');
  content = content.replace(/export const blogPosts:\s*BlogPost\[\]\s*=/, 'const blogPosts =');

  // Extract the array content
  const arrayMatch = content.match(/const blogPosts\s*=\s*(\[[\s\S]*\]);/);
  if (!arrayMatch) {
    console.error('Could not find blogPosts array');
    return [];
  }

  // Convert to JSON-parseable format
  let arrayStr = arrayMatch[1];

  // Replace single quotes with double quotes for keys and values
  arrayStr = arrayStr
    .replace(/(\w+):/g, '"$1":')  // Add quotes to keys
    .replace(/:\s*'([^']*)'/g, ':"$1"')  // Single quotes to double quotes for values
    .replace(/,\s*\}/g, '}')  // Remove trailing commas
    .replace(/,\s*\]/g, ']');  // Remove trailing commas in arrays

  try {
    const posts = JSON.parse(arrayStr);
    return posts.map(post => ({
      id: post.id,
      title: post.title,
      slug: post.slug,
      category: post.category || 'AI',
      excerpt: post.excerpt || '',
      content: post.content || '',
      coverImage: post.coverImage || '',
      publishedAt: post.publishedAt,
      updatedAt: post.updatedAt || post.publishedAt,
      authorName: post.author?.name || post.authorName || '알파고고고'
    }));
  } catch (e) {
    console.error('Error parsing blog posts:', e.message);
    return [];
  }
}

// XML escape function
function escapeXml(unsafe) {
  if (!unsafe) return '';
  return String(unsafe)
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&apos;');
}

// Strip markdown and HTML
function stripMarkdown(md) {
  if (!md) return '';
  return md
    .replace(/!\[([^\]]*)\]\([^)]+\)/g, '')
    .replace(/\[([^\]]+)\]\([^)]+\)/g, '$1')
    .replace(/`([^`]+)`/g, '$1')
    .replace(/```[\s\S]*?```/g, '')
    .replace(/<[^>]*>/g, '')
    .replace(/[*_~>#\-\+]/g, '')
    .replace(/\n+/g, ' ')
    .replace(/\s+/g, ' ')
    .trim();
}

// Generate sitemap.xml
function generateSitemap(posts) {
  const today = new Date().toISOString().split('T')[0];
  const xmlLines = [];

  xmlLines.push('<?xml version="1.0" encoding="UTF-8"?>');
  xmlLines.push('<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">');

  // Static pages
  const staticUrls = [
    { url: '', priority: '1.0', changefreq: 'daily' },
    { url: '/blog', priority: '0.9', changefreq: 'daily' },
    { url: '/blog/ai-news', priority: '0.8', changefreq: 'daily' },
    { url: '/blog/tech-reviews', priority: '0.7', changefreq: 'weekly' },
    { url: '/blog/tutorials', priority: '0.7', changefreq: 'weekly' },
    { url: '/blog/chatgpt-guides', priority: '0.7', changefreq: 'weekly' },
    { url: '/blog/lovable-dev', priority: '0.7', changefreq: 'weekly' },
    { url: '/blog/latest-updates', priority: '0.8', changefreq: 'daily' },
    { url: '/blog/trending', priority: '0.8', changefreq: 'daily' },
    { url: '/blog/lifestyle', priority: '0.7', changefreq: 'weekly' },
    { url: '/gpts', priority: '0.7', changefreq: 'weekly' },
    { url: '/services', priority: '0.7', changefreq: 'monthly' },
    { url: '/resources', priority: '0.8', changefreq: 'daily' },
    { url: '/community', priority: '0.6', changefreq: 'daily' },
    { url: '/open-chat-rooms', priority: '0.6', changefreq: 'daily' },
    { url: '/business-inquiry', priority: '0.5', changefreq: 'monthly' }
  ];

  staticUrls.forEach(({ url, priority, changefreq }) => {
    xmlLines.push('  <url>');
    xmlLines.push(`    <loc>${SITE_DOMAIN}${url}</loc>`);
    xmlLines.push(`    <lastmod>${today}</lastmod>`);
    xmlLines.push(`    <changefreq>${changefreq}</changefreq>`);
    xmlLines.push(`    <priority>${priority}</priority>`);
    xmlLines.push('  </url>');
  });

  // Blog posts
  posts.forEach(post => {
    const postUrl = post.slug ? `/blog/${post.slug}` : `/blog/post/${post.id}`;
    const lastmod = post.updatedAt ?
      new Date(post.updatedAt).toISOString().split('T')[0] :
      new Date(post.publishedAt).toISOString().split('T')[0];

    xmlLines.push('  <url>');
    xmlLines.push(`    <loc>${SITE_DOMAIN}${postUrl}</loc>`);
    xmlLines.push(`    <lastmod>${lastmod}</lastmod>`);
    xmlLines.push(`    <changefreq>monthly</changefreq>`);
    xmlLines.push(`    <priority>0.6</priority>`);
    xmlLines.push('  </url>');
  });

  xmlLines.push('</urlset>');
  return xmlLines.join('\n');
}

// Generate RSS feed
function generateRSS(posts) {
  const now = new Date();
  const buildDate = now.toUTCString();
  const xmlLines = [];

  xmlLines.push('<?xml version="1.0" encoding="UTF-8"?>');
  xmlLines.push('<rss version="2.0" xmlns:content="http://purl.org/rss/1.0/modules/content/" xmlns:atom="http://www.w3.org/2005/Atom" xmlns:dc="http://purl.org/dc/elements/1.1/">');
  xmlLines.push('  <channel>');
  xmlLines.push('    <title>알파고고고 - 최신 AI 소식 &amp; 인사이트</title>');
  xmlLines.push(`    <link>${SITE_DOMAIN}</link>`);
  xmlLines.push('    <description>최신 AI 뉴스, 연구 및 인사이트로 업데이트하세요. 알파고고고는 인공지능 발전에 대한 최신 정보를 제공합니다.</description>');
  xmlLines.push('    <language>ko-KR</language>');
  xmlLines.push(`    <lastBuildDate>${buildDate}</lastBuildDate>`);
  xmlLines.push(`    <pubDate>${buildDate}</pubDate>`);
  xmlLines.push('    <ttl>60</ttl>');
  xmlLines.push(`    <atom:link href="${SITE_DOMAIN}/rss.xml" rel="self" type="application/rss+xml"/>`);
  xmlLines.push('    <managingEditor>support@alphagogogo.com (알파고고고)</managingEditor>');
  xmlLines.push(`    <copyright>Copyright ${now.getFullYear()} 알파고고고. All rights reserved.</copyright>`);

  posts.forEach(post => {
    const postUrl = post.slug ? `${SITE_DOMAIN}/blog/${post.slug}` : `${SITE_DOMAIN}/blog/post/${post.id}`;
    const pubDate = new Date(post.publishedAt).toUTCString();
    const cleanTitle = escapeXml(post.title);

    let description = '';
    if (post.excerpt) {
      description = stripMarkdown(post.excerpt).substring(0, 300);
    } else if (post.content) {
      description = stripMarkdown(post.content).substring(0, 300);
    }
    description = escapeXml(description + (description.length >= 300 ? '...' : ''));

    xmlLines.push('    <item>');
    xmlLines.push(`      <title>${cleanTitle}</title>`);
    xmlLines.push(`      <link>${postUrl}</link>`);
    xmlLines.push(`      <guid isPermaLink="true">${postUrl}</guid>`);
    xmlLines.push(`      <description>${description}</description>`);
    xmlLines.push(`      <pubDate>${pubDate}</pubDate>`);
    xmlLines.push(`      <dc:creator><![CDATA[${post.authorName}]]></dc:creator>`);
    xmlLines.push(`      <category><![CDATA[${post.category || 'AI'}]]></category>`);
    xmlLines.push('    </item>');
  });

  xmlLines.push('  </channel>');
  xmlLines.push('</rss>');
  return xmlLines.join('\n');
}

// Main execution
try {
  console.log('📚 Reading blog posts...');
  const posts = getBlogPosts();
  console.log(`✅ Found ${posts.length} blog posts`);

  // Generate sitemap
  console.log('\n🗺️  Generating sitemap.xml...');
  const sitemapContent = generateSitemap(posts);
  const sitemapPath = path.join(__dirname, '../public/sitemap.xml');
  fs.writeFileSync(sitemapPath, sitemapContent, 'utf-8');
  console.log(`✅ Sitemap saved: ${sitemapPath}`);

  // Generate RSS feed
  console.log('\n📡 Generating rss.xml...');
  const rssContent = generateRSS(posts);
  const rssPath = path.join(__dirname, '../public/rss.xml');
  fs.writeFileSync(rssPath, rssContent, 'utf-8');
  console.log(`✅ RSS feed saved: ${rssPath}`);

  // Delete old files if they exist
  const oldSitemapPath = path.join(__dirname, '../public/images/sitemap.xml');
  const oldRssPath = path.join(__dirname, '../public/images/rss.xml');

  if (fs.existsSync(oldSitemapPath)) {
    fs.unlinkSync(oldSitemapPath);
    console.log('\n🗑️  Deleted old sitemap: public/images/sitemap.xml');
  }

  if (fs.existsSync(oldRssPath)) {
    fs.unlinkSync(oldRssPath);
    console.log('🗑️  Deleted old RSS feed: public/images/rss.xml');
  }

  console.log('\n✨ SEO files generated successfully!');
  console.log(`📊 Total URLs: ${16 + posts.length}`);
  console.log(`📝 Blog posts: ${posts.length}`);
  console.log(`📏 Sitemap size: ${(sitemapContent.length / 1024).toFixed(2)} KB`);
  console.log(`📏 RSS size: ${(rssContent.length / 1024).toFixed(2)} KB`);
} catch (error) {
  console.error('❌ Error generating SEO files:', error);
  process.exit(1);
}
