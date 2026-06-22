import React from 'react';
import { Helmet } from 'react-helmet-async';

interface SEOProps {
  title?: string;
  description?: string;
  canonical?: string;
  ogTitle?: string;
  ogDescription?: string;
  ogImage?: string;
  ogType?: 'website' | 'article' | 'course' | 'profile';
  twitterCard?: 'summary' | 'summary_large_image';
  noIndex?: boolean;
  structuredData?: Record<string, any>;
}

export const SEO: React.FC<SEOProps> = ({
  title,
  description,
  canonical,
  ogTitle,
  ogDescription,
  ogImage,
  ogType = 'website',
  twitterCard = 'summary_large_image',
  noIndex = false,
  structuredData,
}) => {
  const siteName = 'Veloria Academy';
  const defaultTitle = `${siteName} — Practical Courses for Modern Skills`;
  const defaultDescription = 'Learn practical skills through focused courses, guided projects, and collaborative learning experiences.';
  const siteUrl = 'https://course-website-pages.kalthiyaheet.workers.dev';
  const defaultOgImage = `${siteUrl}/og-image.png`;

  const metaTitle = title ? title : defaultTitle;
  const metaDescription = description || defaultDescription;
  const metaOgTitle = ogTitle || metaTitle;
  const metaOgDescription = ogDescription || metaDescription;
  const metaOgImage = ogImage || defaultOgImage;

  // Ensure absolute URLs for canonical and images
  const canonicalUrl = canonical 
    ? (canonical.startsWith('http') ? canonical : `${siteUrl}${canonical}`) 
    : undefined;
    
  const imageUrl = metaOgImage.startsWith('http') ? metaOgImage : `${siteUrl}${metaOgImage}`;

  return (
    <Helmet>
      {/* Primary Meta Tags */}
      <title>{metaTitle}</title>
      <meta name="description" content={metaDescription} />

      {/* Robots Indexing */}
      {noIndex ? (
        <meta name="robots" content="noindex, nofollow" />
      ) : (
        <meta name="robots" content="index, follow" />
      )}

      {/* Canonical URL */}
      {canonicalUrl && <link rel="canonical" href={canonicalUrl} />}

      {/* Open Graph / Facebook */}
      <meta property="og:type" content={ogType} />
      {canonicalUrl && <meta property="og:url" content={canonicalUrl} />}
      <meta property="og:title" content={metaOgTitle} />
      <meta property="og:description" content={metaOgDescription} />
      <meta property="og:image" content={imageUrl} />
      <meta property="og:site_name" content={siteName} />

      {/* Twitter */}
      <meta name="twitter:card" content={twitterCard} />
      {canonicalUrl && <meta name="twitter:url" content={canonicalUrl} />}
      <meta name="twitter:title" content={metaOgTitle} />
      <meta name="twitter:description" content={metaOgDescription} />
      <meta name="twitter:image" content={imageUrl} />

      {/* Structured Data (JSON-LD) */}
      {structuredData && (
        <script type="application/ld+json">
          {JSON.stringify(structuredData)}
        </script>
      )}
    </Helmet>
  );
};
