<template>
    <div class="home-wrapper bg-whitesmoke min-h-screen pb-4">
        <app-nav class="mb-4"></app-nav>
        <div class="">
            <div class="w-fit mx-auto relative">
                <search-input
                    placeholder="searching for?"
                    paClass="gray"
                    :value="searchText"
                    :homeSearch="true"
                    :background="false"
                    @search="homeSearch"
                ></search-input>
                <div class="bg-gradient-to-r from-youredubrown to-youredugreen w-full h-1"></div>
            </div>
            
        </div>
        <div class="grid grid-cols-4 md:grid-cols-5 gap-2 mt-8">
            <div class="col-start-1 col-span-2 md:col-span-1">
                <home-menu-bar
                    :activeItem="menuValue"
                    @clickedMenuItem="emitSideValue"
                ></home-menu-bar>
            </div>
            <div class="row-start-2 col-span-4 md:row-start-1 md:col-start-2 md:col-span-3" infinite-wrapper>
                <home-main 
                    @askLoginRegister="askLoginRegister"
                    @clickedMedia="clickedMedia"
                    :loading="loading"
                    :posts="computedPosts"
                    @clickedShowPostComments="clickedShowPostComments"
                    @clickedShowPostPreview="clickedShowPostPreview"
                ></home-main>
            </div>
            <div class="col-start-3 row-start-1 col-span-2 md:col-span-1 md:col-start-5">
                <home-side
                    @clickedItem="emitSideValue"
                    :sideValue="sideValue"
                ></home-side>
            </div>
        </div>
        <fade-up>
            <template #transition v-if="showLoginRegister">
                <small-modal
                    @disappear="showLoginRegister = false"
                    :showForm='showLoginRegister'
                    title="welcome to this new community."
                >
                    <template #other>
                        <router-link to="/login">login</router-link> or 
                        <router-link to='/register'>register</router-link> to interact and grow in a positve way.
                    </template>
                </small-modal>
            </template>
        </fade-up>
        
        <just-fade>
            <template #transition v-if="showMediaModal">
                <media-modal
                    @mainModalDisappear="mediaModalDisappear"
                    :url="mediaUrl"
                    :urlType="mediaUrlType"
                    :justUrl="mediaJustUrl"
                >
                </media-modal>
            </template>
        </just-fade>
        <!-- post modal for showing post/type and its comments -->
        <just-fade>
            <template #transition v-if="showPostModal">
                <post-modal
                    @mainModalDisappear="showPostModal = false"
                    :data="postModalData"
                    :postLoading="postModalLoading"
                    :type="postModalType"
                >
                </post-modal>
            </template>
        </just-fade>
        <!-- post modal for search output -->
                <search-output
                    :type="postModalType"
                    :propSearchType="searchOutputType"
                    @clickedButton="clickedSearchOutputButton"
                    @clickedViewPost="clickedViewPost"
                    :show="showSearchOutput"
                    :searchData="searchData"
                    :loadMore="searchHasMore"
                    :loading="searchLoading"
                    @clickedLoadMore="clickedLoadMoreSearchOutput"
                    @clearData="clearSearchData"
                    @addMyfollow="addMyfollow"
                    @removeMyfollow="removeMyfollow"
                >
                </search-output>

        <div class="mx-auto w-fit mt-6">
            <infinite-loading
                class="mx-auto"
                @infinite="infiniteHandler"
                v-if="computedPosts.length"
                force-use-infinite-wrapper
            >
                <template #complete>
                    <div class="text-lg font-bold bg-gradient-to-r from-youredubrown to-youredugreen w-fit mx-auto bg-clip-text text-transparent">no more posts!</div>
                </template>
            </infinite-loading>
        </div>
    </div>
</template>

<script setup>
import HomeMain from '../components/home/HomeMain.vue'
import HomeMenu from '../components/home/HomeMenu.vue'
import YourEduLogo from '../components/YourEduLogo.vue'
import HomeSide from '../components/home/HomeSide.vue'
import FadeUp from '../components/transitions/FadeUp.vue'
import SmallModal from '../components/SmallModal.vue'
import SearchInput from '../components/SearchInput.vue'
import SearchOutput from '../components/SearchOutput.vue'
import { useStore } from 'vuex'
import FadeDown from '../components/transitions/FadeDown.vue'
import { default as _ } from 'lodash';
import HomeMenuBar from '../components/HomeMenuBar.vue'
import { computed, onBeforeMount, onMounted, ref, unref, watch, watchEffect } from 'vue'

const store = useStore()

