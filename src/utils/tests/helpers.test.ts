import { calculateNewInstallment } from '../helpers';

describe('calculateNewInstallment', () => {
  it('should calculate the new installment value correctly', () => {
    const financingAmount = 10000;
    const remainingInstallments = 12;
    const interestRate = 5;

    const result = calculateNewInstallment(
      financingAmount,
      remainingInstallments,
      interestRate
    );

    expect(result).toBeCloseTo(856.07, 2);
  });

  it('should return correct installment for zero interest rate', () => {
    const financingAmount = 12000;
    const remainingInstallments = 12;
    const interestRate = 0;

    const result = calculateNewInstallment(
      financingAmount,
      remainingInstallments,
      interestRate
    );

    expect(result).toBeCloseTo(1000, 2);
  });
});
