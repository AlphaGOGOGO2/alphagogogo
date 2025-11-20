/**
 * 로컬 관리자 API 서버
 * 로컬 환경에서만 실행되며, 블로그 글 작성 및 파일 관리를 지원합니다.
 */

import express from 'express';
import cors from 'cors';
import multer from 'multer';
import { exec } from 'child_process';
import { promisify } from 'util';
import fs from 'fs/promises';
import path from 'path';
import { fileURLToPath } from 'url';
import matter from 'gray-matter';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const execAsync = promisify(exec);

const app = express();
const PORT = 3001;

// API 키 (환경변수에서 읽거나 기본값 사용)
const API_KEY = process.env.API_KEY || 'alphagogo-admin-2024-secure-key';

// API 인증 미들웨어
const authenticateAPI = (req, res, next) => {
  const apiKey = req.headers['x-api-key'];

  if (!apiKey || apiKey !== API_KEY) {
    return res.status(401).json({ error: 'Unauthorized: Invalid API key' });
  }

  next();
};

// Git 커밋 메시지 새니타이징 (쉘 특수문자 제거)
const sanitizeCommitMessage = (message) => {
  return message.replace(/["`'$\\;\n\r]/g, '');
};

// Middleware
app.use(cors({
  origin: ['http://localhost:5173', 'http://localhost:8080', 'http://localhost:8081', 'http://localhost:8085'],
  credentials: true
}));
app.use(express.json({ limit: '50mb' }));

// Multer 설정 (파일 업로드)
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, path.join(__dirname, '../public/files'));
  },
  filename: (req, file, cb) => {
    // 파일명을 안전하게 변환
    const safeName = Buffer.from(file.originalname, 'latin1').toString('utf8');
    cb(null, safeName);
  }
});

const upload = multer({
  storage,
  limits: { fileSize: 200 * 1024 * 1024 } // 200MB 제한
});

// 이미지 업로드 설정 (블로그 이미지용)
const imageStorage = multer.diskStorage({
  destination: async (req, file, cb) => {
    const uploadDir = path.join(__dirname, '../public/images/blog');
    // 폴더가 없으면 생성
    try {
      await fs.mkdir(uploadDir, { recursive: true });
    } catch (err) {
      console.error('Error creating directory:', err);
    }
    cb(null, uploadDir);
  },
  filename: (req, file, cb) => {
    // 타임스탬프 + 원본 파일명으로 저장
    const timestamp = Date.now();
    const safeName = Buffer.from(file.originalname, 'latin1').toString('utf8');
    const ext = path.extname(safeName);
    const nameWithoutExt = path.basename(safeName, ext);
    cb(null, `${timestamp}-${nameWithoutExt}${ext}`);
  }
});

const uploadImage = multer({
  storage: imageStorage,
  limits: { fileSize: 10 * 1024 * 1024 }, // 10MB 제한
  fileFilter: (req, file, cb) => {
    // 이미지 파일만 허용
    const allowedTypes = /jpeg|jpg|png|gif|webp|svg/;
    const extname = allowedTypes.test(path.extname(file.originalname).toLowerCase());
    const mimetype = allowedTypes.test(file.mimetype);

    if (mimetype && extname) {
      return cb(null, true);
    } else {
      cb(new Error('Only image files are allowed!'));
    }
  }
});

// ==================== 블로그 글 API ====================

/**
 * GET /api/blog/posts - 모든 블로그 글 조회 (마크다운 파일 읽기)
 */
