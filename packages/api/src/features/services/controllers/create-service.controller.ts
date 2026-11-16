import type { FastifyPluginAsyncZod } from "@fastify/type-provider-zod";

import {
  createServiceBodySchema,
  createServiceResponseSchema,
} from "../schemas/create-service.schema.js";
import { FAKE_ESTABLISHMENT_ID } from "../constants/fake-establishment-id.js";
import { createServiceUseCase } from "../usecases/create-service.usecase.js";

export const createServiceController: FastifyPluginAsyncZod =
  async app => {
    app.post("/", {
      schema: {
        body: createServiceBodySchema,
        response: { 201: createServiceResponseSchema },
      },
      handler: async (request, reply) => {
        const service = await createServiceUseCase({
          ...request.body,
          establishmentId: FAKE_ESTABLISHMENT_ID,
        });

        return reply.status(201).send({
          ...service,
          createdAt: service.createdAt.toISOString(),
          updatedAt: service.updatedAt.toISOString(),
        });
      },
    });
  };
