import re
import os
from pathlib import Path
import json

# Markdown 파일들이 있는 디렉토리
blog_dir = Path('src/content/blog')
output_file = Path('claudedocs/blog-backup/image-urls.json')

# Supabase Storage URL 패턴
supabase_pattern = r'https://plimzlmmftdbpipbnhsy\.supabase\.co/storage/v1/object/public/[^\s\)"\']+\.(png|jpg|jpeg|gif|webp|svg)'

image_urls = set()
image_map = {}  # 파일별 이미지 매핑

# 모든 마크다운 파일 스캔
for md_file in blog_dir.glob('*.md'):
    with open(md_file, 'r', encoding='utf-8') as f:
        content = f.read()

        # 이미지 URL 찾기
        urls = re.findall(supabase_pattern, content, re.IGNORECASE)

        if urls:
            image_map[md_file.name] = []
            for url in urls:
                # 전체 URL 복원 (확장자만 매칭되므로)
                full_url_match = re.search(
                    r'https://plimzlmmftdbpipbnhsy\.supabase\.co/storage/v1/object/public/[^\s\)"\']+\.' + url,
                    content
                )
                if full_url_match:
                    full_url = full_url_match.group(0)
                    image_urls.add(full_url)
                    image_map[md_file.name].append(full_url)

# 결과 저장
result = {
    'total_images': len(image_urls),
    'total_files_with_images': len(image_map),
    'image_urls': sorted(list(image_urls)),
    'file_image_map': image_map
}

output_file.parent.mkdir(parents=True, exist_ok=True)
with open(output_file, 'w', encoding='utf-8') as f:
    json.dump(result, f, indent=2, ensure_ascii=False)

print(f"Found {len(image_urls)} unique images")
print(f"Used in {len(image_map)} markdown files")
print(f"Saved to: {output_file}")

# 이미지 목록 미리보기
print("\nFirst 10 images:")
for i, url in enumerate(sorted(list(image_urls))[:10], 1):
    print(f"{i}. {url}")
