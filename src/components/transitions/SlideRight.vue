<template>
    <transition tag="div" name='slide-right' appear>
        <slot name="transition"></slot>
    </transition>
</template>

<script>
    export default {
        
    }
</script>

<style lang="scss" scoped>

    .slide-right-leave-to{
        opacity: 0;
        transform: translateX(20px);
    }
    
    .slide-right-enter{
        opacity: 0;
        transform: translateX(30px);
    }

    .slide-right-enter-active,
    .slide-right-leave-active {
        transition: all .5s ease;
    }
</style>