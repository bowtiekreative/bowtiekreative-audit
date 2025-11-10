import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useForm } from 'react-hook-form';
import axios from 'axios';
import StepIndicator from '../components/StepIndicator';
import Step1Business from '../components/steps/Step1Business';
import Step2Digital from '../components/steps/Step2Digital';
import Step3Marketing from '../components/steps/Step3Marketing';
import Step4Current from '../components/steps/Step4Current';
import StepSuccess from '../components/steps/StepSuccess';

const steps = [
  { id: 1, name: 'Business Info', description: 'Tell us about your business' },
  { id: 2, name: 'Digital Presence', description: 'Your online footprint' },
  { id: 3, name: 'Marketing Goals', description: 'Your objectives' },
  { id: 4, name: 'Current Status', description: 'What you have now' }
];

function AuditForm() {
  const [currentStep, setCurrentStep] = useState(1);
  const [formData, setFormData] = useState({});
  const [auditId, setAuditId] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const { register, handleSubmit, formState: { errors }, watch, setValue } = useForm({
    defaultValues: formData
  });

  const nextStep = () => {
    if (currentStep < steps.length) {
      setCurrentStep(currentStep + 1);
      window.scrollTo({ top: 0, behavior: 'smooth' });
    }
  };

  const prevStep = () => {
    if (currentStep > 1) {
      setCurrentStep(currentStep - 1);
      window.scrollTo({ top: 0, behavior: 'smooth' });
    }
  };

  const onStepSubmit = (data) => {
    setFormData({ ...formData, ...data });
    nextStep();
  };

  const onFinalSubmit = async (data) => {
    setLoading(true);
    setError('');

    const completeData = { ...formData, ...data };

    try {
      // Create audit
      const auditResponse = await axios.post('/api/audits', completeData);
      
      if (auditResponse.data.success) {
        const newAuditId = auditResponse.data.auditId;
        setAuditId(newAuditId);

        // Generate report
        await axios.post(`/api/audits/${newAuditId}/report`);

        // Move to success step
        setCurrentStep(5);
      }
    } catch (err) {
      console.error('Submission error:', err);
      setError(err.response?.data?.message || 'Failed to submit audit. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const renderStep = () => {
    switch (currentStep) {
      case 1:
        return (
          <Step1Business
            register={register}
            errors={errors}
            onNext={handleSubmit(onStepSubmit)}
            watch={watch}
          />
        );
      case 2:
        return (
          <Step2Digital
            register={register}
            errors={errors}
            onNext={handleSubmit(onStepSubmit)}
            onBack={prevStep}
            watch={watch}
            setValue={setValue}
          />
        );
      case 3:
        return (
          <Step3Marketing
            register={register}
            errors={errors}
            onNext={handleSubmit(onStepSubmit)}
            onBack={prevStep}
            watch={watch}
          />
        );
      case 4:
        return (
          <Step4Current
            register={register}
            errors={errors}
            onSubmit={handleSubmit(onFinalSubmit)}
            onBack={prevStep}
            watch={watch}
            setValue={setValue}
            loading={loading}
          />
        );
      case 5:
        return <StepSuccess auditId={auditId} email={formData.email} />;
      default:
        return null;
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-primary-50 via-white to-secondary-50 py-12">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Hero Section */}
        {currentStep !== 5 && (
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-center mb-12"
          >
            <h1 className="text-4xl md:text-5xl font-bold text-gray-900 mb-4">
              Free Digital Marketing Audit
            </h1>
            <p className="text-xl text-gray-600 mb-2">
              Discover opportunities to grow your business online
            </p>
            <p className="text-sm text-gray-500">
              Takes only 3-5 minutes • Get instant results
            </p>
          </motion.div>
        )}

        {/* Step Indicator */}
        {currentStep <= 4 && (
          <StepIndicator steps={steps} currentStep={currentStep} />
        )}

        {/* Error Message */}
        {error && (
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            className="bg-red-50 border-2 border-red-200 text-red-700 px-6 py-4 rounded-xl mb-6"
          >
            <p className="font-semibold">Error</p>
            <p>{error}</p>
          </motion.div>
        )}

        {/* Step Content */}
        <AnimatePresence mode="wait">
          <motion.div
            key={currentStep}
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -20 }}
            transition={{ duration: 0.3 }}
          >
            {renderStep()}
          </motion.div>
        </AnimatePresence>

        {/* Alternative Option */}
        {currentStep <= 4 && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.5 }}
            className="mt-12 text-center"
          >
            <div className="bg-white rounded-xl shadow-lg p-8 border-2 border-gray-200">
              <h3 className="text-xl font-bold text-gray-900 mb-3">
                Prefer Personal Guidance?
              </h3>
              <p className="text-gray-600 mb-6">
                Skip the audit and book a strategy call with our experts for personalized insights.
              </p>
              <a
                href="https://bookme.name/digitalstemcell/lite/schedule-a-consultation-appointment-1"
                target="_blank"
                rel="noopener noreferrer"
                className="inline-block px-8 py-4 bg-gradient-to-r from-green-500 to-emerald-600 text-white font-semibold rounded-lg shadow-lg hover:shadow-xl transform hover:-translate-y-0.5 transition-all duration-200"
              >
                📞 Book Strategy Call - $250
              </a>
            </div>
          </motion.div>
        )}
      </div>
    </div>
  );
}

export default AuditForm;
