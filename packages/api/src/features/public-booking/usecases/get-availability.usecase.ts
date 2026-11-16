import { TZDate } from "@date-fns/tz";
import { addDays, addMinutes, format } from "date-fns";

import { prisma } from "../../../shared/database/prisma/client.js";
import { BaseError } from "../../../shared/errors/base-error.js";
import {
  GetAvailabilityParams,
  GetAvailabilityQuery,
} from "../schemas/get-availability.schema.js";

const SLOT_STEP_MINUTES = 30;

type GetAvailabilityInput = GetAvailabilityParams &
  GetAvailabilityQuery;

type Interval = { start: Date; end: Date };

// Instante de "date às hh:mm" no fuso do estabelecimento.
const toZonedDateTime = (
  date: string,
  timezone: string,
  hours = 0,
  minutes = 0,
) => {
  const [year, month, day] = date.split("-").map(Number);

  return new TZDate(
    year,
    month - 1,
    day,
    hours,
    minutes,
    0,
    timezone,
  );
};

// Regra: o calendário público mostra somente hoje e amanhã.
const assertDateIsBookable = (
  date: string,
  timezone: string,
  now: Date,
) => {
  const nowInTimezone = new TZDate(now, timezone);
  const today = format(nowInTimezone, "yyyy-MM-dd");
  const tomorrow = format(
    addDays(nowInTimezone, 1),
    "yyyy-MM-dd",
  );

  if (date !== today && date !== tomorrow) {
    throw new BaseError(
      "A data deve ser hoje ou amanhã.",
      "BOOKING_DATE_OUT_OF_RANGE",
      422,
    );
  }
};

// Regra: o expediente vem do horário recorrente do dia da semana.
// Retorna null quando o estabelecimento está fechado.
const findOpeningInterval = async (
  establishmentId: string,
  date: string,
  timezone: string,
): Promise<Interval | null> => {
  const weekday = toZonedDateTime(date, timezone).getDay();

  const businessHour = await prisma.businessHour.findUnique(
    {
      where: {
        establishmentId_weekday: {
          establishmentId,
          weekday,
        },
      },
      select: {
        isOpen: true,
        startTime: true,
        endTime: true,
      },
    },
  );

  if (
    !businessHour?.isOpen ||
    !businessHour.startTime ||
    !businessHour.endTime
  ) {
    return null;
  }

  // Colunas TIME chegam como Date em UTC, mas guardam a hora local.
  const { startTime, endTime } = businessHour;

  return {
    start: toZonedDateTime(
      date,
      timezone,
      startTime.getUTCHours(),
      startTime.getUTCMinutes(),
    ),
    end: toZonedDateTime(
      date,
      timezone,
      endTime.getUTCHours(),
      endTime.getUTCMinutes(),
    ),
  };
};

// Regra: agendamentos não cancelados ocupam a agenda.
const findOccupiedIntervals = async (
  establishmentId: string,
  openingInterval: Interval,
): Promise<Interval[]> => {
  const appointments = await prisma.appointment.findMany({
    where: {
      establishmentId,
      status: { not: "CANCELLED" },
      startsAt: { lt: openingInterval.end },
      endsAt: { gt: openingInterval.start },
    },
    select: { startsAt: true, endsAt: true },
  });

  return appointments.map(({ startsAt, endsAt }) => ({
    start: startsAt,
    end: endsAt,
  }));
};

// Regras: o slot precisa caber no expediente, não pode ter começado
// e não pode sobrepor um agendamento que ocupa a agenda.
const findAvailableSlots = (
  openingInterval: Interval,
  occupiedIntervals: Interval[],
  durationMinutes: number,
  now: Date,
) => {
  const slots: Interval[] = [];

  let start = openingInterval.start;
  let end = addMinutes(start, durationMinutes);

  while (end <= openingInterval.end) {
    const hasStarted = start <= now;
    const isOccupied = occupiedIntervals.some(
      occupied =>
        start < occupied.end && end > occupied.start,
    );

    if (!hasStarted && !isOccupied) {
      slots.push({ start, end });
    }

    start = addMinutes(start, SLOT_STEP_MINUTES);
    end = addMinutes(start, durationMinutes);
  }

  return slots;
};

export const getAvailabilityUseCase = async (
  { slug, serviceId, date }: GetAvailabilityInput,
  now = new Date(),
) => {
  // TODO: validar assinatura ativa e franquia mensal quando o billing existir.
  const establishment =
    await prisma.establishment.findUnique({
      where: { slug },
      select: { id: true, timezone: true },
    });

  if (!establishment) {
    throw new BaseError(
      "Estabelecimento não encontrado.",
      "NOT_FOUND",
      404,
    );
  }

  const service = await prisma.service.findUnique({
    where: {
      id: serviceId,
      establishmentId: establishment.id,
    },
    select: { durationMinutes: true },
  });

  if (!service) {
    throw new BaseError(
      "Serviço não encontrado.",
      "NOT_FOUND",
      404,
    );
  }

  const { timezone } = establishment;

  assertDateIsBookable(date, timezone, now);

  const openingInterval = await findOpeningInterval(
    establishment.id,
    date,
    timezone,
  );

  if (!openingInterval) {
    return { date, timezone, slots: [] };
  }

  const occupiedIntervals = await findOccupiedIntervals(
    establishment.id,
    openingInterval,
  );

  const slots = findAvailableSlots(
    openingInterval,
    occupiedIntervals,
    service.durationMinutes,
    now,
  ).map(slot => ({
    startTime: format(slot.start, "HH:mm"),
    endTime: format(slot.end, "HH:mm"),
  }));

  return { date, timezone, slots };
};
