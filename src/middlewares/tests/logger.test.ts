import { logger } from '../logger';
import { NextFunction, Request, Response } from 'express';

describe('logger middleware', () => {
  it('should log the request path and call next', () => {
    const req = {
      method: 'GET',
      path: '/test'
    } as Request;
    const res = {} as Response;
    const next = jest.fn() as NextFunction;

    console.log = jest.fn();

    logger(req, res, next);

    expect(console.log).toHaveBeenCalledWith('Request path: GET /test');
    expect(next).toHaveBeenCalled();
  });
});
