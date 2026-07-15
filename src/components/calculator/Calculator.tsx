import { useCalculator } from '../../hooks/useCalculator';
import { ButtonGrid } from './ButtonGrid';
import { Display } from './Display';

export function Calculator() {
  const calculator = useCalculator();

  return (
    <section
      className="calculator-shell grid max-h-[calc(100dvh-1rem)] w-full max-w-md grid-rows-[auto_1fr] gap-4 overflow-hidden p-4 sm:max-h-[calc(100dvh-3rem)] sm:gap-5 sm:p-5"
      aria-label="Calculator"
    >
      <Display
        currentEntry={calculator.currentEntry}
        runningValue={calculator.runningValue}
        displayValue={calculator.displayValue}
        pendingOperator={calculator.pendingOperator}
        status={calculator.status}
      />
      <ButtonGrid onAction={calculator.controls.press} />
    </section>
  );
}
