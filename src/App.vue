<script setup>
import { onBeforeMount } from "vue";
import { useStore } from "vuex";

const store = useStore()

onBeforeMount(() => {
    getUser()
})

async function getUser() {
    if (!store.getters.getUser)
        await store.dispatch('reloadUser')
}

</script>

<template>
    <router-view></router-view>
    <user-addons></user-addons>
</template>

<style scoped>

</style>
