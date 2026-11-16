import type { FastifyPluginAsyncZod } from "@fastify/type-provider-zod";

import {
  updateBusinessHoursBodySchema,
  updateBusinessHoursResponseSchema,
} from "../schemas/update-business-hours.schema.js";
import { updateBusinessHoursUseCase } from "../usecases/update-business-hours.usecase.js";

export const updateBusinessHoursController: FastifyPluginAsyncZod =
  async app => {
    app.put("/", {
      schema: {
        body: updateBusinessHoursBodySchema,
        response: {
          200: updateBusinessHoursResponseSchema,
        },
      },
      handler: async (request, reply) => {
        const businessHours =
          await updateBusinessHoursUseCase({
            ...request.body,
            establishmentId: request.establishmentId,
          });

        return reply.status(200).send(businessHours);
      },
    });
  };
