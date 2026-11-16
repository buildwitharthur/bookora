import { prisma } from "../../../shared/database/prisma/client.js";
import { UpdateBusinessHoursBody } from "../schemas/update-business-hours.schema.js";

type UpdateBusinessHoursInput = UpdateBusinessHoursBody & {
  establishmentId: string;
};

// As colunas Time do Prisma são representadas como Date em 1970-01-01 (UTC).
const toDate = (value: string | null) =>
  value ? new Date(`1970-01-01T${value}:00.000Z`) : null;

const toTime = (value: Date | null) =>
  value ? value.toISOString().slice(11, 16) : null;

export const updateBusinessHoursUseCase = async ({
  establishmentId,
  days,
}: UpdateBusinessHoursInput) => {
  const updated = await prisma.$transaction(
    days.map(day =>
      prisma.businessHour.update({
        where: {
          establishmentId_weekday: {
            establishmentId,
            weekday: day.weekday,
          },
        },
        data: {
          isOpen: day.isOpen,
          startTime: toDate(day.startTime),
          endTime: toDate(day.endTime),
        },
        select: {
          weekday: true,
          isOpen: true,
          startTime: true,
          endTime: true,
        },
      }),
    ),
  );

  return {
    days: updated.map(day => ({
      weekday: day.weekday,
      isOpen: day.isOpen,
      startTime: toTime(day.startTime),
      endTime: toTime(day.endTime),
    })),
  };
};
