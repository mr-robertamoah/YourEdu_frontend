<template>
    <transition name="main-alert">
        <div class="main-alert-wrapper"
            :class="{messageText:computedIsMessageAndHasText}"
        >
            <div class="close" @click="clickedRemoveAlert">
                <font-awesome-icon :icon="['fa','times']"></font-awesome-icon>
            </div>
            <div class="name" v-if="computedMessageAccount">
                {{account.name}}
            </div>
            <div class="section">
                <profile-picture 
                    class="profile-picture"
                    v-if="computedMessageAccount"
                >
                    <template #image>
                        <img :src="account.url">
                    </template>
                </profile-picture>
                <div class="message" v-if="computedIsMessageAndHasText">
                    {{text}}
                </div>
            </div>
            <discussion-badge
                v-if="isMessage && !text.length"
                :message="message"
                :alert="true"
            ></discussion-badge>
            <account-badge
                v-if="isAccount"
                :alert="true"
                :account="account"
                class="account-badge"
            ></account-badge>
        </div>
    </transition>
</template>

<script setup>
import { computed, watch, watchEffect } from 'vue';
import AccountBadge from '../dashboard/AccountBadge.vue';
import DiscussionBadge from '../DiscussionBadge.vue';
import ProfilePicture from "../profile/ProfilePicture.vue"
    
const emits = defineEmits(['removeAlert'])
const props = defineProps({
    account: {
        type: Object,
        default(){
            return {}
        }
    },
    message: {
        type: Object,
        default(){
            return {}
        }
    },
    isAccount: {
        type: Boolean,
        default: false
    },
    isMessage: {
        type: Boolean,
        default: false
    },
    show: {
        type: Boolean,
        default: false
    },
    text: {
        type: String,
        default: ''
    },
    id: {
        type: Number,
        default: 0
    }
})

watch(() => props.show, () => {
    if (props.show) {
        setTimeout(() => {
            removeAlert()
        }, 4000);
    }
})

const computedMessageAccount = computed(() => {
    return isMessage.value && account.value
})
const computedIsMessageAndHasText = computed(() => {
    return text.value.length && isMessage.value
})

function clickedRemoveAlert() {
    removeAlert()
}
function removeAlert() {
    emits('removeAlert', props.id)
}
</script>

<style lang="scss" scoped>

    .main-alert-enter{
        transform: translateX(100px);
        width: 0;
    }

    .main-alert-leave-to{
        transform: translateX(100px);
        width: 0;
    }
    
    .main-alert-enter-active,
    .main-alert-leave-active{
        transition: all 1s ease-out;
    }

    .main-alert-wrapper{
        width: 100%;
        position: relative;

        .name{
            @include small-msg;
            text-align: left;
            font-size: 12px;
            font-weight: bold;
        }

        .section{
            display: flex;
            align-items: flex-start;
            flex-wrap: nowrap;
            width: 100%;

            .profile-picture{
                min-width: 30px;
                width: 30px;
                height: 30px;
                margin-right: 5px;
            }
        }

        .close{
            position: absolute;
            z-index: 1;
            top: 5px;
            right: 5px;
            padding: 5px;
            font-size: 14px;
            cursor: pointer;
            color: gray;
            border-radius: 10px;
            background: white;

            &:hover{
                color: red;
                transition: color .5s ease;
            }
        }

    }

    .messageText{
        border-radius: 10px;
        box-shadow: 0 0 2px gray;
        background: rgb(240,248,255);
        padding: 10px;

        .message{
            width: 100%;
            text-align: center;
            font-size: 12px;
            color: gray;
        }
    }
</style>