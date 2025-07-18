import { AutomationSettings, Campaign, Analytics, ActivityLog } from '../types';
import { trendAnalyzer } from './trendAnalyzer';
import { contentGenerator } from './contentGenerator';
import { productManager } from './productManager';
import { socialMediaPoster } from './socialMediaPoster';
import { affiliateManager } from './affiliateManager';

class AutomationEngine {
  private settings: AutomationSettings = {
    enabled: true,
    contentPostingFrequency: 5, // 5 posts per day
    trendAnalysisInterval: 2, // every 2 hours
    budgetLimit: 10000,
    profitThreshold: 1000,
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
    console.log('🚀 Automation Engine Started - Making Money While You Sleep!');
    
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
    console.log('🔄 Executing automation cycle...');
    
    // 1. Analyze trending content
    const trendingVideos = await trendAnalyzer.analyzeTrendingVideos();
    console.log(`📈 Found ${trendingVideos.length} trending videos`);
    
    // 2. Create products from trends
    if (this.settings.autoCreateProducts) {
      for (const video of trendingVideos.slice(0, 3)) { // Process top 3 trends
        const products = await productManager.createProductFromTrend(video);
        console.log(`🛍️ Created ${products.length} products from trend: ${video.title}`);
        
        // 3. Generate content for products
        const content = await contentGenerator.generateContentFromTrend(video, products);
        console.log(`📝 Generated ${content.length} content pieces`);
        
        // 4. Schedule content posting
        await socialMediaPoster.scheduleContent(content);
        
        // 5. Create campaign
        const campaign: Campaign = {
          id: `camp_${Date.now()}`,
          name: `Auto Campaign - ${video.title.substring(0, 30)}`,
          niche: video.niche,
          products,
          content,
          budget: 1000,
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
    
    // 6. Find and promote affiliate programs
    const affiliatePrograms = await affiliateManager.findProfitableAffiliatePrograms();
    console.log(`💰 Found ${affiliatePrograms.length} profitable affiliate programs`);
    
    // 7. Generate affiliate content
    for (const program of affiliatePrograms.slice(0, 2)) {
      const affiliateContent = await affiliateManager.generateAffiliateContent(
        program, 
        ['trending product', 'viral item', 'must-have gadget']
      );
      console.log(`📢 Generated ${affiliateContent.length} affiliate content pieces`);
    }
  }

  private async runTrendAnalysis(): Promise<void> {
    while (this.isRunning) {
      try {
        console.log('🔍 Running trend analysis...');
        
        // Analyze trends every 2 hours
        const trends = await trendAnalyzer.analyzeTrendingVideos();
        const niches = await trendAnalyzer.findProfitableNiches();
        
        console.log(`📊 Analyzed ${trends.length} trends across ${niches.length} niches`);
        
        // Update settings with most profitable niches
        this.settings.niches = niches.slice(0, 5).map(n => n.name);
        
        this.logActivity('trend_detected', `Detected ${trends.length} new trending opportunities`);
        
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
        console.log('📊 Monitoring performance...');
        
        // Update campaign performance
        for (const campaign of this.campaigns) {
          if (campaign.status === 'active') {
            // Simulate revenue generation
            const newRevenue = Math.floor(Math.random() * 500) + 100;
            const newSpent = Math.floor(Math.random() * 100) + 20;
            
            campaign.revenue += newRevenue;
            campaign.spent += newSpent;
            campaign.profit = campaign.revenue - campaign.spent;
            
            if (campaign.profit > this.settings.profitThreshold) {
              console.log(`💰 Campaign "${campaign.name}" hit profit threshold: $${campaign.profit}`);
            }
          }
        }
        
        // Check for budget limits
        const totalSpent = this.campaigns.reduce((sum, c) => sum + c.spent, 0);
        if (totalSpent > this.settings.budgetLimit) {
          console.log('⚠️ Budget limit reached, pausing campaigns');
          this.campaigns.forEach(c => c.status = 'paused');
        }
        
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
    const totalOrders = Math.floor(totalRevenue / 35); // Assuming $35 average order
    const conversionRate = Math.random() * 3 + 2; // 2-5%
    
    return {
      totalRevenue,
      totalProfit,
      totalOrders,
      conversionRate,
      averageOrderValue: totalRevenue / totalOrders || 0,
      topProducts: [],
      topNiches: await trendAnalyzer.findProfitableNiches(),
      recentActivity: this.activityLog.slice(-10)
    };
  }

  getSettings(): AutomationSettings {
    return { ...this.settings };
  }

  updateSettings(newSettings: Partial<AutomationSettings>): void {
    this.settings = { ...this.settings, ...newSettings };
    console.log('⚙️ Automation settings updated');
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
    const dailyGrowthRate = 0.15; // 15% daily growth
    
    return {
      daily: currentProfit * dailyGrowthRate,
      weekly: currentProfit * dailyGrowthRate * 7,
      monthly: currentProfit * dailyGrowthRate * 30,
      yearly: currentProfit * dailyGrowthRate * 365,
      projectedMonthlyRevenue: Math.min(currentProfit * dailyGrowthRate * 30 * 3, 100000) // Cap at $100k/month initially
    };
  }
}

export const automationEngine = new AutomationEngine();