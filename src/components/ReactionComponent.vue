<template>
    <div 
        class="reaction-component w-full z-10"
        :class="[classes]"
    >
        <div class="reaction"
            @dblclick.self="clickedViewComments"
        >
            <template
                v-if="! showOnlyProfiles"
            >
                <post-button 
                    :class="{'z-40': computedIsAdult}"
                    :titleText="flagData.flagTitle"
                    v-if="!isOwner"
                    @click="clickedFlag"
                    :postButtonClass="flagData.flagRed"
                >
                    <template #icon>
                        <font-awesome-icon
                            :icon="['fa','flag']"
                        ></font-awesome-icon>
                    </template>
                </post-button>
                <div class="reason">
                    <flag-reason
                        :show="showFlagReason"
                        :hasBackground="true"
                        @continueFlagProcess="continueFlagProcess"
                        @reasonGiven="reasonGiven"
                        @cancelFlagProcess="cancelFlagProcess"
                    ></flag-reason>
                </div>
            </template>
            <div class="like"
                v-if="! showOnlyProfiles"
            >
                <number-of>
                    {{computedLikesText}}
                </number-of>
                <div class="comment-number" 
                    v-if="commentCountData"
                    @click="clickedViewComments"
                    :title="commentCountData.title"
                >
                    {{`${commentCountData.count}`}} <font-awesome-icon
                        :icon="['fa','comment-alt']"
                    ></font-awesome-icon>
                </div>
                <div class="others">
                    <div class="like-post"
                        @click="clickedLike"
                        :class="{liked:likeData.isLiked}"
                        :title="likeData.likeTitle"
                    >
                        <font-awesome-icon
                            :icon="['fa','thumbs-up']"
                        ></font-awesome-icon>
                    </div>
                    <div class="comment"
                        title="add a comment"
                        @click="clickedAddComment"
                        v-if="!showAddComment"
                    >
                        <font-awesome-icon
                            :icon="['fa','comment']"
                        ></font-awesome-icon>
                    </div>
                </div>
            </div>
            <div class="profiles left-1/2 -ml-1/4 absolute"
                v-if="showProfiles"
            >
                <span class="mx-1">
                    {{showProfilesText}}
                </span>
                <div :key="key" v-for="(profile,key) in profiles">
                    <profile-bar
                        :smallType="true"
                        :profile="profile"
                        :navigate="false"
                        @clickedProfile="clickedProfile"
                    ></profile-bar>
                </div>
            </div>
        </div>
        <div 
            class="add-comment"
            v-if="! showOnlyProfiles"
        >
            <add-comment
                :what="item"
                :onPostModal="full"
                :showAddComment="showAddComment"
                :schoolAdmin="schoolAdmin"
                :editableData="editableComment"
                :account="commentingAccount"
                :edit="editComment"
                @hideAddComment="hideAddComment"
                @postAddComplete="postAddComplete"
                @postModalCommentCreated="postModalCommentCreated"
                @postModalCommentEdited="postModalCommentEdited"
            ></add-comment>
        </div>
        <div 
            class="comment-section"
            @dblclick.self="clickedShowPostComments"
            v-if="! showOnlyProfiles"
        >
            <template v-if="!full && comments">
                <comment-single
                    v-for="comment in comments"
                    :key="comment.id" 
                    :comment="comment"
                    :simple="true"
                    @askLoginRegister="askLoginRegister"
                    @clickedMedia="clickedMedia"
                    @clickedShowPostComments="clickedShowPostComments"
                ></comment-single>
            </template>
        </div>
    </div>
</template>

<script setup>
import AddComment from './AddComment.vue';
import FlagReason from './FlagReason.vue';
import PostButton from './PostButton.vue';
import NumberOf from './NumberOf.vue';
import ProfileBar from './profile/ProfileBar.vue';
import { useStore } from 'vuex';
import { computed } from 'vue';

const store = useStore()

const emits = defineEmits([
    'clickedShowPostComments', 'clickedShowPostComments', 'clickedMedia', 'askLoginRegister', 
    'postModalCommentCreated', 'postAddComplete', 'hideAddComment', 'clickedProfile', 
    'clickedAddComment', 'clickedLike', 'cancelFlagProcess', 'reasonGiven', 'continueFlagProcess',
    'clickedFlag', 'postModalCommentEdited'
])

