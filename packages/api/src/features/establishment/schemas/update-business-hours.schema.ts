import { z } from "zod";

const timeSchema = z
  .string()
  .regex(
    /^([01]\d|2[0-3]):[0-5]\d$/,
    "O horário deve estar no formato HH:mm.",
  );

const businessHourDaySchema = z
  .object({
    weekday: z.number().int().min(0).max(6),
    isOpen: z.boolean(),
    startTime: timeSchema.nullable(),
    endTime: timeSchema.nullable(),
  })
  .strict()
  .superRefine((day, ctx) => {
    if (!day.isOpen) {
      if (day.startTime !== null || day.endTime !== null) {
        ctx.addIssue({
          code: "custom",
          message:
            "Dias fechados devem ter startTime e endTime nulos.",
          path: ["startTime"],
        });
      }
      return;
    }

    if (day.startTime === null || day.endTime === null) {
      ctx.addIssue({
        code: "custom",
        message: "Dias abertos exigem startTime e endTime.",
        path: ["startTime"],
      });
      return;
    }

    if (day.startTime >= day.endTime) {
      ctx.addIssue({
        code: "custom",
        message:
          "O horário de início deve ser anterior ao de término.",
        path: ["endTime"],
      });
    }
  });

const updateBusinessHoursBodySchema = z
  .object({
    days: z
      .array(businessHourDaySchema)
      .length(7, "Informe os 7 dias da semana.")
      .refine(
        days =>
          new Set(days.map(day => day.weekday)).size ===
          days.length,
        "Cada dia da semana deve aparecer uma única vez.",
      ),
  })
  .strict();

type UpdateBusinessHoursBody = z.infer<
  typeof updateBusinessHoursBodySchema
>;

const updateBusinessHoursResponseSchema = z
  .object({
    days: z.array(
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

export {
  UpdateBusinessHoursBody,
  updateBusinessHoursBodySchema,
  updateBusinessHoursResponseSchema,
};
