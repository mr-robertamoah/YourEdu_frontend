<template>
    <fade-right>
        <template #transition>
            <div class="flag-reason-wrapper"
                v-if="show"
                :class="{hasBackground:hasBackground}"
            >
                <div class="reason-top">
                    <span>any reason?</span>
                    <div class="reason-yes"
                        :class="{reasonYes:reasonYes}"
                        @click="clickedReason('yes')"
                    >yes</div>
                    <div class="reason-no"
                        :class="{reasonNo:reasonNo}"
                        @click="clickedReason('no')"
                    >no</div>
                    <div class="action"
                        @click="clickedAction(actionText)"
                        :class="{reasonReady:reasonReady,reasonActive:reasonActive}"
                    >
                        {{actionText}}
                    </div>
                </div>
                <div class="reason-bottom">
                    <fade-left-fast>
                        <template #transition v-if="showInputReason">
                            <main-textarea
                                placeholder="your reason"
                                v-model="inputReason"
                            ></main-textarea>
                        </template>
                    </fade-left-fast>
                </div>
            </div>
        </template>
    </fade-right>
</template>

<script setup>
import { ref, watch } from 'vue';
import MainTextarea from './MainTextarea.vue';
import FadeLeftFast from './transitions/FadeLeftFast.vue';
import FadeRight from './transitions/FadeRight.vue';

const emits = defineEmits(['cancelFlagProcess', 'reasonGiven', 'continueFlagProcess'])

const props = defineProps({
    show: {
        type: Boolean,
        default: true
    },
    hasBackground: {
        type: Boolean,
        default: false
    },
})

const actionText = ref('cancel')
const inputReason = ref('')
const showInputReason = ref(false)
const reasonYes = ref(false)
const reasonNo = ref(false)
const reasonActive = ref(false)
const reasonReady = ref(false)

watch(() => props.show, () => {
    if (!props.show) {
        inputReason.value = ''
        actionText.value = 'cancel'
        showInputReason.value = false
        reasonYes.value = false
        reasonNo.value = false
        reasonActive.value = false
        reasonReady.value = false
    }
})
watch(() => inputReason.value, (value) => {
    if (inputReason.value?.length) {
        actionText.value = 'give'
    } else {
        actionText.value = 'cancel'
    }
})

function clickedAction(data) {
    reasonActive.value = true
    reasonReady.value = false
    if (data === 'cancel') {
        emits('cancelFlagProcess')
    } else if (data === 'give') {
        emits('reasonGiven', inputReason.value)
    }
}

function clickedReason(data) {
    reasonYes.value = false
    reasonNo.value = false
    if (data === 'yes') {
        reasonYes.value = true
        showInputReason.value = true
        reasonReady.value = true
    } else if (data === 'no') {
        reasonNo.value = true
        emits('continueFlagProcess')
    }
}
</script>

<style lang="scss" scoped>

    .flag-reason-wrapper{
        width: 100%;
        margin-top: 5px;
        
        .reason-top{
            display: inline-flex;
            align-items: center;
            font-size: 12px;
            margin-bottom: 5px;

            div{
                font-size: 14px;
                padding: 3px;
                margin-left: 10px;
                cursor: pointer;
                border-radius: 5px;

                &:hover{
                    box-shadow: 0 0 2px;
                    transition: all .5s ease;
                }
            }

            .reasonActive,
            .reasonYes,
            .reasonNo{
                box-shadow: 0 0 2px;
                transition: all .5s ease;
            }

            .reasonYes{
                color: green;
            }

            .reasonReady{
                border-radius: 0;
                border-bottom: 2px solid green;
            }
        }

        .reason-bottom{
            background-color: white;
        }
    }

    .hasBackground{
        background-color: aliceblue;
    }
</style>