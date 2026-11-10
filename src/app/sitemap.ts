import { MetadataRoute } from 'next';

export default function sitemap(): MetadataRoute.Sitemap {
  const baseUrl = 'https://ws.ai.kr';
  const now = new Date();

  // 11종 전체 게임 직통 URL 등록
  const games = [
    { slug: 'timer', priority: 0.9 },
    { slug: 'roulette', priority: 0.9 },
    { slug: 'touch', priority: 0.9 },
    { slug: 'ladder', priority: 0.9 },
    { slug: 'mole', priority: 0.8 },
    { slug: '2048', priority: 0.8 },
    { slug: 'puzzle', priority: 0.8 },
    { slug: 'reflex', priority: 0.8 },
    { slug: 'stroke', priority: 0.8 },
    { slug: 'animal', priority: 0.8 },
    { slug: 'led', priority: 0.8 },
    { slug: 'speed', priority: 0.9 },
    { slug: 'gridshot', priority: 0.9 },
    { slug: 'scoreboard', priority: 0.9 },
    { slug: 'chess', priority: 0.9 },
  ];

  return [
    {
      url: baseUrl,
      lastModified: now,
      changeFrequency: 'daily',
      priority: 1.0,
    },
    ...games.map((g) => ({
      url: `${baseUrl}/?game=${g.slug}`,
      lastModified: now,
      changeFrequency: 'weekly' as const,
      priority: g.priority,
    })),
  ];
}
