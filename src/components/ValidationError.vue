<template>
    <div class="fixed top-12 transition-all duration-150 w-full left-0 z-[1000]">
        <div class="flex w-[90%] sm:w-[70%] lg:w-[60%] mx-auto p-2 rounded bg-red-600 text-red-200 justify-center items-center relative">
            <div class="w-[90%] mx-auto text-center">
                <div v-if="isString">
                    {{errorString}}
                </div>
                <div v-else v-for="(error,key) in errors" :key="key">
                    <div class="">
                        {{error.toString()}}
                    </div>
                </div>
            </div>
            <div class="cursor-pointer absolute -top-3 -right-3 p-2 rounded-full flex justify-center items-center bg-red-200 text-red-600 w-8 h-8" 
                @click="clearValidation"
            >
                <font-awesome-icon :icon="['fas','times']"></font-awesome-icon>
            </div>
        </div>
    </div>
</template>

<script setup>
import { watchEffect } from 'vue';

const emits = defineEmits(['clearValidation'])

const props = defineProps({
    isString: {
        type: Boolean,
        default: true
    },
    errorString: {
        type: String,
        default: ''
    },
    errors: {
        type: Object,
        default: ()=>{
            return null
        }
    },
})

watchEffect(() => {
    if (props.errors && Object.entries(props.errors).length > 0) {
        disappearSoon()
        return
    }

    if (!props.errorString) return

    disappearSoon()
})

function clearValidation() {
    emits('clearValidation')
}

function disappearSoon(){
    setTimeout(function() {
        emits('clearValidation')
    },5000)
}
</script>

<style lang="scss" scoped>

</style>