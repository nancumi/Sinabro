import { MetadataRoute } from 'next';

export default function sitemap(): MetadataRoute.Sitemap {
  return [
    {
      url: 'https://ws.ai.kr',
      lastModified: new Date(),
      changeFrequency: 'daily',
      priority: 1.0,
    },
    {
      url: 'https://www.ws.ai.kr',
      lastModified: new Date(),
      changeFrequency: 'daily',
      priority: 0.9,
    },
  ];
}
