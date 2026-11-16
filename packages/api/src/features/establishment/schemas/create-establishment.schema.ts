import { z } from "zod";

const createEstablishmentBodySchema = z
  .object({
    name: z.string().trim().min(1),
    slug: z
      .string()
      .trim()
      .min(3)
      .max(60)
      .regex(
        /^[a-z0-9]+(?:-[a-z0-9]+)*$/,
        "O slug deve conter apenas letras minúsculas, números e hífens.",
      ),
    logoUrl: z.url().nullish(),
    description: z.string().trim().min(1).nullish(),
    address: z.string().trim().min(1).nullish(),
    phone: z
      .string()
      .regex(
        /^\+\d{10,15}$/,
        "O telefone deve estar no formato internacional, como +5511999999999.",
      )
      .nullish(),
    accentColor: z
      .string()
      .regex(
        /^#[0-9A-Fa-f]{6}$/,
        "A cor deve estar no formato hexadecimal, como #5B2EFF.",
      ),
    timezone: z
      .string()
      .min(1)
      .default("America/Sao_Paulo"),
  })
  .strict()
  .meta({
    examples: [
      {
        name: "Salão do Arthur",
        slug: "salao-do-arthur",
        logoUrl: "https://exemplo.com/logo.png",
        description: "Cortes e cuidados masculinos.",
        address: "Rua Exemplo, 100 — São Paulo/SP",
        phone: "+5511999999999",
        accentColor: "#5B2EFF",
        timezone: "America/Sao_Paulo",
      },
    ],
  });

type CreateEstablishmentBody = z.infer<
  typeof createEstablishmentBodySchema
>;

const createEstablishmentResponseSchema = z
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
  })
  .strict();

export {
  CreateEstablishmentBody,
  createEstablishmentBodySchema,
  createEstablishmentResponseSchema,
};
