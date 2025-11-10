import React from 'react';
import { motion } from 'framer-motion';

function Step3Marketing({ register, errors, onNext, onBack, watch }) {
  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      className="bg-white rounded-2xl shadow-xl p-8 md:p-12"
    >
      <h2 className="text-3xl font-bold text-gray-900 mb-2">
        Marketing Goals & Challenges
      </h2>
      <p className="text-gray-600 mb-8">
        Help us understand what you want to achieve and overcome.
      </p>

      <form onSubmit={onNext} className="space-y-6">
        {/* Marketing Goals */}
        <div>
          <label htmlFor="marketing_goals" className="block text-sm font-semibold text-gray-700 mb-2">
            What are your primary marketing goals? <span className="text-red-500">*</span>
          </label>
          <textarea
            id="marketing_goals"
            {...register('marketing_goals', { required: 'Please describe your marketing goals' })}
            rows={4}
            className="input-field"
            placeholder="e.g., Increase website traffic, generate more leads, build brand awareness, improve customer engagement..."
          />
          {errors.marketing_goals && (
            <p className="mt-1 text-sm text-red-600">{errors.marketing_goals.message}</p>
          )}
          <p className="mt-1 text-xs text-gray-500">
            Be specific about what you want to achieve in the next 6-12 months
          </p>
        </div>

        {/* Monthly Budget */}
        <div>
          <label htmlFor="monthly_budget" className="block text-sm font-semibold text-gray-700 mb-2">
            What's your monthly marketing budget?
          </label>
          <select
            id="monthly_budget"
            {...register('monthly_budget')}
            className="input-field"
          >
            <option value="">Select budget range</option>
            <option value="0-500">$0 - $500</option>
            <option value="500-1000">$500 - $1,000</option>
            <option value="1000-2500">$1,000 - $2,500</option>
            <option value="2500-5000">$2,500 - $5,000</option>
            <option value="5000-10000">$5,000 - $10,000</option>
            <option value="10000+">$10,000+</option>
            <option value="not-sure">Not sure yet</option>
          </select>
          <p className="mt-1 text-xs text-gray-500">
            This helps us recommend solutions that fit your budget
          </p>
        </div>

        {/* Biggest Challenges */}
        <div>
          <label htmlFor="biggest_challenges" className="block text-sm font-semibold text-gray-700 mb-2">
            What are your biggest marketing challenges? <span className="text-red-500">*</span>
          </label>
          <textarea
            id="biggest_challenges"
            {...register('biggest_challenges', { required: 'Please describe your challenges' })}
            rows={4}
            className="input-field"
            placeholder="e.g., Not enough time, limited budget, don't know where to start, hard to measure results, inconsistent content creation..."
          />
          {errors.biggest_challenges && (
            <p className="mt-1 text-sm text-red-600">{errors.biggest_challenges.message}</p>
          )}
          <p className="mt-1 text-xs text-gray-500">
            Understanding your challenges helps us provide targeted recommendations
          </p>
        </div>

        {/* Success Metrics */}
        <div className="bg-blue-50 border-2 border-blue-200 rounded-lg p-6">
          <h3 className="text-lg font-semibold text-blue-900 mb-3">
            💡 Common Marketing Goals
          </h3>
          <ul className="space-y-2 text-sm text-blue-800">
            <li className="flex items-start">
              <span className="mr-2">✓</span>
              <span>Increase website traffic and improve search rankings</span>
            </li>
            <li className="flex items-start">
              <span className="mr-2">✓</span>
              <span>Generate more qualified leads and conversions</span>
            </li>
            <li className="flex items-start">
              <span className="mr-2">✓</span>
              <span>Build stronger brand awareness and recognition</span>
            </li>
            <li className="flex items-start">
              <span className="mr-2">✓</span>
              <span>Improve customer engagement and retention</span>
            </li>
            <li className="flex items-start">
              <span className="mr-2">✓</span>
              <span>Establish thought leadership in your industry</span>
            </li>
            <li className="flex items-start">
              <span className="mr-2">✓</span>
              <span>Increase social media following and engagement</span>
            </li>
          </ul>
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

export default Step3Marketing;
