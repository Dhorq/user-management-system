import { createAuthClient } from "better-auth/vue";

export const useAuth = () => {
  return createAuthClient({
    baseURL: "http://localhost:3000",
  });
};
