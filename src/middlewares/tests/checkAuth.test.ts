import { checkAuth } from '../checkAuth';
import { HttpStatusCode } from 'axios';
import { NextFunction, Request, Response } from 'express';

describe('checkAuth middleware', () => {
  it('should return unauthorized if user is not authenticated', () => {
    const req = {} as Request;
    const res = {
      status: jest.fn().mockReturnThis(),
      json: jest.fn()
    } as unknown as Response;
    const next = jest.fn() as NextFunction;

    checkAuth(req, res, next);

    expect(res.status).toHaveBeenCalledWith(HttpStatusCode.Unauthorized);
    expect(res.json).toHaveBeenCalledWith({ error: 'Unauthorized' });
    expect(next).not.toHaveBeenCalled();
  });

  it('should call next if user is authenticated', () => {
    const req = {
      user: {}
    } as Request;
    const res = {} as Response;
    const next = jest.fn() as NextFunction;

    checkAuth(req, res, next);

    expect(next).toHaveBeenCalled();
  });
});
