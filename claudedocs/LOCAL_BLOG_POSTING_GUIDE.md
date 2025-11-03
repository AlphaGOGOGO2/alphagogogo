# 로컬 블로그 포스팅 가이드

**완전 로컬 블로그 시스템** - Supabase 없이 Markdown 파일로 블로그 관리

---

## 📝 새 포스트 작성 방법

### 1단계: Markdown 파일 생성

`src/content/blog/` 폴더에 새 파일을 생성합니다.

**파일명 규칙**:
```
YYYY-MM-DD-slug.md
```

**예시**:
```
2025-11-02-my-new-post.md
2025-11-03-chatgpt-tutorial.md
```

### 2단계: Frontmatter 작성

파일 상단에 YAML frontmatter를 추가합니다:

```markdown
---
title: "포스트 제목"
date: "2025-11-02 10:00:00+00"
category: "카테고리"
author: "알파GOGOGO"
excerpt: "포스트 요약문 (200자 이내)..."
coverImage: "/blog-images/your-image.png"
readTime: 5
slug: "my-new-post"
tags: ["AI", "튜토리얼", "개발"]
---
```

**필수 필드**:
- `title`: 포스트 제목
- `date`: 발행 날짜 (YYYY-MM-DD HH:MM:SS+00 형식)
- `category`: 카테고리 (예: "AI 뉴스", "튜토리얼", "라이프스타일")
- `slug`: URL에 사용될 슬러그 (영문, 숫자, 하이픈만)

**선택 필드**:
- `author`: 작성자 (기본값: "Anonymous")
- `excerpt`: 요약문 (없으면 본문 앞 200자 사용)
- `coverImage`: 커버 이미지 경로
- `readTime`: 읽는 시간 (분, 없으면 자동 계산)
- `tags`: 태그 배열

### 3단계: 본문 작성

Frontmatter 아래에 Markdown으로 본문을 작성합니다:

```markdown
---
title: "ChatGPT 활용법"
date: "2025-11-02 10:00:00+00"
category: "튜토리얼"
slug: "chatgpt-guide"
---

# ChatGPT란?

ChatGPT는 OpenAI가 개발한 대화형 AI입니다.

## 주요 기능

1. 질문 답변
2. 코드 생성
3. 번역

### 예제 코드

\`\`\`python
print("Hello, ChatGPT!")
\`\`\`

![예시 이미지](/blog-images/example.png)
```

---

## 🖼️ 이미지 추가 방법

### 1. 이미지 파일 준비

이미지를 `public/blog-images/` 폴더에 복사합니다.

**권장 형식**:
- PNG, JPG, WEBP
- 최대 1MB 이하 (성능 고려)
- 파일명: 영문 소문자, 하이픈 사용 (예: `my-image-001.png`)

### 2. Markdown에서 참조

```markdown
![이미지 설명](/blog-images/my-image-001.png)
```

**커버 이미지**:
```yaml
---
coverImage: "/blog-images/cover.png"
---
```

**본문 이미지**:
```markdown
![튜토리얼 스크린샷](/blog-images/tutorial-step1.png)
```

---

## 📂 파일 구조

```
alphagogogoblog/
├── src/
│   └── content/
│       └── blog/
│           ├── 2025-11-02-my-post.md      ← 새 포스트 여기에 생성
│           ├── 2025-11-01-another-post.md
│           └── ...
│
├── public/
│   └── blog-images/
│       ├── cover-001.png                  ← 이미지 파일 여기에 저장
│       ├── screenshot-002.png
│       └── ...
│
└── scripts/
    └── new-post.sh                        ← 포스트 생성 도우미 (선택)
```

---

## 🚀 포스트 발행 프로세스

### 자동 발행 (권장)

1. **Markdown 파일 생성** → `src/content/blog/YYYY-MM-DD-slug.md`
2. **Git 커밋**
   ```bash
   git add src/content/blog/2025-11-02-my-post.md
   git add public/blog-images/new-image.png
   git commit -m "Add new blog post: My Post Title"
   git push
   ```
