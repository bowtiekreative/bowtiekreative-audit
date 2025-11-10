import React from 'react';
import { motion } from 'framer-motion';

function StepIndicator({ steps, currentStep }) {
  return (
    <div className="mb-12">
      <div className="flex items-center justify-between">
        {steps.map((step, index) => (
          <React.Fragment key={step.id}>
            {/* Step Circle */}
            <div className="flex flex-col items-center flex-1">
              <motion.div
                className={`w-12 h-12 rounded-full flex items-center justify-center font-bold text-lg border-4 ${
                  currentStep >= step.id
                    ? 'bg-primary-500 border-primary-500 text-white'
                    : 'bg-gray-200 border-gray-300 text-gray-500'
                }`}
                initial={{ scale: 0.8 }}
                animate={{ scale: currentStep === step.id ? 1.1 : 1 }}
                transition={{ duration: 0.3 }}
              >
                {step.id}
              </motion.div>
              <div className="mt-2 text-center hidden sm:block">
                <p className={`text-sm font-semibold ${
                  currentStep >= step.id ? 'text-primary-600' : 'text-gray-500'
                }`}>
                  {step.name}
                </p>
                <p className="text-xs text-gray-400">{step.description}</p>
              </div>
            </div>

            {/* Connector Line */}
            {index < steps.length - 1 && (
              <div className="flex-1 h-1 mx-2 sm:mx-4 relative -mt-20 sm:-mt-12">
                <div className="absolute top-0 left-0 w-full h-full bg-gray-300 rounded"></div>
                <motion.div
                  className="absolute top-0 left-0 h-full bg-primary-500 rounded"
                  initial={{ width: '0%' }}
                  animate={{ width: currentStep > step.id ? '100%' : '0%' }}
                  transition={{ duration: 0.5 }}
                ></motion.div>
              </div>
            )}
          </React.Fragment>
        ))}
      </div>
    </div>
  );
}

export default StepIndicator;
