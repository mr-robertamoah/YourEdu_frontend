<script setup>
import { onBeforeMount } from "vue";
import { useStore } from "vuex";
import ApiService from "./services/api.service";

const store = useStore()

onBeforeMount(() => {
    
    ApiService.init(`${import.meta.env.VITE_APP_URL}`)
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
