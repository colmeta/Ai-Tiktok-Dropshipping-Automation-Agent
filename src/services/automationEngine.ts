import { AutomationSettings, Campaign, Analytics, ActivityLog } from '../types';
import { freeWebScraper } from './freeWebScraper';
import { freeContentGenerator } from './freeContentGenerator';
import { productManager } from './productManager';
import { freeSocialPoster } from './freeSocialPoster';
import { freeAffiliateManager } from './freeAffiliateManager';
import { freePrintOnDemand } from './freePrintOnDemand';

class AutomationEngine {
  private settings: AutomationSettings = {
    enabled: true,
    contentPostingFrequency: 8, // 8 posts per day (free tier)
    trendAnalysisInterval: 2, // every 2 hours
    budgetLimit: 0, // Zero budget - completely free
    profitThreshold: 100, // Lower threshold for free start
    niches: ['Korean Beauty & Skincare', 'Kitchen Problem Solvers', 'Phone & Tech Accessories'],
    platforms: ['tiktok', 'instagram'],
    autoApproveContent: true,
    autoCreateProducts: true
  };

  private isRunning = false;
  private campaigns: Campaign[] = [];
  private activityLog: ActivityLog[] = [];

  async start(): Promise<void> {
    if (this.isRunning) return;
    
    this.isRunning = true;
    console.log('🚀 FREE Automation Engine Started - Zero Investment, Maximum Profit!');
    
    // Start main automation loop
    this.runMainLoop();
    
    // Start trend analysis loop
    this.runTrendAnalysis();
    
    // Start performance monitoring
    this.runPerformanceMonitoring();
  }

  async stop(): Promise<void> {
    this.isRunning = false;
    console.log('⏹️ Automation Engine Stopped');
  }

  private async runMainLoop(): Promise<void> {
    while (this.isRunning) {
      try {
        await this.executeAutomationCycle();
        
        // Wait before next cycle (30 minutes)
        await this.sleep(30 * 60 * 1000);
      } catch (error) {
        console.error('Error in main automation loop:', error);
        await this.sleep(60 * 1000); // Wait 1 minute before retry
      }
    }
  }

  private async executeAutomationCycle(): Promise<void> {
    console.log('🔄 Executing FREE automation cycle...');
    
    // 1. Analyze trending content
    const trendingVideos = await freeWebScraper.scrapeTikTokTrends();
    console.log(`📈 Found ${trendingVideos.length} trending videos (FREE)`);
    
    // 2. Create FREE print-on-demand designs from trends
    if (this.settings.autoCreateProducts) {
      for (const video of trendingVideos.slice(0, 3)) { // Process top 3 trends
        // Create FREE POD designs
        const designs = await freePrintOnDemand.createFreeDesigns(video);
        console.log(`🎨 Created ${designs.length} FREE designs from trend: ${video.title}`);
        
        const products = await productManager.createProductFromTrend(video);
        console.log(`🛍️ Created ${products.length} FREE products from trend: ${video.title}`);
        
        // 3. Generate FREE content for products
        const content = await freeContentGenerator.generateFreeContent(video, products[0]);
        console.log(`📝 Generated ${content.length} FREE content pieces`);
        
        // 4. Schedule FREE content posting
        await freeSocialPoster.scheduleFreePosts(content);
        
        // 5. Create campaign
        const campaign: Campaign = {
          id: `camp_${Date.now()}`,
          name: `Auto Campaign - ${video.title.substring(0, 30)}`,
          niche: video.niche,
          products,
          content,
          budget: 0, // FREE campaign
          spent: 0,
          revenue: 0,
          profit: 0,
          status: 'active',
          startDate: new Date()
        };
        
        this.campaigns.push(campaign);
        this.logActivity('product_created', `Created campaign: ${campaign.name}`);
      }
    }
    
    // 6. Find and promote FREE affiliate programs
    const affiliatePrograms = await freeAffiliateManager.findFreeAffiliatePrograms();
    console.log(`💰 Found ${affiliatePrograms.length} FREE affiliate programs`);
    
    // 7. Generate FREE affiliate content
    for (const program of affiliatePrograms.slice(0, 2)) {
      const affiliateContent = await freeAffiliateManager.generateFreeAffiliateContent(
        program, 
        ['trending product', 'viral item', 'must-have gadget']
      );
      console.log(`📢 Generated ${affiliateContent.length} FREE affiliate content pieces`);
    }
  }

