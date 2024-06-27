<template>
    <div class="post-single-wrapper"
        @dblclick.self="clickedShowPostComments"
    >
        <div class="absolute top-0 left-0 w-[10%] h-1 bg-gradient-to-r from-youredubrown to-youredugreen"></div>
        <div class="absolute top-0 left-0 w-1 h-[10%] bg-gradient-to-r from-youredubrown to-youredugreen"></div>

        <div class="absolute top-0 right-0 w-[10%] h-1 bg-gradient-to-r from-youredubrown to-youredugreen"></div>
        <div class="absolute top-0 right-0 w-1 h-[10%] bg-gradient-to-r from-youredubrown to-youredugreen"></div>

        <div class="absolute bottom-0 right-0 w-[10%] h-1 bg-gradient-to-r from-youredubrown to-youredugreen"></div>
        <div class="absolute bottom-0 right-0 w-1 h-[10%] bg-gradient-to-r from-youredubrown to-youredugreen"></div>

        <div class="absolute bottom-0 right-0 w-full h-1 bg-gradient-to-r from-youredubrown to-youredugreen"></div>

        <div class="absolute bottom-0 left-0 w-[10%] h-1 bg-gradient-to-r from-youredubrown to-youredugreen"></div>
        <div class="absolute bottom-0 left-0 w-1 h-[10%] bg-gradient-to-r from-youredubrown to-youredugreen"></div>
        <div class="loading" v-if="loading">
            <pulse-loader :loading="loading" :size="'10px'"></pulse-loader>
        </div>
        <div class="alert">
            <auto-alert
                :message="alertData.message"
                :success="alertData.success"
                :danger="alertData.danger"
                :sticky="true"
                @hideAlert="clearAlert"
            ></auto-alert>
        </div>
        <div class="edit absolute top-2 right-2"
            @click="clickedEditIcon"
            v-if="computedProfiles.length"
        >
            <font-awesome-icon
                :icon="['fa','chevron-down']"
            ></font-awesome-icon>
        </div>
        <div class="options" v-if="showOptions">
            <optional-actions
                :show="showOptions"
                :hasSave="!computedIsOwner"
                :isSaved="saveData.isSaved"
                :hasEdit="computedIsOwner"
                :hasAttachment="computedProfiles.length ? true : false"
                :hasDelete="computedIsOwner"
                @clickedOption="clickedOption"
            ></optional-actions>
        </div>
        <div class="post-attachment" 
            v-if="attachmentData.showAttach && !computedLesson"
            @click.self="attachmentData.showAttach = false"
        >
            <post-attachment
                :show="attachmentData.showAttach"
                :isAttached="attachmentData.isAttached"
                :attachmentsNumber="attachmentData.postAttachments.length"
                :attachments="attachmentData.myAttachments"
                @itemClicked="attachmentClicked"
                @clickedUnattach="clickedUnattach"
            ></post-attachment>
        </div>
        <div class="top"
            @dblclick="clickedShowPostComments"
        >
            <div class="name"
                @click="clickedProfilePicture"
            >
                {{computedName}}
            </div>
            <div class="created">
                {{computedCreated}}
            </div>
        </div>
        <div class="body" 
            v-if="!computedLesson"
            @dblclick="clickedShowPostComments"
        >
            <div class="creator">
                <profile-picture>
                    <template #image>
                        <img :src="computedUrl">
                    </template>
                </profile-picture>
            </div>
            <div class="other">
                <div class="post-media" 
                    v-if="computedImageUrl.length"
                    :class="{postMediaFull:postMediaFull}"
                    @click="clickedPostMedia(computedImageUrl,'image')"
                >
                    <img :src="computedImageUrl">
                </div>
                <div class="post-media" 
                    v-if="computedAudioUrl.length"
                    :class="{postMediaFull:postMediaFull}"
                    @click="clickedPostMedia(computedAudioUrl,'audio')"
                >
                    <audio :src="computedAudioUrl" controls controlslist="nodownload">
                    </audio>
                </div>
                <div class="post-media" 
                    v-if="computedVideoUrl.length"
                    :class="{postMediaFull:postMediaFull}"
                    @click="clickedPostMedia(computedVideoUrl,'video')"
                >
                    <video :src="computedVideoUrl" controls controlslist="nodownload">
                    </video>
                </div>
                <div class="text-short"
                    @click="clickedShowPostComments">
                    <slot name="text"></slot>
                    <main-textarea
                        :disabled="true"
                        v-model="computedContent"
                    >
                    </main-textarea>
                    <div
                        v-if="computedShowMore"
                    >see more</div>
                </div>
            </div>
        </div>
        <template v-if="computedType && !computedLesson">
            <post-preview
                :type="computedType"
                :typeName="computedTypeName"
                :typeMediaFull="postMediaFull"
                @clickedMedia="clickedMedia"
                @clickedShowPostPreview="clickedShowPostPreview"
                :post="post"
            ></post-preview>
        </template>
        <template v-if="computedType && computedLesson">
            <lesson-preview
                :lesson="computedType"
                :profileUrl="post.addedby.url"
                :full="postMediaFull"
                @clickedMedia="clickedMedia"
                :post="post"
            ></lesson-preview>
        </template>
        <div class="bottom">
            <reaction-component
                :comments="computedComments"
                :item="computedItem"
                :isOwner="computedIsOwner"
                :full="postMediaFull"
                :showAddComment="showAddComment"
                :showFlagReason="flagData.showReason"
                :flagData="flagData"
                :likeData="likeData"
                :classes="computedClasses"
                :showProfilesText="profilesData.text"
                :showOnlyProfiles="computedClasses.length ? true : false"
                :showProfiles="profilesData.show"
                :profiles="computedProfiles"
                @hideAddComment="showAddComment = false"
                @postAddComplete="postAddComplete"
                @askLoginRegister="askLoginRegister"
                @clickedMedia="clickedMedia"
                @clickedProfile="clickedProfile"
                @clickedLike="() => clickedLike({owner: {...computedOwner}, schoolAdmin, emits: $emit, disabled, banned: false})"
                @clickedAddComment="clickedAddComment"
                @cancelFlagProcess="cancelFlagProcess"
                @reasonGiven="reasonGiven"
                @clickedFlag="() => clickedFlag({schoolAdmin, emits: $emit, disabled, banned: false})"
                @continueFlagProcess="continueFlagProcess"
                @clickedShowPostComments="clickedShowPostComments"
                @postModalCommentCreated="postModalCommentCreated"
            ></reaction-component>
        </div>
        <div class="attachments-section">
            <attachment-badge 
                v-for="(attachment,index) in attachmentData.postAttachments"
                :key="index"
                :hasClose="false"
                :attachment="attachment.data"
                :type="attachment.type"
            ></attachment-badge>
        </div>
        <just-fade>
            <template #transition v-if="showEdit">
                <create-post
                    :edit="showEdit"
                    :editableData="post"
                    :showForm="showEdit"
                    :loading="createPostLoading"
                    :type="post.typeName"
                    @clickedEdit="clickedEdit"
                    @mainModalDisappear="showEdit=false"
                ></create-post>
            </template>
        </just-fade>
        <fade-up>
            <template #transition v-if="modalData.show && modalData.type == 'small modal'">
                <small-modal
                    :title="modalData.message"
                    :show="modalData.show"
                    :message="alertData.message"
                    :success="alertData.success"
                    :danger="alertData.danger"
                    :loading="loading"
                    :alerting="modalData.alerting"
                    @disappear="modalData.show = false"
                >
                    <template #actions>
                        <post-button
                            buttonText="ok"
                            @click="clickedInfoOk"
                            v-if="modalData.info"
                        ></post-button>
                        <post-button
                            buttonText="yes"
                            @click="clickedYes"
                            v-if="modalData.delete"
                        ></post-button>
                        <post-button
                            buttonText="no"
                            @click="clickedNo"
                            v-if="modalData.Delete "
                        ></post-button>
                    </template>
                </small-modal>
            </template>
        </fade-up>
    </div>
