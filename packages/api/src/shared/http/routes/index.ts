import type { FastifyPluginAsync } from "fastify";
import { establishmentRoutes } from "../../../features/establishment/routes/establishment.routes.js";
import { publicBookingRoutes } from "../../../features/public-booking/routes/public-booking.routes.js";
import { servicesRoutes } from "../../../features/services/routes/services.routes.js";
import { authRoutes } from "./auth.routes.js";

export const routes: FastifyPluginAsync = async app => {
  app.register(authRoutes, { prefix: "/auth" });
  app.register(establishmentRoutes, {
    prefix: "/establishment",
  });
  app.register(servicesRoutes, { prefix: "/services" });
  app.register(publicBookingRoutes, {
    prefix: "/public/establishments",
  });
};
