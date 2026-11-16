import { app } from "./shared/http/app.js";

await app.listen({
  port: 8080,
  host: "0.0.0.0",
});
