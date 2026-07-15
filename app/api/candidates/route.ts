import { NextResponse } from 'next/server';
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const candidate = await prisma.candidate.create({
      data: {
        fullname: body.fullname,
        phone: body.phone,
        area: body.area,
        age: parseInt(body.age, 10),
        education: body.education,
        field: body.field,
        excel_skill: body.excel_skill,
        ai_skill: body.ai_skill,
        motivation: body.motivation,
        expectations: body.expectations,
      }
    });
    return NextResponse.json({ success: true, candidate }, { status: 201 });
  } catch (error) {
    console.error('Database Error:', error);
    return NextResponse.json({ success: false, message: 'خطا در ثبت اطلاعات' }, { status: 500 });
  }
}
