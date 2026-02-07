export default defineNuxtRouteMiddleware(async (to, from) => {
  const { session } = useAuth();

  while (session.value.isPending) {
    await new Promise((resolve) => setTimeout(resolve, 50));
  }

  const isAuthenticated = !!session.value.data?.user;

  const protectedRoutes = [
    "/",
    "/inbox",
    "/employees",
    "/settings",
    "/profile",
  ];
  const isProtectedRoute = protectedRoutes.some((route) =>
    to.path.startsWith(route),
  );

  const authRoutes = ["/login", "/register"];
  const isAuthRoute = authRoutes.includes(to.path);

  if (isProtectedRoute && !isAuthenticated) {
    return navigateTo("/login");
  }

  if (isAuthRoute && isAuthenticated) {
    return navigateTo("/");
  }
});
