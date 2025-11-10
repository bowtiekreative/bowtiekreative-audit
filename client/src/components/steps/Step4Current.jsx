import React from 'react';
import { motion } from 'framer-motion';

const capabilities = [
  { id: 'has_website', name: 'Website', description: 'Professional website or landing page', icon: '🌐' },
  { id: 'has_social_media', name: 'Social Media', description: 'Active social media presence', icon: '📱' },
  { id: 'has_email_marketing', name: 'Email Marketing', description: 'Email campaigns or newsletters', icon: '📧' },
  { id: 'has_seo', name: 'SEO', description: 'Search engine optimization', icon: '🔍' },
  { id: 'has_paid_ads', name: 'Paid Advertising', description: 'Google Ads, Facebook Ads, etc.', icon: '💰' },
  { id: 'has_analytics', name: 'Analytics', description: 'Tracking tools (Google Analytics, etc.)', icon: '📊' },
  { id: 'has_crm', name: 'CRM System', description: 'Customer relationship management', icon: '👥' },
  { id: 'has_automation', name: 'Marketing Automation', description: 'Automated workflows or campaigns', icon: '⚙️' }
];

function Step4Current({ register, errors, onSubmit, onBack, watch, setValue, loading }) {
  const currentValues = watch();

  const toggleCapability = (capabilityId) => {
    setValue(capabilityId, !currentValues[capabilityId]);
  };

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      className="bg-white rounded-2xl shadow-xl p-8 md:p-12"
    >
      <h2 className="text-3xl font-bold text-gray-900 mb-2">
        Current Marketing Capabilities
      </h2>
      <p className="text-gray-600 mb-8">
        Select all the marketing capabilities you currently have in place.
      </p>

      <form onSubmit={onSubmit} className="space-y-8">
        {/* Capabilities Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {capabilities.map((capability) => {
            const isSelected = currentValues[capability.id] || false;
            return (
              <motion.button
                key={capability.id}
                type="button"
                onClick={() => toggleCapability(capability.id)}
                className={`p-6 rounded-xl border-2 text-left transition-all duration-200 ${
                  isSelected
                    ? 'border-primary-500 bg-primary-50 shadow-lg'
                    : 'border-gray-300 hover:border-primary-300 hover:shadow-md'
                }`}
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
              >
                <input
                  type="checkbox"
                  {...register(capability.id)}
                  className="hidden"
                />
                <div className="flex items-start">
                  <div className="text-4xl mr-4">{capability.icon}</div>
                  <div className="flex-1">
                    <div className="flex items-center justify-between mb-2">
                      <h3 className="text-lg font-semibold text-gray-900">
                        {capability.name}
                      </h3>
                      <div className={`w-6 h-6 rounded-full border-2 flex items-center justify-center transition-all ${
                        isSelected
                          ? 'bg-primary-500 border-primary-500'
                          : 'border-gray-300'
                      }`}>
                        {isSelected && (
                          <svg className="w-4 h-4 text-white" fill="currentColor" viewBox="0 0 20 20">
                            <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                          </svg>
                        )}
                      </div>
                    </div>
                    <p className="text-sm text-gray-600">{capability.description}</p>
                  </div>
                </div>
              </motion.button>
            );
          })}
        </div>

        {/* Info Box */}
        <div className="bg-gradient-to-r from-primary-50 to-secondary-50 border-2 border-primary-200 rounded-xl p-6">
          <h3 className="text-lg font-semibold text-gray-900 mb-3">
            🎯 What Happens Next?
          </h3>
          <ul className="space-y-2 text-sm text-gray-700">
            <li className="flex items-start">
              <span className="mr-2 text-primary-600">1.</span>
              <span>We'll analyze your responses and calculate your digital health score</span>
            </li>
            <li className="flex items-start">
              <span className="mr-2 text-primary-600">2.</span>
              <span>Generate a comprehensive PDF report with personalized recommendations</span>
            </li>
            <li className="flex items-start">
              <span className="mr-2 text-primary-600">3.</span>
              <span>Send the report to your email within minutes</span>
            </li>
            <li className="flex items-start">
              <span className="mr-2 text-primary-600">4.</span>
              <span>You'll receive actionable insights to improve your digital marketing</span>
            </li>
          </ul>
        </div>

        {/* Consent */}
        <div className="bg-gray-50 rounded-lg p-4">
          <label className="flex items-start cursor-pointer">
            <input
              type="checkbox"
              {...register('consent', { required: 'You must agree to continue' })}
              className="mt-1 w-5 h-5 text-primary-600 border-gray-300 rounded focus:ring-primary-500"
            />
            <span className="ml-3 text-sm text-gray-700">
              I agree to receive my audit report via email and understand that Bowtie Kreative may contact me about their services. I have read the{' '}
              <a href="#" className="text-primary-600 hover:underline">Privacy Policy</a> and{' '}
              <a href="#" className="text-primary-600 hover:underline">Terms & Conditions</a>.
            </span>
          </label>
          {errors.consent && (
            <p className="mt-2 ml-8 text-sm text-red-600">{errors.consent.message}</p>
          )}
        </div>

        {/* Navigation Buttons */}
        <div className="pt-6 flex flex-col sm:flex-row gap-4">
          <button
            type="button"
            onClick={onBack}
            className="flex-1 px-6 py-4 bg-gray-200 text-gray-700 font-semibold rounded-lg hover:bg-gray-300 transition-colors"
            disabled={loading}
          >
            ← Back
          </button>
          <button
            type="submit"
            className="flex-1 btn-primary text-lg py-4 relative"
            disabled={loading}
          >
            {loading ? (
              <>
                <span className="opacity-0">Generate My Audit Report</span>
                <div className="absolute inset-0 flex items-center justify-center">
                  <div className="w-6 h-6 border-3 border-white border-t-transparent rounded-full animate-spin"></div>
                  <span className="ml-3">Generating Report...</span>
                </div>
              </>
            ) : (
              '✨ Generate My Audit Report'
            )}
          </button>
        </div>
      </form>
    </motion.div>
  );
}

export default Step4Current;
