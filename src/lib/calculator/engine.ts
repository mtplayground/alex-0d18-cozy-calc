import type {
  CalculatorAction,
  CalculatorState,
  Digit,
  ExpressionToken,
  LastBinaryOperation,
  Operator,
} from './types';

const DIVIDE_BY_ZERO_MESSAGE = 'Cannot divide by zero';
const MAX_SIGNIFICANT_DIGITS = 12;
const FLOATING_POINT_PRECISION = 12;

const operatorPrecedence: Record<Operator, number> = {
  add: 1,
  subtract: 1,
  multiply: 2,
  divide: 2,
};

export function createInitialCalculatorState(): CalculatorState {
  return {
    currentEntry: '0',
    displayValue: '0',
    tokens: [],
    pendingOperator: null,
    lastOperation: null,
    status: 'input',
    isEditingEntry: true,
  };
}

export function reduceCalculatorState(
  state: CalculatorState,
  action: CalculatorAction,
): CalculatorState {
  switch (action.type) {
    case 'digit':
      return inputDigit(state, action.digit);
    case 'decimal':
      return inputDecimal(state);
    case 'operator':
      return inputOperator(state, action.operator);
    case 'percent':
      return applyPercent(state);
    case 'clear':
      return clearEntry(state);
    case 'all-clear':
      return createInitialCalculatorState();
    case 'equals':
      return evaluateEquals(state);
  }
}

export function calculateExpression(tokens: ExpressionToken[]): number {
  const values: number[] = [];
  const operators: Operator[] = [];

  for (const token of tokens) {
    if (token.type === 'number') {
      values.push(token.value);
      continue;
    }

    while (
      operators.length > 0 &&
      operatorPrecedence[operators[operators.length - 1]] >= operatorPrecedence[token.operator]
    ) {
      applyPendingOperator(values, operators.pop());
    }

    operators.push(token.operator);
  }

  while (operators.length > 0) {
    applyPendingOperator(values, operators.pop());
  }

  return normalizeNumber(values[0] ?? 0);
}

export function formatNumber(value: number): string {
  if (!Number.isFinite(value)) {
    return DIVIDE_BY_ZERO_MESSAGE;
  }

  const normalized = normalizeNumber(value);

  if (Object.is(normalized, -0)) {
    return '0';
  }

  if (Math.abs(normalized) >= 1e12 || (Math.abs(normalized) > 0 && Math.abs(normalized) < 1e-9)) {
    return normalized.toExponential(MAX_SIGNIFICANT_DIGITS - 1).replace(/\.?0+e/, 'e');
  }

  return normalized.toLocaleString('en-US', {
    maximumFractionDigits: FLOATING_POINT_PRECISION,
    useGrouping: false,
  });
}

function inputDigit(state: CalculatorState, digit: Digit): CalculatorState {
  const readyState = shouldStartNewCalculation(state) ? createInitialCalculatorState() : state;
  const currentEntry = readyState.isEditingEntry
    ? appendDigit(readyState.currentEntry, digit)
    : digit;

  return {
    ...readyState,
    currentEntry,
    displayValue: currentEntry,
    status: 'input',
    isEditingEntry: true,
  };
}

function inputDecimal(state: CalculatorState): CalculatorState {
  const readyState = shouldStartNewCalculation(state) ? createInitialCalculatorState() : state;

  if (!readyState.isEditingEntry) {
    return {
      ...readyState,
      currentEntry: '0.',
      displayValue: '0.',
      status: 'input',
      isEditingEntry: true,
    };
  }

  if (readyState.currentEntry.includes('.')) {
    return readyState;
  }

  const currentEntry = `${readyState.currentEntry}.`;

  return {
    ...readyState,
    currentEntry,
    displayValue: currentEntry,
    status: 'input',
    isEditingEntry: true,
  };
}

function inputOperator(state: CalculatorState, operator: Operator): CalculatorState {
  if (state.status === 'error') {
    return state;
  }

  const baseTokens =
    state.status === 'result'
      ? [{ type: 'number', value: parseDisplayValue(state.displayValue) } satisfies ExpressionToken]
      : commitEntry(state);

  const tokens = replaceTrailingOperator(baseTokens, operator);

  return {
    ...state,
    currentEntry: state.displayValue,
    tokens,
    pendingOperator: operator,
    lastOperation: null,
    status: 'input',
    isEditingEntry: false,
  };
}

function applyPercent(state: CalculatorState): CalculatorState {
  if (state.status === 'error') {
    return state;
  }

  const percentageValue = normalizeNumber(parseDisplayValue(state.displayValue) / 100);
  const currentEntry = formatNumber(percentageValue);

  return {
    ...state,
    currentEntry,
    displayValue: currentEntry,
    status: 'input',
    isEditingEntry: true,
  };
}

