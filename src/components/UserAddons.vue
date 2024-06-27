<template>
    <div class="user-addons-wrapper" 
        :class="{userAddonWidth: showItems}"
        v-if="computedUser"
    >
        <div class="addon-button" @click="clickedButton">
            <font-awesome-icon :icon="['fa','ellipsis-v']"></font-awesome-icon>
        </div>
        <fade-right>
            <template #transition v-if="showItems">
                <div class="main-addons-section" v-if="showItems">
                    <div class="addon-section-item"
                        :class="{itemActive: itemText === 'chat'}"
                        @click="itemText = 'chat'"
                    >chat</div>
                    <div class="addon-section-item"
                        :class="{itemActive: itemText === 'flags'}"
                        @click="itemText = 'flags'"
                    >flags</div>
                    <div class="addon-section-item"
                        :class="{itemActive: itemText === 'saves'}"
                        @click="itemText = 'saves'"
                    >saves</div>
                </div>
            </template>
        </fade-right>

        <just-fade>
            <template #transition v-if="showItems && showChatModal">
                <chat-modal
                    @clickedClose="clickedClose"
                ></chat-modal>
            </template>
        </just-fade>
        <just-fade>
            <template #transition v-if="showItems && showFlaggedModal">
                <flag-modal
                    :show="showFlaggedModal"
                    @clickedClose="clickedClose"
                ></flag-modal>
            </template>
        </just-fade>
        <just-fade>
            <template #transition v-if="showItems && showSavedModal">
                <save-modal
                    :show="showSavedModal"
                    @clickedClose="clickedClose"
                ></save-modal>
            </template>
        </just-fade>
    </div>
</template>

<script setup>
import JustFade from './transitions/JustFade.vue';
import FadeRight from './transitions/FadeRight.vue';
import FlagModal from './FlagModal.vue';
import ChatModal from './ChatModal.vue';
import SaveModal from './SaveModal.vue';
import { mapGetters, useStore } from 'vuex'
import { computed, ref, watch } from 'vue';

const store = useStore()

const showItems = ref(false)
const showFlaggedModal = ref(false)
const showSavedModal = ref(false)
const showChatModal = ref(false)
const itemText = ref('')

const computedUser = computed(() => {
    return store.getters.getUser && store.getters.getProfiles ? true : false
})

watch(() => itemText.value, (newValue) => {
    if (newValue === 'chat') {
        showChatModal.value = true
        showFlaggedModal.value = false
        showSavedModal.value = false
    } else if (newValue === 'flags') {
        showChatModal.value = false
        showFlaggedModal.value = true
        showSavedModal.value = false
    } else if (newValue === 'saves') {
        showChatModal.value = false
        showFlaggedModal.value = false
        showSavedModal.value = true
    }
})


function clickedButton() {
    console.log(showItems.value, 'showing');
    showItems.value = !showItems.value
}
function clickedClose(data) {
    console.log();
    if (data === 'saves') {
        showSavedModal.value = false
    } else if (data === 'flags') {
        showFlaggedModal.value = false
    } else if (data === 'chat') {
        showChatModal.value = false
    }
    itemText.value = ''
}
</script>

<style lang="scss" scoped>

    .user-addons-wrapper{
        position: fixed;
        bottom: 0;
        right: 0;
        z-index: 100000;
        display: inline-flex;
        justify-content: flex-end;
        align-items: center;
        flex-wrap: nowrap;
        flex-direction: row-reverse;
        background: aliceblue;
        box-shadow: 0 0 3px grey;
        border-radius: 10px 0 0;
        
        .addon-button{
            font-size: 16px;
            font-weight: 500;
            color: gray;
            padding: 10px;
            text-align: center;
            cursor: pointer;
        }

        .main-addons-section{
            width: 100%;
            display: inline-flex;
            
            .addon-section-item{
                width: 30%;
                text-align: center;
                font-weight: 700;
                color: gray;
                padding: 5px;
                border-right: 2px solid gray;
                cursor: pointer;
                font-size: 12px;
                margin: 0 10px 0 0;

                &:hover{
                    box-shadow: 0 1px gray;
                    transition: all .5s ease;
                }                
            }

            .itemActive{
                box-shadow: 0 1px gray;
                transition: all .5s ease;
            }
        }
    }

    .userAddonWidth{
        width: 40%;
    }

@media screen and (max-width: 800px) {

    .userAddonWidth{
        width: 70%;
    }
}

@media screen and (max-width: 500px) {

    .userAddonWidth{
        width: 100%;
    }
}
</style>