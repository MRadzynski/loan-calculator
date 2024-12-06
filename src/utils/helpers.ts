export const calculateNewInstallment = (
  financingAmount: number,
  remainingInstallments: number,
  interestRate: number
): number => {
  const monthlyRate = interestRate / 100 / 12;

  if (monthlyRate === 0) return financingAmount / remainingInstallments;

  const result =
    (financingAmount *
      (monthlyRate * Math.pow(1 + monthlyRate, remainingInstallments))) /
    (Math.pow(1 + monthlyRate, remainingInstallments) - 1);

  return result;
};
