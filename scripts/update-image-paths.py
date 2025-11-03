import re
from pathlib import Path

# 설정
blog_dir = Path('src/content/blog')
supabase_base_url = 'https://plimzlmmftdbpipbnhsy.supabase.co/storage/v1/object/public/blog-images/'
local_base_path = '/blog-images/'

# 통계
stats = {
    'files_processed': 0,
    'files_updated': 0,
    'images_replaced': 0
}

def replace_image_urls(content):
    """Supabase URL을 로컬 경로로 변경"""
    # Supabase Storage URL 패턴
    pattern = r'https://plimzlmmftdbpipbnhsy\.supabase\.co/storage/v1/object/public/blog-images/([^\s\)"\']+\.(png|jpg|jpeg|gif|webp|svg))'

    def replacer(match):
        filename = match.group(1)
        return f'{local_base_path}{filename}'

    updated_content, count = re.subn(pattern, replacer, content, flags=re.IGNORECASE)
    return updated_content, count

# 모든 마크다운 파일 처리
print("Updating image paths in Markdown files...\n")

for md_file in sorted(blog_dir.glob('*.md')):
    stats['files_processed'] += 1

    with open(md_file, 'r', encoding='utf-8') as f:
        original_content = f.read()

    # 이미지 URL 교체
    updated_content, replace_count = replace_image_urls(original_content)

    if replace_count > 0:
        # 파일 업데이트
        with open(md_file, 'w', encoding='utf-8') as f:
            f.write(updated_content)

        stats['files_updated'] += 1
        stats['images_replaced'] += replace_count
        print(f"[UPDATED] {md_file.name}: {replace_count} image(s)")
    else:
        print(f"[SKIP] {md_file.name}: No images to update")

# 결과 출력
print("\n" + "="*50)
print("Update Summary")
print("="*50)
print(f"Files processed:  {stats['files_processed']}")
print(f"Files updated:    {stats['files_updated']}")
print(f"Images replaced:  {stats['images_replaced']}")
print("\nAll Supabase image URLs have been replaced with local paths!")
print(f"Images are now served from: /blog-images/")
