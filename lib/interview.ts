import { prisma } from "@/lib/prisma";

/** Time slots offered for interviews (24h format stored in DB). */
export const INTERVIEW_TIME_SLOTS = ["14:00", "15:30", "16:15", "17:00"] as const;

const PERSIAN_WEEKDAYS = [
  "یکشنبه",
  "دوشنبه",
  "سه‌شنبه",
  "چهارشنبه",
  "پنج‌شنبه",
  "جمعه",
  "شنبه",
] as const;

export class CapacityFullError extends Error {
  constructor(message = "ظرفیت تکمیل شده") {
    super(message);
    this.name = "CapacityFullError";
  }
}

/** مرداد ≈ August in the requested Gregorian check (getMonth() === 7). */
export function isCapacityMonth(date = new Date()): boolean {
  return date.getMonth() === 7;
}

/** Friday is the weekly holiday in Iran (getDay() === 5). */
export function isFriday(date: Date): boolean {
  return date.getDay() === 5;
}

export function startOfDay(date: Date): Date {
  const d = new Date(date);
  d.setHours(0, 0, 0, 0);
  return d;
}

/** Returns the next working day (skips Friday). */
export function getNextBusinessDay(from = new Date(), includeToday = false): Date {
  const d = startOfDay(from);
  if (!includeToday) {
    d.setDate(d.getDate() + 1);
  }

  while (isFriday(d)) {
    d.setDate(d.getDate() + 1);
  }

  return d;
}

function toPersianDigits(input: string): string {
  return input.replace(/\d/g, (digit) => "۰۱۲۳۴۵۶۷۸۹"[Number(digit)]!);
}

export function formatInterviewLabel(date: Date, timeSlot: string): string {
  const weekday = PERSIAN_WEEKDAYS[date.getDay()];
  const timeFa = toPersianDigits(timeSlot);
  return `${weekday} آینده، ساعت ${timeFa}`;
}

export type ReservedSlot = {
  date: Date;
  timeSlot: string;
  label: string;
};

/**
 * Finds the earliest free interview slot starting from the next business day.
 * If a slot is taken, advances to the next slot / next business day.
 */
export async function findAvailableInterviewSlot(
  startFrom = new Date()
): Promise<ReservedSlot> {
  if (isCapacityMonth(startFrom)) {
    throw new CapacityFullError();
  }

  let day = getNextBusinessDay(startFrom, false);
  const maxDays = 60;

  for (let i = 0; i < maxDays; i += 1) {
    if (isCapacityMonth(day)) {
      throw new CapacityFullError();
    }

    for (const timeSlot of INTERVIEW_TIME_SLOTS) {
      const isTaken = await prisma.interview.findFirst({
        where: {
          date: day,
          timeSlot,
        },
      });

      if (!isTaken) {
        return {
          date: day,
          timeSlot,
          label: formatInterviewLabel(day, timeSlot),
        };
      }
    }

    day = getNextBusinessDay(day, false);
  }

  throw new CapacityFullError(
    "ظرفیت مصاحبه در بازه زمانی موجود تکمیل شده است."
  );
}
