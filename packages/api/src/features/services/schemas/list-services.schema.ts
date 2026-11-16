import { z } from "zod";

const listServicesResponseSchema = z
  .object({
    data: z.array(
      z
        .object({
          id: z.string(),
          name: z.string(),
          priceCents: z.number().int().positive(),
          durationMinutes: z.number().int().positive(),
          createdAt: z.iso.datetime(),
          updatedAt: z.iso.datetime(),
        })
        .strict(),
    ),
  })
  .strict()
  .meta({
    examples: [
      {
        data: [
          {
            id: "srv_01J9V5R7QW2K8M3N6P4X1Z0ABC",
            name: "Corte masculino",
            priceCents: 8000,
            durationMinutes: 45,
            createdAt: "2026-11-16T14:01:12.000Z",
            updatedAt: "2026-11-16T14:01:12.000Z",
          },
        ],
      },
    ],
  });

export { listServicesResponseSchema };
