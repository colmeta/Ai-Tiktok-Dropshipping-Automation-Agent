import { ContentPiece, TrendingVideo, Product } from '../types';

class ContentGenerator {
  private readonly CONTENT_TEMPLATES = {
    product_demo: [
      "This {product} will change your {category} game forever! 🔥",
      "POV: You discover the {product} that everyone's talking about",
      "I wasn't expecting this {product} to be THIS good...",
      "Why didn't anyone tell me about this {product} sooner?",
      "This {product} just solved my biggest {category} problem"
    ],
    unboxing: [
      "Unboxing the viral {product} everyone's obsessed with",
      "First impressions of this trending {product}",
      "Is this {product} worth the hype? Let's find out...",
      "Unboxing haul: {product} edition",
      "Testing viral {product} so you don't have to"
    ],
    transformation: [
      "Before vs After using this {product}",
      "30 days of using this {product} - results shocked me",
      "This {product} transformation is insane",
      "Watch this {product} work its magic",
      "The {product} glow up is real"
    ]
  };

  async generateContentFromTrend(video: TrendingVideo, products: Product[]): Promise<ContentPiece[]> {
    const contentPieces: ContentPiece[] = [];

    for (const product of products) {
      // Generate multiple content variations
      const variations = await this.createContentVariations(video, product);
      contentPieces.push(...variations);
    }

    return contentPieces;
  }

  private async createContentVariations(video: TrendingVideo, product: Product): Promise<ContentPiece[]> {
    const variations: ContentPiece[] = [];
    const templateTypes = Object.keys(this.CONTENT_TEMPLATES);

    for (const templateType of templateTypes) {
      const template = this.getRandomTemplate(templateType);
      const content = this.fillTemplate(template, product, video);

      variations.push({
        id: `${product.id}_${templateType}_${Date.now()}`,
        type: 'video',
        title: content.title,
        description: content.description,
        mediaUrl: await this.generateVideoContent(product, templateType),
        hashtags: this.generateHashtags(product, video),
        platform: 'tiktok',
        scheduledFor: this.getNextScheduleTime(),
        status: 'scheduled',
        engagement: {
          views: 0,
          likes: 0,
          shares: 0,
          comments: 0
        }
      });
    }

    return variations;
  }

  private getRandomTemplate(type: string): string {
    const templates = this.CONTENT_TEMPLATES[type as keyof typeof this.CONTENT_TEMPLATES];
    return templates[Math.floor(Math.random() * templates.length)];
  }

  private fillTemplate(template: string, product: Product, video: TrendingVideo): { title: string; description: string } {
    const title = template
      .replace('{product}', product.name)
      .replace('{category}', product.category);

    const description = `${title}\n\nGet yours now! Link in bio 🔗\n\n#${product.category.toLowerCase().replace(' ', '')} #viral #trending`;

    return { title, description };
  }

  private generateHashtags(product: Product, video: TrendingVideo): string[] {
    const baseHashtags = [
      '#viral',
      '#trending',
      '#fyp',
      '#foryou',
      `#${product.category.toLowerCase().replace(' ', '')}`,
      ...product.tags.map(tag => `#${tag}`)
    ];

    // Add trending hashtags from the video
    const trendingHashtags = video.hashtags.slice(0, 3);
    
    return [...new Set([...baseHashtags, ...trendingHashtags])].slice(0, 10);
  }

  private async generateVideoContent(product: Product, templateType: string): Promise<string> {
    // In a real implementation, this would generate actual video content
    // For now, return a placeholder URL
    return `https://example.com/generated-video/${product.id}_${templateType}.mp4`;
  }

  private getNextScheduleTime(): Date {
    const now = new Date();
    const hoursToAdd = Math.floor(Math.random() * 8) + 1; // 1-8 hours from now
    return new Date(now.getTime() + hoursToAdd * 60 * 60 * 1000);
  }

  async generateProductImages(product: Product): Promise<string[]> {
    // Simulate AI-generated product images
    const imageTypes = ['hero', 'lifestyle', 'detail', 'comparison', 'infographic'];
    
    return imageTypes.map(type => 
      `https://images.pexels.com/photos/${Math.floor(Math.random() * 1000000)}/generated-${type}-${product.id}.jpg`
    );
  }

  async createPrintOnDemandDesigns(trend: TrendingVideo): Promise<string[]> {
    // Generate design concepts based on trending content
    const designs = [
      `Design inspired by: ${trend.title}`,
      `Trending quote: "${trend.description.substring(0, 50)}..."`,
      `Hashtag design: ${trend.hashtags[0]}`,
      `Minimalist version of trending concept`,
      `Vintage style interpretation`
    ];

    return designs;
  }
}

export const contentGenerator = new ContentGenerator();