</template>

<script setup>
import ProfilePicture from './profile/ProfilePicture.vue'
import PostButton from './PostButton.vue'
import MainTextarea from './MainTextarea.vue'
import PostPreview from './PostPreview.vue'
import PostAttachment from './PostAttachment.vue'
import AttachmentBadge from './AttachmentBadge.vue'
import LessonPreview from './LessonPreview.vue'
import CreatePost from './forms/CreatePost.vue'
import OptionalActions from './OptionalActions.vue'
import FadeUp from './transitions/FadeUp.vue'
import JustFade from './transitions/JustFade.vue'
import AutoAlert from './AutoAlert.vue'
import {dates, strings, files} from '../services/helpers'
import { useStore } from 'vuex'
import { useRoute, useRouter } from 'vue-router'
import { ref, watch, computed, watchEffect, onMounted } from 'vue'
import useProfiles from '../composables/useProfiles'
import useAlert from '../composables/useAlert'
import useAttachments from '../composables/useAttachments'
import useModal from '../composables/useModal'
import useComments from '../composables/useComments'
import useSaves from '../composables/useSaves'
import useLikes from '../composables/useLikes'
import useFlags from '../composables/useFlags'
import useParticipations from '../composables/useParticipations'

const { profilesAppear, clearProfilesData, profilesData, computedProfiles } = useProfiles()
const { attachmentData, attach, listenForAttachments, setMyAttachment } = useAttachments()
const { alertData, clearAlert } = useAlert()
const { 
    modalData, closeModal, showModal, clearSmallModal, issueCustomMessage, issueSmallModalInfoMessage,
    issueSmallModalDeletionMessage
} = useModal()
const route = useRoute()
const router = useRouter()
const store = useStore()
const emits = defineEmits([
    'clickedShowPostPreview', 'postModalCommentCreated', 'clickedMedia', 'clickedShowPostComments',
    'askLoginRegister', 'saveSuccessful', 'unsaveSuccessful', 'unlikeSuccessful', 'likeSuccessful',
    'flaggedSuccessful', 'unflaggedSuccessful'
])
const props = defineProps({
    post: {
        type: Object,
        default(){
            return {}
        },
    },
    postMediaFull: { //true means its on the post modal
        type: Boolean,
        default: false
    },
    disabled: { //when being viewed by admin as an activity
        type: Boolean,
        default: false
    },
    schoolAdmin: {
        type: Object,
        default(){
            return null
        },
    },
})
const { showAddComment, computedComments, listenForComments } = useComments({
    itemId: props.post?.id,
    comments: props.post?.comments,
    item: 'post'
})
const { saveData, save, setMySave, clickedSave, listenForSaves } = useSaves({
    itemId: props.post?.id,
    saves: props.post?.saves,
    item: 'post'
})
const { likeData, clickedLike, like, listenForLikes, setMyLike } = useLikes({
    itemId: props.post?.id,
    likes: props.post?.likes,
    item: 'post'
})
const {  } = useParticipations({
    itemId: props.post?.id,
    main: props.post,
    item: 'post'
})
const { 
    flagData, clickedFlag, flag, continueFlagProcess, setMyFlag, listenForFlags, 
    cancelFlagProcess, reasonGiven, 
} = useFlags({
    itemId: props.post?.id,
    flags: props.post?.flags,
    item: 'post'
})

