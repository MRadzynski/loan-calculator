import { body } from 'express-validator';

export const validateInputLoanData = [
  body('financingAmount')
    .notEmpty()
    .withMessage('financing amount is required')
    .isFloat({ min: 1 })
    .withMessage('Financing amount must be a number'),
  body('installmentAmount')
    .notEmpty()
    .withMessage('installmentAmount amount is required')
    .isFloat({ min: 1 })
    .withMessage('Installment amount must be a number'),
  body('interestRate')
    .notEmpty()
    .withMessage('interestRate amount is required')
    .isNumeric()
    .withMessage('Interest rate must be a number'),
  body('remainingInstallments')
    .notEmpty()
    .withMessage('remainingInstallments amount is required')
    .isInt({ min: 1 })
    .withMessage('Remaining installments must be an integer greater than 0'),
  body('totalInstallments')
    .notEmpty()
    .withMessage('totalInstallments amount is required')
    .isInt({ min: 1 })
    .withMessage('Total installments must be an integer greater than 0')
];
