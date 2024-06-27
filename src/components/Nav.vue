<template>
    <div class="flex justify-between items-center px-2 relative">
        <div class="absolute -bottom-1 w-full left-0 h-1 rounded bg-gradient-to-r from-youredubrown to-youredugreen"></div>
        <YourEduLogo
            class="w-16 cursor-pointer"
            @click="() => router.push('/')"
        />
        <div class="main-alert" v-if="alerts.length">
            <main-alert
                v-for="alert in alerts"
                :key="alert.id"
                :id="alert.id"
                :show="alert.hasOwnProperty('id')"
                :isMessage="alert.isMessage"
                :text="alert.text"
                :isAccount="alert.isAccount"
                @removeAlert="clickedRemoveAlert"
                :account="alert.account"
                :message="alert.message"
            ></main-alert>
        </div>
        <div 
            class="flex justify-start items-center gap-1 cursor-pointer"
        >
            <div class="p-2 rounded bg-gradient-to-br from-youredubrown to-youredugreen bg-clip-text text-transparent font-bold">
                {{ computedUser?.username ?? 'guest' }}
            </div>
            <font-awesome-icon
                @click="() => showActions = !showActions"
                :icon="['fa', `${showActions ? 'chevron-up' : 'chevron-down'}`]"
            ></font-awesome-icon>
        </div>

        <div 
            :class="[showActions ? 'block' : 'hidden']"
            class="absolute top-[100%] z-[1000] right-2 min-w-48 bg-white shadow-sm rounded p-2 py-4 text-center space-y-2"
        >
            <div
                v-if="computedRouteName != 'home'"
                class="border-b-2 border-transparent hover:border-youredubrown w-fit mx-auto cursor-pointer hover:bg-gradient-to-r from-youredubrown to-youredugreen hover:bg-clip-text hover:text-transparent hover:font-bold transition duration-75" 
                @click="() => router.push({name: 'home'})"
            >Home</div>
            <div 
                class="border-b-2 border-transparent hover:border-youredubrown w-fit mx-auto cursor-pointer hover:bg-gradient-to-r from-youredubrown to-youredugreen hover:bg-clip-text hover:text-transparent hover:font-bold transition duration-75" 
                v-if="computedRegistration"
                @click="() => router.push('/register')"
            >Register</div>
            <div 
                class="border-b-2 border-transparent hover:border-youredubrown w-fit mx-auto cursor-pointer hover:bg-gradient-to-r from-youredubrown to-youredugreen hover:bg-clip-text hover:text-transparent hover:font-bold transition duration-75" 
                v-if="computedLogin"
                @click="() => router.push('/login')"
            >Login</div>
            <div
                class="border-b-2 border-transparent hover:border-youredubrown w-fit mx-auto cursor-pointer hover:bg-gradient-to-r from-youredubrown to-youredugreen hover:bg-clip-text hover:text-transparent hover:font-bold transition duration-75" 
                v-if="computedUser"
                @click="() => router.push({name: 'welcome'})"
            >User Profile</div>
            <div 
                class="border-b-2 border-transparent hover:border-youredubrown w-fit mx-auto cursor-pointer hover:bg-gradient-to-r from-youredubrown to-youredugreen hover:bg-clip-text hover:text-transparent hover:font-bold transition duration-75" 
                v-if="computedDashboard" 
                @click="() => router.push('/dashboard')"
            >Dashboard</div>
            <div
                class="border-b-2 border-transparent hover:border-youredubrown w-fit mx-auto cursor-pointer hover:bg-gradient-to-r from-youredubrown to-youredugreen hover:bg-clip-text hover:text-transparent hover:font-bold transition duration-75" 
                v-if="computedProfiles && computedUser"
                @click.prevent="showProfiles = !showProfiles"
            >Profiles</div>
            <div
                v-if="computedProfiles && computedUser"
            >
                <div
                    class="border-b-2 border-transparent hover:border-youredubrown w-fit mx-auto cursor-pointer hover:bg-gradient-to-r from-youredubrown to-youredugreen hover:bg-clip-text hover:text-transparent hover:font-bold transition duration-75" 
                    @click.self="clickedRequest"
                >Requests</div>
                <div
                    class="notification"
                    v-if="requestNotifications.length"
                >{{requestNotifications.length}}</div>
                <template v-if="requestModalType == 'requests' && showRequestModal">
                    <div v-for="(profile,key) in computedProfiles"
                        :key="key">
                        <profile-bar
                            v-if="profileAccount != profile.account ||
                                profileAccountId != profile.accountId"
                            :profile="profile"
                        ></profile-bar>
                    </div>
                </template>
            </div>
            <div
                v-if="computedUser" 
                class="request"
                @click="clickedNotifications">
                    <div>
                        <font-awesome-icon :icon="['fa','bell']"></font-awesome-icon>
                    </div>
                    <div
                        class="notification"
                        v-if="otherNotifications.length"
                    >{{otherNotifications.length}}</div>
            </div>
            <div
                class="border-b-2 border-transparent hover:border-youredubrown w-fit mx-auto cursor-pointer hover:bg-gradient-to-r from-youredubrown to-youredugreen hover:bg-clip-text hover:text-transparent hover:font-bold transition duration-75" 
                v-if="computedUser"
                @click="navLogout"
            >Logout</div>
        </div>
        <div class="nav-outer">
            <request-modal
                :show="showRequestModal"
                :type="requestModalType"
                @requestsModalDisappear="requestsModalDisappear"
                :requestNotifications="requestNotifications.length"
            ></request-modal>
        </div>

    </div>