const showOptions = ref(false)
const listening = ref(false)
const showEdit = ref(false)
const profile = ref(null)
const loading = ref(false)
const createPostLoading = ref(false)
const commentSuccess = ref(false)
const commentFail = ref(false)

watchEffect(() => {
    if (props.post?.saves?.length) {
        
        data.value.saves = props.post?.saves.length
    }

    if (props.post?.likes?.length) {
        
        data.value.likes = props.post?.likes.length
    }
})

onMounted(() => {
    setMyFlag()
    setMyLike()
    setMySave()
    setMyAttachment()
    listen()
    listenForComments()
    listenForLikes()
    listenForFlags()
    listenForSaves()
    listenForAttachments({item: 'post', itemId: props.post?.id})
})

const computedIsOwner = computed(() => {
    return props.post.addedby.userId === store.getters.getUser?.id
})
const computedClasses = computed(() =>{
    let classes = ''

    if (
        profilesData.value.action === 'save' || 
        profilesData.value.action === 'attach'
    ) {
        classes += 'absolute top-5 left-2/3 -ml-1/4 top-10 max-w-content'
    }
    
    // if (this.steps === 0) {
    //     classes += ' bottom-8'
    // }

    return classes
})
const computedOwner = computed(() =>{
    if (!computedProfiles.value?.length) {
        return null
    }
        
    let index =  computedProfiles.findIndex(profile=>{
        return props.post.addedby.accountId === profile.accountId && 
            props.post.addedby.account === profile.account
    })

    if (index > -1) {
        return computedProfiles.value[index]
    }
    
    return null
})
const computedLesson = computed(() =>{
    return props.post.typeName === 'lesson' ? true : false
})
const computedFileUrl = computed(() =>{

})
const computedImageUrl = computed(() =>{
    return props.post && props.post.images ? props.post.images[0].url : ''
})
const computedVideoUrl = computed(() =>{
    return props.post && props.post.videos ? props.post.videos[0].url : ''
})
const computedAudioUrl = computed(() =>{
    return props.post && props.post.audios ? props.post.audios[0].url : ''
})
const computedType = computed(() =>{
    return props.post && props.post.type ?
        props.post.type[0] : null
})
const computedTypeName = computed(() =>{
    return props.post && props.post.typeName ?
        props.post.typeName : null
})
const computedUrl = computed(() =>{
    return props.post && props.post.hasOwnProperty('addedby') ?
        props.post.addedby.url : ''
})
const computedContent = computed(() => {
    return props.post && props.post.hasOwnProperty('content') ? 
        strings.trim(props.post.content,100) : null
})
const computedName = computed(() =>{
    return props.post && props.post.hasOwnProperty('addedby') ?
        props.post.addedby.name : ''
})
const computedCreated = computed(() =>{
    return props.post ? dates.createdAt(props.post.created_at) : ''
})
const computedShowMore = computed(() =>{
    return props.post && props.post.hasOwnProperty('content') &&
        props.post.content && props.post.content.length > 200 ? true : false
})
const computedItem = computed(() =>{
    return {
        item: 'post',
        itemId: props.post.id,
        postType: props.post.typeName
    }
})
const computedItemable = computed(() => {
    return props.post
})
const computedPostOwnerAccount = computed(() =>{
    let postOwner = props.post ? {
        account: props.post.addedby.account,
        accountId: `${props.post.addedby.accountId}`
    } : {}

    return postOwner
})

