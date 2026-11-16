import type { FastifyPluginAsync } from "fastify";
import fp from "fastify-plugin";

import { prisma } from "../../database/prisma/client.js";
import { BaseError } from "../../errors/base-error.js";

declare module "fastify" {
  interface FastifyRequest {
    establishmentId: string;
  }
}

export const requireEstablishmentPlugin: FastifyPluginAsync =
  fp(async app => {
    app.decorateRequest("establishmentId", "");

    app.addHook("onRequest", async request => {
      const establishment =
        await prisma.establishment.findUnique({
          where: { ownerId: request.userId },
          select: { id: true },
        });

      if (!establishment) {
        throw new BaseError(
          "Estabelecimento não encontrado ou ainda não criado.",
          "NOT_FOUND",
          404,
        );
      }

      request.establishmentId = establishment.id;
    });
  });
