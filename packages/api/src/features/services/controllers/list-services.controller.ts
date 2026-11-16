import type { FastifyPluginAsyncZod } from "@fastify/type-provider-zod";

import { FAKE_ESTABLISHMENT_ID } from "../constants/fake-establishment-id.js";
import { listServicesResponseSchema } from "../schemas/list-services.schema.js";
import { listServicesUseCase } from "../usecases/list-services.usecase.js";

export const listServicesController: FastifyPluginAsyncZod =
  async app => {
    app.get("/", {
      schema: {
        response: { 200: listServicesResponseSchema },
      },
      handler: async (_request, reply) => {
        const services = await listServicesUseCase({
          establishmentId: FAKE_ESTABLISHMENT_ID,
        });

        return reply.status(200).send({
          data: services.map(service => ({
            ...service,
            createdAt: service.createdAt.toISOString(),
            updatedAt: service.updatedAt.toISOString(),
          })),
        });
      },
    });
  };
