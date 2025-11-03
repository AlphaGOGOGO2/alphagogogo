import json
import urllib.request
import urllib.error
from pathlib import Path
import time
import hashlib

# 설정
image_urls_file = Path('claudedocs/blog-backup/image-urls.json')
output_dir = Path('public/blog-images')
download_log = Path('claudedocs/blog-backup/image-download-log.json')

# 출력 디렉토리 생성
output_dir.mkdir(parents=True, exist_ok=True)

# 이미지 URL 로드
with open(image_urls_file, 'r', encoding='utf-8') as f:
    data = json.load(f)
    image_urls = data['image_urls']

print(f"Total images to download: {len(image_urls)}")
print(f"Output directory: {output_dir}\n")

# 다운로드 결과 추적
results = {
    'total': len(image_urls),
    'success': 0,
    'failed': 0,
    'skipped': 0,
    'downloads': []
}

def get_filename_from_url(url):
    """URL에서 파일명 추출"""
    # URL 예: https://plimzlmmftdbpipbnhsy.supabase.co/storage/v1/object/public/blog-images/UUID.ext
    parts = url.split('/')
    return parts[-1]  # UUID.ext

def download_image(url, output_path):
    """이미지 다운로드"""
    try:
        # User-Agent 추가 (일부 서버에서 요구)
        req = urllib.request.Request(
            url,
            headers={'User-Agent': 'Mozilla/5.0'}
        )

        with urllib.request.urlopen(req, timeout=30) as response:
            data = response.read()

        with open(output_path, 'wb') as f:
            f.write(data)

        return True, len(data)
    except urllib.error.HTTPError as e:
        return False, f"HTTP Error {e.code}: {e.reason}"
    except urllib.error.URLError as e:
        return False, f"URL Error: {e.reason}"
    except Exception as e:
        return False, f"Error: {str(e)}"

# 이미지 다운로드
for idx, url in enumerate(image_urls, 1):
    filename = get_filename_from_url(url)
    output_path = output_dir / filename

    # 이미 존재하는 파일 스킵
    if output_path.exists():
        print(f"[SKIP] {idx}/{len(image_urls)}: {filename} (already exists)")
        results['skipped'] += 1
        results['downloads'].append({
            'url': url,
            'filename': filename,
            'status': 'skipped',
            'reason': 'already exists'
        })
        continue

    # 다운로드
    print(f"[DOWNLOAD] {idx}/{len(image_urls)}: {filename}...", end=' ')
    success, result = download_image(url, output_path)

    if success:
        print(f"OK ({result} bytes)")
        results['success'] += 1
        results['downloads'].append({
            'url': url,
            'filename': filename,
            'status': 'success',
            'size_bytes': result,
            'local_path': str(output_path)
        })
    else:
        print(f"FAILED - {result}")
        results['failed'] += 1
        results['downloads'].append({
            'url': url,
            'filename': filename,
            'status': 'failed',
            'error': result
        })

    # 서버 부하 방지를 위한 딜레이
    if idx < len(image_urls):
        time.sleep(0.5)

# 결과 저장
with open(download_log, 'w', encoding='utf-8') as f:
    json.dump(results, f, indent=2, ensure_ascii=False)

# 결과 출력
print("\n" + "="*50)
print("Download Summary")
print("="*50)
print(f"Total images:    {results['total']}")
print(f"Success:         {results['success']}")
print(f"Skipped:         {results['skipped']}")
print(f"Failed:          {results['failed']}")
print(f"\nLog saved to: {download_log}")

if results['failed'] > 0:
    print("\nFailed downloads:")
    for item in results['downloads']:
        if item['status'] == 'failed':
            print(f"  - {item['filename']}: {item['error']}")