</template>

<script setup>
import ProfilePicture from "../components/profile/ProfilePicture.vue";
import ProfileBar from "../components/profile/ProfileBar.vue";
import FadeRight from "../components/transitions/FadeRight.vue";
import FadeUp from "../components/transitions/FadeUp.vue";
import MainAlert from "../components/transitions/MainAlert.vue";
import RequestModal from "../components/RequestModal.vue";
import {TokenService} from "../services/token.service";
import { mapActions, mapGetters, useStore } from "vuex";
import { dates, strings } from '../services/helpers';
import { onBeforeRouteUpdate, useRoute, useRouter } from "vue-router";
import { computed, onMounted, ref, watch } from "vue";
import YourEduLogo from "./YourEduLogo.vue";

const store = useStore()
const router = useRouter()
const route = useRoute()

defineProps({
    profileAccountId: {
        type: String,
        default: ''
    },
    profileAccount: {
        type: String,
        default: ''
    },
})

const navState = ref(['fa','bars'])
const show = ref(false)
const showProfiles = ref(false)
const showActions = ref(false)
///follow requests
const showRequestModal = ref(false)
const otherNotifications = ref([])
const requestNotifications = ref([])
const newNotification = ref(false)
const requestModalType = ref('')
//alert
const alerts = ref([])

onMounted(() => {
    setTimeout(() => {
        listen()                
    }, 2000);
})

watch(() => newNotification.value, (newValue) => {
    if (newValue) {
        setTimeout(() => {
            newNotification.value = false
        }, 4000);
    }
})

onBeforeRouteUpdate((to, from, next) => {
    showProfiles.value = false
    showActions.value = false
    next();
})

const computedRouteName = computed(() => {
    return route.name
})
const computedRegistration = computed(() => {
    return store.getters.getLoggedin ? false : 
        computedRouteName.value !== 'register' ? true : false
})
const computedLogin = computed(() => {
    return store.getters.getLoggedin ? false : 
        computedRouteName.value !== 'login' ? true : false
})
const computedWelcome = computed(() => {
    return store.getters.getLoggedin ? 
        computedRouteName.value === 'welcome' ? false : true : false
})
const computedDashboard = computed(() => {
    return store.getters.getLoggedin ? 
        computedRouteName.value === 'dashboard' ? false : true : false
})
const computedProfiles = computed(() => {
    return store.getters.getProfiles ? store.getters.getProfiles : []
})
const computedUser = computed(() => {
    return store.getters.getUser
})

