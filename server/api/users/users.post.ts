import { prisma } from "../../utils/db";
import { auth } from "../../lib/auth";

export default defineEventHandler(async (event) => {
  const session = await auth.api.getSession({ headers: event.headers });

  if (!session?.user || (session.user as any).role !== "ADMIN") {
    throw createError({
      statusCode: 403,
      message: "Unauthorized - Admin access required",
    });
  }

  const { name, email, password, role } = await readBody(event);

  if (!name || !email || !password) {
    throw createError({
      statusCode: 400,
      message: "Name, email, and password are required",
    });
  }

  if (!["ADMIN", "MANAGER", "USER"].includes(role)) {
    throw createError({
      statusCode: 400,
      message: "Invalid role",
    });
  }

  const existingUser = await prisma.user.findUnique({
    where: { email },
  });

  if (existingUser) {
    throw createError({
      statusCode: 400,
      message: "Email already exists",
    });
  }

  const result = await auth.api.signUpEmail({
    body: {
      email,
      password,
      name,
    },
  });

  if (!result || !result.user) {
    throw createError({
      statusCode: 500,
      message: "Failed to create user",
    });
  }

  const updatedUser = await prisma.user.update({
    where: { id: result.user.id },
    data: { role },
  });

  return {
    id: updatedUser.id,
    name: updatedUser.name,
    email: updatedUser.email,
    role: updatedUser.role,
    image: updatedUser.image,
    createdAt: updatedUser.createdAt,
    lastActiveAt: updatedUser.createdAt,
  };
});
