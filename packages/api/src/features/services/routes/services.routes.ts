import type { FastifyPluginAsync } from "fastify";
import { createServiceController } from "../controllers/create-service.controller.js";
import { listServicesController } from "../controllers/list-services.controller.js";

export const servicesRoutes: FastifyPluginAsync =
  async app => {
    app.register(createServiceController);
    app.register(listServicesController);
  };