const props = defineProps({
    item: {
        type: Object,
        default() {
            return null
        }
    },
    flagData: {
        type: Object,
        default() {
            return null
        }
    },
    likeData: {
        type: Object,
        default() {
            return null
        }
    },
    profiles: {
        type: Array,
        default() {
            return []
        }
    },
    comments: {
        type: Array,
        default() {
            return []
        }
    },
    full: {
        type: Boolean,
        default: false
    },
    showProfiles: {
        type: Boolean,
        default: false
    },
    showOnlyProfiles: {
        type: Boolean,
        default: false
    },
    classes: {
        type: String,
        default: ''
    },
    showProfilesText: {
        type: String,
        default: ''
    },
    editComment: {
        type: Boolean,
        default: false
    },
    showAddComment: {
        type: Boolean,
        default: false
    },
    showFlagReason: {
        type: Boolean,
        default: false
    },
    isOwner: {
        type: Boolean,
        default: false
    },
    schoolAdmin: {
        type: Object,
        default(){
            return null
        },
    },
    editableComment: {
        type: Object,
        default(){
            return null
        },
    },
    commentingAccount: {
        type: Object,
        default(){
            return null
        },
    },
    commentCountData: {
        type: Object,
        default(){
            return null
        },
    },
})

const computedLikesText = computed(() => {
    if (!props.likeData?.likes) return `0 likes`

    return props.likeData.likes === 1 ? `${props.likeData.likes} like` : `${this.likeData.likes} likes`
})
const computedIsAdult = computed(() => {
    return store.getters.isAdult
})

function clickedViewComments() {
    emits('clickedShowPostComments', props.editableComment)
}

function clickedShowPostComments(data) {
    emits('clickedShowPostComments', data)
}

function clickedMedia(data) {
    emits('clickedMedia', data)
}

function askLoginRegister(data) {
    emits('askLoginRegister', data)
}

function postModalCommentCreated(data) {
    emits('postModalCommentCreated', data)
}

function postAddComplete(data) {
    emits('postAddComplete', data)
}

function hideAddComment(data) {
    emits('hideAddComment', data)
}

function clickedProfile(data) {
    emits('clickedProfile', data)
}

function clickedAddComment(data) {
    emits('clickedAddComment', data)
}

function clickedLike(data) {
    emits('clickedLike', data)
}

function cancelFlagProcess(data) {
    emits('cancelFlagProcess', data)
}

function reasonGiven(data) {
    emits('reasonGiven', data)
}

function continueFlagProcess(data) {
    emits('continueFlagProcess', data)
}

function clickedFlag(data) {
    emits('clickedFlag', data)
}

function postModalCommentEdited(comment){
    emits('postModalCommentEdited', comment)
}
</script>

<style lang="scss" scoped>
    

    .reaction-component{
        padding-top: 5px;

        .reaction{
            display: flex;
            justify-content: space-between;
            align-items: center; 
            position: relative;

            .reason{
                position: absolute;
                top: 100%;
                z-index: 3;
            }

            .profiles{
                width: 200px;
                z-index: 1000;
                text-align: start;

                span{
                    font-size: 12px;
                    font-weight: 500;
                }
            }

            .like{
                display: inline-flex;
                align-items: center;
                justify-content: space-between;
                width: 50%;  
                margin-left: auto;

                .others{
                    display: inline-flex;
                    justify-content: flex-end;
                    align-items: center;
                    position: relative;

                    .like-post{
                        margin-right: 10px;
                        padding: 5px;
                        font-size: 16px;
                        cursor: pointer;
                    }

                    .liked{
                        color: green;
                    }

                    .comment{
                        cursor: pointer;
                        font-size: 16px;
                    }
                }

                .comment-number{
                    font-size: 12px;
                    padding: 5px;
                    cursor: pointer;
                    background-color: whitesmoke;
                    border-radius: 10%;
                }
            }
        }

        .add-comment{
            width: 75%;
            position: relative;
            margin: 10px 0 0 auto;
        }

        .comment-section{
            width: 85%;
            margin: 5px 0 0 auto;
        }
    }
</style>