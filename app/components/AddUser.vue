<script setup lang="ts">
import { ref } from "vue";

const isOpen = defineModel<boolean>("isOpen", { required: true });
const emit = defineEmits<{
  userAdded: [user: any];
}>();

const toast = useToast();
const form = ref({
  name: "",
  email: "",
  password: "",
  role: "USER" as "ADMIN" | "MANAGER" | "USER",
});

const isLoading = ref(false);

const roles = [
  { label: "Admin", value: "ADMIN" },
  { label: "Manager", value: "MANAGER" },
  { label: "User", value: "USER" },
];

async function handleSubmit() {
  if (!form.value.name || !form.value.email || !form.value.password) {
    toast.add({
      title: "Error",
      description: "Please fill in all required fields",
      color: "error",
      icon: "i-heroicons-exclamation-triangle-20-solid",
    });
    return;
  }

  isLoading.value = true;

  try {
    const newUser = await $fetch("/api/users/create", {
      method: "POST",
      body: {
        name: form.value.name,
        email: form.value.email,
        password: form.value.password,
        role: form.value.role,
      },
    });

    toast.add({
      title: "Success",
      description: "User created successfully",
      color: "success",
      icon: "i-heroicons-check-circle-20-solid",
    });

    emit("userAdded", newUser);
    isOpen.value = false;
    resetForm();
  } catch (error: any) {
    toast.add({
      title: "Error",
      description: error.data?.message || "Failed to create user",
      color: "error",
      icon: "i-heroicons-exclamation-triangle-20-solid",
    });
  } finally {
    isLoading.value = false;
  }
}

function resetForm() {
  form.value = {
    name: "",
    email: "",
    password: "",
    role: "USER",
  };
}

function handleClose() {
  isOpen.value = false;
  resetForm();
}
</script>

<template>
  <Transition
    enter-active-class="transition-opacity duration-200"
    enter-from-class="opacity-0"
    enter-to-class="opacity-100"
    leave-active-class="transition-opacity duration-200"
    leave-from-class="opacity-100"
    leave-to-class="opacity-0"
  >
    <div
      v-if="isOpen"
      class="fixed inset-0 bg-black/50 backdrop-blur-sm z-40"
      @click="handleClose"
    ></div>
  </Transition>

  <Transition
    enter-active-class="transition-all duration-200 ease-out"
    enter-from-class="opacity-0 scale-95"
    enter-to-class="opacity-100 scale-100"
    leave-active-class="transition-all duration-150 ease-in"
    leave-from-class="opacity-100 scale-100"
    leave-to-class="opacity-0 scale-95"
  >
    <div
      v-if="isOpen"
      class="fixed inset-0 flex items-center justify-center z-50 p-4"
      @click.self="handleClose"
    >
      <UCard class="w-full max-w-md">
        <template #header>
          <div class="flex items-center justify-between">
            <h3 class="text-lg font-semibold">Add New User</h3>
            <UButton
              color="neutral"
              variant="ghost"
              icon="i-heroicons-x-mark-20-solid"
              @click="handleClose"
              square
            />
          </div>
        </template>

        <form @submit.prevent="handleSubmit" class="space-y-4">
          <div>
            <label class="block text-sm font-medium mb-1">
              Name <span class="text-red-500">*</span>
            </label>
            <UInput
              v-model="form.name"
              placeholder="Enter full name"
              icon="i-heroicons-user-20-solid"
              required
            />
          </div>

          <div>
            <label class="block text-sm font-medium mb-1">
              Email <span class="text-red-500">*</span>
            </label>
            <UInput
              v-model="form.email"
              type="email"
              placeholder="user@example.com"
              icon="i-heroicons-envelope-20-solid"
              required
            />
          </div>

          <div>
            <label class="block text-sm font-medium mb-1">
              Password <span class="text-red-500">*</span>
            </label>
            <UInput
              v-model="form.password"
              type="password"
              placeholder="Enter password"
              icon="i-heroicons-lock-closed-20-solid"
              required
            />
          </div>

          <div>
            <label class="block text-sm font-medium mb-1">Role</label>
            <USelect
              v-model="form.role"
              :options="roles"
              option-attribute="label"
              value-attribute="value"
            />
          </div>

          <div class="flex justify-end gap-3 pt-4">
            <UButton
              type="button"
              color="neutral"
              variant="outline"
              @click="handleClose"
            >
              Cancel
            </UButton>
            <UButton
              type="submit"
              color="primary"
              :loading="isLoading"
              :disabled="isLoading"
            >
              Create User
            </UButton>
          </div>
        </form>
      </UCard>
    </div>
  </Transition>
</template>
