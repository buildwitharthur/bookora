import { z } from "zod";

const getAvailabilityParamsSchema = z
  .object({
    slug: z.string().trim().min(1),
  })
  .strict();

const getAvailabilityQuerySchema = z
  .object({
    serviceId: z.string().trim().min(1),
    date: z.iso.date(),
  })
  .strict();

type GetAvailabilityParams = z.infer<
  typeof getAvailabilityParamsSchema
>;
type GetAvailabilityQuery = z.infer<
  typeof getAvailabilityQuerySchema
>;

const getAvailabilityResponseSchema = z
  .object({
    date: z.iso.date(),
    timezone: z.string(),
    slots: z.array(
      z
        .object({
          startTime: z.string(),
          endTime: z.string(),
        })
        .strict(),
    ),
  })
  .strict()
  .meta({
    examples: [
      {
        date: "2026-11-17",
        timezone: "America/Sao_Paulo",
        slots: [{ startTime: "09:00", endTime: "09:45" }],
      },
    ],
  });

export {
  GetAvailabilityParams,
  GetAvailabilityQuery,
  getAvailabilityParamsSchema,
  getAvailabilityQuerySchema,
  getAvailabilityResponseSchema,
};
