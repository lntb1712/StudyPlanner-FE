<script setup lang="ts">
import { useAuthStore } from "../../application/stores/AuthStore";
import { useRouter } from "vue-router";

const auth = useAuthStore();
const router = useRouter();

const handleLogout = () => {
  auth.logout();
  router.push({ name: "Login" });
};
</script>

<template>
  <div class="dashboard">
    <h1>Welcome, {{ auth.username || "User" }} 🎉</h1>
    <button @click="handleLogout">Logout</button>
  </div>
</template>