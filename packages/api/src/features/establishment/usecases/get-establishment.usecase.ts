import { prisma } from "../../../shared/database/prisma/client.js";

const toTime = (value: Date | null) =>
  value ? value.toISOString().slice(11, 16) : null;

export const getEstablishmentUseCase = async (
  establishmentId: string,
) => {
  const establishment =
    await prisma.establishment.findUniqueOrThrow({
      where: { id: establishmentId },
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
        businessHours: {
          orderBy: { weekday: "asc" },
          select: {
            weekday: true,
            isOpen: true,
            startTime: true,
            endTime: true,
          },
        },
      },
    });

  return {
    ...establishment,
    businessHours: establishment.businessHours.map(day => ({
      ...day,
      startTime: toTime(day.startTime),
      endTime: toTime(day.endTime),
    })),
  };
};
