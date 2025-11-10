import React from 'react';
import { motion } from 'framer-motion';

function StepSuccess({ auditId, email }) {
  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.9 }}
      animate={{ opacity: 1, scale: 1 }}
      className="max-w-2xl mx-auto"
    >
      <div className="bg-white rounded-2xl shadow-2xl p-8 md:p-12 text-center">
        {/* Success Icon */}
        <motion.div
          initial={{ scale: 0 }}
          animate={{ scale: 1 }}
          transition={{ delay: 0.2, type: 'spring', stiffness: 200 }}
          className="w-24 h-24 mx-auto mb-6 bg-gradient-to-r from-green-400 to-emerald-500 rounded-full flex items-center justify-center"
        >
          <svg className="w-12 h-12 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M5 13l4 4L19 7" />
          </svg>
        </motion.div>

        {/* Success Message */}
        <motion.h2
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
          className="text-3xl md:text-4xl font-bold text-gray-900 mb-4"
        >
          🎉 Audit Complete!
        </motion.h2>

        <motion.p
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4 }}
          className="text-xl text-gray-600 mb-8"
        >
          Your comprehensive digital marketing audit report is ready!
        </motion.p>

        {/* Info Cards */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.5 }}
          className="space-y-4 mb-8"
        >
          <div className="bg-blue-50 border-2 border-blue-200 rounded-lg p-6">
            <div className="flex items-center justify-center mb-3">
              <span className="text-4xl">📧</span>
            </div>
            <h3 className="text-lg font-semibold text-blue-900 mb-2">
              Check Your Email
            </h3>
            <p className="text-blue-800">
              We've sent your personalized audit report to:
            </p>
            <p className="font-semibold text-blue-900 mt-2">{email}</p>
          </div>

          <div className="bg-green-50 border-2 border-green-200 rounded-lg p-6">
            <div className="flex items-center justify-center mb-3">
              <span className="text-4xl">📊</span>
            </div>
            <h3 className="text-lg font-semibold text-green-900 mb-2">
              Your Report Includes
            </h3>
            <ul className="text-green-800 text-left space-y-2">
              <li className="flex items-start">
                <span className="mr-2">✓</span>
                <span>Digital Health Score (0-100)</span>
              </li>
              <li className="flex items-start">
                <span className="mr-2">✓</span>
                <span>Detailed Analysis by Category</span>
              </li>
              <li className="flex items-start">
                <span className="mr-2">✓</span>
                <span>Personalized Recommendations</span>
              </li>
              <li className="flex items-start">
                <span className="mr-2">✓</span>
                <span>Action Plan for Improvement</span>
              </li>
            </ul>
          </div>
        </motion.div>

        {/* CTA Section */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.6 }}
          className="bg-gradient-to-r from-primary-50 to-secondary-50 border-2 border-primary-200 rounded-xl p-8"
        >
          <h3 className="text-2xl font-bold text-gray-900 mb-3">
            Ready to Take Action?
          </h3>
          <p className="text-gray-700 mb-6">
            Book a strategy call with our experts to discuss your report and create a customized action plan.
          </p>
          <a
            href="https://bookme.name/digitalstemcell/lite/schedule-a-consultation-appointment-1"
            target="_blank"
            rel="noopener noreferrer"
            className="inline-block px-8 py-4 bg-gradient-to-r from-green-500 to-emerald-600 text-white font-semibold rounded-lg shadow-lg hover:shadow-xl transform hover:-translate-y-1 transition-all duration-200 text-lg"
          >
            📞 Book Strategy Call - $250
          </a>
        </motion.div>

        {/* Additional Info */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.7 }}
          className="mt-8 text-sm text-gray-500"
        >
          <p>Audit ID: #{auditId}</p>
          <p className="mt-2">
            Didn't receive the email?{' '}
            <button className="text-primary-600 hover:underline font-medium">
              Resend email
            </button>
          </p>
        </motion.div>

        {/* Start New Audit */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.8 }}
          className="mt-8"
        >
          <button
            onClick={() => window.location.reload()}
            className="text-primary-600 hover:text-primary-700 font-medium underline"
          >
            Start a new audit →
          </button>
        </motion.div>
      </div>

      {/* Confetti Effect (Optional) */}
      <style jsx>{`
        @keyframes confetti-fall {
          to {
            transform: translateY(100vh) rotate(360deg);
          }
        }
      `}</style>
    </motion.div>
  );
}

export default StepSuccess;
