<script setup lang="ts">
import type { DropdownMenuItem } from "#ui/types";

definePageMeta({
  layout: "default",
  ssr: false,
});

interface User {
  id: number;
  name: string;
  email: string;
  avatar: string;
  access: string[];
  lastActive: string;
  dateAdded: string;
}

const toast = useToast();
const page = ref(1);
const pageSize = ref(7);
const searchQuery = ref("");
const selected = ref<number[]>([]);

const users = ref<User[]>([
  {
    id: 1,
    name: "Florence Shaw",
    email: "florence@untitledui.com",
    avatar: "https://i.pravatar.cc/150?img=1",
    access: ["Admin"],
    lastActive: "Mar 4, 2024",
    dateAdded: "July 4, 2022",
  },
  {
    id: 2,
    name: "Amelie Laurent",
    email: "amelie@untitledui.com",
    avatar: "https://i.pravatar.cc/150?img=5",
    access: ["Admin"],
    lastActive: "Mar 4, 2024",
    dateAdded: "July 4, 2022",
  },
  {
    id: 3,
    name: "Ammar Foley",
    email: "ammar@untitledui.com",
    avatar: "https://i.pravatar.cc/150?img=12",
    access: ["Staff"],
    lastActive: "Mar 2, 2024",
    dateAdded: "July 4, 2022",
  },
  {
    id: 4,
    name: "Caitlyn King",
    email: "caitlyn@untitledui.com",
    avatar: "https://i.pravatar.cc/150?img=10",
    access: ["Staff"],
    lastActive: "Mar 6, 2024",
    dateAdded: "July 4, 2022",
  },
  {
    id: 5,
    name: "Sienna Hewitt",
    email: "sienna@untitledui.com",
    avatar: "https://i.pravatar.cc/150?img=20",
    access: ["Staff"],
    lastActive: "Mar 8, 2024",
    dateAdded: "July 4, 2022",
  },
  {
    id: 6,
    name: "Olly Shoeder",
    email: "olly@untitledui.com",
    avatar: "https://i.pravatar.cc/150?img=15",
    access: ["Staff"],
    lastActive: "Mar 6, 2024",
    dateAdded: "July 4, 2022",
  },
  {
    id: 7,
    name: "Mathilde Lewis",
    email: "mathilde@untitledui.com",
    avatar: "https://i.pravatar.cc/150?img=25",
    access: ["Admin"],
    lastActive: "Mar 4, 2024",
    dateAdded: "July 4, 2022",
  },
  {
    id: 8,
    name: "Jaya Willis",
    email: "jaya@untitledui.com",
    avatar: "https://i.pravatar.cc/150?img=30",
    access: ["Staff"],
    lastActive: "Mar 4, 2024",
    dateAdded: "July 4, 2022",
  },
  {
    id: 9,
    name: "John Doe",
    email: "john@untitledui.com",
    avatar: "https://i.pravatar.cc/150?img=33",
    access: ["Staff"],
    lastActive: "Mar 3, 2024",
    dateAdded: "July 3, 2022",
  },
  {
    id: 10,
    name: "Jane Smith",
    email: "jane@untitledui.com",
    avatar: "https://i.pravatar.cc/150?img=44",
    access: ["Admin"],
    lastActive: "Mar 5, 2024",
    dateAdded: "July 5, 2022",
  },
  {
    id: 11,
    name: "Michael Brown",
    email: "michael@untitledui.com",
    avatar: "https://i.pravatar.cc/150?img=51",
    access: ["Staff"],
    lastActive: "Mar 7, 2024",
    dateAdded: "July 7, 2022",
  },
  {
    id: 12,
    name: "Sarah Johnson",
    email: "sarah@untitledui.com",
    avatar: "https://i.pravatar.cc/150?img=49",
    access: ["Staff"],
    lastActive: "Mar 9, 2024",
    dateAdded: "July 9, 2022",
  },
  {
    id: 13,
    name: "David Wilson",
    email: "david@untitledui.com",
    avatar: "https://i.pravatar.cc/150?img=60",
    access: ["Admin"],
    lastActive: "Mar 10, 2024",
    dateAdded: "July 10, 2022",
  },
  {
    id: 14,
    name: "Emily Davis",
    email: "emily@untitledui.com",
    avatar: "https://i.pravatar.cc/150?img=47",
    access: ["Staff"],
    lastActive: "Mar 11, 2024",
    dateAdded: "July 11, 2022",
  },
  {
    id: 15,
    name: "Robert Martinez",
    email: "robert@untitledui.com",
    avatar: "https://i.pravatar.cc/150?img=68",
    access: ["Staff"],
    lastActive: "Mar 12, 2024",
    dateAdded: "July 12, 2022",
  },
]);

const columns = [
  {
    key: "user",
    label: "User name",
  },
  {
    key: "access",
    label: "Access",
  },
  {
    key: "lastActive",
    label: "Last active",
  },
  {
    key: "dateAdded",
    label: "Date added",
  },
  {
    key: "actions",
    label: "",
  },
];

