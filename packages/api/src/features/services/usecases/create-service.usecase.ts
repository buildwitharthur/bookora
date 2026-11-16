import { BaseError } from "../../../shared/errors/base-error.js";
import { prisma } from "../../../shared/database/prisma/client.js";
import { CreateServiceBody } from "../schemas/create-service.schema.js";

type CreateServiceInput = CreateServiceBody & {
  establishmentId: string;
};

export const createServiceUseCase = async (
  input: CreateServiceInput,
) => {
  const existingService = await prisma.service.findUnique({
    where: {
      establishmentId_name: {
        establishmentId: input.establishmentId,
        name: input.name,
      },
    },
    select: { id: true },
  });

  if (existingService) {
    throw new BaseError(
      "Já existe um serviço com este nome.",
      "CONFLICT",
      409,
    );
  }

  return prisma.service.create({
    data: input,
    select: {
      id: true,
      name: true,
      priceCents: true,
      durationMinutes: true,
      createdAt: true,
      updatedAt: true,
    },
  });
};
