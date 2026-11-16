import type { FastifyPluginAsyncZod } from "@fastify/type-provider-zod";

import { listServicesResponseSchema } from "../schemas/list-services.schema.js";
import { listServicesUseCase } from "../usecases/list-services.usecase.js";

export const listServicesController: FastifyPluginAsyncZod =
  async app => {
    app.get("/", {
      schema: {
        response: { 200: listServicesResponseSchema },
      },
      handler: async (request, reply) => {
        const services = await listServicesUseCase({
          establishmentId: request.establishmentId,
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
