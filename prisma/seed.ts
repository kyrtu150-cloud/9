import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

async function main() {
  const email = process.env.ADMIN_EMAIL;
  if (!email) {
    console.log("Укажите ADMIN_EMAIL=you@example.com перед запуском, чтобы назначить администратора.");
    return;
  }
  const user = await prisma.user.update({
    where: { email },
    data: { role: "admin" },
  });
  console.log(`Пользователь ${user.email} теперь администратор. /admin доступен после входа.`);
}

main().finally(() => prisma.$disconnect());