  private async runTrendAnalysis(): Promise<void> {
    while (this.isRunning) {
      try {
        console.log('🔍 Running FREE trend analysis...');
        
        // Analyze trends every 2 hours using FREE scraping
        const trends = await freeWebScraper.scrapeTikTokTrends();
        const instagramTrends = await freeWebScraper.scrapeInstagramTrends();
        const youtubeTrends = await freeWebScraper.scrapeYouTubeTrends();
        
        console.log(`📊 FREE Analysis: ${trends.length} TikTok + ${instagramTrends.length} Instagram + ${youtubeTrends.length} YouTube trends`);
        
        // Update settings with trending niches
        const trendingNiches = [...new Set(trends.map(t => t.niche))];
        this.settings.niches = trendingNiches.slice(0, 5);
        
        this.logActivity('trend_detected', `FREE: Detected ${trends.length} new trending opportunities`);
        
        await this.sleep(this.settings.trendAnalysisInterval * 60 * 60 * 1000);
      } catch (error) {
        console.error('Error in trend analysis:', error);
        await this.sleep(60 * 60 * 1000); // Wait 1 hour before retry
      }
    }
  }

  private async runPerformanceMonitoring(): Promise<void> {
    while (this.isRunning) {
      try {
        console.log('📊 Monitoring FREE performance...');
        
        // Update campaign performance
        for (const campaign of this.campaigns) {
          if (campaign.status === 'active') {
            // Simulate FREE revenue generation (higher profits, no ad spend)
            const newRevenue = Math.floor(Math.random() * 800) + 200; // Higher revenue
            const newSpent = 0; // No ad spend - completely free
            
            campaign.revenue += newRevenue;
            campaign.spent += newSpent;
            campaign.profit = campaign.revenue - campaign.spent;
            
            if (campaign.profit > this.settings.profitThreshold) {
              console.log(`💰 FREE Campaign "${campaign.name}" hit profit threshold: $${campaign.profit}`);
            }
          }
        }
        
        // No budget limits for free campaigns!
        console.log('✅ FREE campaigns running with unlimited budget!');
        
        await this.sleep(15 * 60 * 1000); // Check every 15 minutes
      } catch (error) {
        console.error('Error in performance monitoring:', error);
        await this.sleep(60 * 1000);
      }
    }
  }

  async getAnalytics(): Promise<Analytics> {
    const totalRevenue = this.campaigns.reduce((sum, c) => sum + c.revenue, 0);
    const totalProfit = this.campaigns.reduce((sum, c) => sum + c.profit, 0);
    const totalOrders = Math.floor(totalRevenue / 25); // Lower price point for POD
    const conversionRate = Math.random() * 5 + 3; // 3-8% (higher for free traffic)
    
    return {
      totalRevenue,
      totalProfit,
      totalOrders,
      conversionRate,
      averageOrderValue: totalRevenue / totalOrders || 0,
      topProducts: [],
      topNiches: [],
      recentActivity: this.activityLog.slice(-10)
    };
  }

  getSettings(): AutomationSettings {
    return { ...this.settings };
  }

  updateSettings(newSettings: Partial<AutomationSettings>): void {
    this.settings = { ...this.settings, ...newSettings };
    console.log('⚙️ FREE Automation settings updated');
  }

  getCampaigns(): Campaign[] {
    return [...this.campaigns];
  }

  private logActivity(type: ActivityLog['type'], message: string, data?: any): void {
    this.activityLog.push({
      id: `log_${Date.now()}`,
      type,
      message,
      timestamp: new Date(),
      data
    });
    
    // Keep only last 100 logs
    if (this.activityLog.length > 100) {
      this.activityLog = this.activityLog.slice(-100);
    }
  }

  private sleep(ms: number): Promise<void> {
    return new Promise(resolve => setTimeout(resolve, ms));
  }

  // Money-making projections
  async getEarningsProjection(): Promise<any> {
    const currentProfit = this.campaigns.reduce((sum, c) => sum + c.profit, 0);
    const dailyGrowthRate = 0.25; // 25% daily growth (higher for free methods)
    
    return {
      daily: currentProfit * dailyGrowthRate,
      weekly: currentProfit * dailyGrowthRate * 7,
      monthly: currentProfit * dailyGrowthRate * 30,
      yearly: currentProfit * dailyGrowthRate * 365,
      projectedMonthlyRevenue: Math.min(currentProfit * dailyGrowthRate * 30 * 4, 150000) // Higher cap for free methods
    };
  }
}

export const automationEngine = new AutomationEngine();