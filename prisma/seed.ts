import bcrypt from "bcryptjs";
import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

async function main() {
  const email = process.env.SEED_EMAIL ?? "demo@lifeshots.local";
  const password = process.env.SEED_PASSWORD ?? "demo123456";
  const displayName = process.env.SEED_NAME ?? "LifeShots";

  const passwordHash = await bcrypt.hash(password, 10);

  await prisma.user.upsert({
    where: { email },
    update: { passwordHash, displayName },
    create: {
      email,
      passwordHash,
      displayName,
    },
  });

  console.log(`Seeded user: ${email}`);
}

main()
  .catch((error) => {
    console.error(error);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
