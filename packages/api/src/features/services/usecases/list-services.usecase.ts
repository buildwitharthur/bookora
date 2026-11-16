import { prisma } from "../../../shared/database/prisma/client.js";

type ListServicesInput = {
  establishmentId: string;
};

export const listServicesUseCase = async ({
  establishmentId,
}: ListServicesInput) => {
  return prisma.service.findMany({
    where: { establishmentId },
    orderBy: { name: "asc" },
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
