
import { BlogPost } from "@/types/blog";

interface BlogPostSchemaProps {
  post: BlogPost;
  url: string;
}

export function BlogPostSchema({ post, url }: BlogPostSchemaProps) {
  // Use full absolute URL for structured data
  const fullUrl = url.startsWith('http') ? url : `https://alphagogogo.com${url.startsWith('/') ? '' : '/'}${url}`;
  
  // Create a keywords array from tags if available, or use default keywords
  const keywordsArray = post.tags && post.tags.length > 0 
    ? [...post.tags, "알파고고고", "알파고", "알파GOGOGO", "블로그", "AI", "인공지능"] 
    : ["알파고고고", "알파고", "알파GOGOGO", "유튜브 알파GOGOGO", "유튜브 알파고고고", "본질을 찾아서", "블로그", "블로그 자동화", "알파블로그", "블로그 GPTS", "챗GPT", "블로그 AI", "블로그 GPT"];
  
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
      "@id": fullUrl
    },
    "publisher": {
      "@type": "Organization",
      "name": "알파고고고",
      "logo": {
        "@type": "ImageObject",
        "url": "https://plimzlmmftdbpipbnhsy.supabase.co/storage/v1/object/public/images//logo.png"
      }
    },
    "keywords": keywordsArray.join(",")
  };

  if (post.coverImage) {
    structuredData["image"] = post.coverImage;
  } else {
    structuredData["image"] = "https://plimzlmmftdbpipbnhsy.supabase.co/storage/v1/object/public/images//logo.png";
  }

  // Ensure the JSON is valid before adding it to the page
  try {
    // Test parse to catch any JSON errors
    JSON.parse(JSON.stringify(structuredData));
    
    return (
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(structuredData) }}
      />
    );
  } catch (error) {
    console.error("Invalid schema JSON:", error);
    // Return empty fragment if invalid JSON to prevent rendering errors
    return <></>;
  }
}