function requestsModalDisappear(){
    showRequestModal.value = false
} //generalize requestNotifications
function clickedRequest(){
    requestModalType.value = 'requests'
    showRequestModal.value = true
    if (requestNotifications.value.length) {
        markUserNotifications()
    }
}
function clickedNotifications(){
    requestModalType.value = 'notifications'
    showRequestModal.value = true
    markOtherUserNotifications()
}
async function markUserNotifications(){

    let response = await store.dispatch('markNotifications')

    if (response.status) {
        requestNotifications.value = []
    } else {
        console.log('response :>> ', response);
    }
}
async function markOtherUserNotifications(){

    let response = await store.dispatch('markOtherNotifications', {other:true})

    if (response.status) {
        otherNotifications.value = []
    } else {
        console.log('response :>> ', response);
    }
}
async function getNotifications(){
    let response = await store.dispatch('userNotifications')

    if (response.status) {
        requestNotifications.value = response.data
    } else {
        console.log('response :>> ', response);
    }
    listen()
}
function showOrHide() {
    if (navState.value[1] ==='bars') {
        navState.value[1] ='times'
        show.value = true
        return
    }

    navState.value[1] ='bars'
    show.value = false
    showProfiles.value = false
}
function clickedRemoveAlert(id){
    let index = alerts.value.findIndex(a=>{
        return a.id === id
    })
    if (index > -1) {
        alerts.value.splice(index,1)
    }
}
function clearAlert(id){
    setTimeout((id) => {
        clickedRemoveAlert(id)
    }, 5000);
}
function handleNotification(notification) {
    console.log(notification);
    let alert = {
        isMessage: true,
        account: notification.account,
        text: notification.message,
        id: Math.floor(Math.random() * 10000)
    }

    alerts.value.unshift(alert)

    clearAlert(alert.id)
}
function listen(){
    if (store.getters.getUser && TokenService.getToken()) {
        
        Echo.private(`youredu.user.${store.getters.getUser.id}`)
            .notification((notification) => {
                console.log(notification);
                if (notification.type == 'App\\Notifications\\DiscussionRequestNotification' ||
                    notification.type == 'App\\Notifications\\FollowRequest' ||
                    notification.type == 'App\\Notifications\\NewDiscussionMessageNotification') {
                    
                    requestNotifications.value.push(notification)
                } 
                else if (notification.type === 'App\\Notifications\\DiscussionJoinResponseNotification') {
                    otherNotifications.value.push(notification)
                    let alert = {
                        isMessage: true,
                        text: `your request to join discussion with title: ${notification.title.toUpperCase()} has been ${notification.action}`
                    }
                    alert.id = Math.floor(Math.random() * 10000)
                    alerts.value.unshift(alert)
                    clearAlert(alert.id)
                } 
                else if (notification.type === 'App\\Notifications\\DiscussionInvitationNotification') {
                    requestNotifications.value.push(notification)
                    otherNotifications.value.push(notification)
                    let alert = {
                        isMessage: true,
                        text: notification.message
                    }
                    alert.id = Math.floor(Math.random() * 100)
                    alerts.value.unshift(alert)
                    clearAlert(alert.id)
                } 
                else if (
                    notification.type === 'App\\Notifications\\AccountRequestNotification' ||
                    notification.type === 'App\\Notifications\\AccountResponseNotification'
                ) {
                    requestNotifications.value.push(notification)

                    let alert = {
                        isMessage: true,
                        text: notification.message,
                        account: notification.account,
                    }
                    alert.id = Math.floor(Math.random() * 10000)
                    alerts.value.unshift(alert)
                    newNotification.value = true
                    clearAlert(alert.id)
                }
                else if (
                    notification.type === 'App\\Notifications\\DiscussionInvitationResponseNotification' ||
                    notification.type === 'App\\Notifications\\UpdateParticipantStateNotification' ||
                    notification.type === 'App\\Notifications\\UpdateParticipantStateNotification' ||
                    notification.type === 'App\\Notifications\\AdminResponseNotification' ||
                    notification.type === 'App\\Notifications\\FacilitatorResponseNotification' ||
                    notification.type === 'App\\Notifications\\SchoolResponseNotification' ||
                    notification.type === 'App\\Notifications\\CollaborationNotification' ||
                    notification.type === 'App\\Notifications\\RemoveDiscussionParticipantNotification'
                ) {
                    otherNotifications.value.push(notification)
                    console.log(notification);
                    let alert = {
                        isMessage: true,
                        account: notification.account,
                        text: notification.message
                    }
                    alert.id = Math.floor(Math.random() * 10000)
                    alerts.value.unshift(alert)
                    clearAlert(alert.id)
                    if (notification.admin && computedRouteName.value === 'dashboard') {                                    
                        store.dispatch('dashboard/addAccountDetails', {
                            account: notification.accountData.account,
                            accountId: notification.accountData.accountId,
                            what: 'admin',
                            data: notification.admin
                        })
                    } 
                    else if (notification.facilitator && computedRouteName.value === 'dashboard') {                                    
                        store.dispatch('dashboard/addAccountDetails', {
                            account: notification.accountData.account,
                            accountId: notification.accountData.accountId,
                            what: 'facilitator',
                            data: notification.facilitator
                        })
                    } 
                    else if (
                        notification.school && 
                        computedRouteName.value === 'dashboard' &&
                        notification.accountData.account !== 'admin'
                    ) {                                    
                        store.dispatch('dashboard/addAccountDetails', {
                            account: notification.accountData.account,
                            accountId: notification.accountData.accountId,
                            what: 'school',
                            data: notification.school
                        })
                    } 
                    else if (
                        notification.school && 
                        computedRouteName.value === 'dashboard' &&
                        notification.accountData.account === 'admin'
                    ) {                                    
                        store.dispatch('addProfile', notification.school)
                    }
                }  
                else if (notification.type === 'App\\Notifications\\RequestMessageNotification') {
                    
                    let alert = {
                        isMessage: true,
                        account: notification.account,
                        text: notification.message
                    }
                    alert.id = Math.floor(Math.random() * 10000)
                    alerts.value.unshift(alert)
                    clearAlert(alert.id)
                }  
                else if (notification.type === 'App\\Notifications\\BanNotification') {
                    let message,
                        action = notification.ban.type === 'overall' ? '' : 
                            `${notification.ban.type.toLowerCase()} `,
                        account = notification.ban.account === 'user' ? 'you' :
                            notification.ban.account
                    if (notification.ban === 'SERVED' || notification.ban === 'PENDING') {
                        if (notifcation.ban.username) {
                            message = `you have been served ${action}ban which will last until ${dates.dateReadable(notification.ban.dueDate)}`
                        } else {
                            message = `your ${account} account has been served ${action}ban which will last until ${dates.dateReadable(notification.ban.dueDate)}`
                        }
                    } 
                    else if (notification.ban === 'UNSERVED' || notification.ban === 'RESOLVED') {
                        if (notifcation.ban.username) {
                            message = `your ${action} ban with the due date of ${dates.dateReadable(notification.ban.dueDate)}, has been removed.`
                        } else {
                            message = `the ${action} ban served to ${account} account, with due date of ${dates.dateReadable(notification.ban.dueDate)}, has been removed.`
                        }
                    }
                    
                    let alert = {
                        isMessage: true,
                        text: message
                    }
                    alert.id = Math.floor(Math.random() * 10000)
                    alerts.value.unshift(alert)
                    clearAlert(alert.id)
                } else {
                    handleNotification(notification)
                }

                newNotification.value = true
            })
            .listen('.newFollower', data=>{
                console.log('data :>> ', data);
                let alert = {}
                alert.id = Math.floor(Math.random() * 10000)
                alert.account = {
                    account: strings.getAccount(data.follower.followedby_type),
                    accountId: data.follower.followedby_id,
                    myAccount: strings.getAccount(data.follower.followable_type),
                    myName: data.follower.my_name,
                    url: data.follower.url,
                    action: data.action
                }
                alert.isAccount = true
                alerts.value.unshift(alert)
                setTimeout(() => {
                    clearAlert(alert.id)
                }, 5000);
                store.dispatch('addUserFollower', data.follower)
            })
            .listen('.newDiscussionMessageResponse', data=>{
                console.log('data :>> ', data);
                let alert = {}
                alert.id = Math.floor(Math.random() * 10000)
                alert.message = data.message
                alert.isMessage = true
                alerts.value.unshift(alert)
                setTimeout(() => {
                    clearAlert(alert.id)
                }, 5000);
            })
    } else {
        setTimeout(() => {
            listen()
        }, 3000);
    }
}
async function navLogout(){
    const result = await store.dispatch('logout')

    if (result.status && computedRouteName !== 'home')
        router.push('/')
}

