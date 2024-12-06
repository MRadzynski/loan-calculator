import {
  calculateNewInstallmentHandler,
  generateInstallmentFormHandler
} from '../controllers/loanController';
import { Router } from 'express';
import { validateInputLoanData } from '../utils/validators';

const router = Router();

router.get('/calculate-new-installment', generateInstallmentFormHandler);

router.post(
  '/calculate-new-installment',
  validateInputLoanData,
  calculateNewInstallmentHandler
);

export default router;
