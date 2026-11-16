import type { FastifyPluginAsync } from "fastify";

export const routes: FastifyPluginAsync = async app => {
  app.get("/health", async () => {
    return { status: "ok" };
  });
};
