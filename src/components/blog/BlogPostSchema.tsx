
import { BlogPost } from "@/types/blog";

interface BlogPostSchemaProps {
  post: BlogPost;
  url: string;
}

export function BlogPostSchema({ post, url }: BlogPostSchemaProps) {
  const structuredData = {
    "@context": "https://schema.org",
    "@type": "BlogPosting",
    "headline": post.title,
    "description": post.excerpt,
    "author": {
      "@type": "Person",
      "name": post.author.name
    },
    "datePublished": post.publishedAt,
    "dateModified": post.publishedAt,
    "mainEntityOfPage": {
      "@type": "WebPage",
      "@id": url
    },
    "publisher": {
      "@type": "Organization",
      "name": "알파블로그",
      "logo": {
        "@type": "ImageObject",
        "url": "https://plimzlmmftdbpipbnhsy.supabase.co/storage/v1/object/public/images//logo.png"
      }
    },
    "keywords": "알파고고고,알파고,알파GOGOGO,유튜브 알파GOGOGO,유튜브 알파고고고,본질을 찾아서,블로그,블로그 자동화,알파블로그,블로그 GPTS,챗GPT,블로그 AI,블로그 GPT,챗지피티,블로그자동,블로그 글쓰기,블로그 AI글"
  };

  if (post.coverImage) {
    structuredData["image"] = post.coverImage;
  } else {
    structuredData["image"] = "https://plimzlmmftdbpipbnhsy.supabase.co/storage/v1/object/public/images//logo.png";
  }

  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: JSON.stringify(structuredData) }}
    />
  );
}
