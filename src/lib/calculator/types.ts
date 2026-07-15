export type Digit = '0' | '1' | '2' | '3' | '4' | '5' | '6' | '7' | '8' | '9';

export type Operator = 'add' | 'subtract' | 'multiply' | 'divide';

export type CalculatorStatus = 'input' | 'result' | 'error';

export type CalculatorAction =
  | { type: 'digit'; digit: Digit }
  | { type: 'decimal' }
  | { type: 'operator'; operator: Operator }
  | { type: 'percent' }
  | { type: 'clear' }
  | { type: 'all-clear' }
  | { type: 'equals' };

export interface NumberToken {
  type: 'number';
  value: number;
}

export interface OperatorToken {
  type: 'operator';
  operator: Operator;
}

export type ExpressionToken = NumberToken | OperatorToken;

export interface LastBinaryOperation {
  operator: Operator;
  operand: number;
}

export interface CalculatorState {
  currentEntry: string;
  displayValue: string;
  tokens: ExpressionToken[];
  pendingOperator: Operator | null;
  lastOperation: LastBinaryOperation | null;
  status: CalculatorStatus;
  isEditingEntry: boolean;
}
