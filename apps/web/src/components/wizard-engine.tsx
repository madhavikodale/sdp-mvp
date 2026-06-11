"use client";

import { Button } from "@/components/ui/button";
import { Modal } from "@/components/ui/modal";
import { Check, ChevronRight, Loader2 } from "lucide-react";
import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useRef,
  useState,
  type ReactNode,
} from "react";

// ─────────────────────────────────────────────────────────────────────────────
// Types
// ─────────────────────────────────────────────────────────────────────────────

export interface WizardStep {
  id: string;
  label: string;
  description?: string;
  component: ReactNode;
  validate?: () => boolean | Promise<boolean>;
  hidden?: boolean;
}

export interface WizardEngineProps {
  isOpen: boolean;
  onClose: () => void;
  title: string;
  description?: string;
  steps: WizardStep[];
  onComplete?: () => void;
  onStepChange?: (stepIndex: number, stepId: string) => void;
  submitLabel?: string;
  loading?: boolean;
  storageKey?: string; // auto-save draft to localStorage
  allowSkipBack?: boolean; // allow clicking back to any previous step
}

interface WizardContextValue {
  currentStep: number;
  totalSteps: number;
  visibleSteps: WizardStep[];
  visibleStepIndex: number;
  goToStep: (index: number) => void;
  goNext: () => void;
  goBack: () => void;
  isFirstStep: boolean;
  isLastStep: boolean;
  canProceed: boolean;
  setCanProceed: (can: boolean) => void;
  isValidating: boolean;
  draft: Record<string, unknown>;
  setDraftValue: (key: string, value: unknown) => void;
  getDraftValue: <T>(key: string, fallback?: T) => T | undefined;
}

// ─────────────────────────────────────────────────────────────────────────────
// Context
// ─────────────────────────────────────────────────────────────────────────────

const WizardContext = createContext<WizardContextValue | undefined>(undefined);

export function useWizard() {
  const ctx = useContext(WizardContext);
  if (!ctx) throw new Error("useWizard must be used within WizardEngine");
  return ctx;
}

// ─────────────────────────────────────────────────────────────────────────────
// Storage helpers
// ─────────────────────────────────────────────────────────────────────────────

function loadDraft(key: string): Record<string, unknown> {
  try {
    const raw = localStorage.getItem(`wizard_draft_${key}`);
    return raw ? JSON.parse(raw) : {};
  } catch {
    return {};
  }
}

function saveDraft(key: string, draft: Record<string, unknown>) {
  try {
    localStorage.setItem(`wizard_draft_${key}`, JSON.stringify(draft));
  } catch {
    // ignore
  }
}

function clearDraft(key: string) {
  try {
    localStorage.removeItem(`wizard_draft_${key}`);
  } catch {
    // ignore
  }
}

// ─────────────────────────────────────────────────────────────────────────────
// Component
// ─────────────────────────────────────────────────────────────────────────────

