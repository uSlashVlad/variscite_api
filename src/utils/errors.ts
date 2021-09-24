import { FastifyReply, FastifyRequest } from 'fastify';
import { InputValidationError } from 'openapi-validator-middleware';

export interface IErrorMessage {
  status: number;
  errorText: string;
  url?: string;
  moreInfo?: any;
}

export function generateErrorMessage(
  err: Error,
  req: FastifyRequest,
  res: FastifyReply
) {
  console.log(err);
  if (err instanceof InputValidationError) {
    res.status(400).send({
      errorText: err.message,
      url: req.url,
      moreInfo: err.errors,
    });
  } else if (err instanceof AuthError) {
    res.status(401).send({
      errorText: err.message,
      url: req.url,
    });
  } else if (err instanceof NoPermissionsError) {
    res.status(403).send({
      errorText: err.message,
      url: req.url,
    });
  } else if (err instanceof NotFoundError) {
    res.status(404).send({
      errorText: err.message,
      url: req.url,
    });
  } else {
    res.status(500).send({
      errorText: err.message,
      url: req.url,
    });
  }
}

export class AuthError extends Error { }

export class NoPermissionsError extends Error {}

export class NotFoundError extends Error {}
