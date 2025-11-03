# Supabase Postgres 업그레이드 가이드

**현재 버전**: `supabase-postgres-15.8.1.044`
**문제**: 보안 패치가 제공되는 최신 버전으로 업그레이드 필요
**우선순위**: 중간 (보안 이슈)

---

## 📋 업그레이드 전 체크리스트

### 1. 백업 확인
- ✅ **자동 백업 활성화 확인**
  - Supabase는 일일 자동 백업 제공
  - 복원 가능 여부 확인

### 2. 낮은 트래픽 시간대 선택
- 🕐 **권장 시간**: 새벽 2-4시 (한국 시간 기준)
- ⏱️ **예상 다운타임**: 5-15분

### 3. 애플리케이션 점검
- 현재 실행 중인 쿼리 없음 확인
- 사용자에게 사전 공지 (선택사항)

---

## 🚀 업그레이드 절차

### Step 1: Supabase Dashboard 접속
1. 브라우저에서 접속: https://supabase.com/dashboard
2. 로그인
3. 프로젝트 선택: **alphagogogoblog** (plimzlmmftdbpipbnhsy)

### Step 2: Database Settings 이동
1. 왼쪽 사이드바에서 **Settings** 클릭
2. **Database** 탭 선택
3. 스크롤하여 **Database Version** 섹션 찾기

### Step 3: 현재 버전 확인
- **Current version**: supabase-postgres-15.8.1.044
- **Available updates**: 확인 (보통 업그레이드 가능 버튼이 표시됨)

### Step 4: 업그레이드 실행
1. **"Upgrade database"** 또는 **"Update to latest version"** 버튼 클릭
2. 경고 메시지 읽기:
   - 다운타임 발생 가능
   - 백업 권장
   - 롤백 불가능할 수 있음
3. 확인 후 **"Confirm upgrade"** 클릭

### Step 5: 업그레이드 진행 모니터링
- 진행 상황 표시줄 확인
- 5-15분 소요 예상
- **절대 브라우저 창을 닫지 마세요**

### Step 6: 완료 확인
- ✅ "Upgrade completed successfully" 메시지 확인
- ✅ 새 버전 번호 확인
- ✅ Database status: "Healthy" 확인

---

## ✅ 업그레이드 후 검증

### 1. 애플리케이션 동작 확인
```bash
# 로컬 개발 서버 접속
http://localhost:8082

# 확인 사항:
- [ ] 홈페이지 로딩
- [ ] 블로그 포스트 목록 표시
- [ ] 자료실 접근
- [ ] 어드민 페이지 접속
```

### 2. Security Advisor 재확인
Supabase MCP를 통해 Security Advisor 재실행:
```bash
mcp__supabase__get_advisors(type: "security")
```

**예상 결과**: Postgres 버전 관련 경고 해소

### 3. Performance Advisor 확인
업그레이드 후 성능 이슈가 새로 발생하지 않았는지 확인:
```bash
mcp__supabase__get_advisors(type: "performance")
```

### 4. 데이터 무결성 확인
```sql
-- 주요 테이블 레코드 수 확인
SELECT 'blog_posts' as table_name, COUNT(*) as count FROM blog_posts
UNION ALL
SELECT 'resources', COUNT(*) FROM resources
UNION ALL
SELECT 'blog_tags', COUNT(*) FROM blog_tags;

-- 예상 결과:
-- blog_posts: 40개
-- resources: 4개
-- blog_tags: 270개
```

---

## 🔧 문제 해결

### 업그레이드 실패 시
1. **에러 메시지 확인**: 대시보드에 표시된 정확한 에러 복사
2. **Supabase Support 티켓 생성**:
   - https://supabase.com/dashboard/support
   - 프로젝트 ref: plimzlmmftdbpipbnhsy
   - 에러 메시지 첨부
3. **롤백 불가능**: 업그레이드는 되돌릴 수 없으므로 신중하게 진행

### 애플리케이션 연결 문제 시
```typescript
// supabase client 연결 확인
import { supabase } from '@/integrations/supabase/client';

const testConnection = async () => {
  const { data, error } = await supabase
    .from('blog_posts')
    .select('count')
    .limit(1);

  console.log('Connection test:', { data, error });
};
```

---

## 📝 업그레이드 완료 후 조치

### 1. 문서 업데이트
- [ ] `claudedocs/supabase-security-performance-analysis.md` 업데이트
- [ ] Security Advisor 이슈 해결됨으로 표시

### 2. 팀 공유 (해당 시)
- 업그레이드 완료 알림
- 새 Postgres 버전 번호 공유
- 다운타임 발생 시간 기록

### 3. 모니터링 강화 (48시간)
- 애플리케이션 에러 로그 확인
- 데이터베이스 성능 모니터링
- 사용자 피드백 수집

---

## ⚠️ 주의사항

1. **백업 필수**: 업그레이드 전 반드시 수동 백업 생성 권장
2. **롤백 불가**: 업그레이드 후 이전 버전으로 되돌릴 수 없음
3. **브레이킹 체인지**: Postgres 메이저 버전 업그레이드 시 SQL 호환성 확인
4. **Extension 호환성**: 사용 중인 Postgres Extension의 버전 호환성 확인

---

## 📚 참고 자료

- **Supabase 공식 문서**: https://supabase.com/docs/guides/platform/upgrading
- **Postgres Release Notes**: https://www.postgresql.org/docs/release/
- **Supabase 상태 페이지**: https://status.supabase.com/

---

## 🎯 요약

**업그레이드 방법**: Supabase Dashboard에서만 가능 (CLI/MCP 불가)
**예상 소요 시간**: 5-15분
**다운타임**: 5-15분 (데이터베이스 재시작)
**권장 시간대**: 새벽 2-4시

**업그레이드 후 필수 확인**:
1. ✅ Security Advisor에서 경고 해소 확인
2. ✅ 애플리케이션 정상 동작 확인
3. ✅ 데이터 무결성 검증
