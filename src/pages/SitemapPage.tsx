import { useEffect } from 'react';

export default function SitemapPage() {
  useEffect(() => {
    // Edge Function으로 리다이렉트
    window.location.href = 'https://plimzlmmftdbpipbnhsy.supabase.co/functions/v1/sitemap';
  }, []);

  return <div>Redirecting to sitemap...</div>;
}