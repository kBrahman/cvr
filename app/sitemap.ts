import { MetadataRoute } from 'next';

export default function sitemap(): MetadataRoute.Sitemap {
  return [
    {
      url: 'https://cv.brahman.top',
      lastModified: new Date(),
      changeFrequency: 'daily',
      priority: 1,
    },
    // Add other static routes if any
  ];
}
