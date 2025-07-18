import React, { useState, useEffect } from 'react';
import { Play, Pause, Settings, TrendingUp, DollarSign, ShoppingBag, Users } from 'lucide-react';
import { automationEngine } from '../services/automationEngine';
import { Analytics, Campaign, AutomationSettings } from '../types';
import { AnalyticsCard } from './AnalyticsCard';
import { CampaignList } from './CampaignList';
import { SettingsPanel } from './SettingsPanel';
import { EarningsProjection } from './EarningsProjection';

export const Dashboard: React.FC = () => {
  const [isRunning, setIsRunning] = useState(false);
  const [analytics, setAnalytics] = useState<Analytics | null>(null);
  const [campaigns, setCampaigns] = useState<Campaign[]>([]);
  const [settings, setSettings] = useState<AutomationSettings | null>(null);
  const [showSettings, setShowSettings] = useState(false);
  const [earnings, setEarnings] = useState<any>(null);

  useEffect(() => {
    loadData();
    const interval = setInterval(loadData, 30000); // Update every 30 seconds
    return () => clearInterval(interval);
  }, []);

  const loadData = async () => {
    try {
      const [analyticsData, campaignsData, settingsData, earningsData] = await Promise.all([
        automationEngine.getAnalytics(),
        automationEngine.getCampaigns(),
        automationEngine.getSettings(),
        automationEngine.getEarningsProjection()
      ]);
      
      setAnalytics(analyticsData);
      setCampaigns(campaignsData);
      setSettings(settingsData);
      setEarnings(earningsData);
    } catch (error) {
      console.error('Error loading data:', error);
    }
  };

  const handleStartStop = async () => {
    try {
      if (isRunning) {
        await automationEngine.stop();
        setIsRunning(false);
      } else {
        await automationEngine.start();
        setIsRunning(true);
      }
    } catch (error) {
      console.error('Error toggling automation:', error);
    }
  };

  const handleSettingsUpdate = (newSettings: Partial<AutomationSettings>) => {
    automationEngine.updateSettings(newSettings);
    setSettings(prev => prev ? { ...prev, ...newSettings } : null);
    setShowSettings(false);
  };

  if (!analytics || !settings) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary-600 mx-auto mb-4"></div>
          <p className="text-gray-600">Loading your money-making machine...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white shadow-sm border-b">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center py-4">
            <div>
              <h1 className="text-2xl font-bold text-gray-900">
                🤖 FREE AI Dropshipping Agent
              </h1>
              <p className="text-sm text-gray-600">
                Zero investment, maximum profit • {isRunning ? '🟢 Active (FREE)' : '🔴 Stopped'}
              </p>
            </div>
            
            <div className="flex items-center space-x-4">
              <button
                onClick={() => setShowSettings(true)}
                className="btn-secondary flex items-center space-x-2"
              >
                <Settings className="w-4 h-4" />
                <span>Settings</span>
              </button>
              
              <button
                onClick={handleStartStop}
                className={`flex items-center space-x-2 px-6 py-2 rounded-lg font-medium transition-colors ${
                  isRunning 
                    ? 'bg-red-600 hover:bg-red-700 text-white' 
                    : 'bg-green-600 hover:bg-green-700 text-white animate-pulse'
                }`}
              >
                {isRunning ? <Pause className="w-4 h-4" /> : <Play className="w-4 h-4" />}
                <span>{isRunning ? 'Stop FREE Agent' : 'Start FREE Agent'}</span>
              </button>
            </div>
          </div>
        </div>
      </header>

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Key Metrics */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          <AnalyticsCard
            title="Total Revenue (FREE)"
            value={`$${analytics.totalRevenue.toLocaleString()}`}
            icon={<DollarSign className="w-6 h-6 text-green-600" />}
            trend="+35.2%"
            trendUp={true}
          />
          
          <AnalyticsCard
            title="Total Profit (100%)"
            value={`$${analytics.totalProfit.toLocaleString()}`}
            icon={<TrendingUp className="w-6 h-6 text-blue-600" />}
            trend="+28.7%"
            trendUp={true}
          />
          
          <AnalyticsCard
            title="FREE Orders"
            value={analytics.totalOrders.toLocaleString()}
            icon={<ShoppingBag className="w-6 h-6 text-purple-600" />}
            trend="+22.1%"
            trendUp={true}
          />
          
          <AnalyticsCard
            title="FREE Conversion Rate"
            value={`${analytics.conversionRate.toFixed(1)}%`}
            icon={<Users className="w-6 h-6 text-orange-600" />}
            trend="+4.3%"
            trendUp={true}
          />
        </div>

        {/* Earnings Projection */}
        {earnings && <EarningsProjection earnings={earnings} />}

        {/* Active Campaigns */}
        <div className="mb-8">
          <h2 className="text-xl font-semibold text-gray-900 mb-4">FREE Active Campaigns</h2>
          <CampaignList campaigns={campaigns} />
        </div>

        {/* Recent Activity */}
        <div className="card">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">FREE Agent Activity</h3>
          <div className="space-y-3">
            {analytics.recentActivity.map((activity) => (
              <div key={activity.id} className="flex items-center space-x-3 p-3 bg-gray-50 rounded-lg">
                <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></div>
                <div className="flex-1">
                  <p className="text-sm text-gray-900">{activity.message}</p>
                  <p className="text-xs text-gray-500">
                    {activity.timestamp.toLocaleString()}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Free Tools Info */}
        <div className="mt-8 card bg-gradient-to-r from-green-50 to-blue-50 border-2 border-green-200">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">
            🎉 100% FREE Tools Being Used
          </h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <h4 className="font-medium text-gray-800 mb-2">Content & Trends</h4>
              <ul className="text-sm text-gray-600 space-y-1">
                <li>✅ Free web scraping for trends</li>
                <li>✅ Free content generation</li>
                <li>✅ Free social media posting</li>
                <li>✅ Free hashtag optimization</li>
              </ul>
            </div>
            <div>
              <h4 className="font-medium text-gray-800 mb-2">Money Making</h4>
              <ul className="text-sm text-gray-600 space-y-1">
                <li>✅ Free affiliate programs</li>
                <li>✅ Free print-on-demand setup</li>
                <li>✅ Free design generation</li>
                <li>✅ Zero advertising costs</li>
              </ul>
            </div>
          </div>
          <div className="mt-4 p-3 bg-yellow-100 rounded-lg">
            <p className="text-sm text-yellow-800">
              <strong>💡 Pro Tip:</strong> This system is designed to generate income with ZERO upfront investment. 
              Start earning first, then reinvest profits into premium tools for even faster growth!
            </p>
          </div>
        </div>
      </main>

      {/* Settings Modal */}
      {showSettings && (
        <SettingsPanel
          settings={settings}
          onSave={handleSettingsUpdate}
          onClose={() => setShowSettings(false)}
        />
      )}
    </div>
  );
};