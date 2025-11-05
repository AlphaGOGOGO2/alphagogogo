# 관리자 페이지 사용 가이드

로컬 환경에서 블로그 글 작성 및 파일 관리를 할 수 있는 관리자 기능입니다.

## 🚀 시작하기

### 1. 서버 실행

터미널을 2개 열어야 합니다:

```bash
# 터미널 1: 프론트엔드 개발 서버
npm run dev

# 터미널 2: 로컬 API 서버
npm run dev:api
```

또는 한 번에 실행:
```bash
npm run dev:all
```

### 2. 관리자 페이지 접속

브라우저에서 다음 주소로 접속:
```
http://localhost:5173/admin
```

## ✍️ 블로그 글 작성

### 방법 1: 대시보드에서

1. `http://localhost:5173/admin` 접속
2. **"📝 새 글 작성"** 카드에서 **"글 작성하기"** 클릭
3. 글 정보 입력:
   - **제목** (필수)
   - **카테고리** (필수)
   - 요약
   - 슬러그 (URL - 비워두면 자동 생성)
   - 커버 이미지 URL
   - 태그 (쉼표로 구분)

4. **본문 작성** (마크다운 형식):
   ```markdown
   # 제목 1
   ## 제목 2

   **굵게** *기울임* `코드`

   - 목록 1
   - 목록 2

   [링크](https://example.com)
   ```

5. **미리보기** 버튼으로 렌더링 확인

6. **저장하기** 클릭
   - 자동으로 `src/data/blogPosts.ts`에 추가됨
   - Git 커밋 자동 생성
   - GitHub 푸시 여부 선택 가능

### 직접 접속

```
http://localhost:5173/admin/blog/write
```

## 📁 파일 업로드

### 자료실 파일 업로드

1. `http://localhost:5173/admin` 접속
2. **"📁 파일 업로드"** 카드에서 **"파일 업로드"** 클릭
3. 파일 선택 (최대 200MB)
4. 정보 입력:
   - 제목
   - 설명
   - 카테고리
   - 태그

5. **업로드** 클릭
   - 파일이 `public/files/`에 저장됨
   - `src/data/resources.ts`에 자동 추가됨
   - Git 커밋 자동 생성

### 파일 크기 제한

- **200MB 이하**: 로컬 API로 업로드 → `public/files/`
- **200MB 초과**: GitHub Release 사용 (수동)
  ```bash
  gh release create files-v1.1 public/files/큰파일.exe
  ```

## 🔄 Git 워크플로우

### 자동 커밋

블로그 글 작성이나 파일 업로드 시 자동으로 커밋됩니다:

```bash
feat: Add new blog post - 제목

🤖 Generated via Admin Panel
```

### GitHub 푸시

1. **자동 푸시**: 저장 후 확인 창에서 "예" 선택
2. **수동 푸시**:
   ```bash
   git push
   ```

### 변경사항 확인

```bash
git status
git log --oneline -5
```

## 📂 파일 구조

```
src/
├── data/
│   ├── blogPosts.ts    # 블로그 글 데이터
│   └── resources.ts    # 자료실 파일 데이터
├── pages/admin/
│   ├── AdminDashboard.tsx      # 대시보드
│   ├── AdminBlog.tsx           # 블로그 관리
│   ├── AdminBlogWrite.tsx      # 글 작성 (NEW!)
│   └── AdminResources.tsx      # 자료실 관리
└── server/
    └── api.js          # 로컬 API 서버

public/
└── files/              # 업로드된 파일 저장
```

## 🛠️ API 엔드포인트

로컬 API 서버 (`http://localhost:3001`):

### 블로그 관련
- `GET /api/blog/posts` - 모든 글 조회
- `POST /api/blog/posts` - 새 글 작성
- `PUT /api/blog/posts/:id` - 글 수정

### 자료실 관련
- `POST /api/resources/upload` - 파일 업로드

### Git 관련
- `POST /api/git/push` - GitHub 푸시
- `GET /api/git/status` - Git 상태 확인

## 💡 팁

### 1. 마크다운 작성 팁

```markdown
# H1 제목 (페이지당 1개만)
## H2 소제목
### H3 하위 제목

**굵게** *기울임* ~~취소선~~

> 인용구

- 순서 없는 목록
  - 중첩 목록

1. 순서 있는 목록
2. 두 번째 항목

[링크 텍스트](https://example.com)

![이미지 설명](https://example.com/image.jpg)

\`인라인 코드\`

\`\`\`javascript
// 코드 블록
const example = "hello";
\`\`\`
```

### 2. 이미지 URL 추천

- **Unsplash**: `https://images.unsplash.com/photo-...`
- **Pixabay**: `https://pixabay.com/...`
- **자체 업로드**: `public/images/` 폴더 사용

### 3. 슬러그 작성 규칙

- 소문자만 사용
- 공백은 하이픈(`-`)으로
- 특수문자 제거
- 예: `"AI 뉴스"` → `ai-news`

### 4. 카테고리 목록

- 최신 AI소식
- 화제의 이슈
- 라이프스타일
- 테크 리뷰
- 튜토리얼
- ChatGPT 가이드
- 러브블 개발

## ⚠️ 주의사항

1. **로컬 전용**: 이 기능은 로컬 환경에서만 작동합니다
2. **API 서버**: `npm run dev:api` 실행 필수
3. **포트**: API 서버는 3001 포트 사용
4. **Git**: 커밋 전 변경사항 확인 권장
5. **백업**: 중요한 데이터는 수동 백업 권장

## 🐛 문제 해결

### API 서버 연결 실패

```bash
# API 서버 실행 확인
npm run dev:api

# 포트 충돌 확인
netstat -ano | findstr 3001  # Windows
lsof -i :3001                # Mac/Linux
```

### Git 커밋 실패

```bash
# Git 상태 확인
git status

# 수동 커밋
git add .
git commit -m "feat: 수동 커밋"
git push
```

### 파일 업로드 실패

1. 파일 크기 확인 (200MB 이하)
2. `public/files/` 폴더 권한 확인
3. API 서버 로그 확인

## 📝 추가 기능 (예정)

- [ ] 글 수정 기능
- [ ] 글 삭제 기능
- [ ] 이미지 업로드 (본문 삽입)
- [ ] 초안 저장 기능
- [ ] 예약 발행 기능
- [ ] SEO 메타데이터 편집
