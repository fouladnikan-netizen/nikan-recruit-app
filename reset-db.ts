import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

async function main() {
  await prisma.candidate.deleteMany({}); // این دستور همه داده‌ها را پاک می‌کند
  console.log("تمام داده‌ها پاک شدند.");
}

main()
  .catch((error) => {
    console.error(error);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