const showLoginRegister = ref(false)
const showDetails = ref(false)
const nextPages = ref({
    discussions: {
        all: 1, mine: 1, followers: 1, followings: 1, attachments: 1
    },
    posts: {
        all: 1, mine: 1, followers: 1, followings: 1, attachments: 1
    },
    questions: {
        all: 1, mine: 1, followers: 1, followings: 1, attachments: 1
    },
    poems: {
        all: 1, mine: 1, followers: 1, followings: 1, attachments: 1
    },
    riddles: {
        all: 1, mine: 1, followers: 1, followings: 1, attachments: 1
    },
    books: {
        all: 1, mine: 1, followers: 1, followings: 1, attachments: 1
    },
    activities: {
        all: 1, mine: 1, followers: 1, followings: 1, attachments: 1
    },
    reads: {
        all: 1, mine: 1, followers: 1, followings: 1, attachments: 1
    },
    assessments: {
        all: 1, mine: 1, followers: 1, followings: 1, attachments: 1
    },
})
        //
const readsNextPage = ref(1)
const listening = ref(false)
const initialCall = ref(false)
const loading = ref(false)
const params = ref({all:true})
        //media modal
const mediaUrl = ref('')
const mediaJustUrl = ref(true)
const showMediaModal = ref(false)
const mediaUrlType = ref(true) 
        //post modal
const showPostModal = ref(false)
const postModalData = ref(null)
const postModalType = ref('')
const postModalLoading = ref(false)
        //home menu
const menuValue = ref("all")
const sideValue = ref('posts')
const menuAttachment = ref(null)
const attachmentAfter = ref({
    discussions: null,
    posts: null,
    questions: null,
    poems: null,
    riddles: null,
    books: null,
    activities: null,
    reads: null,
    assessments: null,
})

const searchOutputType = ref('all')
const searchText = ref('')
const oldSearchText = ref('')
const showSearchOutput = ref(false)
const searchData = ref([])
const searchNextPage = ref(1)
const searchLoading = ref(false)
const searchHasMore = ref(false)
const views = ref([])

onMounted(() => {
    listen()
})

watchEffect(() => {
    if (
        !params.value ||
        !sideValue.value ||
        !menuValue.value
    ) return

    if (initialCall.value) return

    initialCall.value = true
    getPosts()
})
watch(() => sideValue.value, () => {
    getData()
})
watch(() => menuValue.value, (newValue) => {
    
    if (!store.getters.getUser) {
        menuValue.value = 'all'
        showLoginRegister.value = true
        return
    }

    params.value = {
        user: store.getters.getUser.id,
    }

    if (newValue === 'all') {
        params.value.all = true
    }
    
    if (newValue === 'followers') {
        params.value.followers = true
    }
    
    if (newValue === 'followings') {
        params.value.followings = true
    }
    
    if (newValue === 'mine') {
        params.value.mine = true
    }
    
    if (newValue === 'attachments') {
        
    }

    getData()
})
watch(() => menuAttachment.value, (newValue) => {
    if (! newValue) return

    params.value = {}
    params.value.user = store.getters.getUser.id
    params.value.attachments = true
    params.value.attach = newValue.type,
    params.value.id = newValue.data.id

    getData()
})
watch(() => searchText.value, (newValue) => {
    searchNextPage.value = 1
    if (newValue.length) {
        showSearchOutput.value = true
        debouncedHomeSearch()
    } else {
        showSearchOutput.value = false
        searchData.value = []
    }
})
watch(() => searchOutputType.value, () =>{
    searchNextPage.value = 1
    if (searchText.value.length) {
        debouncedHomeSearch()
    }
})
watch(() => searchNextPage.value, (newValue) => {
    if (newValue && newValue > 1) {
        searchHasMore.value = true
    } else {
        searchHasMore.value = false
    }
})


const computedPosts = computed(() => {
    return [
        ...new Set(store.getters[`home/getHome${_.capitalize(computedCurrentStates.value)}`])
    ]
})
const computedUser = computed(() => {
    return store.getters.getUser
})
const computedProfiles = computed(() => {
    return getProfiles.value ?? []
})
const computedCurrentStates = computed(() => {
    return `${sideValue.value}${_.capitalize(menuValue.value === 'all' ? '' : menuValue.value)}`
})
const computedNextPageForMenuValue = computed(() => {
    if (!sideValue.value || !menuValue.value) return 0

    return nextPages.value[sideValue.value][menuValue.value]
})
const computedIsPostType = computed(() => {
    return !computedIsNotPostType.value
})
const computedIsNotPostType = computed(() => {
    return ['posts', 'discussions', 'reads', 'assessments'].includes(sideValue.value)
})


