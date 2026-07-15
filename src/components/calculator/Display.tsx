import { useEffect, useRef, useState } from 'react';

import type { CalculatorStatus, Operator } from '../../lib/calculator';

export interface DisplayProps {
  currentEntry: string;
  runningValue: string;
  displayValue?: string;
  pendingOperator?: Operator | null;
  status?: CalculatorStatus;
  className?: string;
}

const operatorSymbols: Record<Operator, string> = {
  add: '+',
  subtract: '-',
  multiply: '×',
  divide: '÷',
};

type DisplayAnimation = 'update' | 'settle' | null;

export function Display({
  currentEntry,
  runningValue,
  displayValue,
  pendingOperator = null,
  status = 'input',
  className = '',
}: DisplayProps) {
  const primaryValue =
    status === 'result' || status === 'error' ? (displayValue ?? currentEntry) : currentEntry;
  const primarySizeClass = getPrimarySizeClass(primaryValue);
  const isError = status === 'error';
  const [animation, setAnimation] = useState<DisplayAnimation>(null);
  const previousValue = useRef(primaryValue);
  const previousStatus = useRef(status);
  const animationTimeout = useRef<number | null>(null);

  useEffect(() => {
    return () => {
      if (animationTimeout.current !== null) {
        window.clearTimeout(animationTimeout.current);
      }
    };
  }, []);

  useEffect(() => {
    const valueChanged = primaryValue !== previousValue.current;
    const settledResult = status === 'result' && previousStatus.current !== 'result';

    if (!valueChanged && !settledResult) {
      return;
    }

    if (animationTimeout.current !== null) {
      window.clearTimeout(animationTimeout.current);
    }

    setAnimation(settledResult ? 'settle' : 'update');
    animationTimeout.current = window.setTimeout(
      () => {
        setAnimation(null);
        animationTimeout.current = null;
      },
      settledResult ? 420 : 220,
    );

    previousValue.current = primaryValue;
    previousStatus.current = status;
  }, [primaryValue, status]);

  return (
    <section
      className={`calculator-display flex min-h-32 w-full flex-col justify-between gap-4 px-5 py-5 text-right sm:min-h-44 sm:px-6 ${className}`}
      aria-label="Calculator display"
    >
      <div className="flex min-h-8 items-start justify-between gap-3">
        <div
          className="min-w-0 flex-1 overflow-hidden text-ellipsis whitespace-nowrap font-display text-lg font-semibold tabular-nums text-cocoa-400 sm:text-xl"
          aria-label="Running value"
          title={runningValue}
        >
          {runningValue}
        </div>
        {pendingOperator ? (
          <div
            className="flex h-8 min-w-8 shrink-0 items-center justify-center rounded-pill bg-terracotta-100 px-3 font-display text-base font-bold text-terracotta-600"
            aria-label={`Pending ${pendingOperator} operation`}
          >
            {operatorSymbols[pendingOperator]}
          </div>
        ) : null}
      </div>

      <output
        className={`${primarySizeClass} ${getAnimationClass(animation)} block min-w-0 break-all font-display font-bold leading-none tabular-nums text-cocoa-600 [overflow-wrap:anywhere]`}
        aria-label={isError ? 'Calculator error' : 'Current entry'}
        aria-live="polite"
        title={primaryValue}
      >
        {primaryValue}
      </output>
    </section>
  );
}

function getPrimarySizeClass(value: string): string {
  const length = value.replace(/[,\s.-]/g, '').length;

  if (length <= 8) {
    return 'text-6xl sm:text-7xl';
  }

  if (length <= 12) {
    return 'text-5xl sm:text-6xl';
  }

  if (length <= 18) {
    return 'text-4xl sm:text-5xl';
  }

  return 'text-3xl sm:text-4xl';
}

function getAnimationClass(animation: DisplayAnimation): string {
  if (animation === 'settle') {
    return 'calculator-display-settle';
  }

  if (animation === 'update') {
    return 'calculator-display-update';
  }

  return '';
}
