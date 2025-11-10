import React from 'react';
import { motion } from 'framer-motion';

const socialPlatforms = [
  { id: 'facebook', name: 'Facebook', icon: '📘' },
  { id: 'instagram', name: 'Instagram', icon: '📷' },
  { id: 'twitter', name: 'Twitter/X', icon: '🐦' },
  { id: 'linkedin', name: 'LinkedIn', icon: '💼' },
  { id: 'youtube', name: 'YouTube', icon: '📹' },
  { id: 'tiktok', name: 'TikTok', icon: '🎵' },
  { id: 'pinterest', name: 'Pinterest', icon: '📌' },
  { id: 'other', name: 'Other', icon: '➕' }
];

const marketingTools = [
  { id: 'google-analytics', name: 'Google Analytics' },
  { id: 'google-ads', name: 'Google Ads' },
  { id: 'facebook-ads', name: 'Facebook Ads' },
  { id: 'mailchimp', name: 'Mailchimp' },
  { id: 'hubspot', name: 'HubSpot' },
  { id: 'salesforce', name: 'Salesforce' },
  { id: 'wordpress', name: 'WordPress' },
  { id: 'shopify', name: 'Shopify' },
  { id: 'hootsuite', name: 'Hootsuite' },
  { id: 'canva', name: 'Canva' },
  { id: 'none', name: 'None of these' }
];

function Step2Digital({ register, errors, onNext, onBack, watch, setValue }) {
  const selectedPlatforms = watch('social_media_platforms') || [];
  const selectedTools = watch('current_marketing_tools') || [];

  const togglePlatform = (platformId) => {
    const current = Array.isArray(selectedPlatforms) ? selectedPlatforms : [];
    if (current.includes(platformId)) {
      setValue('social_media_platforms', current.filter(p => p !== platformId));
    } else {
      setValue('social_media_platforms', [...current, platformId]);
    }
  };

  const toggleTool = (toolId) => {
    const current = Array.isArray(selectedTools) ? selectedTools : [];
    if (current.includes(toolId)) {
      setValue('current_marketing_tools', current.filter(t => t !== toolId));
    } else {
      setValue('current_marketing_tools', [...current, toolId]);
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      className="bg-white rounded-2xl shadow-xl p-8 md:p-12"
    >
      <h2 className="text-3xl font-bold text-gray-900 mb-2">
        Your Digital Presence
      </h2>
      <p className="text-gray-600 mb-8">
        Let us know where you're currently active online.
      </p>

      <form onSubmit={onNext} className="space-y-8">
        {/* Social Media Platforms */}
        <div>
          <label className="block text-sm font-semibold text-gray-700 mb-4">
            Which social media platforms are you active on?
          </label>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
            {socialPlatforms.map((platform) => {
              const isSelected = selectedPlatforms.includes(platform.id);
              return (
                <button
                  key={platform.id}
                  type="button"
                  onClick={() => togglePlatform(platform.id)}
                  className={`p-4 rounded-lg border-2 transition-all duration-200 ${
                    isSelected
                      ? 'border-primary-500 bg-primary-50 shadow-md'
                      : 'border-gray-300 hover:border-primary-300 hover:bg-gray-50'
                  }`}
                >
                  <div className="text-3xl mb-2">{platform.icon}</div>
                  <div className="text-sm font-medium text-gray-900">{platform.name}</div>
                </button>
              );
            })}
          </div>
          <p className="mt-2 text-xs text-gray-500">
            Select all that apply
          </p>
        </div>

        {/* Target Audience */}
        <div>
          <label htmlFor="target_audience" className="block text-sm font-semibold text-gray-700 mb-2">
            Who is your target audience?
          </label>
          <textarea
            id="target_audience"
            {...register('target_audience')}
            rows={3}
            className="input-field"
            placeholder="e.g., Small business owners aged 30-50 looking for accounting services..."
          />
          <p className="mt-1 text-xs text-gray-500">
            Describe your ideal customer or client
          </p>
        </div>

        {/* Marketing Tools */}
        <div>
          <label className="block text-sm font-semibold text-gray-700 mb-4">
            What marketing tools do you currently use?
          </label>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
            {marketingTools.map((tool) => {
              const isSelected = selectedTools.includes(tool.id);
              return (
                <button
                  key={tool.id}
                  type="button"
                  onClick={() => toggleTool(tool.id)}
                  className={`p-3 rounded-lg border-2 text-left transition-all duration-200 ${
                    isSelected
                      ? 'border-primary-500 bg-primary-50'
                      : 'border-gray-300 hover:border-primary-300 hover:bg-gray-50'
                  }`}
                >
                  <div className="flex items-center">
                    <div className={`w-5 h-5 rounded border-2 mr-3 flex items-center justify-center ${
                      isSelected ? 'bg-primary-500 border-primary-500' : 'border-gray-300'
                    }`}>
                      {isSelected && (
                        <svg className="w-3 h-3 text-white" fill="currentColor" viewBox="0 0 20 20">
                          <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                        </svg>
                      )}
                    </div>
                    <span className="text-sm font-medium text-gray-900">{tool.name}</span>
                  </div>
                </button>
              );
            })}
          </div>
          <p className="mt-2 text-xs text-gray-500">
            Select all that apply
          </p>
        </div>

        {/* Navigation Buttons */}
        <div className="pt-6 flex flex-col sm:flex-row gap-4">
          <button
            type="button"
            onClick={onBack}
            className="flex-1 px-6 py-4 bg-gray-200 text-gray-700 font-semibold rounded-lg hover:bg-gray-300 transition-colors"
          >
            ← Back
          </button>
          <button
            type="submit"
            className="flex-1 btn-primary text-lg py-4"
          >
            Continue to Next Step →
          </button>
        </div>
      </form>
    </motion.div>
  );
}

export default Step2Digital;
