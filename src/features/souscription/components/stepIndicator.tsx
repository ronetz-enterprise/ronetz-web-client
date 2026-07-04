import React from 'react';
import { cn } from '@/shared/lib/utils';
import type { PaymentStep } from '../hooks/usePaiemetStepper';

interface Step {
  id: PaymentStep;
  label: string;
}

const STEPS: Step[] = [
  { id: 'method', label: 'Méthode' },
  { id: 'phone', label: 'Téléphone' },
  { id: 'confirmation', label: 'Confirmation' },
];

interface StepIndicatorProps {
  currentStep: PaymentStep;
}

export const StepIndicator: React.FC<StepIndicatorProps> = ({ currentStep }) => {
  const currentIndex = STEPS.findIndex(step => step.id === currentStep);

  return (
    <div className="w-full space-y-1.5">
      <p className="text-xs text-muted-foreground text-right">
        Étape {currentIndex + 1} / {STEPS.length}
      </p>
      <div className="flex gap-1">
        {STEPS.map((step, index) => {
          const isCompleted = index < currentIndex;
          const isCurrent = index === currentIndex;
          return (
            <div
              key={step.id}
              className="relative flex-1 h-0.5 rounded-full bg-muted overflow-hidden"
            >
              <div
                className={cn(
                  "absolute inset-0 rounded-full transition-transform duration-500 ease-out origin-left",
                  (isCompleted || isCurrent) ? "bg-primary scale-x-100" : "scale-x-0"
                )}
              />
            </div>
          );
        })}
      </div>
    </div>
  );
};
