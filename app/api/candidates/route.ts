import { NextResponse } from "next/server";
import { Prisma } from "@prisma/client";
import { prisma } from "@/lib/prisma";
import {
  CapacityFullError,
  findAvailableInterviewSlot,
} from "@/lib/interview";

export async function POST(request: Request) {
  if (!process.env.DATABASE_URL) {
    console.error("DATABASE_URL is not set");
    return NextResponse.json(
      { success: false, message: "تنظیمات پایگاه داده یافت نشد." },
      { status: 500 }
    );
  }

  try {
    const body = await request.json();
    const age = parseInt(body.age, 10);

    if (Number.isNaN(age)) {
      return NextResponse.json(
        { success: false, message: "سن وارد شده معتبر نیست." },
        { status: 400 }
      );
    }

    const slot = await findAvailableInterviewSlot();

    const candidate = await prisma.candidate.create({
      data: {
        fullname: body.fullname,
        phone: body.phone,
        area: body.area,
        age,
        education: body.education,
        field: body.field,
        excel_skill: body.excel_skill,
        ai_skill: body.ai_skill,
        motivation: body.motivation,
        expectations: body.expectations,
        interview: {
          create: {
            date: slot.date,
            timeSlot: slot.timeSlot,
          },
        },
      },
      include: {
        interview: true,
      },
    });

    try {
      const message = `کارجوی جدید:
نام: ${candidate.fullname}
تلفن: ${candidate.phone}
رشته: ${candidate.field}
زمان مصاحبه: ${slot.label}`;

      // آدرسِ بات‌فادرِ بله
      const BALE_URL = `https://tapi.bale.ai/bot${process.env.BALE_TOKEN}/sendMessage`;

      await fetch(BALE_URL, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          chat_id: process.env.BALE_CHAT_ID,
          text: message,
        }),
      });
    } catch (error) {
      console.error("خطا در ارسال به بله:", error);
    }

    return NextResponse.json(
      {
        success: true,
        candidate,
        interview: {
          date: slot.date,
          timeSlot: slot.timeSlot,
          label: slot.label,
        },
      },
      { status: 201 }
    );
  } catch (error) {
    console.error("Database Error:", error);

    if (error instanceof CapacityFullError) {
      return NextResponse.json(
        { success: false, message: error.message },
        { status: 400 }
      );
    }

    if (error instanceof Prisma.PrismaClientInitializationError) {
      return NextResponse.json(
        { success: false, message: "اتصال به پایگاه داده برقرار نشد." },
        { status: 503 }
      );
    }

    if (
      error instanceof Prisma.PrismaClientKnownRequestError &&
      error.code === "P2021"
    ) {
      return NextResponse.json(
        {
          success: false,
          message:
            "جدول دیتابیس هنوز ساخته نشده. لطفاً با پشتیبانی تماس بگیرید.",
        },
        { status: 503 }
      );
    }

    return NextResponse.json(
      { success: false, message: "خطا در ثبت اطلاعات" },
      { status: 500 }
    );
  }
}