function clickedButton(data) {
    if (data === 'details') {
        showDetails.value = !showDetails.value
        return
    }
}
function setPostTypeOnParams(data) {
    let isPostType = !['posts', 'discussions', 'reads', 'assessments'].includes(sideValue.value)
    if (isPostType) {
        data.postType = sideValue.value
        return data
    }

    data.postType = 'posts'
    return data
}
function setTypeOnParams(data) {
    let isPostType = !['posts', 'discussions', 'reads', 'assessments'].includes(sideValue.value)
    if (isPostType || sideValue.value === 'posts') {
        data.type = 'posts'
        return data
    }

    data.type = sideValue.value
    return data
}
function clickedSearchOutputButton(data){
    searchOutputType.value = data
}

function listen(){
    if (listening.value) return

    listening.value = true

    Echo.channel('youredu.home')
        .listen('.newPost', (data)=>{
            this['home/newPost'](data)
        })
        .listen('.newDiscussion', (data)=>{
            this['home/newDiscussion'](data)
        })
        .listen('.newAssessment', (data)=>{
            this['home/newAssessment'](data)
        })
}
async function clickedViewPost(data){
    showPostModal.value = true
    postModalLoading.value = true
    let response = await store.dispatch('profile/getPost', data.id)
    if (response !== 'unsuccessful') {
        postModalType.value = 'post'
        postModalData.value = response
    } else {
        showPostModal.value = false
    }
    postModalLoading.value = false
}

function removeMyfollow(data){
    searchData.value.forEach(searchItem=>{
        if (searchItem.accountId === data.accountId &&
            searchItem.account === data.account) {
            let followIndex = searchItem.follows.findIndex(follow=>{
                return follow.id === data.follow.id
            })
            if (followIndex > -1) {
                searchItem.follows.splice(followIndex,1)
            }
        }
    })
}
function addMyfollow(data){
    searchData.value.forEach(searchItem=>{
        if (searchItem.accountId === data.accountId &&
            searchItem.account === data.account) {
            searchItem.follows.push(data.follow)
        }
    })
}
function clearSearchData(){
    searchText.value = ''
    oldSearchText.value = ''
    searchOutputType.value = 'all'
    searchData.value = []
}

function clickedLoadMoreSearchOutput(){
    debouncedHomeSearch()
}

function homeSearch(data){
    searchText.value = data
}

const debouncedHomeSearch = _.debounce(function() {
    this.search()
}, 200)

