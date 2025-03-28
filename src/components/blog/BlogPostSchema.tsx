
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
  
  // Format dates correctly for schema
  const publishDate = new Date(post.publishedAt).toISOString();
  const modifiedDate = post.updatedAt 
    ? new Date(post.updatedAt).toISOString() 
    : publishDate;
  
  // Create the structured data object
  const structuredData = {
    "@context": "https://schema.org",
    "@type": "BlogPosting",
    "headline": post.title,
    "description": post.excerpt,
    "author": {
      "@type": "Person",
      "name": post.author.name,
      "url": "https://alphagogogo.com/author/" + encodeURIComponent(post.author.name.toLowerCase().replace(/\s+/g, '-'))
    },
    "publisher": {
      "@type": "Organization",
      "name": "알파고고고",
      "logo": {
        "@type": "ImageObject",
        "url": "https://plimzlmmftdbpipbnhsy.supabase.co/storage/v1/object/public/images//logo.png",
        "width": 112,
        "height": 112
      }
    },
    "datePublished": publishDate,
    "dateModified": modifiedDate,
    "mainEntityOfPage": {
      "@type": "WebPage",
      "@id": fullUrl
    },
    "keywords": keywordsArray.join(","),
    "inLanguage": "ko-KR"
  };

  // Add image if available, or use default logo
  if (post.coverImage) {
    structuredData["image"] = {
      "@type": "ImageObject",
      "url": post.coverImage,
      // Assume standard dimensions if actual dimensions are not available
      "width": 1200,
      "height": 630
    };
  } else {
    structuredData["image"] = {
      "@type": "ImageObject",
      "url": "https://plimzlmmftdbpipbnhsy.supabase.co/storage/v1/object/public/images//logo.png",
      "width": 112,
      "height": 112
    };
  }

  // Extra validation to ensure JSON is properly formed
  try {
    // Convert to string and parse back to validate
    const jsonString = JSON.stringify(structuredData);
    // This will throw if JSON is invalid
    JSON.parse(jsonString);
    
    return (
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: jsonString }}
      />
    );
  } catch (error) {
    console.error("Invalid schema JSON:", error);
    // Return empty fragment if invalid JSON to prevent rendering errors
    return <></>;
  }
}
