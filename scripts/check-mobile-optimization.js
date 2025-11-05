/**
 * 모바일 최적화 점검 스크립트
 *
 * 실행 방법:
 * node scripts/check-mobile-optimization.js
 */

import fs from 'fs/promises';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const SRC_DIR = path.join(__dirname, '../src');

// 점검 결과
const results = {
  passed: [],
  warnings: [],
  failed: []
};

/**
 * Tailwind 반응형 클래스 패턴
 */
const MOBILE_BREAKPOINTS = ['sm:', 'md:', 'lg:', 'xl:', '2xl:'];

/**
 * 모바일에 문제가 될 수 있는 패턴
 */
const PROBLEMATIC_PATTERNS = [
  { pattern: /width:\s*[0-9]{4,}px/, message: '고정 너비가 너무 큽니다' },
  { pattern: /min-width:\s*[0-9]{4,}px/, message: '최소 너비가 너무 큽니다' },
  { pattern: /font-size:\s*[0-9]{2,}px/, message: '폰트 크기가 너무 큽니다' },
  { pattern: /overflow-x:\s*scroll/, message: '가로 스크롤이 활성화되어 있습니다' },
];

/**
 * 모바일 최적화 권장 패턴
 */
const RECOMMENDED_PATTERNS = [
  { pattern: /overflow-x-hidden/, score: 1, message: '가로 스크롤 방지' },
  { pattern: /flex|grid/, score: 1, message: 'Flexbox/Grid 레이아웃 사용' },
  { pattern: /sm:|md:|lg:/, score: 2, message: '반응형 브레이크포인트 사용' },
  { pattern: /max-w-/, score: 1, message: '최대 너비 제한 사용' },
  { pattern: /px-\d|py-\d/, score: 1, message: '적절한 패딩 사용' },
  { pattern: /gap-/, score: 1, message: 'Gap 간격 사용' },
  { pattern: /touch-/, score: 1, message: '터치 최적화' },
];

/**
 * 파일에서 모바일 최적화 점검
 */
async function checkFile(filePath) {
  const content = await fs.readFile(filePath, 'utf-8');
  const relativePath = path.relative(SRC_DIR, filePath);

  const fileResult = {
    file: relativePath,
    hasResponsive: false,
    responsiveScore: 0,
    issues: [],
    recommendations: []
  };

  // 1. 반응형 브레이크포인트 사용 확인
  MOBILE_BREAKPOINTS.forEach(bp => {
    if (content.includes(bp)) {
      fileResult.hasResponsive = true;
    }
  });

  // 2. 문제 패턴 검사
  PROBLEMATIC_PATTERNS.forEach(({ pattern, message }) => {
    const matches = content.match(pattern);
    if (matches) {
      fileResult.issues.push({ message, count: matches.length });
    }
  });

  // 3. 권장 패턴 점수 계산
  RECOMMENDED_PATTERNS.forEach(({ pattern, score, message }) => {
    const matches = content.match(pattern);
    if (matches) {
      fileResult.responsiveScore += score;
      fileResult.recommendations.push({ message, count: matches.length });
    }
  });

  // 4. overflow-x-hidden 확인
  if (content.includes('overflow-x-hidden')) {
    results.passed.push(`✅ ${relativePath}: 가로 스크롤 방지 설정됨`);
  }

  // 5. viewport meta 태그 확인 (HTML 파일)
  if (relativePath.endsWith('.html')) {
    if (content.includes('width=device-width')) {
      results.passed.push(`✅ ${relativePath}: viewport meta 태그 설정됨`);
    } else {
      results.failed.push(`❌ ${relativePath}: viewport meta 태그 없음`);
    }
  }

  // 6. 반응형 점수 평가
  if (fileResult.responsiveScore >= 5) {
    results.passed.push(`✅ ${relativePath}: 우수한 모바일 최적화 (점수: ${fileResult.responsiveScore})`);
  } else if (fileResult.responsiveScore >= 2) {
    results.warnings.push(`⚠️ ${relativePath}: 모바일 최적화 보통 (점수: ${fileResult.responsiveScore})`);
  } else if (relativePath.endsWith('.tsx') || relativePath.endsWith('.jsx')) {
    results.warnings.push(`⚠️ ${relativePath}: 모바일 최적화 부족 (점수: ${fileResult.responsiveScore})`);
  }

  // 7. 문제 보고
  if (fileResult.issues.length > 0) {
    fileResult.issues.forEach(({ message, count }) => {
      results.warnings.push(`⚠️ ${relativePath}: ${message} (${count}개 발견)`);
    });
  }

  return fileResult;
}

/**
 * 디렉토리 재귀 탐색
 */
