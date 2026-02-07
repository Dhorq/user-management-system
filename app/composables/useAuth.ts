import { createAuthClient } from "better-auth/vue";

export const authClient = createAuthClient({
  baseURL: process.env.BETTER_AUTH_URL || "http://localhost:3000",
});

export const useAuth = () => {
  const router = useRouter();
  const toast = useToast();

  const signUpEmail = async (data: {
    email: string;
    password: string;
    name: string;
  }) => {
    try {
      const result = await authClient.signUp.email({
        email: data.email,
        password: data.password,
        name: data.name,
        callbackURL: "/",
      });

      if (result.error) {
        toast.add({
          title: "Error",
          description: result.error.message,
          color: "neutral",
        });
        return { error: result.error };
      }

      toast.add({
        title: "Success",
        description: "Account created successfully!",
        color: "primary",
      });

      return { data: result.data };
    } catch (error: any) {
      toast.add({
        title: "Error",
        description: error.message || "Failed to register",
        color: "neutral",
      });
      return { error };
    }
  };

  const signInEmail = async (data: { email: string; password: string }) => {
    try {
      const result = await authClient.signIn.email({
        email: data.email,
        password: data.password,
        callbackURL: "/",
      });

      if (result.error) {
        toast.add({
          title: "Error",
          description: result.error.message,
          color: "neutral",
        });
        return { error: result.error };
      }

      toast.add({
        title: "Success",
        description: "Logged in successfully!",
        color: "primary",
      });

      return { data: result.data };
    } catch (error: any) {
      toast.add({
        title: "Error",
        description: error.message || "Failed to login",
        color: "neutral",
      });
      return { error };
    }
  };

  const signInSocial = async (provider: "google" | "github") => {
    try {
      await authClient.signIn.social({
        provider,
        callbackURL: "/",
      });
    } catch (error: any) {
      toast.add({
        title: "Error",
        description: error.message || `Failed to login with ${provider}`,
        color: "neutral",
      });
    }
  };

  const logout = async () => {
    try {
      await authClient.signOut({
        fetchOptions: {
          onSuccess: () => {
            toast.add({
              title: "Success",
              description: "Logged out successfully",
              color: "primary",
            });
          },
          onError: () => {
            toast.add({
              title: "Error",
              description: "Failed to logout",
              color: "neutral",
            });
          },
        },
      });
    } catch (error: any) {
      toast.add({
        title: "Error",
        description: error.message || "Failed to logout",
        color: "neutral",
      });
    }
  };

  const session = authClient.useSession();

  return {
    signUpEmail,
    signInEmail,
    signInSocial,
    logout,

    session,

    authClient,
  };
};
