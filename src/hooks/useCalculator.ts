import { useCallback, useMemo, useReducer } from 'react';

import {
  calculateExpression,
  createInitialCalculatorState,
  formatNumber,
  reduceCalculatorState,
  type CalculatorAction,
  type CalculatorState,
  type Digit,
  type ExpressionToken,
  type Operator,
} from '../lib/calculator';

export interface CalculatorControls {
  press: (action: CalculatorAction) => void;
  pressDigit: (digit: Digit) => void;
  pressDecimal: () => void;
  pressOperator: (operator: Operator) => void;
  pressPercent: () => void;
  pressClear: () => void;
  pressAllClear: () => void;
  pressEquals: () => void;
  reset: () => void;
}

export interface CalculatorViewState {
  currentEntry: string;
  displayValue: string;
  runningValue: string;
  pendingOperator: Operator | null;
  lastOperation: CalculatorState['lastOperation'];
  status: CalculatorState['status'];
  isEditingEntry: boolean;
  isError: boolean;
}

export interface UseCalculatorResult extends CalculatorViewState {
  state: CalculatorState;
  controls: CalculatorControls;
}

export function useCalculator(): UseCalculatorResult {
  const [state, dispatch] = useReducer(
    reduceCalculatorState,
    undefined,
    createInitialCalculatorState,
  );

  const press = useCallback((action: CalculatorAction) => {
    dispatch(action);
  }, []);

  const controls = useMemo<CalculatorControls>(
    () => ({
      press,
      pressDigit: (digit) => press({ type: 'digit', digit }),
      pressDecimal: () => press({ type: 'decimal' }),
      pressOperator: (operator) => press({ type: 'operator', operator }),
      pressPercent: () => press({ type: 'percent' }),
      pressClear: () => press({ type: 'clear' }),
      pressAllClear: () => press({ type: 'all-clear' }),
      pressEquals: () => press({ type: 'equals' }),
      reset: () => press({ type: 'all-clear' }),
    }),
    [press],
  );

  const runningValue = useMemo(() => getRunningValue(state), [state]);

  return {
    state,
    controls,
    currentEntry: state.currentEntry,
    displayValue: state.displayValue,
    runningValue,
    pendingOperator: state.pendingOperator,
    lastOperation: state.lastOperation,
    status: state.status,
    isEditingEntry: state.isEditingEntry,
    isError: state.status === 'error',
  };
}

function getRunningValue(state: CalculatorState): string {
  if (state.status === 'error' || state.status === 'result') {
    return state.displayValue;
  }

  const tokens = getPreviewTokens(state);

  if (tokens.length === 0) {
    return state.displayValue;
  }

  return formatNumber(calculateExpression(tokens));
}

function getPreviewTokens(state: CalculatorState): ExpressionToken[] {
  if (state.tokens.length === 0) {
    return [];
  }

  if (state.isEditingEntry) {
    return [...state.tokens, { type: 'number', value: parseEntry(state.currentEntry) }];
  }

  const lastToken = state.tokens[state.tokens.length - 1];

  if (lastToken?.type === 'operator') {
    return state.tokens.slice(0, -1);
  }

  return state.tokens;
}

function parseEntry(entry: string): number {
  const parsed = Number(entry);
  return Number.isFinite(parsed) ? parsed : 0;
}
