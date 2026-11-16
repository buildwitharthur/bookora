import type { FastifyPluginAsync } from "fastify";
import { requireAuthPlugin } from "../../../shared/http/plugins/require-auth.js";
import { requireEstablishmentPlugin } from "../../../shared/http/plugins/require-establishment.js";
import { createServiceController } from "../controllers/create-service.controller.js";
import { listServicesController } from "../controllers/list-services.controller.js";

export const servicesRoutes: FastifyPluginAsync =
  async app => {
    app.register(requireAuthPlugin);
    app.register(requireEstablishmentPlugin);
    app.register(createServiceController);
    app.register(listServicesController);
  };
