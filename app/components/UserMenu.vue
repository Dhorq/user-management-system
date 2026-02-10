<script setup lang="ts">
const { logout, session } = useAuth();

const isOpen = ref(false);

const handleLogout = async () => {
  await logout();
  isOpen.value = false;
  await navigateTo("/login");
};
</script>

<template>
  <UPopover v-model:open="isOpen" :popper="{ placement: 'top-start' }">
    <UAvatar
      :src="
        session.data?.user?.image ||
        'https://avatars.githubusercontent.com/u/98602811?v=4'
      "
      :alt="session.data?.user?.name || 'User'"
      size="sm"
      class="cursor-pointer hover:opacity-80 transition-opacity"
    />

    <template #content>
      <div class="p-2 w-48">
        <UButton
          icon="i-lucide-user"
          to="/profile"
          variant="ghost"
          color="primary"
          class="w-full justify-start mb-1"
          @click="isOpen = false"
        >
          Profile
        </UButton>

        <UButton
          icon="i-lucide-log-out"
          variant="ghost"
          color="primary"
          class="w-full justify-start mt-1"
          @click="handleLogout"
        >
          Logout
        </UButton>
      </div>
    </template>
  </UPopover>
</template>