</script>

<style lang="scss" scoped>
$nav-container-outer: 50px;
$nav-container-inner: $nav-container-outer - 10px;
$nav-main-container: 85%;
$nav-container-outer-color: rgba(22, 233, 205, 1);
$nav-container-inner-color: aliceblue;
$nav-main-container-acolor: brown;
$nav-main-container-abackground: aliceblue;
$nav-main-container-background: lighten($nav-container-outer-color, 30);
$homeLogoColor : rgba(2, 104, 90, .6);

.nav-bar-enter, .nav-bar-leave-to{
    opacity: 0;
    transform: scale(0,0);
}

.nav-bar-enter-active, .nav-bar-leave-active{
    transition: all 1s ease-in-out;
}

.main-alert{
    background: transparent;
    position: fixed;
    width: fit-content;
    max-width: 50%;
    height: 300px;
    top: 40px;
    padding: 10px;
    right: 0;
    z-index: 1;
}

.nav-outer{
    position: fixed;
    width: 100%;
    z-index: 1000;
    bottom: 30px;
    display: flex;

    .nav-shadow-wrapper{
        width: 100vw;
        height: 100vh;
        top: 0;
        position: inherit;
        background: none;
    }

    .nav-menu-container{
        position: absolute;
        width: auto;
        bottom: 0;
        z-index: 1;

        .nav-container-outer{
            width: $nav-container-outer;
            height: $nav-container-outer;
            background-color: $nav-container-outer-color;
            border-radius: 100%;
            display: flex;
            justify-content: center;
            align-items: center;
            cursor: pointer;

            .nav-container-inner{
                width: $nav-container-inner;
                height: $nav-container-inner;
                background-color: $nav-container-inner-color;
                border-radius: inherit;
                display: flex;
                justify-content: center;
                align-items: center;
                cursor: pointer;
            }
        }

        .navNotification{
            background: red;
            animation-name: shake;
            animation-duration: 1.5s;
            animation-iteration-count: infinite;
            animation-timing-function: linear;

            .nav-container-inner{

                animation-name: spin;
                animation-duration: 2s;
                animation-iteration-count: infinite;
                animation-timing-function: ease-in-out;
            }
        }
            
    }

    .nav-main-container{
        position: relative;
        background-color: $nav-main-container-background;
        width: $nav-main-container;
        min-height: $nav-container-inner;
        margin: -20px auto 0;
        display: flex;
        justify-content: space-between;
        align-items: center;
        padding: 5px 10px;
        position: relative;
        border-radius: 5px;

        a, 
        .a-profile {
            text-decoration: none;
            text-align: center;
            cursor: pointer;
            color: $nav-main-container-acolor;
            background-color: $nav-main-container-abackground;
            padding: 5px;
            margin: 5px 0;
            border-radius: 5px;
            padding: 5px;

            &:hover{
                background-color: $nav-main-container-acolor;
                color: $nav-main-container-abackground;
                opacity: .7;
                transition: all 1s ease;
            }
            
        }

        .nav-main-login{

            .request{
                display: inline-flex;
                position: relative;

                .notification{
                    font-size: 9px;
                    color: $nav-main-container-acolor;
                    padding: 5px;
                    border-radius: 50%;
                    border: 2px solid $nav-main-container-acolor;
                    bottom: 65%;
                    right: -10%;
                    background-color: aliceblue;
                    position: absolute;
                }
            }
        }

        .nav-main-other{

            .nav-other-sub{
                    position: absolute;
                    // min-height: 100px;
                    right: 0;
                    bottom: 100%;
                    padding: 5px;
                    width: 50%;
                    margin: 0 auto;
                    padding-right: 0;

                div{
                    display: flex; 
                    flex-wrap: wrap;
                    flex-direction: row-reverse;
                }
            }
        }
    }
}

