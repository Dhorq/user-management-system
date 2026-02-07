<script setup lang="ts">
import * as z from "zod";
import type { FormSubmitEvent, AuthFormField } from "@nuxt/ui";

const { signUpEmail, signInSocial } = useAuth();
const router = useRouter();

definePageMeta({
  layout: "auth",
});

const fields: AuthFormField[] = [
  {
    name: "name",
    type: "text",
    label: "Name",
    placeholder: "Enter your name",
    required: true,
  },
  {
    name: "email",
    type: "email",
    label: "Email",
    placeholder: "Enter your email",
    required: true,
  },
  {
    name: "password",
    label: "Password",
    type: "password",
    placeholder: "Enter your password",
    required: true,
  },
];

const providers = [
  {
    label: "Google",
    icon: "i-simple-icons-google",
    onClick: () => signInSocial("google"),
  },
  {
    label: "GitHub",
    icon: "i-simple-icons-github",
    onClick: () => signInSocial("github"),
  },
];

const schema = z.object({
  name: z.string().min(2, "Name must be at least 2 characters"),
  email: z.string().email("Invalid email"),
  password: z.string().min(8, "Must be at least 8 characters"),
});

type Schema = z.output<typeof schema>;

const loading = ref(false);

async function onSubmit(payload: FormSubmitEvent<Schema>) {
  loading.value = true;

  const result = await signUpEmail(payload.data);

  if (!result.error) {
    router.push("/");
  }

  loading.value = false;
}
</script>

<template>
  <ClientOnly>
    <div class="flex flex-col items-center justify-center gap-4 p-4 h-screen">
      <UPageCard class="w-full max-w-md">
        <UAuthForm
          :schema="schema"
          title="Register"
          description="Create your account to get started."
          icon="i-lucide-user-plus"
          :fields="fields"
          :providers="providers"
          :loading="loading"
          @submit="onSubmit"
        >
          <template #footer>
            <div class="text-center text-sm">
              Already have an account?
              <NuxtLink to="/login" class="text-primary hover:underline">
                Sign in
              </NuxtLink>
            </div>
          </template>
        </UAuthForm>
      </UPageCard>
    </div>
  </ClientOnly>
</template>
