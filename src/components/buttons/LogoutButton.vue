<script setup lang="ts">
import { useAuth0 } from "@auth0/auth0-vue"

const { logout } = useAuth0()

const handleLogout = () => logout()
</script>

<template>
    <p class="logout-button" @click="handleLogout"><span class="header-text">Logout</span></p>
</template>

<style>
.logout-button{
    cursor: pointer;
    color: black;
}
</style>
