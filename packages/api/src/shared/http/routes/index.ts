import type { FastifyPluginAsync } from "fastify";
import { publicBookingRoutes } from "../../../features/public-booking/routes/public-booking.routes.js";
import { servicesRoutes } from "../../../features/services/routes/services.routes.js";

export const routes: FastifyPluginAsync = async app => {
  app.get("/health", () => {
    return { status: "ok" };
  });

  app.register(servicesRoutes, { prefix: "/services" });
  app.register(publicBookingRoutes, {
    prefix: "/public/establishments",
  });
};
