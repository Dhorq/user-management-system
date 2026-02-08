<script setup lang="ts">
import { ref, computed, watch, onMounted } from "vue";

definePageMeta({
  layout: "default",
  ssr: false,
  middleware: "auth",
});

const toast = useToast();
const page = ref(1);
const pageSize = ref(7);
const searchQuery = ref("");
const selected = ref<string[]>([]);
const isLoading = ref(true);

type Role = "ADMIN" | "MANAGER" | "USER";

interface User {
  id: string;
  name: string;
  email: string;
  image: string | null;
  role: Role;
  lastActiveAt: string;
  createdAt: string;
}

const users = ref<User[]>([]);
const { user } = useAuth();
const currentUserRole = computed(() => user.value?.role || null);

onMounted(async () => {
  try {
    const res = await $fetch<User[]>("/api/users");
    users.value = res;
  } catch (error) {
    toast.add({
      title: "Error",
      description: "Failed to load users",
      color: "error",
      icon: "i-heroicons-exclamation-triangle-20-solid",
    });
  } finally {
    isLoading.value = false;
  }
});

function timeAgo(dateStr: string): string {
  const now = new Date();
  const date = new Date(dateStr);
  const seconds = Math.floor((now.getTime() - date.getTime()) / 1000);

  if (seconds < 60) return "Just now";

  const minutes = Math.floor(seconds / 60);
  if (minutes < 60) return `${minutes}m ago`;

  const hours = Math.floor(minutes / 60);
  if (hours < 24) return `${hours}h ago`;

  const days = Math.floor(hours / 24);
  if (days < 7) return `${days}d ago`;

  const weeks = Math.floor(days / 7);
  if (weeks < 4) return `${weeks}w ago`;

  return formatDate(dateStr);
}

function formatDate(dateStr: string): string {
  return new Date(dateStr).toLocaleDateString("en-US", {
    month: "short",
    day: "numeric",
    year: "numeric",
  });
}

function isRecentlyActive(dateStr: string): boolean {
  const now = new Date();
  const date = new Date(dateStr);
  const hours = (now.getTime() - date.getTime()) / (1000 * 60 * 60);
  return hours < 24;
}

function getRoleLabel(role: Role): string {
  const labels: Record<Role, string> = {
    ADMIN: "Admin",
    MANAGER: "Manager",
    USER: "User",
  };
  return labels[role] || role;
}

function getRoleColor(role: Role): "error" | "primary" | "neutral" {
  const colors: Record<Role, "error" | "primary" | "neutral"> = {
    ADMIN: "error",
    MANAGER: "primary",
    USER: "neutral",
  };
  return colors[role] || "neutral";
}

const filteredUsers = computed(() => {
  const q = searchQuery.value.trim().toLowerCase();
  if (!q) return users.value;

  return users.value.filter(
    (user) =>
      user.name.toLowerCase().includes(q) ||
      user.email.toLowerCase().includes(q) ||
      getRoleLabel(user.role).toLowerCase().includes(q),
  );
});

watch(filteredUsers, () => {
  page.value = 1;
});

const paginatedUsers = computed(() => {
  const start = (page.value - 1) * pageSize.value;
  const end = start + pageSize.value;
  return filteredUsers.value.slice(start, end);
});

const showingFrom = computed(() =>
  filteredUsers.value.length > 0 ? (page.value - 1) * pageSize.value + 1 : 0,
);

const showingTo = computed(() =>
  Math.min(page.value * pageSize.value, filteredUsers.value.length),
);

function getDropdownItems(user: User) {
  const role = currentUserRole.value;

  if (role === "USER") {
    return null;
  }

  if (role === "MANAGER") {
    return [
      [
        {
          label: "View profile",
          icon: "i-heroicons-user-20-solid",
          to: "/profile",
        },
      ],
    ];
  }

  if (role === "ADMIN") {
    return [
      [
        {
          label: "View profile",
          icon: "i-heroicons-user-20-solid",
          to: "/profile",
        },
      ],
      [
        {
          label: "Change to Admin",
          icon: "i-heroicons-shield-check-20-solid",
          disabled: user.role === "ADMIN",
          onSelect: () => changeUserRole(user, "ADMIN"),
        },
        {
          label: "Change to Manager",
          icon: "i-heroicons-briefcase-20-solid",
          disabled: user.role === "MANAGER",
          onSelect: () => changeUserRole(user, "MANAGER"),
        },
        {
          label: "Change to User",
          icon: "i-heroicons-user-20-solid",
          disabled: user.role === "USER",
          onSelect: () => changeUserRole(user, "USER"),
        },
      ],
      [
        {
          label: "Delete",
          icon: "i-heroicons-trash-20-solid",
          onSelect: () => deleteUser(user),
        },
      ],
    ];
  }

  return null;
}

