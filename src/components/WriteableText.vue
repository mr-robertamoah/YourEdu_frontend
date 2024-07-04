<template>
    <div 
        class=""
    >
        {{ messages.length ? messages[messageArrayIndex].slice(0, messageIndex) : '' }}
    </div>
</template>

<script setup>
import { ref, watch, watchEffect } from "vue"


const emits = defineEmits(['changed'])

const messageIndex = ref(1)
const messageArrayIndex = ref(0)
const initialCall = ref(false)

const props = defineProps({
    messages: {
        type: Array,
        default: () => ([])
    },
    title: {
        type: String,
        default: ''
    },
    classes: {
        type: String,
        default: ''
    },
    speed: {
        type: Number,
        default: 200
    },
    wait: {
        type: Number,
        default: 4000
    },
})

watchEffect(() => {
    if (!(props.messages.length && messageArrayIndex.value < props.messages.length)) return

    if (initialCall.value) return

    initialCall.value = true

    setTimeout(writeMessage, props.speed)
})
watch(() => messageIndex.value, () => {
    setTimeout(writeMessage, props.speed)
})

function writeMessage() {
    if (messageIndex.value < props.messages[messageArrayIndex.value].length) {
        messageIndex.value += 1
        return
    }

    setTimeout(() => {
        switchCode()
        messageIndex.value = 1
    }, props.wait)
}

function switchCode() {
    if (messageArrayIndex.value + 1 < props.messages.length)
        messageArrayIndex.value += 1
    else
        messageArrayIndex.value = 0

    emits('changed', messageArrayIndex.value)
}
</script>