async function checkDirectory(dir) {
  const entries = await fs.readdir(dir, { withFileTypes: true });

  for (const entry of entries) {
    const fullPath = path.join(dir, entry.name);

    if (entry.isDirectory()) {
      // node_modules, .git 등 제외
      if (!['node_modules', '.git', 'dist', 'build'].includes(entry.name)) {
        await checkDirectory(fullPath);
      }
    } else if (entry.isFile()) {
      // TSX, JSX, CSS 파일만 검사
      if (/\.(tsx|jsx|css)$/.test(entry.name)) {
        await checkFile(fullPath);
      }
    }
  }
}

/**
 * index.html viewport 메타 태그 검사
 */
async function checkIndexHTML() {
  const indexPath = path.join(__dirname, '../index.html');

  try {
    const content = await fs.readFile(indexPath, 'utf-8');

    if (content.includes('<meta name="viewport"') && content.includes('width=device-width')) {
      results.passed.push('✅ index.html: viewport 메타 태그 올바르게 설정됨');
    } else if (content.includes('<meta name="viewport"')) {
      results.warnings.push('⚠️ index.html: viewport 메타 태그에 width=device-width 없음');
    } else {
      results.failed.push('❌ index.html: viewport 메타 태그 없음');
    }

    // 터치 아이콘 확인
    if (content.includes('apple-touch-icon')) {
      results.passed.push('✅ index.html: Apple Touch 아이콘 설정됨');
    } else {
      results.warnings.push('⚠️ index.html: Apple Touch 아이콘 미설정');
    }
  } catch (error) {
    results.failed.push(`❌ index.html 읽기 실패: ${error.message}`);
  }
}

/**
 * Tailwind 설정 검사
 */
async function checkTailwindConfig() {
  const configPath = path.join(__dirname, '../tailwind.config.ts');

  try {
    const content = await fs.readFile(configPath, 'utf-8');

    if (content.includes('screens')) {
      results.passed.push('✅ tailwind.config.ts: 커스텀 브레이크포인트 정의됨');
    }

    if (content.includes('fontSize')) {
      results.passed.push('✅ tailwind.config.ts: 폰트 크기 커스터마이징됨');
    }
  } catch (error) {
    results.warnings.push('⚠️ tailwind.config.ts 파일 없음');
  }
}

/**
 * 메인 실행
 */
async function main() {
  console.log('\n🔍 모바일 최적화 점검 시작...\n');

  // HTML 검사
  await checkIndexHTML();

  // Tailwind 설정 검사
  await checkTailwindConfig();

  // 소스 파일 검사
  await checkDirectory(SRC_DIR);

  // 결과 출력
  console.log('\n📊 점검 결과\n');
  console.log('='.repeat(60));

  if (results.passed.length > 0) {
    console.log('\n✅ 통과 항목:');
    results.passed.slice(0, 10).forEach(msg => console.log(`  ${msg}`));
    if (results.passed.length > 10) {
      console.log(`  ... 외 ${results.passed.length - 10}개 더 있음`);
    }
  }

  if (results.warnings.length > 0) {
    console.log('\n⚠️ 경고 항목:');
    results.warnings.slice(0, 10).forEach(msg => console.log(`  ${msg}`));
    if (results.warnings.length > 10) {
      console.log(`  ... 외 ${results.warnings.length - 10}개 더 있음`);
    }
  }

  if (results.failed.length > 0) {
    console.log('\n❌ 실패 항목:');
    results.failed.forEach(msg => console.log(`  ${msg}`));
  }

  console.log('\n' + '='.repeat(60));
  console.log(`\n📈 전체 통계:`);
  console.log(`  - 통과: ${results.passed.length}개`);
  console.log(`  - 경고: ${results.warnings.length}개`);
  console.log(`  - 실패: ${results.failed.length}개`);

  // 전체 평가
  const totalIssues = results.failed.length + (results.warnings.length * 0.5);
  const totalPassed = results.passed.length;

  console.log('\n🎯 모바일 최적화 평가:');
  if (totalIssues === 0 && totalPassed > 20) {
    console.log('  ⭐⭐⭐⭐⭐ 우수 - 모바일 최적화가 매우 잘 되어 있습니다!');
  } else if (totalIssues < 5 && totalPassed > 15) {
    console.log('  ⭐⭐⭐⭐ 양호 - 대부분 모바일 최적화가 잘 되어 있습니다.');
  } else if (totalIssues < 10) {
    console.log('  ⭐⭐⭐ 보통 - 일부 모바일 최적화가 필요합니다.');
  } else if (totalIssues < 20) {
    console.log('  ⭐⭐ 개선 필요 - 모바일 최적화를 강화하세요.');
  } else {
    console.log('  ⭐ 많은 개선 필요 - 모바일 최적화가 시급합니다.');
  }

  console.log('\n✅ 점검 완료!\n');
}

// 실행
main().catch(error => {
  console.error('❌ 오류 발생:', error);
  process.exit(1);
});
