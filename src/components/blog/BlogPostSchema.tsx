
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
    "dateModified": post.publishedAt, // Fixed the error by using publishedAt instead of updatedAt
    "mainEntityOfPage": {
      "@type": "WebPage",
      "@id": url
    },
    "publisher": {
      "@type": "Organization",
      "name": "알파블로그",
      "logo": {
        "@type": "ImageObject",
        "url": "https://alphablog.app/logo.png"
      }
    },
    "keywords": "알파고고고,알파고,알파GOGOGO,유튜브 알파GOGOGO,유튜브 알파고고고,본질을 찾아서,블로그,블로그 자동화,알파블로그"
  };

  if (post.coverImage) {
    structuredData["image"] = post.coverImage;
  }

  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: JSON.stringify(structuredData) }}
    />
  );
}
