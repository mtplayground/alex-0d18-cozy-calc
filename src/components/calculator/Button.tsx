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
    'border-terracotta-500 bg-terracotta-400 text-cream-50 hover:bg-terracotta-500 focus-visible:ring-terracotta-300',
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
  return (
    <button
      type="button"
      className={`calculator-button flex min-h-12 min-w-0 touch-manipulation select-none items-center justify-center border px-2 font-display text-2xl font-bold leading-none transition-colors duration-150 ease-cozy focus:outline-none focus-visible:ring-4 focus-visible:ring-offset-2 focus-visible:ring-offset-cream-50 disabled:pointer-events-none disabled:opacity-50 sm:min-h-16 sm:text-3xl ${variantClasses[variant]} ${className}`}
      aria-label={ariaLabel ?? label}
      disabled={disabled}
      onClick={() => onPress(action)}
    >
      {label}
    </button>
  );
}
