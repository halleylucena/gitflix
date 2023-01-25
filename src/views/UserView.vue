<script setup lang="ts">
import { useAuth0 } from "@auth0/auth0-vue"

const { user, isAuthenticated } = useAuth0()
</script>

<template>
    <main class="main-container">
        <div>
            <h2>User Profile</h2>

            <pre v-if="isAuthenticated">
                <code>{{ user }}</code>
            </pre>
        </div>
    </main>
</template>
