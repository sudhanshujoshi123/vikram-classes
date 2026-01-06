import { MetadataRoute } from 'next';

export default function robots(): MetadataRoute.Robots {
  return {
    rules: [
      {
        userAgent: '*',
        allow: '/',
        disallow: ['/login', '/register', '/admin'],
      },
    ],
    sitemap: 'https://vikramclasses.com/sitemap.xml',
  };
}
