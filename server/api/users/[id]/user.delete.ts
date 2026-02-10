import { prisma } from "../../../utils/db";
import { auth } from "../../../lib/auth";

export default defineEventHandler(async (event) => {
  const session = await auth.api.getSession({ headers: event.headers });

  if (!session?.user || (session.user as any).role !== "ADMIN") {
    throw createError({
      statusCode: 403,
      message: "Unauthorized - Admin access required",
    });
  }

  const userId = getRouterParam(event, "id");

  if (!userId) {
    throw createError({
      statusCode: 400,
      message: "User ID is required",
    });
  }

  const userToDelete = await prisma.user.findUnique({
    where: { id: userId },
  });

  if (!userToDelete) {
    throw createError({
      statusCode: 404,
      message: "User not found",
    });
  }

  await prisma.user.delete({
    where: { id: userId },
  });

  return {
    success: true,
    message: "User deleted successfully",
    deletedUserId: userId,
  };
});