export function WizardEngine({
  isOpen,
  onClose,
  title,
  description,
  steps,
  onComplete,
  onStepChange,
  submitLabel = "Complete",
  loading = false,
  storageKey,
  allowSkipBack = true,
}: WizardEngineProps) {
  const visibleSteps = useMemo(() => steps.filter((s) => !s.hidden), [steps]);
  const totalSteps = visibleSteps.length;

  const [currentStep, setCurrentStep] = useState(0);
  const [canProceed, setCanProceed] = useState(true);
  const [isValidating, setIsValidating] = useState(false);
  const [draft, setDraft] = useState<Record<string, unknown>>(() =>
    storageKey ? loadDraft(storageKey) : {}
  );

  const contentRef = useRef<HTMLDivElement>(null);
  const prevOpenRef = useRef(isOpen);

  const isFirstStep = currentStep === 0;
  const isLastStep = currentStep === totalSteps - 1;
  const activeStep = visibleSteps[currentStep];

  // Auto-save draft
  useEffect(() => {
    if (storageKey) {
      saveDraft(storageKey, draft);
    }
  }, [draft, storageKey]);

  // Focus first focusable element when step changes
  useEffect(() => {
    if (contentRef.current && isOpen) {
      const focusable = contentRef.current.querySelector<HTMLElement>(
        'input, select, textarea, button:not([disabled]), [href], [tabindex]:not([tabindex="-1"])'
      );
      focusable?.focus();
    }
  }, [currentStep, isOpen]);

  // Reset on open
  useEffect(() => {
    if (isOpen && !prevOpenRef.current) {
      setCurrentStep(0);
      setCanProceed(true);
      setIsValidating(false);
      if (storageKey) {
        setDraft(loadDraft(storageKey));
      }
    }
    prevOpenRef.current = isOpen;
  }, [isOpen, storageKey]);

  const setDraftValue = useCallback((key: string, value: unknown) => {
    setDraft((prev) => ({ ...prev, [key]: value }));
  }, []);

  const getDraftValue = useCallback(
    <T,>(key: string, fallback?: T): T | undefined => {
      return (draft[key] as T) ?? fallback;
    },
    [draft]
  );

  const goToStep = useCallback(
    (index: number) => {
      if (index >= 0 && index < totalSteps) {
        setCurrentStep(index);
        onStepChange?.(index, visibleSteps[index]?.id ?? "");
      }
    },
    [totalSteps, visibleSteps, onStepChange]
  );

  const goNext = useCallback(async () => {
    const step = visibleSteps[currentStep];
    if (step?.validate) {
      setIsValidating(true);
      try {
        const valid = await step.validate();
        if (!valid) return;
      } finally {
        setIsValidating(false);
      }
    }
    if (isLastStep) {
      if (storageKey) clearDraft(storageKey);
      onComplete?.();
    } else {
      const nextIndex = Math.min(currentStep + 1, totalSteps - 1);
      setCurrentStep(nextIndex);
      onStepChange?.(nextIndex, visibleSteps[nextIndex]?.id ?? "");
    }
  }, [currentStep, visibleSteps, isLastStep, totalSteps, onComplete, onStepChange, storageKey]);

  const goBack = useCallback(() => {
    const prevIndex = Math.max(currentStep - 1, 0);
    setCurrentStep(prevIndex);
    onStepChange?.(prevIndex, visibleSteps[prevIndex]?.id ?? "");
  }, [currentStep, visibleSteps, onStepChange]);

  const handleClose = useCallback(() => {
    setCurrentStep(0);
    setCanProceed(true);
    setIsValidating(false);
    onClose();
  }, [onClose]);

  const value = useMemo<WizardContextValue>(
    () => ({
      currentStep,
      totalSteps,
      visibleSteps,
      visibleStepIndex: currentStep,
      goToStep,
      goNext,
      goBack,
      isFirstStep,
      isLastStep,
      canProceed,
      setCanProceed,
      isValidating,
      draft,
      setDraftValue,
      getDraftValue,
    }),
    [
      currentStep,
      totalSteps,
      visibleSteps,
      goToStep,
      goNext,
      goBack,
      isFirstStep,
      isLastStep,
      canProceed,
      isValidating,
      draft,
      setDraftValue,
      getDraftValue,
    ]
  );

  return (
    <WizardContext.Provider value={value}>
      <Modal
        isOpen={isOpen}
        onClose={handleClose}
        title={title}
        description={description}
        size="lg"
      >
        <div className="space-y-6" role="dialog" aria-modal="true" aria-labelledby="wizard-title">
          {/* Stepper */}
          {totalSteps > 1 && (
            <nav aria-label="Wizard steps" className="flex items-center gap-1.5 overflow-x-auto pb-1">
              {visibleSteps.map((step, index) => {
                const isActive = index === currentStep;
                const isCompleted = index < currentStep;
                const isClickable = allowSkipBack && index < currentStep;

                return (
                  <div key={step.id} className="flex items-center gap-1.5 shrink-0">
                    <button
                      type="button"
                      onClick={() => isClickable && goToStep(index)}
                      disabled={!isClickable && !isActive}
                      aria-current={isActive ? "step" : undefined}
                      aria-label={`Step ${index + 1}: ${step.label}${isCompleted ? " (completed)" : ""}`}
                      className={`flex items-center gap-2 rounded-full px-3 py-1.5 text-xs font-medium transition-colors ${
                        isActive
                          ? "bg-sdp-accent text-sdp-accent-text"
                          : isCompleted
                          ? "bg-sdp-success-bg text-sdp-success-text hover:bg-sdp-success-border"
                          : "bg-sdp-bg text-sdp-text-medium"
                      } ${isClickable ? "cursor-pointer" : "cursor-default"}`}
                    >
                      {isCompleted ? (
                        <Check className="h-3.5 w-3.5" aria-hidden="true" />
                      ) : (
                        <span className="flex h-4 w-4 items-center justify-center text-[10px]" aria-hidden="true">
                          {index + 1}
                        </span>
                      )}
                      <span className="hidden sm:inline">{step.label}</span>
                    </button>
                    {index < totalSteps - 1 && (
                      <ChevronRight className="h-3.5 w-3.5 text-sdp-text-low shrink-0" aria-hidden="true" />
                    )}
                  </div>
                );
              })}
            </nav>
          )}

          {/* Step Content */}
          <div
            ref={contentRef}
            className="min-h-[200px]"
            role="region"
            aria-label={`Step ${currentStep + 1}: ${activeStep?.label}`}
          >
            {isValidating ? (
              <div className="flex flex-col items-center justify-center py-12 gap-3">
                <Loader2 className="h-6 w-6 animate-spin text-sdp-text-medium" />
                <p className="text-sm text-sdp-text-medium">Validating...</p>
              </div>
            ) : (
              activeStep?.component
            )}
          </div>

          {/* Footer */}
          <div className="flex justify-between border-t border-sdp-border pt-4">
            <Button
              type="button"
              variant="secondary"
              onClick={goBack}
              disabled={isFirstStep || loading}
            >
              Back
            </Button>
            <Button
              type="button"
              onClick={goNext}
              disabled={(!canProceed && !isLastStep) || isValidating || loading}
              isLoading={isValidating || loading}
            >
              {isLastStep ? submitLabel : "Continue"}
            </Button>
          </div>
        </div>
      </Modal>
    </WizardContext.Provider>
  );
}
