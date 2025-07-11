-- SEO 파일 업로드를 위한 Storage 정책 추가
-- images 버킷에 SEO 파일 업로드 허용
CREATE POLICY "Allow SEO file uploads to images bucket"
ON storage.objects
FOR INSERT
WITH CHECK (bucket_id = 'images' AND (storage.filename(name) = 'sitemap.xml' OR storage.filename(name) = 'rss.xml'));

-- SEO 파일 업데이트 허용
CREATE POLICY "Allow SEO file updates to images bucket"
ON storage.objects
FOR UPDATE
USING (bucket_id = 'images' AND (storage.filename(name) = 'sitemap.xml' OR storage.filename(name) = 'rss.xml'));

-- SEO 파일 공개 읽기 허용 (이미 있을 수 있지만 확실히 하기 위해)
CREATE POLICY "Allow public SEO file access"
ON storage.objects
FOR SELECT
USING (bucket_id = 'images' AND (storage.filename(name) = 'sitemap.xml' OR storage.filename(name) = 'rss.xml'));