app.get('/api/blog/posts', async (req, res) => {
  try {
    const blogDir = path.join(__dirname, '../src/content/blog');
    const files = await fs.readdir(blogDir);

    const posts = [];
    for (const file of files) {
      if (!file.endsWith('.md')) continue;

      try {
        const filePath = path.join(blogDir, file);
        const fileContent = await fs.readFile(filePath, 'utf-8');
        const { data: frontmatter, content: markdown } = matter(fileContent);

        const slug = frontmatter.slug || file.replace(/\.md$/, '');
        posts.push({
          id: slug,
          title: frontmatter.title || 'Untitled',
          excerpt: frontmatter.excerpt || markdown.slice(0, 200) + '...',
          content: markdown,
          category: frontmatter.category || 'Uncategorized',
          author: {
            name: frontmatter.author || 'Anonymous',
            avatar: '/images/instructor-profile-image.png',
          },
          publishedAt: frontmatter.date || new Date().toISOString(),
          readTime: frontmatter.readTime || Math.ceil(markdown.length / 1000),
          coverImage: frontmatter.coverImage || '',
          slug: slug,
          tags: Array.isArray(frontmatter.tags) ? frontmatter.tags : [],
        });
      } catch (fileError) {
        console.error(`⚠️  Error reading file ${file}:`, fileError.message);
        // 에러 발생 파일은 건너뛰고 계속 진행
        continue;
      }
    }

    // 최신순 정렬
    posts.sort((a, b) => new Date(b.publishedAt).getTime() - new Date(a.publishedAt).getTime());

    res.json({ success: true, posts });
  } catch (error) {
    console.error('Error reading blog posts:', error);
    res.status(500).json({ error: error.message });
  }
});

/**
 * POST /api/blog/posts - 새 블로그 글 작성
 */
app.post('/api/blog/posts', authenticateAPI, async (req, res) => {
  try {
    const { title, excerpt, content, category, author, coverImage, slug, tags, readTime } = req.body;

    if (!title || !content || !category) {
      return res.status(400).json({ error: 'Required fields missing' });
    }

    // 현재 날짜
    const publishedAt = new Date().toISOString().split('T')[0];

    // 읽기 시간 자동 계산 (단어 수 / 200)
    const calculatedReadTime = readTime || Math.max(1, Math.ceil(content.split(/\s+/).length / 200));

    // Slug 생성
    const finalSlug = slug || title.toLowerCase().replace(/\s+/g, '-').replace(/[^a-z0-9-가-힣]/g, '');

    // Markdown 파일 생성 (src/content/blog/)
    const markdownDir = path.join(__dirname, '../src/content/blog');
    await fs.mkdir(markdownDir, { recursive: true });

    // Markdown 파일명 생성 (날짜-slug.md)
    const markdownFilename = `${publishedAt}-${finalSlug}.md`;
    const markdownPath = path.join(markdownDir, markdownFilename);

    // Markdown 내용 생성 (frontmatter + content)
    const markdownContent = `---
title: "${title}"
date: "${publishedAt}"
category: "${category}"
author: "${author?.name || '알파GOGOGO'}"
excerpt: "${excerpt || ''}"
coverImage: "${coverImage || ''}"
readTime: ${calculatedReadTime}
slug: "${finalSlug}"
tags: ${JSON.stringify(tags || [])}
---

${content}`;

    await fs.writeFile(markdownPath, markdownContent, 'utf-8');

    // 새 글 객체 생성 (응답용)
    const newPost = {
      id: finalSlug,
      title,
      excerpt,
      content,
      category,
      author: author || { name: "알파GOGOGO", avatar: "https://i.pravatar.cc/150?img=10" },
      publishedAt,
      readTime: calculatedReadTime,
      coverImage: coverImage || "",
      slug: finalSlug,
      tags: tags || []
    };

    // SEO 파일 자동 생성 (Sitemap & RSS)
    try {
      console.log('🔄 SEO 파일 생성 중...');
      await execAsync(`cd "${path.join(__dirname, '..')}" && node scripts/generate-seo.js`);
      console.log('✅ SEO 파일 생성 완료');
    } catch (seoError) {
      console.error('⚠️  SEO 파일 생성 실패:', seoError);
      // SEO 생성 실패는 치명적이지 않으므로 계속 진행
    }

    // Git 커밋 및 푸시 (마크다운 파일 + SEO 파일 + 이미지 파일)
    try {
      const safeTitle = sanitizeCommitMessage(title);
      // 블로그 글과 관련된 모든 파일 추가 (이미지 포함)
      await execAsync(`cd "${path.join(__dirname, '..')}" && git add src/content/blog/${markdownFilename} public/sitemap.xml public/rss.xml public/images/blog/`);
      await execAsync(`cd "${path.join(__dirname, '..')}" && git commit -m "feat: Add new blog post - ${safeTitle}

🤖 Generated via Admin Panel
📊 SEO files updated automatically
📸 Blog images included"`);

      // Git Push
      console.log('🚀 Pushing to GitHub...');
      await execAsync(`cd "${path.join(__dirname, '..')}" && git push`);
      console.log('✅ Pushed to GitHub successfully');

      res.json({
        success: true,
        message: 'Blog post created, committed and pushed successfully',
        post: newPost
      });
    } catch (gitError) {
      console.error('Git error:', gitError);
      res.json({
        success: true,
        message: 'Blog post created but git commit/push failed',
        post: newPost,
        gitError: gitError.message
      });
    }

  } catch (error) {
    console.error('Error creating blog post:', error);
    res.status(500).json({ error: error.message });
  }
});

