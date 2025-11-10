import React from 'react';
import { motion } from 'framer-motion';

function Step1Business({ register, errors, onNext, watch }) {
  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      className="bg-white rounded-2xl shadow-xl p-8 md:p-12"
    >
      <h2 className="text-3xl font-bold text-gray-900 mb-2">
        Tell Us About Your Business
      </h2>
      <p className="text-gray-600 mb-8">
        We'll use this information to personalize your audit report.
      </p>

      <form onSubmit={onNext} className="space-y-6">
        {/* Business Name */}
        <div>
          <label htmlFor="business_name" className="block text-sm font-semibold text-gray-700 mb-2">
            Business Name <span className="text-red-500">*</span>
          </label>
          <input
            type="text"
            id="business_name"
            {...register('business_name', { required: 'Business name is required' })}
            className="input-field"
            placeholder="e.g., Acme Corporation"
          />
          {errors.business_name && (
            <p className="mt-1 text-sm text-red-600">{errors.business_name.message}</p>
          )}
        </div>

        {/* Contact Name */}
        <div>
          <label htmlFor="contact_name" className="block text-sm font-semibold text-gray-700 mb-2">
            Your Name <span className="text-red-500">*</span>
          </label>
          <input
            type="text"
            id="contact_name"
            {...register('contact_name', { required: 'Contact name is required' })}
            className="input-field"
            placeholder="e.g., John Smith"
          />
          {errors.contact_name && (
            <p className="mt-1 text-sm text-red-600">{errors.contact_name.message}</p>
          )}
        </div>

        {/* Email */}
        <div>
          <label htmlFor="email" className="block text-sm font-semibold text-gray-700 mb-2">
            Email Address <span className="text-red-500">*</span>
          </label>
          <input
            type="email"
            id="email"
            {...register('email', {
              required: 'Email is required',
              pattern: {
                value: /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i,
                message: 'Invalid email address'
              }
            })}
            className="input-field"
            placeholder="e.g., john@acmecorp.com"
          />
          {errors.email && (
            <p className="mt-1 text-sm text-red-600">{errors.email.message}</p>
          )}
          <p className="mt-1 text-xs text-gray-500">
            We'll send your personalized audit report to this email
          </p>
        </div>

        {/* Phone */}
        <div>
          <label htmlFor="phone" className="block text-sm font-semibold text-gray-700 mb-2">
            Phone Number (Optional)
          </label>
          <input
            type="tel"
            id="phone"
            {...register('phone')}
            className="input-field"
            placeholder="e.g., (555) 123-4567"
          />
        </div>

        {/* Website */}
        <div>
          <label htmlFor="website" className="block text-sm font-semibold text-gray-700 mb-2">
            Website URL (Optional)
          </label>
          <input
            type="url"
            id="website"
            {...register('website')}
            className="input-field"
            placeholder="e.g., https://www.acmecorp.com"
          />
        </div>

        {/* Industry */}
        <div>
          <label htmlFor="industry" className="block text-sm font-semibold text-gray-700 mb-2">
            Industry <span className="text-red-500">*</span>
          </label>
          <select
            id="industry"
            {...register('industry', { required: 'Industry is required' })}
            className="input-field"
          >
            <option value="">Select your industry</option>
            <option value="technology">Technology</option>
            <option value="healthcare">Healthcare</option>
            <option value="retail">Retail & E-commerce</option>
            <option value="professional-services">Professional Services</option>
            <option value="finance">Finance & Banking</option>
            <option value="real-estate">Real Estate</option>
            <option value="education">Education</option>
            <option value="hospitality">Hospitality & Tourism</option>
            <option value="manufacturing">Manufacturing</option>
            <option value="nonprofit">Non-Profit</option>
            <option value="other">Other</option>
          </select>
          {errors.industry && (
            <p className="mt-1 text-sm text-red-600">{errors.industry.message}</p>
          )}
        </div>

        {/* Business Size */}
        <div>
          <label htmlFor="business_size" className="block text-sm font-semibold text-gray-700 mb-2">
            Business Size <span className="text-red-500">*</span>
          </label>
          <select
            id="business_size"
            {...register('business_size', { required: 'Business size is required' })}
            className="input-field"
          >
            <option value="">Select your business size</option>
            <option value="solo">Solo/Freelancer (1)</option>
            <option value="small">Small (2-10 employees)</option>
            <option value="medium">Medium (11-50 employees)</option>
            <option value="large">Large (51-200 employees)</option>
            <option value="enterprise">Enterprise (200+ employees)</option>
          </select>
          {errors.business_size && (
            <p className="mt-1 text-sm text-red-600">{errors.business_size.message}</p>
          )}
        </div>

        {/* Location */}
        <div>
          <label htmlFor="location" className="block text-sm font-semibold text-gray-700 mb-2">
            Location (City, State/Country)
          </label>
          <input
            type="text"
            id="location"
            {...register('location')}
            className="input-field"
            placeholder="e.g., San Francisco, CA"
          />
        </div>

        {/* Submit Button */}
        <div className="pt-6">
          <button
            type="submit"
            className="w-full btn-primary text-lg py-4"
          >
            Continue to Next Step →
          </button>
        </div>
      </form>
    </motion.div>
  );
}

export default Step1Business;
