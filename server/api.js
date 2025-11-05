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

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const execAsync = promisify(exec);

const app = express();
const PORT = 3001;

// Middleware
app.use(cors());
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
 * GET /api/blog/posts - 모든 블로그 글 조회
 */
app.get('/api/blog/posts', async (req, res) => {
  try {
    const blogPostsPath = path.join(__dirname, '../src/data/blogPosts.ts');
    const content = await fs.readFile(blogPostsPath, 'utf-8');

    // TypeScript 파일에서 데이터 추출
    const arrayMatch = content.match(/export const blogPosts: BlogPost\[\] = (\[[\s\S]*?\]);/);
    if (!arrayMatch) {
      return res.status(500).json({ error: 'Failed to parse blog posts' });
    }

    res.json({ success: true, content: arrayMatch[1] });
  } catch (error) {
    console.error('Error reading blog posts:', error);
    res.status(500).json({ error: error.message });
  }
});

/**
 * POST /api/blog/posts - 새 블로그 글 작성
 */
app.post('/api/blog/posts', async (req, res) => {
  try {
    const { title, excerpt, content, category, author, coverImage, slug, tags, readTime } = req.body;

    if (!title || !content || !category) {
      return res.status(400).json({ error: 'Required fields missing' });
    }

    const blogPostsPath = path.join(__dirname, '../src/data/blogPosts.ts');
    const fileContent = await fs.readFile(blogPostsPath, 'utf-8');

    // 새 ID 생성 (기존 최대 ID + 1)
    const idMatches = fileContent.match(/id: "(\d+)"/g);
    const maxId = idMatches ? Math.max(...idMatches.map(m => parseInt(m.match(/\d+/)[0]))) : 0;
    const newId = String(maxId + 1);

    // 현재 날짜
    const publishedAt = new Date().toISOString().split('T')[0];

    // 읽기 시간 자동 계산 (단어 수 / 200)
    const calculatedReadTime = readTime || Math.max(1, Math.ceil(content.split(/\s+/).length / 200));

    // 새 글 객체 생성
    const newPost = {
      id: newId,
      title,
      excerpt,
      content,
      category,
      author: author || { name: "알파GOGOGO", avatar: "https://i.pravatar.cc/150?img=10" },
      publishedAt,
      readTime: calculatedReadTime,
      coverImage: coverImage || "",
      slug: slug || title.toLowerCase().replace(/\s+/g, '-').replace(/[^a-z0-9-가-힣]/g, ''),
      tags: tags || []
    };

    // blogPosts 배열에 새 글 추가
    const arrayMatch = fileContent.match(/(export const blogPosts: BlogPost\[\] = \[)([\s\S]*?)(\];)/);
    if (!arrayMatch) {
      return res.status(500).json({ error: 'Failed to parse blog posts array' });
    }

    const [, prefix, existingPosts, suffix] = arrayMatch;

    // 새 글을 맨 앞에 추가 (최신글이 먼저 보이도록)
    const newPostString = `  ${JSON.stringify(newPost, null, 2).replace(/"(\w+)":/g, '$1:').replace(/\n/g, '\n  ')},\n`;
    const newContent = fileContent.replace(
      arrayMatch[0],
      `${prefix}\n${newPostString}${existingPosts}${suffix}`
    );

    // 파일 저장
    await fs.writeFile(blogPostsPath, newContent, 'utf-8');

    // Git 커밋
    try {
      await execAsync(`cd "${path.join(__dirname, '..')}" && git add src/data/blogPosts.ts`);
      await execAsync(`cd "${path.join(__dirname, '..')}" && git commit -m "feat: Add new blog post - ${title}

🤖 Generated via Admin Panel"`);

      res.json({
        success: true,
        message: 'Blog post created and committed successfully',
        post: newPost
      });
    } catch (gitError) {
      console.error('Git error:', gitError);
      res.json({
        success: true,
        message: 'Blog post created but git commit failed',
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
 * PUT /api/blog/posts/:id - 블로그 글 수정
 */
app.put('/api/blog/posts/:id', async (req, res) => {
  try {
    const { id } = req.params;
    const updates = req.body;

    const blogPostsPath = path.join(__dirname, '../src/data/blogPosts.ts');
    let fileContent = await fs.readFile(blogPostsPath, 'utf-8');

    // 해당 ID의 포스트 찾아서 업데이트
    const postRegex = new RegExp(`\\{[^}]*id:\\s*"${id}"[^}]*\\}`, 's');
    const match = fileContent.match(postRegex);

    if (!match) {
      return res.status(404).json({ error: 'Blog post not found' });
    }

    // updatedAt 추가
    updates.updatedAt = new Date().toISOString().split('T')[0];

    // 포스트 객체를 문자열로 변환하여 교체
    const existingPost = eval(`(${match[0]})`);
    const updatedPost = { ...existingPost, ...updates };
    const updatedPostString = JSON.stringify(updatedPost, null, 2).replace(/"(\w+)":/g, '$1:');

    fileContent = fileContent.replace(match[0], updatedPostString);

    await fs.writeFile(blogPostsPath, fileContent, 'utf-8');

    // Git 커밋
    try {
      await execAsync(`cd "${path.join(__dirname, '..')}" && git add src/data/blogPosts.ts`);
      await execAsync(`cd "${path.join(__dirname, '..')}" && git commit -m "feat: Update blog post - ${updates.title || existingPost.title}

🤖 Generated via Admin Panel"`);
    } catch (gitError) {
      console.error('Git error:', gitError);
    }

    res.json({ success: true, post: updatedPost });
  } catch (error) {
    console.error('Error updating blog post:', error);
    res.status(500).json({ error: error.message });
  }
});

// ==================== 이미지 업로드 API ====================

/**
 * POST /api/images/upload - 블로그 이미지 업로드 (썸네일, 본문 이미지)
 */
app.post('/api/images/upload', uploadImage.single('image'), async (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({ error: 'No image uploaded' });
    }

    const imageUrl = `/images/blog/${req.file.filename}`;

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
