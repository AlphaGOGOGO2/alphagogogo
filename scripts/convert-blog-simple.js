const fs = require('fs');
const path = require('path');

// Read SQL file
const sql = fs.readFileSync(
  path.join(__dirname, '../claudedocs/blog-backup/blog_posts_rows.sql'),
  'utf-8'
);

// Simple regex to extract INSERT statements
const insertPattern = /INSERT INTO "public"\."blog_posts"[^;]+;/g;
const matches = sql.match(insertPattern);

if (!matches) {
  console.error('No INSERT statements found');
  process.exit(1);
}

console.log(`Found ${matches.length} blog posts`);

// Create output directory
const outputDir = path.join(__dirname, '../src/content/blog');
if (!fs.existsSync(outputDir)) {
  fs.mkdirSync(outputDir, { recursive: true });
}

// Process each INSERT statement
let count = 0;

matches.forEach((insert, index) => {
  try {
    // Extract VALUES part
    const valuesMatch = insert.match(/VALUES \((.*)\);/s);
    if (!valuesMatch) return;

    // This is a simplified parser - we'll extract using regex patterns
    const allText = valuesMatch[1];

    // Extract fields using specific patterns
    const idMatch = allText.match(/^'([^']+)'/);
    const titleMatch = allText.match(/', '([^']+(?:''[^']*)*)', '/);
    const categoryMatch = allText.match(/', '(라이프스타일|화제의 이슈|최신 AI소식)', '/);
    const publishedMatch = allText.match(/', '(\d{4}-\d{2}-\d{2} [^']+)', /);
    const slugMatch = allText.match(/', '([^']*)', '\d{4}-/);

    if (!idMatch || !titleMatch || !categoryMatch) {
      console.log(`Skipping post ${index + 1} - missing required fields`);
      return;
    }

    const id = idMatch[1];
    const title = titleMatch[1].replace(/''/g, "'");
    const category = categoryMatch[1];
    const published = publishedMatch ? publishedMatch[1] : new Date().toISOString();
    const slug = slugMatch ? slugMatch[1] : `post-${index + 1}`;

    // Extract content (everything between 3rd and category field)
    const contentStart = allText.indexOf("', '# ");
    const contentEnd = allText.indexOf(`', '${category}'`);

    let content = '';
    if (contentStart > 0 && contentEnd > contentStart) {
      content = allText.substring(contentStart + 4, contentEnd);
      content = content.replace(/''/g, "'").replace(/\\n/g, '\n');
    }

    // Create filename
    const date = published.split(' ')[0];
    const filename = `${date}-${slug || id}.md`;

    // Create frontmatter
    const frontmatter = `---
title: "${title}"
date: "${published}"
category: "${category}"
slug: "${slug}"
---

${content}
`;

    // Write file
    const filepath = path.join(outputDir, filename);
    fs.writeFileSync(filepath, frontmatter, 'utf-8');

    count++;
    console.log(`✅ ${count}. Created: ${filename}`);
  } catch (error) {
    console.error(`❌ Error processing post ${index + 1}:`, error.message);
  }
});

console.log(`\n🎉 Successfully converted ${count} posts!`);
console.log(`📁 Files saved to: ${outputDir}`);
