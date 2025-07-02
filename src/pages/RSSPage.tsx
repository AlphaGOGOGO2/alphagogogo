import { useEffect } from 'react';

export default function RSSPage() {
  useEffect(() => {
    // Edge Function으로 리다이렉트
    window.location.href = 'https://plimzlmmftdbpipbnhsy.supabase.co/functions/v1/rss-feed';
  }, []);

  return <div>Redirecting to RSS feed...</div>;
}