watch(() => computedItemable.value, (newValue) => {
    if (newValue) {
        setMyFlag()
    }
})

function listen() {
    if (listening.value) return

    listening.value = true
    Echo.channel(`youredu.post.${props.post.id}`)
        .listen('.updatePost', data=>{
            store.dispatch(`${route.name}/replacePost`, data.post)
        })
        .listen('.deletePost', data=>{
            store.dispatch(`${route.name}/removePost`, data)
        })
}

function clickedShowPostPreview(data) {
    emits('clickedShowPostPreview', data)
}

function clickedEditIcon() {
    if (props.disabled) {
        return
    }
    showOptions.value = !showOptions.value
    attachmentData.value.showAttach = false
}

function clickedMedia(data){
    emits('clickedMedia',data)
}

function clickedPostMedia(url,mediaType){
    clickedMedia({url,mediaType})
}

function postModalCommentCreated(data){
    if (props.postMediaFull) {
        emits('postModalCommentCreated',data)
    }
}

function clickedShowPostComments(){
    emits('clickedShowPostComments',{post: this.post,type:'post'})
}

function clickedProfilePicture(){
    if (route.name !== 'profile' &&
        computedPostOwnerAccount.value) {
        router.push({
            name: 'profile',
            params: {
                account: computedPostOwnerAccount.value.account,
                accountId: computedPostOwnerAccount.value.accountId,
            }
        })

        return
    } 
    
    if (!computedPostOwnerAccount.value) return

    if (
        route.params.account == computedPostOwnerAccount.value.account &&
        route.params.accountId == computedPostOwnerAccount.value.accountId
    ) return

    router.push({
        name: 'profile',
        params: {
            account: computedPostOwnerAccount.value.account,
            accountId: computedPostOwnerAccount.value.accountId,
        }
    })
    
}

function askLoginRegister(){
    emits('askLoginRegister','post')
}

