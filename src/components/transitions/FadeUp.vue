<template>
    <transition name='fade-up'>
        <slot name="transition" mode="out-in"></slot>
    </transition>
</template>

<script>
    export default {
        
    }
</script>

<style lang="scss" scoped>

    .fade-up-leave-to{
        transform: translateY(200px);
        opacity: 0;
    }
    
    .fade-up-enter{
        transform: translateY(200px);
        opacity: 0;
    }

    .fade-up-enter-active,
    .fade-up-leave-active{
        transition: all .5s ease;
    }
</style>