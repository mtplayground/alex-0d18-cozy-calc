import { describe, expect, it } from 'vitest';

import {
  calculateExpression,
  createInitialCalculatorState,
  reduceCalculatorState,
  type CalculatorAction,
  type CalculatorState,
  type Digit,
  type Operator,
} from '../../src/lib/calculator';

function digit(value: Digit): CalculatorAction {
  return { type: 'digit', digit: value };
}

function operator(value: Operator): CalculatorAction {
  return { type: 'operator', operator: value };
}

function run(actions: CalculatorAction[]): CalculatorState {
  return actions.reduce(reduceCalculatorState, createInitialCalculatorState());
}

describe('calculator engine', () => {
  it('adds, subtracts, multiplies, and divides values', () => {
    expect(run([digit('8'), operator('add'), digit('2'), { type: 'equals' }]).displayValue).toBe(
      '10',
    );
    expect(
      run([digit('8'), operator('subtract'), digit('2'), { type: 'equals' }]).displayValue,
    ).toBe('6');
    expect(
      run([digit('8'), operator('multiply'), digit('2'), { type: 'equals' }]).displayValue,
    ).toBe('16');
    expect(run([digit('8'), operator('divide'), digit('2'), { type: 'equals' }]).displayValue).toBe(
      '4',
    );
  });

  it('supports percentage conversion for the active entry', () => {
    const result = run([digit('5'), digit('0'), { type: 'percent' }]);

    expect(result.currentEntry).toBe('0.5');
    expect(result.displayValue).toBe('0.5');
  });

  it('preserves decimal entry and normalizes floating-point precision', () => {
    const result = run([
      digit('0'),
      { type: 'decimal' },
      digit('1'),
      operator('add'),
      digit('0'),
      { type: 'decimal' },
      digit('2'),
      { type: 'equals' },
    ]);

    expect(result.displayValue).toBe('0.3');
  });

  it('evaluates chained operations with multiplication and division precedence', () => {
    const result = run([
      digit('5'),
      operator('add'),
      digit('3'),
      operator('multiply'),
      digit('2'),
      operator('subtract'),
      digit('8'),
      operator('divide'),
      digit('4'),
      { type: 'equals' },
    ]);

    expect(result.displayValue).toBe('9');
  });

  it('clears only the active entry with clear', () => {
    const result = run([
      digit('9'),
      operator('add'),
      digit('4'),
      digit('2'),
      { type: 'clear' },
      digit('1'),
      { type: 'equals' },
    ]);

    expect(result.displayValue).toBe('10');
  });

  it('resets all calculator state with all-clear', () => {
    const result = run([digit('9'), operator('multiply'), digit('9'), { type: 'all-clear' }]);

    expect(result).toEqual(createInitialCalculatorState());
  });

  it('enters an error state on divide-by-zero and recovers on all-clear', () => {
    const errorState = run([digit('8'), operator('divide'), digit('0'), { type: 'equals' }]);

    expect(errorState.status).toBe('error');
    expect(errorState.displayValue).toBe('Cannot divide by zero');
    expect(reduceCalculatorState(errorState, { type: 'all-clear' })).toEqual(
      createInitialCalculatorState(),
    );
  });

  it('repeats the last binary operation when equals is pressed repeatedly', () => {
    const result = run([
      digit('2'),
      operator('add'),
      digit('3'),
      { type: 'equals' },
      { type: 'equals' },
      { type: 'equals' },
    ]);

    expect(result.displayValue).toBe('11');
  });

  it('can replace a pending operator before entering the next operand', () => {
    const result = run([
      digit('8'),
      operator('add'),
      operator('multiply'),
      digit('3'),
      { type: 'equals' },
    ]);

    expect(result.displayValue).toBe('24');
  });

  it('exposes pure expression evaluation for non-React callers', () => {
    expect(
      calculateExpression([
        { type: 'number', value: 5 },
        { type: 'operator', operator: 'add' },
        { type: 'number', value: 3 },
        { type: 'operator', operator: 'multiply' },
        { type: 'number', value: 2 },
      ]),
    ).toBe(11);
  });
});
