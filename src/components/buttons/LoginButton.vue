<script setup lang="ts">
import { useAuth0 } from "@auth0/auth0-vue"

const { loginWithRedirect } = useAuth0()

const handleLogin = () => {
    loginWithRedirect({
        appState: {
            target: "/discovery",
        },
    })
}
</script>

<template>
    <p class="login-button" @click="handleLogin"><span class="header-text">Log In</span></p>
</template>

<style>
.login-button{
    cursor: pointer;
    color: black;
}
</style>
