import { useEffect, useRef, useState, type KeyboardEvent } from 'react';

import type { CalculatorAction } from '../../lib/calculator';

export type ButtonVariant = 'number' | 'operator' | 'utility' | 'equals';

export interface ButtonProps {
  label: string;
  action: CalculatorAction;
  variant: ButtonVariant;
  onPress: (action: CalculatorAction) => void;
  ariaLabel?: string;
  className?: string;
  disabled?: boolean;
}

const variantClasses: Record<ButtonVariant, string> = {
  number:
    'border-clay-200 bg-cream-50 text-cocoa-600 hover:bg-cream-100 focus-visible:ring-terracotta-300',
  operator:
    'border-terracotta-600 bg-terracotta-500 text-cream-50 hover:bg-terracotta-600 focus-visible:ring-terracotta-300',
  utility:
    'border-amberNeutral-200 bg-amberNeutral-100 text-amberNeutral-700 hover:bg-amberNeutral-200 focus-visible:ring-amberNeutral-300',
  equals:
    'border-cocoa-600 bg-cocoa-600 text-cream-50 hover:bg-cocoa-500 focus-visible:ring-cocoa-300',
};

export function Button({
  label,
  action,
  variant,
  onPress,
  ariaLabel,
  className = '',
  disabled = false,
}: ButtonProps) {
  const [isPressed, setIsPressed] = useState(false);
  const feedbackStart = useRef<number | null>(null);
  const feedbackTimeout = useRef<number | null>(null);

  useEffect(() => {
    return () => {
      if (feedbackStart.current !== null) {
        window.clearTimeout(feedbackStart.current);
      }

      if (feedbackTimeout.current !== null) {
        window.clearTimeout(feedbackTimeout.current);
      }
    };
  }, []);

  const triggerFeedback = () => {
    if (disabled) {
      return;
    }

    if (feedbackStart.current !== null) {
      window.clearTimeout(feedbackStart.current);
    }

    if (feedbackTimeout.current !== null) {
      window.clearTimeout(feedbackTimeout.current);
    }

    setIsPressed(false);
    feedbackStart.current = window.setTimeout(() => {
      setIsPressed(true);
      feedbackStart.current = null;
      feedbackTimeout.current = window.setTimeout(() => {
        setIsPressed(false);
        feedbackTimeout.current = null;
      }, 260);
    });
  };

  const handleKeyDown = (event: KeyboardEvent<HTMLButtonElement>) => {
    if (event.key === 'Enter' || event.key === ' ') {
      triggerFeedback();
    }
  };

  return (
    <button
      type="button"
      className={`calculator-button flex min-h-12 min-w-0 touch-manipulation select-none items-center justify-center border px-2 font-display text-2xl font-bold leading-none transition-colors duration-150 ease-cozy focus:outline-none focus-visible:ring-4 focus-visible:ring-offset-2 focus-visible:ring-offset-cream-50 disabled:pointer-events-none disabled:opacity-50 sm:min-h-16 sm:text-3xl ${isPressed ? 'calculator-button-feedback' : ''} ${variantClasses[variant]} ${className}`}
      aria-label={ariaLabel ?? label}
      disabled={disabled}
      onPointerDown={triggerFeedback}
      onKeyDown={handleKeyDown}
      onClick={() => onPress(action)}
    >
      <span className="relative z-10">{label}</span>
    </button>
  );
}
