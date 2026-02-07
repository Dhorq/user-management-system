import { prisma } from "../utils/db";

export default defineEventHandler(async () => {
  const users = await prisma.user.findMany();
  return users;
});