async function changeUserRole(user: User, newRole: Role) {
  try {
    const response = await $fetch(`/api/users/${user.id}/role`, {
      method: "PUT" as any,
      body: { role: newRole },
    });

    const foundUser = users.value.find((u) => u.id === user.id);
    if (foundUser) {
      foundUser.role = newRole;
    }

    toast.add({
      title: "Role Updated",
      description: `${user.name}'s role changed to ${getRoleLabel(newRole)}`,
      color: "success",
      icon: "i-heroicons-check-circle-20-solid",
    });
  } catch (error) {
    toast.add({
      title: "Error",
      description: "Failed to update user role",
      color: "error",
      icon: "i-heroicons-exclamation-triangle-20-solid",
    });
  }
}

function deleteUser(user: User) {
  const index = users.value.findIndex((u) => u.id === user.id);
  if (index !== -1) {
    users.value.splice(index, 1);
    const selectedIndex = selected.value.indexOf(user.id);
    if (selectedIndex !== -1) {
      selected.value.splice(selectedIndex, 1);
    }
  }
  toast.add({
    title: "User Deleted",
    description: `${user.name} has been removed`,
    color: "error",
    icon: "i-heroicons-trash-20-solid",
  });
}

function deleteSelected() {
  const count = selected.value.length;
  users.value = users.value.filter((u) => !selected.value.includes(u.id));
  selected.value = [];
  toast.add({
    title: "Users Deleted",
    description: `${count} user(s) have been removed`,
    color: "error",
    icon: "i-heroicons-trash-20-solid",
  });
}

const isAddUserModalOpen = ref(false);

function addUser() {
  isAddUserModalOpen.value = true;
}

function handleUserAdded(newUser: User) {
  users.value.unshift(newUser);

  toast.add({
    title: "User Added",
    description: `${newUser.name} has been added`,
    color: "success",
    icon: "i-heroicons-check-circle-20-solid",
  });
}

function selectUser(userId: string) {
  const index = selected.value.indexOf(userId);
  if (index === -1) {
    selected.value.push(userId);
  } else {
    selected.value.splice(index, 1);
  }
}

const isAllSelected = computed(() => {
  return (
    paginatedUsers.value.length > 0 &&
    paginatedUsers.value.every((user) => selected.value.includes(user.id))
  );
});

function toggleSelectAll() {
  if (isAllSelected.value) {
    paginatedUsers.value.forEach((user) => {
      const index = selected.value.indexOf(user.id);
      if (index !== -1) {
        selected.value.splice(index, 1);
      }
    });
  } else {
    paginatedUsers.value.forEach((user) => {
      if (!selected.value.includes(user.id)) {
        selected.value.push(user.id);
      }
    });
  }
}
</script>

