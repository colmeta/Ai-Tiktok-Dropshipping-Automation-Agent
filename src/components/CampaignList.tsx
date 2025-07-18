import React from 'react';
import { Campaign } from '../types';
import { Play, Pause, TrendingUp, DollarSign } from 'lucide-react';

interface CampaignListProps {
  campaigns: Campaign[];
}

export const CampaignList: React.FC<CampaignListProps> = ({ campaigns }) => {
  if (campaigns.length === 0) {
    return (
      <div className="card text-center py-12">
        <div className="text-gray-400 mb-4">
          <TrendingUp className="w-12 h-12 mx-auto" />
        </div>
        <h3 className="text-lg font-medium text-gray-900 mb-2">No Active Campaigns</h3>
        <p className="text-gray-600">Start the automation engine to begin creating profitable campaigns!</p>
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
      {campaigns.map((campaign) => (
        <div key={campaign.id} className="card">
          <div className="flex items-start justify-between mb-4">
            <div className="flex-1">
              <h3 className="font-semibold text-gray-900 mb-1">{campaign.name}</h3>
              <p className="text-sm text-gray-600">{campaign.niche}</p>
            </div>
            <div className={`px-2 py-1 rounded-full text-xs font-medium ${
              campaign.status === 'active' 
                ? 'bg-green-100 text-green-800' 
                : campaign.status === 'paused'
                ? 'bg-yellow-100 text-yellow-800'
                : 'bg-gray-100 text-gray-800'
            }`}>
              {campaign.status}
            </div>
          </div>

          <div className="grid grid-cols-3 gap-4 mb-4">
            <div>
              <p className="text-xs text-gray-500">Revenue</p>
              <p className="font-semibold text-green-600">${campaign.revenue.toLocaleString()}</p>
            </div>
            <div>
              <p className="text-xs text-gray-500">Spent</p>
              <p className="font-semibold text-red-600">${campaign.spent.toLocaleString()}</p>
            </div>
            <div>
              <p className="text-xs text-gray-500">Profit</p>
              <p className="font-semibold text-blue-600">${campaign.profit.toLocaleString()}</p>
            </div>
          </div>

          <div className="flex items-center justify-between text-sm text-gray-600">
            <span>{campaign.products.length} products</span>
            <span>{campaign.content.length} content pieces</span>
            <span>ROI: {campaign.spent > 0 ? ((campaign.profit / campaign.spent) * 100).toFixed(1) : 0}%</span>
          </div>

          <div className="mt-4 pt-4 border-t border-gray-200">
            <div className="flex items-center justify-between">
              <span className="text-sm text-gray-600">
                Started: {campaign.startDate.toLocaleDateString()}
              </span>
              <div className="flex items-center space-x-2">
                {campaign.status === 'active' ? (
                  <Pause className="w-4 h-4 text-gray-400" />
                ) : (
                  <Play className="w-4 h-4 text-gray-400" />
                )}
                <DollarSign className="w-4 h-4 text-green-500" />
              </div>
            </div>
          </div>
        </div>
      ))}
    </div>
  );
};