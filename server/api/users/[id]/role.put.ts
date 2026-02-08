import { prisma } from "../../../utils/db";
import { auth } from "../../../lib/auth";

export default defineEventHandler(async (event) => {
  const session = await auth.api.getSession({ headers: event.headers });

  if (!session?.user || (session.user as any).role !== "ADMIN") {
    throw createError({
      statusCode: 403,
      message: "Unauthorized",
    });
  }

  const userId = getRouterParam(event, "id");
  const { role } = await readBody(event);

  if (!["ADMIN", "MANAGER", "USER"].includes(role)) {
    throw createError({
      statusCode: 400,
      message: "Invalid role",
    });
  }

  const user = await prisma.user.update({
    where: { id: userId },
    data: { role },
  });

  if (session.user.id === userId) {
    await auth.api.updateUser({
      headers: event.headers,
      body: {
        role: role,
      },
    });
  }

  return user;
});
