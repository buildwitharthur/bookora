import fp from "fastify-plugin";
import { BaseError } from "../../errors/base-error.js";
import { FastifyError } from "fastify";

export const errorHandlerPlugin = fp(async app => {
  app.setErrorHandler<FastifyError>(
    (error, request, reply) => {
      if (error instanceof BaseError) {
        request.log.warn(
          { err: error },
          "Application error",
        );

        return reply.status(error.statusCode).send({
          code: error.code,
          message: error.message,
        });
      }

      if (error.validation) {
        request.log.warn(
          { err: error },
          "Validation error",
        );
        return reply.status(400).send({
          code: "VALIDATION_ERROR",
          message: "Invalid request data",
          details: error.validation.map(issue => ({
            path: issue.instancePath,
            message: issue.message ?? "Invalid value",
          })),
        });
      }

      return reply.status(500).send({
        code: "INTERNAL_SERVER_ERROR",
        message: "An unexpected error occurred",
      });
    },
  );
});