function clickedInfoOk(){
    showModal('small modal')
}

function clickedAddComment(){
    if (props.disabled) {
        return
    }

    if (!store.getters.getUser) {
        askLoginRegister()
        return
    }

    if (!computedProfiles.value?.length) {
        issueSmallModalInfoMessage({message: 'you must have an account (eg. learner, parent, etc) before you can comment.'})
        
        clearSmallModal(false)
        return
    }

    showAddComment.value = true
}

function postAddComplete(data){
    if (data === 'successful') {
        showAddComment.value = false
        commentSuccess.value = true
        setTimeout(() => {
            commentSuccess.value = false
        }, 2000);
    } else {
        commentFail.value = true
        setTimeout(() => {
            commentFail.value = false
        }, 2000);
    }
}

async function clickedProfile(who){
    profilesData.value.show = false

    if (profilesData.value.action === 'like') {
        loading.value = true
        await like({who, schoolAdmin: props.schoolAdmin, emits, owner: {...computedOwner.value}})
        loading.value = false
        return
    }

    if (profilesData.value.action === 'save') {
        loading.value = true
        await save({who, schoolAdmin: props.schoolAdmin, emits})
        loading.value = false
        return
    }

    if (profilesData.value.action === 'flag') {
        issueCustomMessage({
            type: 'delete',
            message: 'are you sure you want to flag this?',
            data: who
        })
        return
    }

    if (profilesData.value.action === 'attach'){
        loading.value = true
        attach(who)
        loading.value = false
    }
}

async function clickedEdit(data){
    let otherData = {},
        formData = new FormData
    createPostLoading.value = true

    if (data.hasOwnProperty('contentFile') && data.contentFile) {
        formData.append('file', data.contentFile)  
    } else {
        console.log('enters',data)
        if (data.type !== '' && data.type !== null) {
            formData.append('type', props.post.typeName)
            formData.append('typeId', props.post.type[0].id)
        }
        
        if (data.type === 'book') {
            formData.append('title', data.title)
            formData.append('authorNames', data.author)
            formData.append('about', data.about)
            formData.append('published', data.published)
        } else if (data.type === 'poem') {
            formData.append('title', data.title)
            formData.append('authorNames', data.author)
            formData.append('about', data.about)
            formData.append('sections', JSON.stringify(data.sections))
            formData.append('published', data.published)
        } else if (data.type === 'riddle') {
            formData.append('authorNames', data.author)
            formData.append('body', data.body)
            formData.append('published', data.published)
        } else if (data.type === 'question') {
            formData.append('body', data.body)
            formData.append('published', data.published)
        } else if (data.type === 'activity') {
            formData.append('description', data.description)
            formData.append('published', data.published)
        }

        if (data && data.file &&
            data.file.length > 0) {
            formData.append('typeFiles', data.file[0])
            formData.append('typeFilesType', files.fileType(data.file[0]))
        }
    }
    formData.append('content', data.content)
    formData.append('account', computedOwner.value.account)
    formData.append('accountId', computedOwner.value.accountId)
    formData.append('postId',props.post.id)

    otherData['postId'] = props.post.id
    otherData['where'] = route.name

    let main = {
        otherData, formData
    }

    let response = await store.dispatch('profile/updatePost', main)

    createPostLoading.value = false
    if (response === 'successful') {
        showEdit.value = false
    }
}

async function clickedYes(){
    if (profilesData.value.action === 'flag') {
        loading.value = true
        await flag({who: modalData.value.data, schoolAdmin: props.schoolAdmin, emits})
        loading.value = false
        return
    }

    deletePost()
}

async function deletePost(){
    loading.value = true
    let data = {
        postId: props.post.id,
        account: computedOwner.value.account,
        accountId: computedOwner.value.accountId,
    }
    data.where = useRoute().name
    let response = await store.dispatch('profile/deletePost', data)

    if (response === 'successful') {
        alertData.value.success = true
    } else {
        alertData.value.danger = true
    }

    loading.value = false   

    if (! store.getters['profile/getMsg']) {
        return
    }

    alertData.value.message = store.getters['profile/getMsg']

    if (props.postMediaFull) {
        emits('postDeleteSuccess',{postId: data.postId})
    }
}

