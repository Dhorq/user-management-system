<script setup lang="ts">
const { logout, session } = useAuth();

defineProps<{
  collapsed?: boolean;
}>();

const handleLogout = async () => {
  await logout();
  await navigateTo("/login");
};
</script>

<template>
  <UPopover :popper="{ placement: 'top-start' }">
    <UAvatar
      :src="
        session.data?.user?.image ||
        'https://avatars.githubusercontent.com/u/739984?v=4'
      "
      :alt="session.data?.user?.name || 'User avatar'"
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
        >
          Profile
        </UButton>

        <UDivider class="my-2" />

        <UButton
          icon="i-lucide-log-out"
          variant="ghost"
          color="primary"
          class="w-full justify-start"
          @click="handleLogout"
        >
          Logout
        </UButton>
      </div>
    </template>
  </UPopover>
</template>
