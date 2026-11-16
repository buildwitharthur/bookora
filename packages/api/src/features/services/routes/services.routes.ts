import type { FastifyPluginAsync } from "fastify";
import { createServiceController } from "../controllers/create-service.controller.js";

export const servicesRoutes: FastifyPluginAsync =
  async app => {
    app.register(createServiceController);
  };
