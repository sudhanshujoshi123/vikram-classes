import { MetadataRoute } from 'next';

export default function sitemap(): MetadataRoute.Sitemap {
  return [
    {
      url: 'https://vikramclasses.com',
      lastModified: new Date(),
    },
    {
      url: 'https://vikramclasses.com/login',
      lastModified: new Date(),
    },
    {
      url: 'https://vikramclasses.com/register',
      lastModified: new Date(),
    },
    {
      url: 'https://vikramclasses.com/student',
      lastModified: new Date(),
    },
  ];
}
