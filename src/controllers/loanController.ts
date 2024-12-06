import { calculateNewInstallment } from '../utils/helpers';
import { fetchReferenceRate } from '../services/referenceRateService';
import { HttpStatusCode } from 'axios';
import { Request, Response } from 'express';
import { sendEmail } from '../services/emailService';
import { validationResult } from 'express-validator';
import LoanCalculation from '../models/LoanCalculation';
import ReferenceRate from '../models/ReferenceRate';
import sequelize from '../config/db';

interface AuthenticatedRequest extends Request {
  user: {
    dataValues: {
      email: string;
      googleId: string;
      id: string;
      type: string;
    };
  };
}

export const calculateNewInstallmentHandler = async (
  req: Request,
  res: Response
) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    res.status(400).json({ error: errors.array() });
    return;
  }

  const user = (req as AuthenticatedRequest).user;

  const transaction = await sequelize.transaction();

  try {
    const {
      financingAmount,
      installmentAmount,
      interestRate,
      remainingInstallments,
      totalInstallments
    } = req.body;

    const officialInterestRate = await fetchReferenceRate();

    if (interestRate > officialInterestRate) {
      res.status(HttpStatusCode.BadRequest).json({
        error: 'Interest rate is higher than the official reference rate'
      });
      return;
    }

    const remainingContractValue =
      financingAmount -
      (totalInstallments - remainingInstallments) * installmentAmount;

    const newInstallmentValue = calculateNewInstallment(
      remainingContractValue,
      remainingInstallments,
      officialInterestRate
    );

    if (newInstallmentValue <= 0) {
      console.log('Loan is paid off');
      sendEmail(
        user.dataValues.email,
        'Contract is over',
        'You have paid off your dept'
      );
    }

    const savedReferenceRate = await ReferenceRate.create(
      {
        rate: officialInterestRate
      },
      { transaction }
    );

    await LoanCalculation.create(
      {
        financingAmount,
        installmentAmount,
        newInstallmentValue,
        remainingContractValue,
        remainingInstallments,
        totalInstallments,
        referenceRateId: savedReferenceRate.id,
        userId: user.dataValues.id
      },
      {
        transaction
      }
    );

    await transaction.commit();
    res
      .status(HttpStatusCode.Ok)
      .json({ newInstallmentValue, remainingContractValue });
    return;
  } catch (error) {
    console.error('Error: ', error);

    await transaction.rollback();
    res
      .status(HttpStatusCode.InternalServerError)
      .json({ error: 'Internal server error' });
    return;
  }
};

// TEMPORARY - this is a temporary handler to generate a form for testing purposes
export const generateInstallmentFormHandler = async (
  _req: Request,
  res: Response
) => {
  res.send(`
      <style>
        form {
          display: flex;
          flex-direction: column;
          gap: 8px;
          width: 300px;

          div {
            display: flex;
            flex-direction: column;
            gap: 4px;
          }
        }
      </style>
      <form id="installmentForm" onsubmit="event.preventDefault()">
        <div>
          <label for="financingAmount">Financing amount</label>
          <input type="number" name="financingAmount" id="financingAmount" required />
        </div>
        <div>
          <label for="installmentAmount">Installment amount</label>
          <input type="number" name="installmentAmount" id="installmentAmount" required />
        </div>
        <div>
          <label for="interestRate">Interest rate</label>
          <input type="number" name="interestRate" id="interestRate" required step="0.05" />
        </div>
        <div>
          <label for="remainingInstallments">Remaining installments</label>
          <input type="number" name="remainingInstallments" id="remainingInstallments" required />
        </div>
        <div>
          <label for="totalInstallments">Total installments</label>
          <input type="number" name="totalInstallments" id="totalInstallments" required />
        </div>
        <button type="submit">Calculate</button>
        </form>
        <div id="result"></div>
      <script>
        document.getElementById('installmentForm').addEventListener('submit', async function(event) {
          event.preventDefault();
          
          const form = event.target;
          const formData = new FormData(form);
          const data = {};
          formData.forEach((value, key) => {
            data[key] = value;
          });

          try {
            const response = await fetch('/api/loan/calculate-new-installment', {
              method: 'POST',
              headers: {
                'Content-Type': 'application/json'
              },
              body: JSON.stringify(data)
            });

            if (!response.ok) {
              const errorData = await response.json();
              console.log('Error:', errorData);
              throw errorData;
            }

            const result = await response.json();
            console.log('Success:', result);
            document.getElementById('result').innerHTML = \`<span style="color:green">Remaining Contract Value: \${result.remainingContractValue.toFixed(2)}</span><br><span style="color:green">New Installment Value: \${result.newInstallmentValue.toFixed(2)}</span>\`;
          } catch (error) {
            console.error('Error:', error);
            const resultContainer = document.getElementById('result')

            resultContainer.innerHTML = '';
            
            if('error' in error && Array.isArray(error.error)) {
              error.error.forEach(err => {
                resultContainer.innerHTML += \`<span style="color:red">\${err.msg}</span><br>\`;
              });
            } else if ('error' in error) {
              resultContainer.innerHTML += \`<span style="color:red">\${error.error}</span><br>\`;
             }
          }
        });
      </script>
    `);
  return;
};
