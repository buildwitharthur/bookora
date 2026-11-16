import { z } from "zod";

const getEstablishmentResponseSchema = z
  .object({
    id: z.string(),
    name: z.string(),
    slug: z.string(),
    logoUrl: z.string().nullable(),
    description: z.string().nullable(),
    address: z.string().nullable(),
    phone: z.string().nullable(),
    accentColor: z.string(),
    timezone: z.string(),
    businessHours: z.array(
      z
        .object({
          weekday: z.number().int(),
          isOpen: z.boolean(),
          startTime: z.string().nullable(),
          endTime: z.string().nullable(),
        })
        .strict(),
    ),
  })
  .strict();

export { getEstablishmentResponseSchema };