/**
 * PUT /api/blog/posts/:slug - 블로그 글 수정 (Markdown 파일)
 */
app.put('/api/blog/posts/:slug', authenticateAPI, async (req, res) => {
  try {
    const { slug } = req.params;
    const { title, excerpt, content, category, author, coverImage, tags, readTime } = req.body;

    if (!title || !content || !category) {
      return res.status(400).json({ error: 'Required fields missing: title, content, category' });
    }

    // Markdown 파일 찾기 (slug 기반)
    const blogDir = path.join(__dirname, '../src/content/blog');
    const files = await fs.readdir(blogDir);

    let targetFile = null;
    let existingFrontmatter = null;

    // slug와 매칭되는 파일 찾기
    for (const file of files) {
      if (!file.endsWith('.md')) continue;

      const filePath = path.join(blogDir, file);
      const fileContent = await fs.readFile(filePath, 'utf-8');
      const { data: frontmatter } = matter(fileContent);

      const fileSlug = frontmatter.slug || file.replace(/\.md$/, '');
      if (fileSlug === slug) {
        targetFile = filePath;
        existingFrontmatter = frontmatter;
        break;
      }
    }

    if (!targetFile) {
      return res.status(404).json({ error: `Blog post not found: ${slug}` });
    }

    // Frontmatter 업데이트 (기존 값 유지하며 덮어쓰기)
    const updatedFrontmatter = {
      ...existingFrontmatter,
      title,
      excerpt: excerpt || existingFrontmatter.excerpt || '',
      category,
      author: author?.name || existingFrontmatter.author || '알파GOGOGO',
      coverImage: coverImage || existingFrontmatter.coverImage || '',
      readTime: readTime || Math.max(1, Math.ceil(content.split(/\s+/).length / 200)),
      tags: Array.isArray(tags) ? tags : (existingFrontmatter.tags || []),
      slug: slug, // slug는 변경 불가
      date: existingFrontmatter.date || new Date().toISOString().split('T')[0],
    };

    // Markdown 내용 재생성
    const markdownContent = `---
title: "${updatedFrontmatter.title}"
date: "${updatedFrontmatter.date}"
category: "${updatedFrontmatter.category}"
author: "${updatedFrontmatter.author}"
excerpt: "${updatedFrontmatter.excerpt}"
coverImage: "${updatedFrontmatter.coverImage}"
readTime: ${updatedFrontmatter.readTime}
slug: "${updatedFrontmatter.slug}"
tags: ${JSON.stringify(updatedFrontmatter.tags)}
---

${content}`;

    // 파일 저장
    await fs.writeFile(targetFile, markdownContent, 'utf-8');

    console.log(`✅ Updated blog post: ${path.basename(targetFile)}`);

    // SEO 파일 자동 재생성 (Sitemap & RSS)
    try {
      console.log('🔄 SEO 파일 재생성 중...');
      await execAsync(`cd "${path.join(__dirname, '..')}" && node scripts/generate-seo.js`);
      console.log('✅ SEO 파일 재생성 완료');
    } catch (seoError) {
      console.error('⚠️  SEO 파일 재생성 실패:', seoError);
    }

    // Git 커밋 및 푸시
    try {
      const safeTitle = sanitizeCommitMessage(title);
      const filename = path.basename(targetFile);
      await execAsync(`cd "${path.join(__dirname, '..')}" && git add src/content/blog/${filename} public/sitemap.xml public/rss.xml`);
      await execAsync(`cd "${path.join(__dirname, '..')}" && git commit -m "feat: Update blog post - ${safeTitle}

Updated: ${filename}

🤖 Generated via Admin Panel
📊 SEO files updated automatically"`);

      // Git Push
      console.log('🚀 Pushing to GitHub...');
      await execAsync(`cd "${path.join(__dirname, '..')}" && git push`);
      console.log('✅ Pushed to GitHub successfully');

      res.json({
        success: true,
        message: 'Blog post updated, committed and pushed successfully',
        post: {
          id: slug,
          title,
          excerpt: updatedFrontmatter.excerpt,
          content,
          category,
          slug,
          coverImage: updatedFrontmatter.coverImage,
          tags: updatedFrontmatter.tags,
        }
      });
    } catch (gitError) {
      console.error('Git error:', gitError);
      res.json({
        success: true,
        message: 'Blog post updated but git commit/push failed',
        gitError: gitError.message,
        post: {
          id: slug,
          title,
          excerpt: updatedFrontmatter.excerpt,
          content,
          category,
          slug,
        }
      });
    }

  } catch (error) {
    console.error('Error updating blog post:', error);
    res.status(500).json({ error: error.message });
  }
});

