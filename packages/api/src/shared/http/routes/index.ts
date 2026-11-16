import type { FastifyPluginAsync } from "fastify";
import { servicesRoutes } from "../../../features/services/routes/services.routes.js";

export const routes: FastifyPluginAsync = async app => {
  app.get("/health", () => {
    return { status: "ok" };
  });

  app.register(servicesRoutes, { prefix: "/services" });
};