async function search(){
    if (searchNextPage.value === null) {
        return 
    }
    searchLoading.value = true
    let response = null,
        params = {},
        data = {}

    params.search = searchText.value
    params.searchType = searchOutputType.value
    if (store.getters.getUser) {
        params.user_id = store.getters.getUser.id
    }
    data.nextPage = searchNextPage.value
    data.params = params

    response = await store.dispatch('home/search', data)

    if (response.status) {
        if (oldSearchText.value === searchText.value && 
            searchNextPage.value && searchNextPage.value > 1) {
            searchData.value.push(...response.data)
        } else {
            searchData.value = response.data
        }
        if (response.next) {
            searchNextPage.value += 1
        } else {
            searchNextPage.value = null
        }
    } else {

    }
    oldSearchText.value = searchText.value
    searchLoading.value = false
}
function emitSideValue(data){
    sideValue.value = data
}
function clickedAttachmentSelection(data){
    menuAttachment.value = data
}
function emitMenuValue(data){
    menuValue.value = data
}
function clickedShowPostPreview(data){
    postModalData.value = data.data
    postModalType.value = 'posttype'
    showPostModal.value = true
}
function clickedShowPostComments(data){
    postModalData.value = data.post
    postModalType.value = 'post'
    showPostModal.value = true
}
function mediaModalDisappear(){
    showMediaModal.value = false
    mediaUrl.value = ''
    mediaUrlType.value = ''
}
function clickedMedia(data){
    mediaUrl.value = data.url
    mediaUrlType.value = data.mediaType
    showMediaModal.value = true
}
function askLoginRegister(){
    showLoginRegister.value = true
    setTimeout(() => {
        showLoginRegister.value = false
    }, 4000);
}
function moveToTop(){
    window.scrollTo(0,0)
}
function getData(){
    if (computedIsPostType.value == 'Posts'){
        getPosts()
        return
    }

    getPostTypes()
}
function incrementNextPage(){
    if (
        !nextPages.value[sideValue.value] ||
        !nextPages.value[sideValue.value][menuValue.value]
    ) return

    nextPages.value[sideValue.value][menuValue.value] += 1
}
function decrementNextPage(){
    console.log(sideValue.value, menuValue.value, !nextPages.value[sideValue.value] ||
    !nextPages.value[sideValue.value][menuValue.value], nextPages.value[sideValue.value][menuValue.value]
);
    if (
        !nextPages.value[sideValue.value] ||
        !nextPages.value[sideValue.value][menuValue.value]
    ) return

    nextPages.value[sideValue.value][menuValue.value] = 0
}
function checkNextPageCancel(){
    if (nextPages.value[sideValue.value][menuValue.value] !== 1 && 
        store.getters[`home/getHome${_.capitalize(computedNextPageForMenuValue.value)}`]) {
        return true
    } 

    return false
}
function setAttachmentAfter(){

    if (!params.value.attachments) {
        return
    } 

    attachmentAfter.value[sideValue.value] = menuAttachment.value
}
function setUpParams() {
    let p = setPostTypeOnParams(unref(params))
    p = setTypeOnParams(p)

    return p
}
function inView() {
    return views.value.includes(`${sideValue.value}${_.capitalize(menuValue.value === 'all' ? '' : menuValue.value)}`)
}
function thereIsEnoughPosts() {
    return store.getters[`home/getHome${_.capitalize(`${sideValue.value}${_.capitalize(menuValue.value === 'all' ? '' : menuValue.value)}`)}`]?.length >= 10
}
function thereIsntEnoughPosts() {
    return !thereIsEnoughPosts()
}
function addToView() {
    let currentStatesValue = `${sideValue.value}${_.capitalize(menuValue.value === 'all' ? '' : menuValue.value)}`
    
    if (!store.getters[`home/getHome${_.capitalize(currentStatesValue)}`]?.length) {
        return
    }

    if (inView()) {
        return
    }

    views.value.push(currentStatesValue)
}
async function getPosts(state = null) {
    if (checkNextPageCancel()) {
        return
    }

    if (inView() && thereIsEnoughPosts()) {
        return
    }

    loading.value = true
    
    let nextPageValue = nextPages.value[sideValue.value][menuValue.value]

    let response = await store.dispatch(`home/get${store.getters.getUser ? 'User' : ''}Posts`, {
        nextPage: nextPageValue,
        params: setUpParams(),
    })

    setNextPageAndAttachmentAfter(response, state)
    
    loading.value = false

    addToView()
}
async function getPostTypes(state = null){
    if (checkNextPageCancel()) {
        return
    }

    if (inView()) {
        return
    }

    loading.value = true 

    let response = await store.dispatch(`home/get${store.getters.getUser ? 'User' : ''}PostTypes`, {
        nextPage: computedNextPageForMenuValue.value,
        params: setUpParams(),
    })
        
    setNextPageAndAttachmentAfter(response, state)

    loading.value = false
}
function setNextPageAndAttachmentAfter(response, state = null) {
    console.log(response, 'set next');
    if (response) {
        incrementNextPage()
        state?.loaded()
    } 
    
    if (! response) {
        decrementNextPage()
        state?.complete()
    }

    setAttachmentAfter()
}
async function infiniteHandler(state){
    console.log(state, 'infinite');
    if (computedNextPageForMenuValue.value === 1) {
        console.log(1);
        return
    }

    if (! computedNextPageForMenuValue.value) {
        console.log(2);
        state.complete()
        return
    }
    
    let response = null

    if (computedIsNotPostType.value) {
        response = await store.dispatch('home/getUserPosts', {
            nextPage: computedNextPageForMenuValue.value,
            params: params.value,
        })
    }
    
    if (computedIsPostType.value) {
        response = await store.dispatch('home/getUserPostTypes', {
            nextPage: computedNextPageForMenuValue.value,
            params: params.value,
        })
    }

    setNextPageAndAttachmentAfter(response, state)
}
</script>

<style lang="scss" scoped>

    .home-wrapper{
        position: relative;
        background: $dashboard-section-second-background-color;

        .home-top{
            background: $color-primary;
            width: 100%;
            margin: 0;
            position: sticky;
            top: 0;
            z-index: 100;
            display: flex;
            justify-content: center;
            align-items: center;

            .move-to-top{
                color: gray;
                padding: 5px;
                cursor: pointer;
                position: absolute;
                left: 10px;
            }

            .search-section{

            }
        }

        .home-middle{
            width: 95%;
            margin: 0 auto 10px;
            display: flex;
            justify-content: space-between;
            align-items: flex-start;
            flex-wrap: wrap;

            .menu{
                width: 15%;
            }

            .main{
                padding-top: 20px;
                width: 50%;
                background-color: inherit;
            }

            .side{
                width: 25%;
            }
        }
    }

@media screen and (min-width: 768px) {
    
    .home-wrapper{

        .home-middle{ 

            .menu{
                width: 100%;
                margin: 10px 0;
            }

            .main{
                width: 60%;
            }

            .side{
                width: 35%;
            }
        }
    }
}


@media screen and (min-width: 640px) {
    
    .home-wrapper{

        .home-middle{

            .menu{
                width: 45%;
            }

            .main{
                width: 100%;
                order: 10;
            }

            .side{
                width: 50%;
                margin: 10px 0;
            }
        }
    }
}
</style>