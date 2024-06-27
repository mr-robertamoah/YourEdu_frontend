<template>
    <div class="w-full flex flex-col sm:flex-row md:flex-col items-start justify-center gap-2
        overflow-x-auto z-10 border-b
        border-mainbrown p-2">
        <home-menu-item
            class=""
            v-for="(item, index) in items"
            :key="index"
            :item="item.text"
            :showItem="item.show"
            :active="item.text === activeItem"
            @clickedItem="clickedItem"
        ></home-menu-item>
    </div>
</template>

<script setup>
import { ref } from 'vue';
import HomeMenuItem from './HomeMenuItem.vue'

const emits = defineEmits(['clickedMenuItem'])
const props = defineProps({
    activeItem: {
        type: String,
        default: ''
    },
})

const items = ref([
    {show: true, icon: false, text:'all'},
    {show: true, icon: false, text:'mine'},
    {show: true, icon: false, text:'followers'},
    {show: true, icon: false, text:'followings'},
    {show: true, icon: false, text:'attachments'},
])

function clickedItem(item) {
    emits('clickedMenuItem', item)
}
</script>

<style lang="scss" scoped>

</style>