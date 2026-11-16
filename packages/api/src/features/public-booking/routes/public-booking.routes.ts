import type { FastifyPluginAsync } from "fastify";
import { getAvailabilityController } from "../controllers/get-availability.controller.js";

export const publicBookingRoutes: FastifyPluginAsync =
  async app => {
    app.register(getAvailabilityController);
  };