function clickedNo(){
    clearSmallModal()
}

async function clickedOption(data) {
    showOptions.value = false

    if (data === 'edit') {
        showEdit.value = true
        return
    }

    if (data === 'attach') {
        attachmentData.value.showAttach = true
        return
    }

    if (data === 'delete') {
        issueSmallModalDeletionMessage()
        return
    }

    if (data !== 'save') {
        return
    }

    if (saveData.isSaved) {
        loading.value = true
        await save({who: null, schoolAdmin: props.schoolAdmin, emits})
        loading.value = false
        return
    }

    clickedSave()
}
</script>

<style lang="scss" scoped>

    .loading,
    .alert{
        width: 100%;
        text-align: center;
        padding: 5px;
    }

    .alert{
        font-size: 12px;
        color: white;
    }

    .success{
        background-color: green;
    }

    .danger{
        background-color: red;
    }

    .post-attachment{
        top: 0;
        height: 100%;
        width: 100%;
        position: absolute;
        z-index: 1;
    }

    .post-single-wrapper{
        min-height: 200px;
        padding: 10px;
        font-size: 1.5vw;
        margin: 10px auto;
        position: relative;

        .edit{
            font-size: 16px;
            margin-top: -10px;
            cursor: pointer;
            text-align: end;
        }

        .top{
            display: flex;
            justify-content: space-between;
            align-items: center;

            .name{
                font-weight: 500;
                font-size: 18px;
                cursor: pointer;
                width: 60%;
                @include text-overflow();
            }

            .created{
                font-weight: 400;
                color: rgba(150, 150, 150, 1);
                font-size: 11px;
                text-align: end;
                width: 40%;
                @include text-overflow();
            }
        }

        .body{
            width: 100%;
            margin: 0 0 0 auto;
            min-height: 50px;
            text-align: justify;
            padding: 10px;
            font-size: 1.2vw;
            display: flex;
            justify-content: space-between;
            align-items: flex-start;

            .creator{
                width: 75px;
                height: 75px;
                background-color: antiquewhite;
                border-radius: 100%;
            }

            .other{
                width: 75%;
                height: auto;

                .post-media{
                    width: 100%;
                    max-height: 150px;
                    overflow: hidden;
                    padding-left: 10px;

                    img,
                    video,
                    audio{
                        width: inherit;
                        height: auto;
                    }
                }

                .postMediaFull{
                    max-height: none;
                    overflow: visible;
                }
            }

            .text{
                width: 90%;
                margin: 0 0 10px auto;
            }

            .text-short{
                height: 90;

                & > div:first-child{
                    width: 90%;
                    margin: 0 auto;
                    height: 100px;
                    overflow: hidden;
                    text-overflow: ellipsis;
                }

                & > div:nth-child(2){
                    text-align: end;
                    font-weight: 400;
                    color: rgba(150, 150, 150, 1);
                    font-size: 12px;
                    cursor: pointer;
                }
            }
        }

        .bottom{
            min-height: 50px;
            border-top: 1px solid dimgrey;
            margin: 10px 0 0;
            width: 100%;
        }

        .attachments-section{
            width: 100%;
            display: flex;
            justify-content: flex-end;
            align-items: center;
            flex-wrap: wrap;
        }
    }


@media screen and (min-width:800px) and (max-width:1100px){
    .post-single-wrapper{
        font-size: 2.2vw;

        .body{
            font-size: 2vw;

            .creator{
                width: 60px;
                height: 60px;
                top: 45px;
            }

            .text{
                width: 90%;
                margin: 0 0 10px auto;
            }
        }
    }
}


@media screen and (max-width:800px){
    .post-single-wrapper{
        font-size: 2.4vw;

        .top{
            .name{
                font-size: 16px;
            }
        }

        .body{
            font-size: 2.2vw;

            .creator{
                width: 60px;
                height: 60px;
            }

            .media{
                width: 100%;

                img{
                    width: inherit;
                }
            }

            .text{
                width: 90%;
                margin: 0 0 10px auto;
            }

            .text-short{

                & > div:nth-child(2){
                    font-size: 11px;
                }
            }
        }
    }
}
</style>