// ==================== 이미지 업로드 API ====================

/**
 * POST /api/images/upload - 블로그 이미지 업로드 (썸네일, 본문 이미지)
 */
app.post('/api/images/upload', authenticateAPI, uploadImage.single('image'), async (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({ error: 'No image uploaded' });
    }

    const imageUrl = `/images/blog/${req.file.filename}`;

    // Git 커밋 및 푸시 (이미지 파일)
    try {
      await execAsync(`cd "${path.join(__dirname, '..')}" && git add public/images/blog/${req.file.filename}`);
      await execAsync(`cd "${path.join(__dirname, '..')}" && git commit -m "feat: Upload blog image - ${req.file.filename}

🤖 Generated via Admin Panel
📸 Image auto-committed"`);

      // Git Push
      console.log('🚀 Pushing image to GitHub...');
      await execAsync(`cd "${path.join(__dirname, '..')}" && git push`);
      console.log('✅ Image pushed to GitHub successfully');
    } catch (gitError) {
      console.error('⚠️  Git commit/push failed for image:', gitError.message);
      // 이미지는 업로드되었으므로 에러는 무시하고 계속 진행
    }

    res.json({
      success: true,
      url: imageUrl,
      filename: req.file.filename,
      size: req.file.size
    });
  } catch (error) {
    console.error('Error uploading image:', error);
    res.status(500).json({ error: error.message });
  }
});

// ==================== 자료실 파일 API ====================

/**
 * POST /api/resources/upload - 파일 업로드
 */