3. **자동 빌드** → Vercel/Netlify가 자동으로 빌드 및 배포
4. **즉시 라이브** → https://alphagogogo.com/blog/my-post

### 로컬 테스트

포스트를 작성한 후 로컬에서 먼저 확인하세요:

```bash
npm run dev
```

브라우저에서 확인:
- 전체 목록: http://localhost:8082/blog
- 개별 포스트: http://localhost:8082/blog/my-post

---

## 📋 포스트 템플릿

### 기본 템플릿

```markdown
---
title: "[제목]"
date: "2025-11-02 10:00:00+00"
category: "카테고리"
author: "알파GOGOGO"
excerpt: "요약문..."
coverImage: "/blog-images/cover.png"
readTime: 5
slug: "url-slug"
tags: ["태그1", "태그2"]
---

# 메인 제목

도입부 문단...

## 소제목 1

내용...

### 하위 제목

상세 내용...

## 소제목 2

내용...

## 결론

마무리 문단...
```

### AI 뉴스 템플릿

```markdown
---
title: "[AI 서비스명] 새로운 기능 출시"
date: "2025-11-02 10:00:00+00"
category: "AI 뉴스"
author: "알파GOGOGO"
excerpt: "[AI 서비스]가 [기능]을 출시했습니다..."
coverImage: "/blog-images/ai-news.png"
slug: "ai-service-new-feature"
tags: ["AI", "뉴스"]
---

# [AI 서비스명] 새로운 기능 출시

[출처 링크]

## 주요 내용

- 기능 1
- 기능 2

## 사용 방법

1. 단계 1
2. 단계 2

## 영향 및 의의

...
```

### 튜토리얼 템플릿

```markdown
---
title: "[도구/서비스] 완벽 가이드"
date: "2025-11-02 10:00:00+00"
category: "튜토리얼"
author: "알파GOGOGO"
excerpt: "[도구]를 활용하는 방법을 단계별로 알아봅니다..."
coverImage: "/blog-images/tutorial-cover.png"
readTime: 10
slug: "tool-complete-guide"
tags: ["튜토리얼", "가이드"]
---

# [도구/서비스] 완벽 가이드

## 시작하기 전에

필요한 준비물:
- 항목 1
- 항목 2

## 1단계: 설치

\`\`\`bash
npm install tool
\`\`\`

## 2단계: 설정

...

## 3단계: 사용

...

## 주의사항

- 주의 1
- 주의 2

## 마무리

...
```

---

## 🎨 Markdown 스타일 가이드

### 제목

```markdown
# H1 - 메인 제목 (페이지당 1개만)
## H2 - 주요 섹션
### H3 - 하위 섹션
#### H4 - 상세 항목
```

### 강조

```markdown
**볼드체**
*이탤릭*
~~취소선~~
`코드`
```

### 링크

```markdown
[링크 텍스트](https://example.com)
[내부 링크](/blog/another-post)
```

### 목록

```markdown
- 항목 1
- 항목 2
  - 하위 항목 2-1
  - 하위 항목 2-2

1. 번호 1
2. 번호 2
3. 번호 3
```

### 인용

```markdown
> 인용문입니다.
> 여러 줄도 가능합니다.
```

### 코드 블록

````markdown
```python
def hello():
    print("Hello, World!")
```

```javascript
console.log("Hello, World!");
```
````

### 표

```markdown
| 항목 | 설명 | 가격 |
|------|------|------|
| A | 설명 A | 1000 |
| B | 설명 B | 2000 |
```

---

## ⚙️ 카테고리 목록

현재 사용 가능한 카테고리:

- **AI 뉴스** - AI 관련 최신 소식
- **튜토리얼** - 단계별 가이드
- **ChatGPT 가이드** - ChatGPT 활용법
- **러버블 DEV** - Lovable DEV 관련
- **라이프스타일** - 일상, 팁
- **기술 리뷰** - 제품, 서비스 리뷰
- **트렌딩** - 인기 트렌드

새 카테고리 추가 시 기존 패턴을 따르세요.

---

## 🔍 SEO 최적화 팁

