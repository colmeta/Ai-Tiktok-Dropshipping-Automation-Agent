import { Product, ProductVariant, TrendingVideo } from '../types';

class ProductManager {
  private readonly PROFIT_MARGIN_TARGET = 3.5; // 3.5x markup
  private readonly TRENDING_CATEGORIES = [
    'Korean Beauty & Skincare',
    'Kitchen Problem Solvers', 
    'Phone & Tech Accessories',
    'Home Organization',
    'Wellness Tools',
    'Pet Accessories',
    'Fitness Equipment',
    'Travel Accessories'
  ];

  async createProductFromTrend(trend: TrendingVideo): Promise<Product[]> {
    const products: Product[] = [];
    const category = this.categorizeFromTrend(trend);
    
    // Generate multiple product variations
    const productIdeas = await this.generateProductIdeas(trend, category);
    
    for (const idea of productIdeas) {
      const product = await this.createProduct(idea, category, trend);
      products.push(product);
    }

    return products;
  }

  private async generateProductIdeas(trend: TrendingVideo, category: string): Promise<any[]> {
    const ideas = [];
    
    switch (category) {
      case 'Korean Beauty & Skincare':
        ideas.push(
          { name: 'K-Beauty Glow Serum', cost: 8, suggestedPrice: 35 },
          { name: 'Jade Facial Roller Set', cost: 5, suggestedPrice: 25 },
          { name: 'Korean Sheet Mask Bundle', cost: 12, suggestedPrice: 45 },
          { name: 'Glass Skin Essence', cost: 10, suggestedPrice: 40 }
        );
        break;
        
      case 'Kitchen Problem Solvers':
        ideas.push(
          { name: 'Multi-Function Garlic Press', cost: 6, suggestedPrice: 28 },
          { name: 'Vegetable Chopper Pro', cost: 8, suggestedPrice: 35 },
          { name: 'Smart Storage Container Set', cost: 10, suggestedPrice: 42 },
          { name: 'Kitchen Organizer Rack', cost: 7, suggestedPrice: 30 }
        );
        break;
        
      case 'Phone & Tech Accessories':
        ideas.push(
          { name: 'Wireless Charging Stand', cost: 9, suggestedPrice: 38 },
          { name: 'Phone Camera Lens Kit', cost: 12, suggestedPrice: 48 },
          { name: 'Magnetic Car Mount', cost: 6, suggestedPrice: 25 },
          { name: 'Portable Phone Tripod', cost: 8, suggestedPrice: 32 }
        );
        break;
        
      default:
        ideas.push(
          { name: 'Trending Product', cost: 8, suggestedPrice: 35 }
        );
    }

    return ideas;
  }

  private async createProduct(idea: any, category: string, trend: TrendingVideo): Promise<Product> {
    const variants = this.generateVariants(idea);
    
    return {
      id: `prod_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
      name: idea.name,
      description: this.generateDescription(idea.name, category, trend),
      price: idea.suggestedPrice,
      cost: idea.cost,
      margin: ((idea.suggestedPrice - idea.cost) / idea.suggestedPrice) * 100,
      category,
      tags: this.generateTags(idea.name, category),
      images: await this.generateProductImages(idea.name),
      variants,
      createdAt: new Date(),
      status: 'active'
    };
  }

  private generateVariants(idea: any): ProductVariant[] {
    const baseVariants = [
      { name: 'Standard', priceModifier: 0 },
      { name: 'Premium', priceModifier: 10 },
      { name: 'Bundle Pack', priceModifier: 25 }
    ];

    return baseVariants.map((variant, index) => ({
      id: `var_${Date.now()}_${index}`,
      name: variant.name,
      price: idea.suggestedPrice + variant.priceModifier,
      sku: `SKU_${Date.now()}_${index}`,
      inventory: Math.floor(Math.random() * 500) + 100
    }));
  }

  private generateDescription(name: string, category: string, trend: TrendingVideo): string {
    const benefits = this.getCategoryBenefits(category);
    const trendConnection = trend.title.substring(0, 50);
    
    return `🔥 VIRAL ${name.toUpperCase()} 🔥

✨ As seen in trending videos with ${(trend.views / 1000000).toFixed(1)}M+ views!

${benefits.join('\n')}

⚡ Limited time offer - Get yours before it sells out!
🚚 Fast shipping worldwide
💯 30-day money-back guarantee

Join thousands of satisfied customers who discovered this through viral TikTok videos!

#Trending #Viral #${category.replace(' ', '')}`;
  }

  private getCategoryBenefits(category: string): string[] {
    const benefitMap: { [key: string]: string[] } = {
      'Korean Beauty & Skincare': [
        '✅ Achieve glass skin in just 7 days',
        '✅ Korean beauty secrets revealed',
        '✅ Dermatologist recommended formula',
        '✅ Suitable for all skin types'
      ],
      'Kitchen Problem Solvers': [
        '✅ Save 30+ minutes on meal prep',
        '✅ Professional chef quality',
        '✅ Easy to clean and store',
        '✅ Durable stainless steel construction'
      ],
      'Phone & Tech Accessories': [
        '✅ Universal compatibility',
        '✅ Premium materials and build quality',
        '✅ Enhance your mobile experience',
        '✅ Sleek and modern design'
      ]
    };

    return benefitMap[category] || [
      '✅ High quality materials',
      '✅ Easy to use',
      '✅ Great value for money',
      '✅ Customer satisfaction guaranteed'
    ];
  }

  private generateTags(name: string, category: string): string[] {
    const baseTags = ['viral', 'trending', 'tiktok', 'popular'];
    const categoryTags = category.toLowerCase().split(' ');
    const nameTags = name.toLowerCase().split(' ').filter(word => word.length > 2);
    
    return [...new Set([...baseTags, ...categoryTags, ...nameTags])];
  }

  private async generateProductImages(name: string): Promise<string[]> {
    // In production, this would generate actual product images
    const imageCount = 5;
    const images = [];
    
    for (let i = 0; i < imageCount; i++) {
      images.push(`https://images.pexels.com/photos/${Math.floor(Math.random() * 1000000)}/product-${name.replace(' ', '-').toLowerCase()}-${i}.jpg`);
    }
    
    return images;
  }

  private categorizeFromTrend(trend: TrendingVideo): string {
    const title = trend.title.toLowerCase();
    const description = trend.description.toLowerCase();
    const hashtags = trend.hashtags.join(' ').toLowerCase();
    const content = `${title} ${description} ${hashtags}`;

    if (content.includes('skin') || content.includes('beauty') || content.includes('korean')) {
      return 'Korean Beauty & Skincare';
    }
    if (content.includes('kitchen') || content.includes('cooking') || content.includes('food')) {
      return 'Kitchen Problem Solvers';
    }
    if (content.includes('phone') || content.includes('tech') || content.includes('gadget')) {
      return 'Phone & Tech Accessories';
    }
    if (content.includes('home') || content.includes('organization') || content.includes('storage')) {
      return 'Home Organization';
    }
    
    return this.TRENDING_CATEGORIES[Math.floor(Math.random() * this.TRENDING_CATEGORIES.length)];
  }

  async optimizePricing(product: Product, competitorData: any[]): Promise<number> {
    if (competitorData.length === 0) return product.price;
    
    const avgCompetitorPrice = competitorData.reduce((sum, comp) => sum + comp.avgPrice, 0) / competitorData.length;
    const optimizedPrice = avgCompetitorPrice * 1.15; // 15% above average
    
    return Math.max(optimizedPrice, product.cost * this.PROFIT_MARGIN_TARGET);
  }
}

export const productManager = new ProductManager();