import { MetadataRoute } from 'next';

export default function robots(): MetadataRoute.Robots {
  return {
    rules: [
      {
        userAgent: '*',
        allow: '/',
        disallow: ['/login', '/register'],
      },
    ],
    sitemap: 'https://vikramclasses.com/sitemap.xml',
  };
}