<template>
  <ClientOnly>
    <div class="min-h-screen w-full">
      <div class="w-full px-4 sm:px-6 lg:px-8 py-8">
        <div class="mb-8">
          <div class="flex items-center gap-2 text-sm text-gray-500 mb-4">
            <UIcon
              name="i-heroicons-building-storefront-20-solid"
              class="w-5 h-5"
            />
            <span class="font-medium">KemenPU</span>
            <UIcon name="i-heroicons-chevron-right-20-solid" class="w-4 h-4" />
            <span>User management</span>
          </div>

          <h1 class="text-3xl font-bold mb-2">User Management</h1>
          <p class="text-gray-500">
            Manage your team members and their account permissions here.
          </p>
        </div>

        <UCard class="shadow-sm w-full">
          <template #header>
            <div
              class="flex flex-col sm:flex-row sm:items-center justify-between gap-4"
            >
              <div class="flex items-center gap-3">
                <h2 class="text-lg font-semibold">All Users</h2>
                <UBadge color="neutral" variant="subtle" size="md">
                  {{ filteredUsers.length }}
                </UBadge>

                <Transition
                  enter-active-class="transition duration-200 ease-out"
                  enter-from-class="opacity-0 scale-95"
                  enter-to-class="opacity-100 scale-100"
                  leave-active-class="transition duration-150 ease-in"
                  leave-from-class="opacity-100 scale-100"
                  leave-to-class="opacity-0 scale-95"
                >
                  <div
                    v-if="selected.length > 0"
                    class="flex items-center gap-2"
                  >
                    <UBadge color="primary" variant="solid" size="md">
                      {{ selected.length }} selected
                    </UBadge>
                    <UButton
                      size="xs"
                      color="error"
                      variant="soft"
                      icon="i-heroicons-trash-20-solid"
                      @click="deleteSelected"
                    >
                      Delete
                    </UButton>
                  </div>
                </Transition>
              </div>

              <div class="flex items-center gap-3">
                <UInput
                  v-model="searchQuery"
                  icon="i-heroicons-magnifying-glass-20-solid"
                  placeholder="Search users..."
                  class="w-full sm:w-72"
                  color="neutral"
                />
                <UButton
                  v-if="user?.role === 'ADMIN'"
                  icon="i-heroicons-plus-20-solid"
                  color="primary"
                  @click="addUser"
                >
                  Add User
                </UButton>
              </div>
            </div>
          </template>

          <div v-if="isLoading" class="flex items-center justify-center py-20">
            <div class="text-center">
              <UIcon
                name="i-heroicons-arrow-path-20-solid"
                class="w-8 h-8 mx-auto text-gray-400 animate-spin mb-3"
              />
              <p class="text-sm text-gray-500">Loading users...</p>
            </div>
          </div>

          <div v-else class="overflow-x-auto w-full">
            <table class="w-full divide-y">
              <thead>
                <tr>
                  <th class="px-6 py-3 text-left w-12">
                    <UCheckbox
                      :model-value="isAllSelected"
                      @update:model-value="toggleSelectAll"
                    />
                  </th>
                  <th
                    class="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider"
                  >
                    User
                  </th>
                  <th
                    class="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider"
                  >
                    Role
                  </th>
                  <th
                    class="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider"
                  >
                    Last Active
                  </th>
                  <th
                    class="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider"
                  >
                    Date Added
                  </th>
                  <th
                    class="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider w-12"
                  ></th>
                </tr>
              </thead>
              <tbody>
                <tr
                  v-for="user in paginatedUsers"
                  :key="user.id"
                  class="transition-colors hover:bg-gray-50 dark:hover:bg-gray-800/50"
                  :class="{
                    'bg-primary-50 dark:bg-primary-900/20': selected.includes(
                      user.id,
                    ),
                  }"
                >
                  <td class="px-6 py-4 whitespace-nowrap">
                    <UCheckbox
                      :model-value="selected.includes(user.id)"
                      @update:model-value="selectUser(user.id)"
                    />
                  </td>
                  <td class="px-6 py-4 whitespace-nowrap">
                    <div class="flex items-center gap-3">
                      <UAvatar
                        :src="user.image || undefined"
                        :alt="user.name"
                        size="sm"
                      />
                      <div>
                        <div class="font-medium">{{ user.name }}</div>
                        <div class="text-sm text-gray-500">
                          {{ user.email }}
                        </div>
                      </div>
                    </div>
                  </td>
                  <td class="px-6 py-4 whitespace-nowrap">
                    <UBadge
                      :color="getRoleColor(user.role)"
                      variant="subtle"
                      size="sm"
                    >
                      {{ getRoleLabel(user.role) }}
                    </UBadge>
                  </td>
                  <td class="px-6 py-4 whitespace-nowrap">
                    <div class="flex items-center gap-2">
                      <span
                        class="w-2 h-2 rounded-full"
                        :class="
                          isRecentlyActive(user.lastActiveAt)
                            ? 'bg-green-500'
                            : 'bg-gray-300'
                        "
                      ></span>
                      <span class="text-sm text-gray-600 dark:text-gray-400">
                        {{ timeAgo(user.lastActiveAt) }}
                      </span>
                    </div>
                  </td>
                  <td class="px-6 py-4 whitespace-nowrap">
                    <span class="text-sm text-gray-600 dark:text-gray-400">
                      {{ formatDate(user.createdAt) }}
                    </span>
                  </td>
                  <td class="px-6 py-4 whitespace-nowrap text-right">
                    <UDropdownMenu
                      v-if="getDropdownItems(user)"
                      :items="getDropdownItems(user)!"
                    >
                      <UButton
                        color="neutral"
                        variant="ghost"
                        icon="i-heroicons-ellipsis-horizontal-20-solid"
                        square
                      />
                    </UDropdownMenu>
                  </td>
                </tr>
              </tbody>
            </table>
          </div>

          <div
            v-if="!isLoading && paginatedUsers.length === 0"
            class="text-center py-16"
          >
            <UIcon
              name="i-heroicons-users-20-solid"
              class="w-12 h-12 mx-auto text-gray-400 mb-3"
            />
            <h3
              class="text-sm font-medium text-gray-900 dark:text-gray-100 mb-1"
            >
              No users found
            </h3>
            <p class="text-sm text-gray-500 mb-4">
              Try adjusting your search or filters to find what you're looking
              for.
            </p>
            <UButton
              v-if="searchQuery"
              size="sm"
              variant="soft"
              @click="searchQuery = ''"
            >
              Clear search
            </UButton>
          </div>

          <template #footer>
            <div
              class="flex flex-col sm:flex-row items-center justify-between gap-4 py-2"
            >
              <div class="text-sm text-gray-500">
                Showing
                <span class="font-semibold text-gray-700 dark:text-gray-300">
                  {{ showingFrom }}
                </span>
                to
                <span class="font-semibold text-gray-700 dark:text-gray-300">
                  {{ showingTo }}
                </span>
                of
                <span class="font-semibold text-gray-700 dark:text-gray-300">
                  {{ filteredUsers.length }}
                </span>
                users
              </div>

              <UPagination
                v-model:page="page"
                :total="filteredUsers.length"
                :page-size="pageSize"
              />
            </div>
          </template>
        </UCard>
      </div>
    </div>

    <AddUser
      v-model:isOpen="isAddUserModalOpen"
      @user-added="handleUserAdded"
    />
  </ClientOnly>
</template>
