import React, { useState } from 'react';
import { X, Save } from 'lucide-react';
import { AutomationSettings } from '../types';

interface SettingsPanelProps {
  settings: AutomationSettings;
  onSave: (settings: Partial<AutomationSettings>) => void;
  onClose: () => void;
}

export const SettingsPanel: React.FC<SettingsPanelProps> = ({
  settings,
  onSave,
  onClose
}) => {
  const [formData, setFormData] = useState(settings);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSave(formData);
  };

  const handleInputChange = (field: keyof AutomationSettings, value: any) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white rounded-xl shadow-xl max-w-2xl w-full mx-4 max-h-[90vh] overflow-y-auto">
        <div className="flex items-center justify-between p-6 border-b">
          <h2 className="text-xl font-semibold text-gray-900">Automation Settings</h2>
          <button
            onClick={onClose}
            className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="p-6 space-y-6">
          {/* Basic Settings */}
          <div>
            <h3 className="text-lg font-medium text-gray-900 mb-4">Basic Settings</h3>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Content Posts Per Day
                </label>
                <input
                  type="number"
                  min="1"
                  max="20"
                  value={formData.contentPostingFrequency}
                  onChange={(e) => handleInputChange('contentPostingFrequency', parseInt(e.target.value))}
                  className="input-field"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Trend Analysis Interval (hours)
                </label>
                <input
                  type="number"
                  min="1"
                  max="24"
                  value={formData.trendAnalysisInterval}
                  onChange={(e) => handleInputChange('trendAnalysisInterval', parseInt(e.target.value))}
                  className="input-field"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Daily Budget Limit ($)
                </label>
                <input
                  type="number"
                  min="100"
                  max="50000"
                  value={formData.budgetLimit}
                  onChange={(e) => handleInputChange('budgetLimit', parseInt(e.target.value))}
                  className="input-field"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Profit Threshold ($)
                </label>
                <input
                  type="number"
                  min="100"
                  max="10000"
                  value={formData.profitThreshold}
                  onChange={(e) => handleInputChange('profitThreshold', parseInt(e.target.value))}
                  className="input-field"
                />
              </div>
            </div>
          </div>

          {/* Automation Toggles */}
          <div>
            <h3 className="text-lg font-medium text-gray-900 mb-4">Automation Features</h3>
            
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="font-medium text-gray-900">Auto-approve Content</p>
                  <p className="text-sm text-gray-600">Automatically post generated content without manual review</p>
                </div>
                <label className="relative inline-flex items-center cursor-pointer">
                  <input
                    type="checkbox"
                    checked={formData.autoApproveContent}
                    onChange={(e) => handleInputChange('autoApproveContent', e.target.checked)}
                    className="sr-only peer"
                  />
                  <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-primary-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-primary-600"></div>
                </label>
              </div>

              <div className="flex items-center justify-between">
                <div>
                  <p className="font-medium text-gray-900">Auto-create Products</p>
                  <p className="text-sm text-gray-600">Automatically create products from trending content</p>
                </div>
                <label className="relative inline-flex items-center cursor-pointer">
                  <input
                    type="checkbox"
                    checked={formData.autoCreateProducts}
                    onChange={(e) => handleInputChange('autoCreateProducts', e.target.checked)}
                    className="sr-only peer"
                  />
                  <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-primary-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-primary-600"></div>
                </label>
              </div>
            </div>
          </div>

          {/* Target Niches */}
          <div>
            <h3 className="text-lg font-medium text-gray-900 mb-4">Target Niches</h3>
            <div className="grid grid-cols-2 gap-2">
              {[
                'Korean Beauty & Skincare',
                'Kitchen Problem Solvers',
                'Phone & Tech Accessories',
                'Home Organization',
                'Wellness Tools',
                'Pet Accessories',
                'Fitness Equipment',
                'Travel Accessories'
              ].map((niche) => (
                <label key={niche} className="flex items-center space-x-2">
                  <input
                    type="checkbox"
                    checked={formData.niches.includes(niche)}
                    onChange={(e) => {
                      if (e.target.checked) {
                        handleInputChange('niches', [...formData.niches, niche]);
                      } else {
                        handleInputChange('niches', formData.niches.filter(n => n !== niche));
                      }
                    }}
                    className="rounded border-gray-300 text-primary-600 focus:ring-primary-500"
                  />
                  <span className="text-sm text-gray-700">{niche}</span>
                </label>
              ))}
            </div>
          </div>

          {/* Social Platforms */}
          <div>
            <h3 className="text-lg font-medium text-gray-900 mb-4">Social Media Platforms</h3>
            <div className="grid grid-cols-3 gap-2">
              {['tiktok', 'instagram', 'youtube'].map((platform) => (
                <label key={platform} className="flex items-center space-x-2">
                  <input
                    type="checkbox"
                    checked={formData.platforms.includes(platform)}
                    onChange={(e) => {
                      if (e.target.checked) {
                        handleInputChange('platforms', [...formData.platforms, platform]);
                      } else {
                        handleInputChange('platforms', formData.platforms.filter(p => p !== platform));
                      }
                    }}
                    className="rounded border-gray-300 text-primary-600 focus:ring-primary-500"
                  />
                  <span className="text-sm text-gray-700 capitalize">{platform}</span>
                </label>
              ))}
            </div>
          </div>

          <div className="flex justify-end space-x-4 pt-6 border-t">
            <button
              type="button"
              onClick={onClose}
              className="btn-secondary"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="btn-primary flex items-center space-x-2"
            >
              <Save className="w-4 h-4" />
              <span>Save Settings</span>
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};