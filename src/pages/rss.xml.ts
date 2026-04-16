import rss from '@astrojs/rss';
import type { APIContext } from 'astro';
import { getPublishedStories } from '~/lib/stories';
import { site } from '~/lib/site';

export async function GET(context: APIContext) {
  const stories = await getPublishedStories();
  return rss({
    title: site.title,
    description: site.description,
    site: context.site!,
    items: stories.map((story) => ({
      title: story.data.title,
      pubDate: story.data.date,
      description: story.data.excerpt ?? story.data.subtitle ?? '',
      link: `/nouvelles/${story.id}`,
    })),
    customData: `<language>${site.lang}</language>`,
  });
}
