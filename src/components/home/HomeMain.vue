<template>
    <div class="home-main-wrapper">
        <div class="loading" v-if="otherLoading">
            <pulse-loader :loading="otherLoading" :size="'10px'"></pulse-loader>
        </div>
        <div class="alert" 
            v-if="alertData.message?.length"
            :class="{success: alertData.success, danger:alert.danger}"
        >
            {{alertData.message}}
        </div>
        <div v-if="computedCanCreatePost">
            <post-create></post-create>
            <div class="extras-section">
                <post-button 
                    buttonText="discussion" 
                    @click="() => clickedPostButton('discussion')"
                    titleText="have something to discuss?"
                ></post-button>
                <post-button 
                    buttonText="assessment" 
                    @click="() => clickedPostButton('assessment')"
                    titleText="want to create an assessment?"
                ></post-button>
            </div>
        </div>
        <div 
            v-else-if="!loading && !computedCanCreatePost"
            class="text-gray-600 w-[90%] mx-auto text-center text-sm cursor-pointer"
        >
            {{
                computedUser ?
                'you must have a user account or be logged in to access your learner, facilitator, professional, etc accounts.' :
                'You can only create a post if you have any of the following accounts: learner, facilitator, professional, etc.'
            }}
        </div>
        <div class="loading" v-if="loading">
            <pulse-loader
                :loading="loading"
            ></pulse-loader>
        </div>
        <div 
            v-if="posts?.length"
            class="w-[90%] mx-auto md:max-w-xl space-y-12 mt-20"
        >
            <template
                v-for="post in posts"
            >
                <post-single
                    :key="`post.${post.id}`"
                    v-if="post.isPost"
                    :post="post"
                    @askLoginRegister="askLoginRegister"
                    @clickedMedia="clickedMedia"
                    @clickedShowPostComments="clickedShowPostComments"
                    @clickedShowPostPreview="clickedShowPostPreview"
                ></post-single>
                <discussion-single
                    v-if="post.isDiscussion"
                    :key="`discussion.${post.id}`"
                    :discussion="post"
                    @askLoginRegister="askLoginRegister"
                ></discussion-single>
                <assessment-single
                    v-if="post.isAssessment"
                    :key="`assessment.${post.id}`"
                    :assessment="post"
                    @askLoginRegister="askLoginRegister"
                ></assessment-single>
            </template>
        </div>
        <div
            class="min-h-[50vh] w-full justify-center flex items-center"
        >
            <div
                class="text-lg font-bold bg-gradient-to-r from-youredubrown to-youredugreen w-fit mx-auto bg-clip-text text-transparent"
            >no posts</div>
        </div>

        <!-- create discussion -->
        <create-discussion
            :show="showCreateItem === 'discussion'"
            @createDiscussionDisappear="clickedCloseCreateItem"
            @clickedCreate="clickedCreateDiscussion"
        ></create-discussion>
        <!-- create assessment -->
        <create-assessment
            :show="showCreateItem === 'assessment'"
            @closeCreateAssessment="clickedCloseCreateItem"
            @clickedCreate="clickedCreateAssessment"
        ></create-assessment>

    </div>
</template>

<script setup>
import PostCreate from '../PostCreate.vue'
import PostCreateAlt from '../PostCreateAlt.vue'
import PostButton from '../PostButton.vue'
import CreateDiscussion from '../forms/CreateDiscussion.vue'
import CreateAssessment from '../forms/CreateAssessment.vue'
import PostSingle from '../PostSingle.vue'
import DiscussionSingle from '../DiscussionSingle.vue'
import AssessmentSingle from '../AssessmentSingle.vue'
import { useStore } from 'vuex'
import { computed, ref } from 'vue'
import useAlert from '../../composables/useAlert'

const { alertData, clearAlert, issueDangerAlert, issueSuccessAlert } = useAlert()
const store = useStore()
const emits = defineEmits([
    'clickedShowPostComments', 'clickedShowPostPreview', 'askLoginRegister', 'clickedMedia',
])
const props = defineProps({
    loading: {
        type: Boolean,
        default: false
    },
    posts: {
        type: Array,
        default() {
            return []
        }
    },
})

const showLoginRegister = ref(false)
const showCreateItem = ref('')
const otherLoading = ref(false)

const computedCanCreatePost = computed(() => {
    return store.getters.getProfiles && store.getters.getProfiles.length ? true : false
})
const computedUser = computed(() => {
    return !!store.getters.getUser
})

function clickedPostButton(text){
    showCreateItem.value = text
}

function clickedCloseCreateItem(){
    showCreateItem.value = ''
}

async function clickedCreateDiscussion(data) {
    let response,
        formData = new FormData

    otherLoading.value = true

    formData.append('account', data.account)
    formData.append('accountId', data.accountId)
    formData.append('title', data.title)
    formData.append('type', data.type)
    formData.append('allowed', data.allowed)
    formData.append('restricted', JSON.stringify(data.restricted))
    formData.append('preamble', data.preamble)

    data.files.forEach(file=>{
        formData.append('file[]', file)
    })

    if (data.postAttachments.length) {
        formData.append('attachments', JSON.stringify(data.postAttachments.map(attachment=>{
            return {
                attachable: attachment.type.slice(0,attachment.type.length - 1),
                attachableId: attachment.data.id
            }
        })))
    }

    response = await store.dispatch('profile/createDiscussion', formData)

    otherLoading.value = false

    handleResponse(response, 'discussion')
}

function handleResponse(response, item) {
    if (response.status)
        issueSuccessAlert({
            message: `${item} created successfully`
        })
    else
        issueDangerAlert({
            message: `${item} creation failed`
        })
    
    setTimeout(() => {
        clearAlert()
    }, 5000);
}

async function clickedCreateAssessment(formData) {
    otherLoading.value = true

    let response = await store.dispatch('dashboard/createAssessment', formData)

    otherLoading.value = false
    
    handleResponse(response, 'assessment')
}

function clickedShowPostComments(data){
    emits('clickedShowPostComments',data)
}

function clickedShowPostPreview(data){
    emits('clickedShowPostPreview',data)
}

function askLoginRegister(){
    emits('askLoginRegister','HomeMain')
}

function clickedMedia(data){
    emits('clickedMedia',data)
}
</script>

<style lang="scss" scoped>

    .home-main-wrapper{
        background: inherit;
        
        .extras-section{
            width: 100%;
            display: inline-flex;
            justify-content: space-around;
            flex-wrap: wrap;
            align-items: center;
        }

        .loading,
        .alert{
            text-align: center;
            width: 100%;
            font-size: 14px;
        }

        .alert{
            color: white;
        }

        .success{
            background-color: green;
        }

        .danger{
            background-color: red;
        }

        .create{
            width: 100%;
            min-height: 100px;
            display: flex;
            justify-content: center;
            align-items: center;
            border: 1px solid dimgrey;
            border-right: 2px solid rgb(105, 105, 105);

            div{
                padding: 10px;
                font-size: 16px;

                &:hover{
                    transition: all 1s ease;
                    box-shadow: 0 0 3px gray;
                }
            }
        }
    }
</style>