import { AffiliateProgram } from '../types';

class AffiliateManager {
  private readonly HIGH_COMMISSION_THRESHOLD = 15; // 15% or higher
  private readonly MIN_RATING = 4.0;

  async findProfitableAffiliatePrograms(): Promise<AffiliateProgram[]> {
    // Simulate finding profitable affiliate programs
    const programs: AffiliateProgram[] = [
      {
        id: '1',
        name: 'Amazon Associates',
        commission: 8,
        category: 'General Retail',
        description: 'World\'s largest affiliate program with millions of products',
        requirements: ['Website/Blog', 'Quality Content', 'Compliance with Terms'],
        payoutThreshold: 10,
        cookieDuration: 24,
        rating: 4.5,
        estimatedEarnings: 2500
      },
      {
        id: '2',
        name: 'ClickBank',
        commission: 25,
        category: 'Digital Products',
        description: 'High-commission digital products and courses',
        requirements: ['Active Promotion', 'Quality Traffic'],
        payoutThreshold: 10,
        cookieDuration: 60,
        rating: 4.2,
        estimatedEarnings: 4200
      },
      {
        id: '3',
        name: 'ShareASale',
        commission: 12,
        category: 'Fashion & Beauty',
        description: 'Premium fashion and beauty brands',
        requirements: ['Website', 'Social Media Presence'],
        payoutThreshold: 50,
        cookieDuration: 30,
        rating: 4.3,
        estimatedEarnings: 1800
      },
      {
        id: '4',
        name: 'CJ Affiliate',
        commission: 18,
        category: 'Technology',
        description: 'Leading tech brands and software companies',
        requirements: ['Established Audience', 'Tech Content'],
        payoutThreshold: 50,
        cookieDuration: 45,
        rating: 4.4,
        estimatedEarnings: 3200
      },
      {
        id: '5',
        name: 'Impact Radius',
        commission: 22,
        category: 'Health & Wellness',
        description: 'Premium health and wellness products',
        requirements: ['Health Content', 'Compliance'],
        payoutThreshold: 25,
        cookieDuration: 30,
        rating: 4.6,
        estimatedEarnings: 3800
      },
      {
        id: '6',
        name: 'Rakuten Advertising',
        commission: 15,
        category: 'Travel & Lifestyle',
        description: 'Travel, hotels, and lifestyle brands',
        requirements: ['Travel Content', 'Active Promotion'],
        payoutThreshold: 50,
        cookieDuration: 30,
        rating: 4.1,
        estimatedEarnings: 2200
      }
    ];

    return this.rankProgramsByProfitability(programs);
  }

  private rankProgramsByProfitability(programs: AffiliateProgram[]): AffiliateProgram[] {
    return programs
      .filter(program => 
        program.commission >= this.HIGH_COMMISSION_THRESHOLD && 
        program.rating >= this.MIN_RATING
      )
      .sort((a, b) => {
        // Sort by estimated earnings potential
        const aScore = this.calculateProfitabilityScore(a);
        const bScore = this.calculateProfitabilityScore(b);
        return bScore - aScore;
      });
  }

  private calculateProfitabilityScore(program: AffiliateProgram): number {
    const commissionWeight = 0.4;
    const earningsWeight = 0.3;
    const ratingWeight = 0.2;
    const cookieWeight = 0.1;

    const commissionScore = (program.commission / 30) * 100; // Normalize to 30% max
    const earningsScore = (program.estimatedEarnings / 5000) * 100; // Normalize to $5000 max
    const ratingScore = (program.rating / 5) * 100;
    const cookieScore = (program.cookieDuration / 90) * 100; // Normalize to 90 days max

    return (
      commissionScore * commissionWeight +
      earningsScore * earningsWeight +
      ratingScore * ratingWeight +
      cookieScore * cookieWeight
    );
  }

  async findNicheAffiliatePrograms(niche: string): Promise<AffiliateProgram[]> {
    const allPrograms = await this.findProfitableAffiliatePrograms();
    
    const nicheKeywords: { [key: string]: string[] } = {
      'beauty': ['beauty', 'skincare', 'cosmetics', 'fashion'],
      'tech': ['technology', 'software', 'gadgets', 'electronics'],
      'health': ['health', 'wellness', 'fitness', 'nutrition'],
      'home': ['home', 'kitchen', 'garden', 'lifestyle'],
      'travel': ['travel', 'hotels', 'booking', 'lifestyle']
    };

    const keywords = nicheKeywords[niche.toLowerCase()] || [niche.toLowerCase()];
    
    return allPrograms.filter(program => 
      keywords.some(keyword => 
        program.category.toLowerCase().includes(keyword) ||
        program.description.toLowerCase().includes(keyword)
      )
    );
  }

  async generateAffiliateContent(program: AffiliateProgram, products: string[]): Promise<string[]> {
    const contentTemplates = [
      `🔥 EXCLUSIVE: Get {discount}% OFF {product} through my link!`,
      `I've been using {product} for 30 days - here's my honest review`,
      `Why {product} is trending on TikTok (and why you need it)`,
      `{product} vs competitors - which one actually works?`,
      `This {product} changed my {category} routine forever`
    ];

    const content: string[] = [];

    for (const product of products) {
      for (const template of contentTemplates) {
        const filledTemplate = template
          .replace('{product}', product)
          .replace('{category}', program.category.toLowerCase())
          .replace('{discount}', Math.floor(Math.random() * 30 + 10).toString());
        
        content.push(filledTemplate);
      }
    }

    return content;
  }

  async trackAffiliatePerformance(programId: string): Promise<any> {
    // Simulate affiliate performance tracking
    return {
      programId,
      clicks: Math.floor(Math.random() * 1000) + 500,
      conversions: Math.floor(Math.random() * 50) + 25,
      revenue: Math.floor(Math.random() * 2000) + 1000,
      commission: Math.floor(Math.random() * 400) + 200,
      conversionRate: Math.random() * 5 + 2, // 2-7%
      averageOrderValue: Math.floor(Math.random() * 100) + 50
    };
  }

  async optimizeAffiliateStrategy(performanceData: any[]): Promise<string[]> {
    const recommendations: string[] = [];

    const avgConversionRate = performanceData.reduce((sum, data) => sum + data.conversionRate, 0) / performanceData.length;
    const topPerformers = performanceData.filter(data => data.conversionRate > avgConversionRate);

    if (topPerformers.length > 0) {
      recommendations.push(`Focus on top-performing programs: ${topPerformers.map(p => p.programId).join(', ')}`);
    }

    const lowPerformers = performanceData.filter(data => data.conversionRate < 2);
    if (lowPerformers.length > 0) {
      recommendations.push(`Consider pausing low-performing programs: ${lowPerformers.map(p => p.programId).join(', ')}`);
    }

    recommendations.push('Increase content frequency for high-converting niches');
    recommendations.push('Test different call-to-action strategies');
    recommendations.push('Optimize posting times based on audience analytics');

    return recommendations;
  }
}

export const affiliateManager = new AffiliateManager();