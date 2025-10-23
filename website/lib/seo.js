// SEO utilities for generating metadata

export const generateMovieSchema = (movie) => {
  return {
    '@context': 'https://schema.org',
    '@type': 'Movie',
    name: movie.title,
    description: movie.description,
    image: movie.poster,
    datePublished: movie.releaseYear,
    genre: movie.genre,
    director: movie.director,
    actor: movie.cast?.map(actor => ({
      '@type': 'Person',
      name: actor,
    })),
    aggregateRating: movie.rating && {
      '@type': 'AggregateRating',
      ratingValue: movie.rating,
      ratingCount: 1,
      bestRating: 10,
      worstRating: 0,
    },
  };
};

export const generateBreadcrumbSchema = (items) => {
  return {
    '@context': 'https://schema.org',
    '@type': 'BreadcrumbList',
    itemListElement: items.map((item, index) => ({
      '@type': 'ListItem',
      position: index + 1,
      name: item.name,
      item: item.url,
    })),
  };
};

export const generateWebsiteSchema = (siteName, siteUrl, description) => {
  return {
    '@context': 'https://schema.org',
    '@type': 'WebSite',
    name: siteName,
    url: siteUrl,
    description: description,
    potentialAction: {
      '@type': 'SearchAction',
      target: {
        '@type': 'EntryPoint',
        urlTemplate: `${siteUrl}/search?q={search_term_string}`,
      },
      'query-input': 'required name=search_term_string',
    },
  };
};

export const getDefaultMetadata = () => {
  const siteName = process.env.NEXT_PUBLIC_SITE_NAME || 'MoviesHub';
  const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || 'http://localhost:3000';
  const description = process.env.NEXT_PUBLIC_SITE_DESCRIPTION || 
    'Watch and download latest movies in HD quality';

  return {
    title: {
      default: siteName,
      template: `%s | ${siteName}`,
    },
    description,
    keywords: ['movies', 'download movies', 'watch movies online', 'HD movies', 'latest movies'],
    authors: [{ name: siteName }],
    creator: siteName,
    publisher: siteName,
    robots: {
      index: true,
      follow: true,
      googleBot: {
        index: true,
        follow: true,
        'max-video-preview': -1,
        'max-image-preview': 'large',
        'max-snippet': -1,
      },
    },
    openGraph: {
      type: 'website',
      locale: 'en_US',
      url: siteUrl,
      siteName,
      title: siteName,
      description,
    },
    twitter: {
      card: 'summary_large_image',
      title: siteName,
      description,
    },
    verification: {
      google: 'your-google-verification-code',
    },
  };
};