@media only screen and (max-width: 800px){

    .main-alert{
        max-width: 75%;
        width: 100%;
        z-index: 1;
    }
    
    .nav-outer{

        .nav-main-container{

            .nav-main-main
            {
                min-width: 55%;
                display: block;
            }

            .nav-main-logo,
            .nav-main-login
            {
                width: 100%;
                display: flex;
                justify-content: center;
                margin: 20px 0;
            }

            .nav-main-other
            {
                width: 40%;
                margin-left: auto;

                .nav-other-section a,
                .nav-other-section .a-profile
                {
                    width: 100%;
                    display: block;
                }

                .nav-other-sub{
                    width: 80%;
                }
                
            }
            
        }
    }
    
}

@media only screen and (min-width: 800px){
    
    .nav-outer{

        .nav-main-container{
        .nav-main-main{
            display: contents;
        }

        .nav-main-login
        {
            order: 3;
        }
    }
    } 
}

@media only screen and (max-width: 400px){

    .main-alert{
        max-width: 100%;
        width: 100%;
    }
    
    .nav-main-container{
        margin: -20px 0 0 auto;
        width: 100%;
    }
    
}

@keyframes spin {
    from{
        transform: rotateZ(0deg);
    }

    to{
        transform: rotateZ(360deg);
    }
}

@keyframes shake {
    0%{
        transform: translate(10px,0);
    }

    33%{
        transform: translate(0,10px);
    }

    66%{
        transform: translate(-10px,0);
    }

    100%{
        transform: translate(0,-10px);
    }
}

</style>