function clearEntry(state: CalculatorState): CalculatorState {
  if (state.status === 'error') {
    return createInitialCalculatorState();
  }

  return {
    ...state,
    currentEntry: '0',
    displayValue: '0',
    status: 'input',
    isEditingEntry: true,
  };
}

function evaluateEquals(state: CalculatorState): CalculatorState {
  if (state.status === 'error') {
    return state;
  }

  if (state.status === 'result' && state.lastOperation) {
    return finishEvaluation(
      applyOperator(
        parseDisplayValue(state.displayValue),
        state.lastOperation.operand,
        state.lastOperation.operator,
      ),
      [],
      state.lastOperation,
    );
  }

  const tokens = commitEntry(state);

  if (tokens.length === 0) {
    return {
      ...state,
      status: 'result',
      isEditingEntry: false,
    };
  }

  const completedTokens = completeTrailingOperator(tokens);
  const lastOperation = getLastBinaryOperation(completedTokens);

  return finishEvaluation(calculateExpression(completedTokens), [], lastOperation);
}

function finishEvaluation(
  value: number,
  tokens: ExpressionToken[],
  lastOperation: LastBinaryOperation | null,
): CalculatorState {
  if (!Number.isFinite(value)) {
    return {
      ...createInitialCalculatorState(),
      currentEntry: '0',
      displayValue: DIVIDE_BY_ZERO_MESSAGE,
      tokens: [],
      pendingOperator: null,
      lastOperation: null,
      status: 'error',
      isEditingEntry: false,
    };
  }

  const displayValue = formatNumber(value);

  return {
    currentEntry: displayValue,
    displayValue,
    tokens,
    pendingOperator: null,
    lastOperation,
    status: 'result',
    isEditingEntry: false,
  };
}

function commitEntry(state: CalculatorState): ExpressionToken[] {
  if (!state.isEditingEntry) {
    return state.tokens;
  }

  return [...state.tokens, { type: 'number', value: parseDisplayValue(state.currentEntry) }];
}

function replaceTrailingOperator(tokens: ExpressionToken[], operator: Operator): ExpressionToken[] {
  const nextTokens = [...tokens];
  const lastToken = nextTokens[nextTokens.length - 1];

  if (lastToken?.type === 'operator') {
    nextTokens[nextTokens.length - 1] = { type: 'operator', operator };
    return nextTokens;
  }

  return [...nextTokens, { type: 'operator', operator }];
}

function completeTrailingOperator(tokens: ExpressionToken[]): ExpressionToken[] {
  const lastToken = tokens[tokens.length - 1];

  if (lastToken?.type !== 'operator') {
    return tokens;
  }

  const previousNumber = findLastNumber(tokens.slice(0, -1));
  return [...tokens, { type: 'number', value: previousNumber ?? 0 }];
}

function getLastBinaryOperation(tokens: ExpressionToken[]): LastBinaryOperation | null {
  if (tokens.length < 3) {
    return null;
  }

  const operandToken = tokens[tokens.length - 1];
  const operatorToken = tokens[tokens.length - 2];

  if (operandToken?.type !== 'number' || operatorToken?.type !== 'operator') {
    return null;
  }

  return {
    operator: operatorToken.operator,
    operand: operandToken.value,
  };
}

function findLastNumber(tokens: ExpressionToken[]): number | null {
  for (let index = tokens.length - 1; index >= 0; index -= 1) {
    const token = tokens[index];
    if (token.type === 'number') {
      return token.value;
    }
  }

  return null;
}

function appendDigit(currentEntry: string, digit: Digit): string {
  if (currentEntry === '0') {
    return digit;
  }

  return `${currentEntry}${digit}`;
}

function applyPendingOperator(values: number[], operator: Operator | undefined): void {
  if (!operator) {
    return;
  }

  const right = values.pop() ?? 0;
  const left = values.pop() ?? 0;
  values.push(applyOperator(left, right, operator));
}

function applyOperator(left: number, right: number, operator: Operator): number {
  switch (operator) {
    case 'add':
      return normalizeNumber(left + right);
    case 'subtract':
      return normalizeNumber(left - right);
    case 'multiply':
      return normalizeNumber(left * right);
    case 'divide':
      return right === 0 ? Number.NaN : normalizeNumber(left / right);
  }

  return assertNever(operator);
}

function normalizeNumber(value: number): number {
  if (!Number.isFinite(value)) {
    return value;
  }

  const normalized = Number(value.toPrecision(MAX_SIGNIFICANT_DIGITS));
  return Object.is(normalized, -0) ? 0 : normalized;
}

function parseDisplayValue(value: string): number {
  const parsed = Number(value);
  return Number.isFinite(parsed) ? parsed : 0;
}

function shouldStartNewCalculation(state: CalculatorState): boolean {
  return state.status === 'result' || state.status === 'error';
}

function assertNever(value: never): never {
  throw new Error(`Unexpected calculator value: ${String(value)}`);
}
