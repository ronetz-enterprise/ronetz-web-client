// hooks/usePaymentStepper.ts
import { useState } from 'react';

export type PaymentStep = 'method' | 'phone' | 'confirmation';

interface UsePaymentStepperReturn {
  currentStep: PaymentStep;
  goToNextStep: () => void;
  goToPreviousStep: () => void;
  canGoNext: boolean;
  canGoBack: boolean;
  isFirstStep: boolean;
  isLastStep: boolean;
}

const STEP_ORDER: PaymentStep[] = ['method', 'phone', 'confirmation'];

export const usePaymentStepper = (initialStep: PaymentStep = 'method'): UsePaymentStepperReturn => {
  const [currentStep, setCurrentStep] = useState<PaymentStep>(initialStep);

  const currentIndex = STEP_ORDER.indexOf(currentStep);
  const isFirstStep = currentIndex === 0;
  const isLastStep = currentIndex === STEP_ORDER.length - 1;

  const goToNextStep = () => {
    if (!isLastStep) {
      setCurrentStep(STEP_ORDER[currentIndex + 1]);
    }
  };

  const goToPreviousStep = () => {
    if (!isFirstStep) {
      setCurrentStep(STEP_ORDER[currentIndex - 1]);
    }
  };

  return {
    currentStep,
    goToNextStep,
    goToPreviousStep,
    canGoNext: !isLastStep,
    canGoBack: !isFirstStep,
    isFirstStep,
    isLastStep,
  };
};