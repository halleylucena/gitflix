<script setup lang="ts">
import { ref } from 'vue';

const emit = defineEmits(['selected'])

const props = defineProps<{
    repo: string
}>()

const handleChange = (event: any) => {
  emit('selected', {
    repo: props.repo,
    selected: event.target.value
  })
}
</script>

<template>
    <select id="sort" @change="handleChange">
        <option value="stars">Sort by stars</option>
        <option value="forks">Sort by forks</option>
        <option value="issues">Sort by help wanted issues</option>
        <option value="updated">Sort by updated</option>
    </select>
</template>

<style>
#sort{
    padding: 4px;
    border-radius: 5px;
}
</style>
