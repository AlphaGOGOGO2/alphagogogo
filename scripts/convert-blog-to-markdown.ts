import fs from 'fs';
import path from 'path';

interface BlogPost {
  id: string;
  title: string;
  slug: string;
  excerpt: string;
  content: string;
  category: string;
  author_name: string;
  author_avatar: string;
  published_at: string;
  read_time: number;
  cover_image: string | null;
  created_at: string;
  updated_at: string;
}

interface BlogTag {
  id: string;
  name: string;
}

interface BlogPostTag {
  blog_post_id: string;
  tag_id: string;
}

interface BlogCategory {
  id: string;
  name: string;
}

// Parse SQL INSERT statement
function parseSqlInsert(sql: string, tableName: string): any[] {
  const regex = new RegExp(
    `INSERT INTO "public"."${tableName}" \\([^)]+\\) VALUES ([^;]+);`,
    'g'
  );

  const results: any[] = [];
  let match;

  while ((match = regex.exec(sql)) !== null) {
    const valuesStr = match[1];
    // Simple parsing - may need enhancement for complex cases
    const values = valuesStr.match(/\([^)]+\)/g);

    if (values) {
      values.forEach(value => {
        const cleanValue = value.slice(1, -1); // Remove parentheses
        results.push(cleanValue);
      });
    }
  }

  return results;
}

// Convert SQL value to JavaScript value
function parseSqlValue(value: string): any {
  value = value.trim();

  if (value === 'NULL') return null;
  if (value === 'true') return true;
  if (value === 'false') return false;
  if (value.startsWith("'") && value.endsWith("'")) {
    return value.slice(1, -1).replace(/''/g, "'");
  }
  if (!isNaN(Number(value))) return Number(value);

  return value;
}

// Read SQL files
const blogPostsSql = fs.readFileSync(
  path.join(process.cwd(), 'claudedocs/blog-backup/blog_posts_rows.sql'),
  'utf-8'
);

const blogTagsSql = fs.readFileSync(
  path.join(process.cwd(), 'claudedocs/blog-backup/blog_tags_rows.sql'),
  'utf-8'
);

const blogPostTagsSql = fs.readFileSync(
  path.join(process.cwd(), 'claudedocs/blog-backup/blog_post_tags_rows.sql'),
  'utf-8'
);

const blogCategoriesSql = fs.readFileSync(
  path.join(process.cwd(), 'claudedocs/blog-backup/blog_categories_rows.sql'),
  'utf-8'
);

// Parse blog posts manually (simpler approach)
const posts: BlogPost[] = [];
const postMatches = blogPostsSql.matchAll(/INSERT INTO "public"\."blog_posts"[^V]+VALUES \(([^)]+(?:\([^)]*\)[^)]*)*)\);/g);

for (const match of postMatches) {
  const valuesStr = match[1];

  // Extract values - this is simplified, may need adjustment
  const values = valuesStr.split(/', '/).map(v => {
    let val = v.trim();
    if (val.startsWith("'")) val = val.slice(1);
    if (val.endsWith("'")) val = val.slice(0, -1);
    if (val === 'NULL') return null;
    return val.replace(/''/g, "'");
  });

  if (values.length >= 13) {
    posts.push({
      id: values[0]?.replace(/'/g, '') || '',
      title: values[1] || '',
      excerpt: values[2] || '',
      content: values[3] || '',
      category: values[4] || '',
      author_name: values[5] || '',
      author_avatar: values[6] || '',
      published_at: values[7] || '',
      read_time: parseInt(values[8] || '5'),
      cover_image: values[9],
      slug: values[10] || '',
      created_at: values[11] || '',
      updated_at: values[12] || ''
    });
  }
}

// Parse tags
const tags: Map<string, string> = new Map();
const tagMatches = blogTagsSql.matchAll(/\('([^']+)', '([^']+)'[^)]*\)/g);

for (const match of tagMatches) {
  tags.set(match[1], match[2]);
}

// Parse post-tag relationships
const postTags: Map<string, string[]> = new Map();
const postTagMatches = blogPostTagsSql.matchAll(/\('[^']+', '([^']+)', '([^']+)'[^)]*\)/g);

for (const match of postTagMatches) {
  const postId = match[1];
  const tagId = match[2];
  const tagName = tags.get(tagId);

  if (tagName) {
    if (!postTags.has(postId)) {
      postTags.set(postId, []);
    }
    postTags.get(postId)!.push(tagName);
  }
}

// Create content directory
const contentDir = path.join(process.cwd(), 'src/content/blog');
if (!fs.existsSync(contentDir)) {
  fs.mkdirSync(contentDir, { recursive: true });
}

// Convert posts to Markdown
console.log(`Converting ${posts.length} blog posts to Markdown...`);

posts.forEach((post, index) => {
  const postTags = tags.get(post.id) || [];
  const date = new Date(post.published_at).toISOString().split('T')[0];
  const filename = `${date}-${post.slug}.md`;

  const frontmatter = `---
title: "${post.title.replace(/"/g, '\\"')}"
date: ${post.published_at}
category: "${post.category}"
tags: ${JSON.stringify(postTags)}
author: "${post.author_name}"
excerpt: "${post.excerpt.replace(/"/g, '\\"')}"
coverImage: "${post.cover_image || ''}"
readTime: ${post.read_time}
slug: "${post.slug}"
---

${post.content}
`;

  const filepath = path.join(contentDir, filename);
  fs.writeFileSync(filepath, frontmatter, 'utf-8');

  console.log(`✅ Created: ${filename}`);
});

console.log(`\n🎉 Successfully converted ${posts.length} posts!`);
console.log(`📁 Files saved to: ${contentDir}`);
