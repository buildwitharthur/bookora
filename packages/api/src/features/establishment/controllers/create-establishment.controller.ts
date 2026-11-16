import type { FastifyPluginAsyncZod } from "@fastify/type-provider-zod";

import {
  createEstablishmentBodySchema,
  createEstablishmentResponseSchema,
} from "../schemas/create-establishment.schema.js";
import { createEstablishmentUseCase } from "../usecases/create-establishment.usecase.js";

export const createEstablishmentController: FastifyPluginAsyncZod =
  async app => {
    app.post("/", {
      schema: {
        body: createEstablishmentBodySchema,
        response: {
          201: createEstablishmentResponseSchema,
        },
      },
      handler: async (request, reply) => {
        const establishment =
          await createEstablishmentUseCase({
            ...request.body,
            ownerId: request.userId,
          });

        return reply.status(201).send(establishment);
      },
    });
  };
