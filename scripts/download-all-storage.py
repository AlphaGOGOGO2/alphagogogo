import json
import urllib.request
import urllib.error
from pathlib import Path
import time

# Supabase 프로젝트 정보
SUPABASE_PROJECT_ID = "plimzlmmftdbpipbnhsy"
SUPABASE_BASE_URL = f"https://{SUPABASE_PROJECT_ID}.supabase.co/storage/v1/object/public"

# 버킷별 저장 경로 매핑
BUCKET_PATHS = {
    'blog-images': 'public/blog-images',
    'images': 'public/images',
    'fonts': 'public/fonts',
    'videos': 'public/videos',
    'naver': 'public',  # 네이버 인증 파일은 루트에
    'resource-media': 'public/resources',
    'resources': 'public/resources',
    'blog_assets': 'public/blog-assets',
    'user_uploads': 'public/user-uploads'
}

# SQL 결과를 JSON으로 변환 (실제 SQL 결과를 여기에 붙여넣기)
storage_files = [
    {"bucket_id": "blog-images", "file_path": "07b7d045-6280-4b3a-aa62-170a73a7931a.png"},
    {"bucket_id": "fonts", "file_path": "Paperlogy-1Thin.ttf"},
    {"bucket_id": "fonts", "file_path": "Paperlogy-2ExtraLight.ttf"},
    {"bucket_id": "fonts", "file_path": "Paperlogy-3Light.ttf"},
    {"bucket_id": "fonts", "file_path": "Paperlogy-4Regular.ttf"},
    {"bucket_id": "fonts", "file_path": "Paperlogy-5Medium.ttf"},
    {"bucket_id": "fonts", "file_path": "Paperlogy-6SemiBold.ttf"},
    {"bucket_id": "fonts", "file_path": "Paperlogy-7Bold.ttf"},
    {"bucket_id": "fonts", "file_path": "Paperlogy-8ExtraBold.ttf"},
    {"bucket_id": "fonts", "file_path": "Paperlogy-9Black.ttf"},
    {"bucket_id": "images", "file_path": "instructor profile image.png"},
    {"bucket_id": "images", "file_path": "logo.png"},
    {"bucket_id": "images", "file_path": "og image.png"},
    {"bucket_id": "images", "file_path": "ogimage.png"},
    {"bucket_id": "images", "file_path": "rss.xml"},
    {"bucket_id": "images", "file_path": "sitemap.xml"},
    {"bucket_id": "naver", "file_path": "naver0ac7b876b3d4a6ceff93227b0828d50a.html"},
    {"bucket_id": "resource-media", "file_path": "files/AlphaBlog-43842045.exe"},
    {"bucket_id": "resource-media", "file_path": "files/AlphaBlog-89ef5a98.exe"},
    {"bucket_id": "resource-media", "file_path": "files/AlphaBlog-b79393e1.exe"},
    {"bucket_id": "resource-media", "file_path": "files/AlphaBlog-c9693abb.exe"},
    {"bucket_id": "resource-media", "file_path": "files/alphatube-_v4-d54c828a.exe"},
    {"bucket_id": "resource-media", "file_path": "files/.emptyFolderPlaceholder"},
    {"bucket_id": "videos", "file_path": "background video.mp4"}
]

# 통계
stats = {
    'total': 0,
    'success': 0,
    'failed': 0,
    'skipped': 0,
    'by_bucket': {}
}

def download_file(url, output_path):
    """파일 다운로드"""
    try:
        req = urllib.request.Request(url, headers={'User-Agent': 'Mozilla/5.0'})
        with urllib.request.urlopen(req, timeout=30) as response:
            data = response.read()

        output_path.parent.mkdir(parents=True, exist_ok=True)
        with open(output_path, 'wb') as f:
            f.write(data)

        return True, len(data)
    except Exception as e:
        return False, str(e)

print("=" * 60)
print("Supabase Storage 전체 다운로드")
print("=" * 60)
print(f"총 파일 수: {len(storage_files)}")
print()

# 버킷별로 처리
for bucket_id in set(f['bucket_id'] for f in storage_files):
    bucket_files = [f for f in storage_files if f['bucket_id'] == bucket_id]
    stats['by_bucket'][bucket_id] = {'total': len(bucket_files), 'success': 0, 'failed': 0, 'skipped': 0}

    print(f"\n[{bucket_id}] {len(bucket_files)}개 파일")
    print("-" * 60)

    for idx, file_info in enumerate(bucket_files, 1):
        file_path = file_info['file_path']
        stats['total'] += 1

        # URL 생성
        url = f"{SUPABASE_BASE_URL}/{bucket_id}/{file_path}"

        # 로컬 경로 결정
        base_path = BUCKET_PATHS.get(bucket_id, f'public/{bucket_id}')

        # 특수 처리: naver 파일은 루트에
        if bucket_id == 'naver':
            local_path = Path(base_path) / file_path
        else:
            # 파일명에서 경로 구조 유지
            local_path = Path(base_path) / file_path

        # 이미 존재하면 스킵
        if local_path.exists():
            print(f"  [{idx}/{len(bucket_files)}] SKIP: {file_path}")
            stats['skipped'] += 1
            stats['by_bucket'][bucket_id]['skipped'] += 1
            continue

        # 다운로드
        print(f"  [{idx}/{len(bucket_files)}] {file_path}...", end=' ')
        success, result = download_file(url, local_path)

        if success:
            print(f"OK ({result} bytes)")
            stats['success'] += 1
            stats['by_bucket'][bucket_id]['success'] += 1
        else:
            print(f"FAILED - {result}")
            stats['failed'] += 1
            stats['by_bucket'][bucket_id]['failed'] += 1

        time.sleep(0.3)  # 서버 부하 방지

# 결과 출력
print("\n" + "=" * 60)
print("다운로드 완료")
print("=" * 60)
print(f"총 파일:  {stats['total']}")
print(f"성공:     {stats['success']}")
print(f"실패:     {stats['failed']}")
print(f"스킵:     {stats['skipped']}")

print("\n버킷별 통계:")
for bucket_id, bucket_stats in stats['by_bucket'].items():
    print(f"  {bucket_id}: {bucket_stats['success']}/{bucket_stats['total']} 성공")

# 로그 저장
log_file = Path('claudedocs/blog-backup/full-storage-download-log.json')
log_file.parent.mkdir(parents=True, exist_ok=True)
with open(log_file, 'w', encoding='utf-8') as f:
    json.dump({
        'stats': stats,
        'bucket_paths': BUCKET_PATHS
    }, f, indent=2, ensure_ascii=False)

print(f"\n로그 저장: {log_file}")