### 1. 제목 작성
- 명확하고 구체적으로
- 키워드 포함 (앞쪽 배치)
- 50-60자 이내

### 2. Excerpt (요약문)
- 핵심 내용 포함
- 150-200자 권장
- 행동 유도 문구 (CTA) 포함

### 3. Slug (URL)
- 영문 소문자
- 하이픈으로 단어 구분
- 짧고 명확하게 (예: `chatgpt-tutorial`)

### 4. 이미지 Alt 텍스트
```markdown
![ChatGPT 인터페이스 스크린샷](/blog-images/chatgpt-ui.png)
```

### 5. 내부 링크
```markdown
관련 포스트: [ChatGPT 활용법](/blog/chatgpt-guide)
```

---

## 🛠️ 유용한 도구

### VS Code 확장

블로그 작성에 유용한 VS Code 확장:

1. **Markdown All in One** - Markdown 편집 지원
2. **Markdown Preview Enhanced** - 실시간 미리보기
3. **Paste Image** - 클립보드 이미지 자동 저장
4. **Front Matter CMS** - Frontmatter GUI 편집기

### 이미지 최적화

```bash
# ImageOptim (Mac) 또는 TinyPNG 사용
# 이미지 크기를 줄여 페이지 로딩 속도 향상
```

---

## 📊 분석 및 통계

### 포스트 통계 확인

로컬 블로그 시스템은 자동으로:
- 총 포스트 수 집계
- 카테고리별 그룹핑
- 최신순 정렬
- Read time 자동 계산

### 개발 도구 콘솔

브라우저 개발자 도구에서 확인:
```javascript
// 콘솔 로그 확인
[localBlogService] Loaded 37 blog posts from Markdown files
```

---

## ❓ FAQ

### Q1: 포스트 수정은 어떻게 하나요?
**A**: Markdown 파일을 직접 수정하고 Git push하면 자동 반영됩니다.

### Q2: 포스트 삭제는?
**A**: Markdown 파일을 삭제하고 Git push하면 됩니다.

### Q3: 이미지가 안 보여요
**A**:
1. 이미지 경로 확인: `/blog-images/파일명.png`
2. 파일이 `public/blog-images/`에 있는지 확인
3. 파일명 대소문자 확인 (Linux는 대소문자 구분)

### Q4: 카테고리를 새로 추가하려면?
**A**: 그냥 새 카테고리명을 frontmatter에 입력하면 자동 생성됩니다.

### Q5: 포스트 순서를 바꾸려면?
**A**: 파일명의 날짜를 변경하거나, frontmatter의 `date` 필드를 수정하세요.

### Q6: 어드민 페이지는 사용할 수 없나요?
**A**: 현재 로컬 블로그는 읽기 전용입니다. 포스팅은 Markdown 파일로만 가능합니다.

---

## 🎯 체크리스트

새 포스트 발행 전 확인:

- [ ] 파일명 형식: `YYYY-MM-DD-slug.md`
- [ ] Frontmatter 필수 필드 작성 완료
- [ ] 이미지 경로 올바름 (`/blog-images/...`)
- [ ] 로컬에서 미리보기 확인
- [ ] 맞춤법 검사
- [ ] SEO 최적화 (제목, excerpt, slug)
- [ ] Git 커밋 메시지 명확히 작성
- [ ] Push 후 라이브 사이트 확인

---

## 📞 문제 해결

문제가 발생하면:

1. **개발 서버 재시작**
   ```bash
   # Ctrl+C로 중지 후
   npm run dev
   ```

2. **캐시 무효화**
   - 브라우저에서 Ctrl+Shift+R (강력 새로고침)

3. **로그 확인**
   - 브라우저 콘솔 (F12)
   - 터미널 출력

4. **문서 참조**
   - [claudedocs/blog-migration-summary.md](./blog-migration-summary.md)
   - [claudedocs/SESSION_SUMMARY.md](./SESSION_SUMMARY.md)

---

## 🎉 완료!

이제 Supabase 없이 완전히 로컬에서 블로그를 관리할 수 있습니다!

**Happy Blogging! 🚀**
