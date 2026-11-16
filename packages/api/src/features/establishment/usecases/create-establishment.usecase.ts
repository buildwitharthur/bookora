import { prisma } from "../../../shared/database/prisma/client.js";
import { BaseError } from "../../../shared/errors/base-error.js";
import { CreateEstablishmentBody } from "../schemas/create-establishment.schema.js";

type CreateEstablishmentInput = CreateEstablishmentBody & {
  ownerId: string;
};

// As colunas Time do Prisma são representadas como Date em 1970-01-01 (UTC).
const time = (value: string) =>
  new Date(`1970-01-01T${value}:00.000Z`);

export const createEstablishmentUseCase = async (
  input: CreateEstablishmentInput,
) => {
  const ownerEstablishment =
    await prisma.establishment.findUnique({
      where: { ownerId: input.ownerId },
      select: { id: true },
    });

  if (ownerEstablishment) {
    throw new BaseError(
      "Você já possui um estabelecimento.",
      "CONFLICT",
      409,
    );
  }

  const slugEstablishment =
    await prisma.establishment.findUnique({
      where: { slug: input.slug },
      select: { id: true },
    });

  if (slugEstablishment) {
    throw new BaseError(
      "Este slug já está em uso.",
      "SLUG_UNAVAILABLE",
      409,
    );
  }

  // 0 = domingo, 6 = sábado.
  const openDay = (weekday: number, endTime = "18:00") => ({
    weekday,
    isOpen: true,
    startTime: time("09:00"),
    endTime: time(endTime),
  });

  return prisma.establishment.create({
    data: {
      ...input,
      businessHours: {
        createMany: {
          data: [
            { weekday: 0, isOpen: false },
            openDay(1),
            openDay(2),
            openDay(3),
            openDay(4),
            openDay(5),
            openDay(6, "14:00"),
          ],
        },
      },
    },
    select: {
      id: true,
      name: true,
      slug: true,
      logoUrl: true,
      description: true,
      address: true,
      phone: true,
      accentColor: true,
      timezone: true,
    },
  });
};
