import { Helmet } from "react-helmet-async";

interface OrganizationSchema {
  type: "organization";
  name: string;
  url: string;
  logo: string;
  description: string;
  sameAs?: string[];
  contactPoint?: {
    "@type": "ContactPoint";
    contactType: string;
    url: string;
  };
}

interface BlogPostingSchema {
  type: "blogPosting";
  headline: string;
  description: string;
  image: string;
  author: {
    "@type": "Person";
    name: string;
  };
  publisher: {
    "@type": "Organization";
    name: string;
    logo: {
      "@type": "ImageObject";
      url: string;
    };
  };
  datePublished: string;
  dateModified?: string;
  url: string;
  mainEntityOfPage: string;
  articleSection?: string;
  keywords?: string[];
}

interface CollectionPageSchema {
  type: "collectionPage";
  name: string;
  description: string;
  url: string;
  mainEntity: {
    "@type": "ItemList";
    numberOfItems: number;
    itemListElement: Array<{
      "@type": "ListItem";
      position: number;
      item: {
        "@type": "BlogPosting";
        name: string;
        url: string;
      };
    }>;
  };
}

interface ServiceSchema {
  type: "service";
  name: string;
  description: string;
  provider: {
    "@type": "Organization";
    name: string;
  };
  serviceType: string;
  url: string;
}

type StructuredDataProps = {
  schema: OrganizationSchema | BlogPostingSchema | CollectionPageSchema | ServiceSchema;
}

export function StructuredData({ schema }: StructuredDataProps) {
  const generateSchema = () => {
    const baseSchema = {
      "@context": "https://schema.org",
    };

    switch (schema.type) {
      case "organization":
        return {
          ...baseSchema,
          "@type": "Organization",
          name: schema.name,
          url: schema.url,
          logo: schema.logo,
          description: schema.description,
          ...(schema.sameAs && { sameAs: schema.sameAs }),
          ...(schema.contactPoint && { contactPoint: schema.contactPoint }),
        };

      case "blogPosting":
        return {
          ...baseSchema,
          "@type": "BlogPosting",
          headline: schema.headline,
          description: schema.description,
          image: schema.image,
          author: schema.author,
          publisher: schema.publisher,
          datePublished: schema.datePublished,
          ...(schema.dateModified && { dateModified: schema.dateModified }),
          url: schema.url,
          mainEntityOfPage: schema.mainEntityOfPage,
          ...(schema.articleSection && { articleSection: schema.articleSection }),
          ...(schema.keywords && { keywords: schema.keywords }),
        };

      case "collectionPage":
        return {
          ...baseSchema,
          "@type": "CollectionPage",
          name: schema.name,
          description: schema.description,
          url: schema.url,
          mainEntity: schema.mainEntity,
        };

      case "service":
        return {
          ...baseSchema,
          "@type": "Service",
          name: schema.name,
          description: schema.description,
          provider: schema.provider,
          serviceType: schema.serviceType,
          url: schema.url,
        };

      default:
        return baseSchema;
    }
  };

  return (
    <Helmet>
      <script type="application/ld+json">
        {JSON.stringify(generateSchema(), null, 0)}
      </script>
    </Helmet>
  );
}