app.post('/api/resources/upload', upload.single('file'), async (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({ error: 'No file uploaded' });
    }

    const { title, description, category, tags } = req.body;

    // 파일 정보
    const fileInfo = {
      filename: req.file.filename,
      size: req.file.size,
      path: `/files/${req.file.filename}`,
      originalName: req.file.originalname
    };

    // resources.ts 업데이트
    const resourcesPath = path.join(__dirname, '../src/data/resources.ts');
    const fileContent = await fs.readFile(resourcesPath, 'utf-8');

    // 새 리소스 객체 생성
    const newResource = {
      id: generateId(),
      title: title || req.file.originalname,
      description: description || "",
      file_url: fileInfo.path,
      file_type: "document",
      file_size: fileInfo.size,
      category: category || "기타",
      tags: tags ? JSON.parse(tags) : [],
      download_count: 0,
      is_featured: false,
      author_name: "알파GOGOGO",
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString()
    };

    // resources 배열에 추가
    const arrayMatch = fileContent.match(/(export const resources: Resource\[\] = \[)([\s\S]*?)(\];)/);
    if (arrayMatch) {
      const [, prefix, existingResources, suffix] = arrayMatch;
      const newResourceString = `  ${JSON.stringify(newResource, null, 2).replace(/"(\w+)":/g, '$1:').replace(/\n/g, '\n  ')},\n`;
      const newContent = fileContent.replace(
        arrayMatch[0],
        `${prefix}\n${newResourceString}${existingResources}${suffix}`
      );

      await fs.writeFile(resourcesPath, newContent, 'utf-8');

      // Git 커밋
      try {
        await execAsync(`cd "${path.join(__dirname, '..')}" && git add public/files/${req.file.filename} src/data/resources.ts`);
        await execAsync(`cd "${path.join(__dirname, '..')}" && git commit -m "feat: Add new resource - ${title || req.file.originalname}

File: ${req.file.filename} (${(fileInfo.size / 1024 / 1024).toFixed(2)} MB)

🤖 Generated via Admin Panel"`);
      } catch (gitError) {
        console.error('Git error:', gitError);
      }
    }

    res.json({ success: true, resource: newResource, file: fileInfo });
  } catch (error) {
    console.error('Error uploading file:', error);
    res.status(500).json({ error: error.message });
  }
});

// ==================== Git 작업 API ====================

/**
 * POST /api/git/push - 변경사항을 GitHub에 푸시
 */
app.post('/api/git/push', async (req, res) => {
  try {
    const { stdout, stderr } = await execAsync(`cd "${path.join(__dirname, '..')}" && git push`);
    res.json({ success: true, stdout, stderr });
  } catch (error) {
    console.error('Git push error:', error);
    res.status(500).json({ error: error.message });
  }
});

/**
 * GET /api/git/status - Git 상태 확인
 */
app.get('/api/git/status', async (req, res) => {
  try {
    const { stdout } = await execAsync(`cd "${path.join(__dirname, '..')}" && git status --short`);
    res.json({ success: true, status: stdout });
  } catch (error) {
    console.error('Git status error:', error);
    res.status(500).json({ error: error.message });
  }
});

/**
 * POST /api/server/restart - 서버 재시작
 */
app.post('/api/server/restart', async (req, res) => {
  try {
    console.log('🔄 서버 재시작 요청...');
    res.json({ success: true, message: '서버 재시작 중...' });

    // 응답 전송 후 서버 재시작
    setTimeout(() => {
      console.log('🔄 서버 재시작 실행...');
      process.exit(0); // pm2 또는 nodemon이 자동으로 재시작
    }, 1000);
  } catch (error) {
    console.error('Server restart error:', error);
    res.status(500).json({ error: error.message });
  }
});

// ==================== 헬퍼 함수 ====================

function generateId() {
  return Math.random().toString(36).substr(2, 9) + '-' +
         Math.random().toString(36).substr(2, 4) + '-' +
         Math.random().toString(36).substr(2, 4) + '-' +
         Math.random().toString(36).substr(2, 4) + '-' +
         Math.random().toString(36).substr(2, 12);
}

// ==================== 서버 시작 ====================

app.listen(PORT, () => {
  console.log(`\n✅ Local Admin API Server running on http://localhost:${PORT}`);
  console.log(`📝 Blog Editor: http://localhost:5173/admin/blog/write`);
  console.log(`📁 Resource Upload: http://localhost:5173/admin/resources\n`);
});
