import fastify from "fastify";
import fastifyCors from "@fastify/cors";

import {
  serializerCompiler,
  validatorCompiler,
  type ZodTypeProvider,
} from "@fastify/type-provider-zod";
import { routes } from "./routes/index.js";
import { randomUUID } from "node:crypto";
import { errorHandlerPlugin } from "./plugins/error-handler.js";

const app = fastify({
  genReqId: () => randomUUID(),
  logger: {
    ...(process.env.NODE_ENV !== "production" && {
      transport: {
        target: "pino-pretty",
        options: {
          colorize: true,
          translateTime: "SYS:standard",
          ignore: "pid,hostname",
        },
      },
    }),
  },
}).withTypeProvider<ZodTypeProvider>();

app.setValidatorCompiler(validatorCompiler);
app.setSerializerCompiler(serializerCompiler);

app.register(fastifyCors, {
  origin: process.env.CLIENT_ORIGIN ?? false,
  methods: [
    "GET",
    "POST",
    "PUT",
    "PATCH",
    "DELETE",
    "OPTIONS",
  ],
  allowedHeaders: [
    "Content-Type",
    "Authorization",
    "X-Requested-With",
  ],
  credentials: true,
  maxAge: 86_400,
});
app.register(errorHandlerPlugin);
app.register(routes);

export { app };
