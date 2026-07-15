import type { CalculatorAction, Digit, Operator } from '../../lib/calculator';
import { Button, type ButtonVariant } from './Button';

export interface ButtonDefinition {
  id: string;
  label: string;
  ariaLabel: string;
  action: CalculatorAction;
  variant: ButtonVariant;
  colSpan?: 1 | 2;
}

export interface ButtonGridProps {
  onAction: (action: CalculatorAction) => void;
  className?: string;
}

const calculatorButtons: ButtonDefinition[] = [
  {
    id: 'all-clear',
    label: 'AC',
    ariaLabel: 'All clear',
    action: { type: 'all-clear' },
    variant: 'utility',
  },
  {
    id: 'clear',
    label: 'C',
    ariaLabel: 'Clear',
    action: { type: 'clear' },
    variant: 'utility',
  },
  {
    id: 'percent',
    label: '%',
    ariaLabel: 'Percent',
    action: { type: 'percent' },
    variant: 'utility',
  },
  operatorButton('divide', '÷', 'Divide'),
  digitButton('7'),
  digitButton('8'),
  digitButton('9'),
  operatorButton('multiply', '×', 'Multiply'),
  digitButton('4'),
  digitButton('5'),
  digitButton('6'),
  operatorButton('subtract', '−', 'Subtract'),
  digitButton('1'),
  digitButton('2'),
  digitButton('3'),
  operatorButton('add', '+', 'Add'),
  {
    ...digitButton('0'),
    colSpan: 2,
  },
  {
    id: 'decimal',
    label: '.',
    ariaLabel: 'Decimal point',
    action: { type: 'decimal' },
    variant: 'number',
  },
  {
    id: 'equals',
    label: '=',
    ariaLabel: 'Equals',
    action: { type: 'equals' },
    variant: 'equals',
  },
];

export function ButtonGrid({ onAction, className = '' }: ButtonGridProps) {
  return (
    <div
      className={`grid w-full grid-cols-4 gap-3 sm:gap-4 ${className}`}
      role="group"
      aria-label="Calculator buttons"
    >
      {calculatorButtons.map((button) => (
        <Button
          key={button.id}
          label={button.label}
          ariaLabel={button.ariaLabel}
          action={button.action}
          variant={button.variant}
          onPress={onAction}
          className={button.colSpan === 2 ? 'col-span-2' : ''}
        />
      ))}
    </div>
  );
}

function digitButton(digit: Digit): ButtonDefinition {
  return {
    id: `digit-${digit}`,
    label: digit,
    ariaLabel: `Digit ${digit}`,
    action: { type: 'digit', digit },
    variant: 'number',
  };
}

function operatorButton(operator: Operator, label: string, ariaLabel: string): ButtonDefinition {
  return {
    id: `operator-${operator}`,
    label,
    ariaLabel,
    action: { type: 'operator', operator },
    variant: 'operator',
  };
}
