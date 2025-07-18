// Free content generation using browser APIs and free services
class FreeContentGenerator {
  private readonly FREE_IMAGE_SOURCES = [
    'https://picsum.photos', // Free random images
    'https://images.pexels.com', // Free stock photos
    'https://images.unsplash.com' // Free high-quality images
  ];

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

  async generateFreeContent(trend: any, product: any): Promise<any[]> {
    const contentPieces = [];

    // Generate multiple content variations using free templates
    for (const [templateType, templates] of Object.entries(this.CONTENT_TEMPLATES)) {
      const template = templates[Math.floor(Math.random() * templates.length)];
      const content = this.fillTemplate(template, product, trend);

      contentPieces.push({
        id: `${product.id}_${templateType}_${Date.now()}`,
        type: 'video',
        title: content.title,
        description: content.description,
        mediaUrl: await this.generateFreeVideo(product, templateType),
        images: await this.generateFreeImages(product),
        hashtags: this.generateHashtags(product, trend),
        platform: 'tiktok',
        scheduledFor: this.getNextScheduleTime(),
        status: 'scheduled',
        engagement: { views: 0, likes: 0, shares: 0, comments: 0 }
      });
    }

    return contentPieces;
  }

  private fillTemplate(template: string, product: any, trend: any): any {
    const title = template
      .replace('{product}', product.name)
      .replace('{category}', product.category);

    const description = `${title}\n\n🔥 Get yours now! Link in bio 🔗\n\n${this.generateDescription(product)}\n\n#${product.category.toLowerCase().replace(' ', '')} #viral #trending`;

    return { title, description };
  }

  private generateDescription(product: any): string {
    const benefits = [
      '✅ Free worldwide shipping',
      '✅ 30-day money-back guarantee',
      '✅ Thousands of 5-star reviews',
      '✅ Limited time offer - 50% OFF',
      '✅ As seen on viral TikTok videos'
    ];

    return benefits.slice(0, 3).join('\n');
  }

  private async generateFreeImages(product: any): Promise<string[]> {
    // Generate free product images using free services
    const imageTypes = ['hero', 'lifestyle', 'detail', 'comparison', 'infographic'];
    const images = [];

    for (let i = 0; i < imageTypes.length; i++) {
      // Use free image services
      const imageUrl = `${this.FREE_IMAGE_SOURCES[0]}/800/600?random=${Date.now()}_${i}`;
      images.push(imageUrl);
    }

    return images;
  }

  private async generateFreeVideo(product: any, templateType: string): Promise<string> {
    // For now, return a placeholder. In production, you'd use free video generation tools
    return `https://example.com/free-generated-video/${product.id}_${templateType}.mp4`;
  }

  private generateHashtags(product: any, trend: any): string[] {
    const baseHashtags = [
      '#viral', '#trending', '#fyp', '#foryou', '#tiktokshop',
      `#${product.category.toLowerCase().replace(' ', '')}`,
      ...product.tags.map((tag: string) => `#${tag}`)
    ];

    const trendingHashtags = trend.hashtags ? trend.hashtags.slice(0, 3) : [];
    
    return [...new Set([...baseHashtags, ...trendingHashtags])].slice(0, 15);
  }

  private getNextScheduleTime(): Date {
    const now = new Date();
    const hoursToAdd = Math.floor(Math.random() * 4) + 1; // 1-4 hours from now
    return new Date(now.getTime() + hoursToAdd * 60 * 60 * 1000);
  }

  // Free design generation for print-on-demand
  async generateFreePrintDesigns(trend: any): Promise<string[]> {
    const designs = [
      `"${trend.title.substring(0, 30)}..." - Trending Quote Design`,
      `${trend.hashtags[0]} - Minimalist Typography`,
      `Viral ${trend.niche} Design - ${new Date().getFullYear()}`,
      `Trending ${trend.niche} - Aesthetic Design`,
      `${trend.hashtags[1]} - Modern Style`
    ];

    return designs;
  }
}

export const freeContentGenerator = new FreeContentGenerator();