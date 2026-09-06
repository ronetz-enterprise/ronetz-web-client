import React from "react";
import { Check } from "lucide-react";
import { cn } from "@/shared/lib/utils";
import type { PaymentStep } from "@/modules/payments/hooks/usePaiemetStepper";

interface Step {
  id: PaymentStep;
  label: string;
}

const STEPS: Step[] = [
  { id: "method", label: "Paiement" },
  { id: "phone", label: "Téléphone" },
  { id: "confirmation", label: "Vérification" },
];

interface StepIndicatorProps {
  currentStep: PaymentStep;
}

export const StepIndicator: React.FC<StepIndicatorProps> = ({ currentStep }) => {
  const currentIndex = STEPS.findIndex((step) => step.id === currentStep);

  return (
    <nav aria-label="Progression du paiement" className="w-full">
      <ol className="flex items-center">
        {STEPS.map((step, index) => {
          const isCompleted = index < currentIndex;
          const isCurrent = index === currentIndex;

          return (
            <React.Fragment key={step.id}>
              {index > 0 && (
                <li
                  aria-hidden="true"
                  className={cn(
                    "mx-2 h-px flex-1 sm:mx-3",
                    index <= currentIndex ? "bg-primary" : "bg-border"
                  )}
                />
              )}
              <li
                aria-current={isCurrent ? "step" : undefined}
                className="flex shrink-0 items-center gap-2"
              >
                <span
                  className={cn(
                    "flex size-6 items-center justify-center rounded-full border text-[11px] font-semibold",
                    isCompleted && "border-primary bg-primary text-primary-foreground",
                    isCurrent && "border-primary text-primary",
                    !isCompleted && !isCurrent && "border-border text-muted-foreground"
                  )}
                >
                  {isCompleted ? (
                    <Check className="size-3.5" aria-hidden="true" />
                  ) : (
                    index + 1
                  )}
                </span>
                <span
                  className={cn(
                    "hidden text-xs font-medium sm:block",
                    isCurrent ? "text-foreground" : "text-muted-foreground"
                  )}
                >
                  {step.label}
                </span>
              </li>
            </React.Fragment>
          );
        })}
      </ol>
    </nav>
  );
};
