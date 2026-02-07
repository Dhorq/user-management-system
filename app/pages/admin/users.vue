<script setup lang="ts">
type Role = "ADMIN" | "MANAGER" | "USER";

interface User {
  id: string;
  name: string;
  email: string;
  role: Role;
  createdAt: Date;
}

definePageMeta({
  middleware: "auth",
});

const { isAdmin } = useAuth();
const toast = useToast();

// Redirect if not admin
onMounted(() => {
  if (!isAdmin.value) {
    navigateTo("/");
  }
});

const { data: users, refresh } = await useFetch<User[]>("/api/users");

const updateRole = async (userId: string, newRole: Role) => {
  try {
    await $fetch(`/api/users/${userId}/role`, {
      method: "PUT",
      body: { role: newRole },
    });

    toast.add({
      title: "Success",
      description: "Role updated successfully",
      color: "primary",
    });

    refresh();
  } catch (error: any) {
    toast.add({
      title: "Error",
      description:
        error.data?.message || error.message || "Failed to update role",
      color: "neutral",
    });
  }
};

const getRoleBadgeColor = (role: Role) => {
  if (role === "ADMIN") return "error";
  if (role === "MANAGER") return "primary";
  return "neutral";
};
</script>

<template>
  <div class="p-6">
    <h1 class="text-2xl font-bold mb-6">User Management</h1>

    <div v-if="users && users.length > 0" class="space-y-4">
      <div
        v-for="user in users"
        :key="user.id"
        class="flex items-center justify-between p-4 border border-gray-200 rounded-lg"
      >
        <div class="flex-1">
          <p class="font-semibold">{{ user.name }}</p>
          <p class="text-sm text-gray-500">{{ user.email }}</p>
        </div>

        <div class="flex items-center gap-4">
          <UBadge :color="getRoleBadgeColor(user.role)">
            {{ user.role }}
          </UBadge>

          <UDropdown
            :items="[
              [
                {
                  label: 'Make Admin',
                  icon: 'i-lucide-shield',
                  click: () => updateRole(user.id, 'ADMIN'),
                },
                {
                  label: 'Make Manager',
                  icon: 'i-lucide-user-cog',
                  click: () => updateRole(user.id, 'MANAGER'),
                },
                {
                  label: 'Make User',
                  icon: 'i-lucide-user',
                  click: () => updateRole(user.id, 'USER'),
                },
              ],
            ]"
          >
            <UButton
              color="primary"
              variant="ghost"
              icon="i-lucide-more-vertical"
            />
          </UDropdown>
        </div>
      </div>
    </div>

    <div v-else class="text-center py-8 text-gray-500">No users found</div>
  </div>
</template>
