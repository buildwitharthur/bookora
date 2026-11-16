import { fromNodeHeaders } from "better-auth/node";
import type { FastifyPluginAsync } from "fastify";
import fp from "fastify-plugin";

import { BaseError } from "../../errors/base-error.js";
import { auth } from "../../providers/auth/index.js";

declare module "fastify" {
  interface FastifyRequest {
    userId: string;
  }
}

export const requireAuthPlugin: FastifyPluginAsync = fp(
  async app => {
    app.decorateRequest("userId", "");

    app.addHook("onRequest", async request => {
      const session = await auth.api.getSession({
        headers: fromNodeHeaders(request.headers),
      });

      if (!session) {
        throw new BaseError(
          "Autenticação necessária.",
          "UNAUTHENTICATED",
          401,
        );
      }

      request.userId = session.user.id;
    });
  },
);
