<template>
    <div
        class="p-1 flex justify-center items-center w-content cursor-pointer min-w-12 border-t-2 transition-all duration-75 border-transparent hover:border-gray-600"
        @click="$emit('clickedItem', item)"
        :class="[active ? 
            'text-mainbrown shadow-sm bg-white rounded font-semibold' : 
            'text-gray-500 hover:text-mainbrown hover:bg-white']"
        v-if="item.length"
    >
        <div class="text-sm md:text-base" v-if="showItem">
            {{item}}
        </div>
        <slot name="icon"></slot>
    </div>
</template>

<script setup>

defineProps({
    item: {
        type: String,
        default: ''
    },
    showItem: {
        type: Boolean,
        default: false
    },
    active: {
        type: Boolean,
        default: false
    },
})
</script>

<style lang="scss" scoped>

</style>