import type { FastifyPluginAsyncZod } from "@fastify/type-provider-zod";

import { getEstablishmentResponseSchema } from "../schemas/get-establishment.schema.js";
import { getEstablishmentUseCase } from "../usecases/get-establishment.usecase.js";

export const getEstablishmentController: FastifyPluginAsyncZod =
  async app => {
    app.get("/", {
      schema: {
        response: { 200: getEstablishmentResponseSchema },
      },
      handler: async (request, reply) => {
        const establishment = await getEstablishmentUseCase(
          request.establishmentId,
        );

        return reply.status(200).send(establishment);
      },
    });
  };
