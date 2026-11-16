import type { FastifyPluginAsync } from "fastify";
import { requireAuthPlugin } from "../../../shared/http/plugins/require-auth.js";
import { requireEstablishmentPlugin } from "../../../shared/http/plugins/require-establishment.js";
import { createEstablishmentController } from "../controllers/create-establishment.controller.js";
import { getEstablishmentController } from "../controllers/get-establishment.controller.js";
import { updateBusinessHoursController } from "../controllers/update-business-hours.controller.js";

export const establishmentRoutes: FastifyPluginAsync =
  async app => {
    app.register(requireAuthPlugin);

    // Precisa vir antes de requireEstablishmentPlugin: ainda não há estabelecimento.
    app.register(createEstablishmentController);

    app.register(requireEstablishmentPlugin);
    app.register(getEstablishmentController);
    app.register(updateBusinessHoursController, {
      prefix: "/business-hours",
    });
  };