const filteredUsers = computed(() => {
  const q = searchQuery.value.trim().toLowerCase();
  if (!q) return users.value;

  return users.value.filter(
    (user) =>
      user.name.toLowerCase().includes(q) ||
      user.email.toLowerCase().includes(q),
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

const totalPages = computed(() =>
  Math.ceil(filteredUsers.value.length / pageSize.value),
);

watch(page, (newPage) => {
  console.log("Page changed:", newPage);
  console.log("Total pages:", totalPages.value);
  console.log("Page size:", pageSize.value);
  console.log("Filtered users:", filteredUsers.value.length);
});

function getActions(user: User): DropdownMenuItem[][] {
  return [
    [
      {
        label: "Edit",
        icon: "i-heroicons-pencil-square-20-solid",
        click: () => editUser(user),
      },
      {
        label: "View profile",
        icon: "i-heroicons-user-20-solid",
        click: () => viewProfile(user),
      },
    ],
    [
      {
        label: "Delete",
        icon: "i-heroicons-trash-20-solid",
        click: () => deleteUser(user),
      },
    ],
  ];
}

function editUser(user: User) {
  toast.add({
    title: "Edit User",
    description: `Editing ${user.name}`,
  });
}

function viewProfile(user: User) {
  toast.add({
    title: "Success",
    description: `"${user.name}" details updated`,
    icon: "i-heroicons-check-circle-20-solid",
  });
}

function deleteUser(user: User) {
  toast.add({
    title: "Delete User",
    description: `${user.name} has been deleted`,
    color: "primary",
  });
}

function addUser() {
  toast.add({
    title: "Add User",
    description: "Opening add user dialog...",
  });
}

function selectUser(userId: number) {
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
  <div class="min-h-screen w-full">
    <div class="w-full px-4 sm:px-6 lg:px-8 py-8">
      <div class="mb-8">
        <div class="flex items-center gap-2 text-sm text-gray-500 mb-4">
          <UIcon
            name="i-heroicons-building-storefront-20-solid"
            class="w-5 h-5"
          />
          <span class="font-medium">KEMENPU</span>
          <UIcon name="i-heroicons-chevron-right-20-solid" class="w-4 h-4" />
          <span>User management</span>
        </div>

        <h1 class="text-3xl font-bold mb-2">User management</h1>
        <p>Manage your team members and their account permissions here.</p>
      </div>

      <UCard class="shadow-sm w-full">
        <template #header>
          <div
            class="flex flex-col sm:flex-row sm:items-center justify-between gap-4"
          >
            <div class="flex items-center gap-2">
              <h2 class="text-lg font-semibold">All users</h2>
              <UBadge color="neutral" variant="subtle" size="md">
                {{ filteredUsers.length }}
              </UBadge>
            </div>

            <div class="flex items-center gap-3">
              <UInput
                v-model="searchQuery"
                icon="i-heroicons-magnifying-glass-20-solid"
                placeholder="Search"
                class="w-full sm:w-80"
                color="neutral"
              />
              <UButton
                icon="i-heroicons-funnel-20-solid"
                color="neutral"
                variant="outline"
              >
                Filters
              </UButton>
              <UButton
                icon="i-heroicons-plus-20-solid"
                color="primary"
                class="w-full sm:w-80"
                @click="addUser"
              >
                Add user
              </UButton>
            </div>
          </div>
        </template>

        <div class="overflow-x-auto w-full">
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
                  User name
                </th>
                <th
                  class="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider"
                >
                  Access
                </th>
                <th
                  class="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider"
                >
                  Last active
                </th>
                <th
                  class="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider"
                >
                  Date added
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
                class="transition-colors"
              >
                <td class="px-6 py-4 whitespace-nowrap">
                  <UCheckbox
                    :model-value="selected.includes(user.id)"
                    @update:model-value="selectUser(user.id)"
                  />
                </td>
                <td class="px-6 py-4 whitespace-nowrap">
                  <div class="flex items-center gap-3">
                    <UAvatar :src="user.avatar" :alt="user.name" size="sm" />
                    <div>
                      <div class="font-medium">
                        {{ user.name }}
                      </div>
                      <div class="text-sm">{{ user.email }}</div>
                    </div>
                  </div>
                </td>
                <td class="px-6 py-4">
                  <div class="flex flex-wrap gap-2">
                    <UBadge
                      v-for="access in user.access"
                      :key="access"
                      :color="access === 'Admin' ? 'primary' : 'neutral'"
                      variant="subtle"
                      size="sm"
                    >
                      {{ access }}
                    </UBadge>
                  </div>
                </td>
                <td class="px-6 py-4 whitespace-nowrap">
                  <span class="text-sm">{{ user.lastActive }}</span>
                </td>
                <td class="px-6 py-4 whitespace-nowrap">
                  <span class="text-sm">{{ user.dateAdded }}</span>
                </td>
                <td class="px-6 py-4 whitespace-nowrap text-right">
                  <UDropdown :items="getActions(user)">
                    <UButton
                      color="neutral"
                      variant="ghost"
                      icon="i-heroicons-ellipsis-horizontal-20-solid"
                      square
                    />
                  </UDropdown>
                </td>
              </tr>
            </tbody>
          </table>
        </div>

        <div v-if="paginatedUsers.length === 0" class="text-center py-12">
          <UIcon
            name="i-heroicons-users-20-solid"
            class="w-12 h-12 mx-auto text-gray-400 mb-3"
          />
          <h3 class="text-sm font-medium text-gray-900 mb-1">No users found</h3>
          <p class="text-sm text-gray-500">
            Try adjusting your search or filter to find what you're looking for.
          </p>
        </div>

        <template #footer>
          <div
            class="flex flex-col sm:flex-row items-center justify-between gap-4 py-4"
          >
            <div class="text-sm text-gray-700">
              Showing
              <span class="font-medium">{{ (page - 1) * pageSize + 1 }}</span>
              to
              <span class="font-medium">{{
                Math.min(page * pageSize, filteredUsers.length)
              }}</span>
              of
              <span class="font-medium">{{ filteredUsers.length }}</span>
              results

              <span class="ml-4 text-red-500 font-bold">
                {{ page }} / {{ totalPages }}
              </span>
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
</template>
