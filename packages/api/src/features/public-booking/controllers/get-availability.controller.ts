import type { FastifyPluginAsyncZod } from "@fastify/type-provider-zod";

import {
  getAvailabilityParamsSchema,
  getAvailabilityQuerySchema,
  getAvailabilityResponseSchema,
} from "../schemas/get-availability.schema.js";
import { getAvailabilityUseCase } from "../usecases/get-availability.usecase.js";

export const getAvailabilityController: FastifyPluginAsyncZod =
  async app => {
    app.get("/:slug/availability", {
      schema: {
        params: getAvailabilityParamsSchema,
        querystring: getAvailabilityQuerySchema,
        response: { 200: getAvailabilityResponseSchema },
      },
      handler: async (request, reply) => {
        const availability = await getAvailabilityUseCase({
          ...request.params,
          ...request.query,
        });

        return reply.status(200).send(availability);
      },
    });
  };
