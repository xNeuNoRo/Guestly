import { useCallback, useMemo, useState } from "react";

interface UseStepHelpers {
  nextStep: () => void;
  prevStep: () => void;
  reset: () => void;
  setStep: (step: number) => void;
  isFirst: boolean;
  isLast: boolean;
  canGoNext: boolean;
  canGoPrev: boolean;
  progress: number;
  direction: number; // 1 para adelante, -1 para atrás
}

/**
 * @description Hook de gestión de pasos ideal para forms o wizards.
 * Incluye seguimiento de dirección para animaciones y metadatos de progreso.
 * @param maxStep Cantidad total de pasos.
 * @returns Un objeto con el estado actual y helpers memorizados.
 */
export function useStep(maxStep: number): [number, UseStepHelpers] {
  const [currentStep, setCurrentStep] = useState(1);
  const [direction, setDirection] = useState(0); // 1: Forward, -1: Backward

  const isFirst = currentStep === 1;
  const isLast = currentStep === maxStep;
  const canGoNext = currentStep < maxStep;
  const canGoPrev = currentStep > 1;

  const setStep = useCallback(
    (step: number) => {
      const newStep = Math.max(1, Math.min(step, maxStep));
      if (newStep !== currentStep) {
        setDirection(newStep > currentStep ? 1 : -1);
        setCurrentStep(newStep);
      }
    },
    [currentStep, maxStep],
  );

  const nextStep = useCallback(() => {
    if (canGoNext) setStep(currentStep + 1);
  }, [canGoNext, currentStep, setStep]);

  const prevStep = useCallback(() => {
    if (canGoPrev) setStep(currentStep - 1);
  }, [canGoPrev, currentStep, setStep]);

  const reset = useCallback(() => {
    setDirection(-1);
    setCurrentStep(1);
  }, []);

  const progress = useMemo(() => {
    return (currentStep / maxStep) * 100;
  }, [currentStep, maxStep]);

  const helpers = useMemo(
    () => ({
      nextStep,
      prevStep,
      reset,
      setStep,
      isFirst,
      isLast,
      canGoNext,
      canGoPrev,
      progress,
      direction,
    }),
    [
      nextStep,
      prevStep,
      reset,
      setStep,
      isFirst,
      isLast,
      canGoNext,
      canGoPrev,
      progress,
      direction,
    ],
  );

  return [currentStep, helpers];
}
