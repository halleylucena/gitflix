<script setup lang="ts">
import LoginButton from "./buttons/LoginButton.vue"
import { useAuth0 } from "@auth0/auth0-vue"
import LogoutButton from "./buttons/LogoutButton.vue"
import logo from "../assets/netflix-logo.png"

const { isAuthenticated } = useAuth0()
</script>

<template>
    <div class="container">
        <div class="main-menu">
            <div class="left">
                <RouterLink to="/">
                    <img class="logo" :src="logo" alt="" />
                </RouterLink>
                <RouterLink to="/discovery"><span class="header-text">Discovery</span></RouterLink>
            </div>
            <div class="right">
                <ul>
                    <li><RouterLink to="/user"><span class="header-text">Username</span></RouterLink></li>
                    <li>
                        <template v-if="!isAuthenticated">
                            <LoginButton />
                        </template>
                        <template v-if="isAuthenticated">
                            <LogoutButton />
                        </template>
                    </li>
                </ul>
            </div>
        </div>
    </div>
</template>

<style scoped>
.container {
    display: flex;
    flex-direction: column;
    background-color: #141414;
    width: 100vw;
    border-bottom: 1px solid rgb(80, 80, 80);
}
.main-menu {
    display: flex;
    flex-direction: row;
    height: 60px;
    width: 100%;
    justify-content: space-between;
    padding: 12px;
    max-width: 1200px;
    align-self: center;
    color: #fff;
}

.left {
    display: flex;
    flex-direction: row;
    align-items: center;
    gap: 20px;
    color: #fff;
}

.header-text{
    color: #fff;
}

.logo {
    height: 32px;
}

.right {
    display: flex;
    align-items: center;
    
}
.right ul {
    display: flex;
    flex-direction: row;
    list-style: none;
    gap: 30px;
}
</style>
