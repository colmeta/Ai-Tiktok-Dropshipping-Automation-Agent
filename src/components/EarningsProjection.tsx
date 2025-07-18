import React from 'react';
import { TrendingUp, DollarSign, Calendar, Target } from 'lucide-react';

interface EarningsProjectionProps {
  earnings: {
    daily: number;
    weekly: number;
    monthly: number;
    yearly: number;
    projectedMonthlyRevenue: number;
  };
}

export const EarningsProjection: React.FC<EarningsProjectionProps> = ({ earnings }) => {
  const projections = [
    {
      period: 'Daily',
      amount: earnings.daily,
      icon: <Calendar className="w-5 h-5 text-blue-600" />,
      color: 'bg-blue-50 border-blue-200'
    },
    {
      period: 'Weekly',
      amount: earnings.weekly,
      icon: <TrendingUp className="w-5 h-5 text-green-600" />,
      color: 'bg-green-50 border-green-200'
    },
    {
      period: 'Monthly',
      amount: earnings.monthly,
      icon: <DollarSign className="w-5 h-5 text-purple-600" />,
      color: 'bg-purple-50 border-purple-200'
    },
    {
      period: 'Yearly',
      amount: earnings.yearly,
      icon: <Target className="w-5 h-5 text-orange-600" />,
      color: 'bg-orange-50 border-orange-200'
    }
  ];

  return (
    <div className="mb-8">
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-xl font-semibold text-gray-900">💰 FREE Earnings Projection</h2>
        <div className="text-sm text-gray-600">
          Based on FREE methods performance
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
        {projections.map((projection) => (
          <div key={projection.period} className={`card border-2 ${projection.color}`}>
            <div className="flex items-center justify-between mb-2">
              <span className="text-sm font-medium text-gray-600">{projection.period}</span>
              {projection.icon}
            </div>
            <div className="text-2xl font-bold text-gray-900">
              ${projection.amount.toLocaleString()}
            </div>
            <div className="text-xs text-gray-500 mt-1">
              FREE projected earnings
            </div>
          </div>
        ))}
      </div>

      {/* Monthly Revenue Goal */}
      <div className="card bg-gradient-to-r from-green-50 to-blue-50 border-2 border-green-200">
        <div className="flex items-center justify-between">
          <div>
            <h3 className="text-lg font-semibold text-gray-900 mb-2">
              🎯 FREE Monthly Revenue Goal
            </h3>
            <p className="text-3xl font-bold text-green-600">
              ${earnings.projectedMonthlyRevenue.toLocaleString()}
            </p>
            <p className="text-sm text-gray-600 mt-1">
              On track to reach $150K+ monthly with FREE methods
            </p>
          </div>
          <div className="text-right">
            <div className="text-sm text-gray-600 mb-1">Progress</div>
            <div className="w-32 bg-gray-200 rounded-full h-2">
              <div 
                className="bg-green-500 h-2 rounded-full transition-all duration-300"
                style={{ 
                  width: `${Math.min((earnings.monthly / 150000) * 100, 100)}%` 
                }}
              ></div>
            </div>
            <div className="text-xs text-gray-500 mt-1">
              {Math.min((earnings.monthly / 150000) * 100, 100).toFixed(1)}% to $150K
            </div>
          </div>
        </div>
      </div>

      {/* Success Message */}
      {earnings.monthly > 5000 && (
        <div className="mt-4 p-4 bg-yellow-50 border border-yellow-200 rounded-lg">
          <div className="flex items-center">
            <div className="text-2xl mr-3">🚀</div>
            <div>
              <h4 className="font-semibold text-yellow-800">
                Amazing! Your FREE system is generating serious money!
              </h4>
              <p className="text-sm text-yellow-700">
                Your FREE automation is crushing it! Consider expanding to more niches and platforms for even bigger profits.
              </p>
            </div>
          </div>
        </div>
      )}

      {/* Zero Investment Success */}
      <div className="mt-4 p-4 bg-green-50 border border-green-200 rounded-lg">
        <div className="flex items-center">
          <div className="text-2xl mr-3">💚</div>
          <div>
            <h4 className="font-semibold text-green-800">
              100% Profit Margin - Zero Investment Required!
            </h4>
            <p className="text-sm text-green-700">
              Since you're using completely FREE methods, every dollar earned is pure profit. 
              No ads, no inventory, no upfront costs - just automated income generation!
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};