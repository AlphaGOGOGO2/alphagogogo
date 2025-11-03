import re
from pathlib import Path

# 설정
src_dir = Path('src')
public_dir = Path('public')
supabase_storage_base = r'https://plimzlmmftdbpipbnhsy\.supabase\.co/storage/v1/object/public/'

# URL 매핑
url_mappings = {
    'blog-images/': '/blog-images/',
    'images//': '/images/',  # 주의: //가 있는 경우
    'images/': '/images/',
    'fonts/': '/fonts/',
    'videos/': '/videos/',
    'resources/': '/resources/',
    'resource-media/': '/resources/',
}

# 파일명에 공백이 있는 경우 특수 처리
special_files = {
    'instructor%20profile%20image.png': 'instructor-profile-image.png',
    'instructor profile image.png': 'instructor-profile-image.png',
    'background%20video.mp4': 'background-video.mp4',
    'background video.mp4': 'background-video.mp4',
    'og%20image.png': 'og-image.png',
    'og image.png': 'og-image.png',
}

stats = {
    'files_processed': 0,
    'files_updated': 0,
    'urls_replaced': 0
}

def replace_storage_urls(content):
    """Supabase Storage URL을 로컬 경로로 변경"""
    original_content = content
    replaced_count = 0

    # 기본 URL 패턴 변경
    for supabase_path, local_path in url_mappings.items():
        pattern = supabase_storage_base + supabase_path
        content = re.sub(pattern, local_path, content, flags=re.IGNORECASE)

    # 특수 파일명 처리 (공백, URL 인코딩)
    for old_name, new_name in special_files.items():
        content = content.replace(old_name, new_name)

    # 변경된 횟수 계산
    if content != original_content:
        # 간단한 카운트 (정확하지는 않지만 추정)
        replaced_count = len(re.findall(supabase_storage_base, original_content))

    return content, replaced_count

# src 디렉토리의 모든 TypeScript/JavaScript 파일 처리
print("=" * 60)
print("Supabase Storage URL → 로컬 경로 변환")
print("=" * 60)
print()

file_patterns = ['**/*.ts', '**/*.tsx', '**/*.js', '**/*.jsx', '**/*.css']

for pattern in file_patterns:
    for file_path in src_dir.glob(pattern):
        if file_path.is_file():
            stats['files_processed'] += 1

            try:
                with open(file_path, 'r', encoding='utf-8') as f:
                    original_content = f.read()

                # URL 교체
                updated_content, replace_count = replace_storage_urls(original_content)

                if replace_count > 0:
                    # 파일 업데이트
                    with open(file_path, 'w', encoding='utf-8') as f:
                        f.write(updated_content)

                    stats['files_updated'] += 1
                    stats['urls_replaced'] += replace_count
                    print(f"[UPDATED] {file_path.relative_to(src_dir)}: {replace_count} URL(s)")

            except Exception as e:
                print(f"[ERROR] {file_path}: {e}")

# public 디렉토리의 HTML/XML 파일도 처리
for file_path in public_dir.glob('*.html'):
    stats['files_processed'] += 1

    try:
        with open(file_path, 'r', encoding='utf-8') as f:
            original_content = f.read()

        updated_content, replace_count = replace_storage_urls(original_content)

        if replace_count > 0:
            with open(file_path, 'w', encoding='utf-8') as f:
                f.write(updated_content)

            stats['files_updated'] += 1
            stats['urls_replaced'] += replace_count
            print(f"[UPDATED] {file_path.name}: {replace_count} URL(s)")

    except Exception as e:
        print(f"[ERROR] {file_path}: {e}")

# index.html 처리
index_html = Path('index.html')
if index_html.exists():
    stats['files_processed'] += 1

    try:
        with open(index_html, 'r', encoding='utf-8') as f:
            original_content = f.read()

        updated_content, replace_count = replace_storage_urls(original_content)

        if replace_count > 0:
            with open(index_html, 'w', encoding='utf-8') as f:
                f.write(updated_content)

            stats['files_updated'] += 1
            stats['urls_replaced'] += replace_count
            print(f"[UPDATED] index.html: {replace_count} URL(s)")

    except Exception as e:
        print(f"[ERROR] index.html: {e}")

# 결과 출력
print("\n" + "=" * 60)
print("변환 완료")
print("=" * 60)
print(f"처리된 파일:  {stats['files_processed']}")
print(f"업데이트된 파일: {stats['files_updated']}")
print(f"교체된 URL:   {stats['urls_replaced']}")
print("\n모든 Supabase Storage URL이 로컬 경로로 변경되었습니다!")
