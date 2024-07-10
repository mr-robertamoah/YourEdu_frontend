<template>
    <div class="overflow-y-auto bg-whitesmoke">
        <div class="loading" v-if="authenticatingUser">
            <sync-loader :loading="authenticatingUser"></sync-loader>
        </div>
        <div v-else>
            <app-nav></app-nav>
            <div class="welcome-wrapper bg-whitesmoke">
                <div class="welcome-message">
                    <div 
                        class="
                            bg-white shadow-sm p-2 rounded-md my-4 w-[90%] md:w-[70%] mx-auto
                            text-sm text-gray-600 min-h-32
                        " 
                        v-if="newCreation"
                    >
                        <div
                            class="flex justify-center items-center gap-2 my-4 text-base"
                        >
                            <div>yay! welcome</div>
                            <div 
                                class="bg-gradient-to-r from-youredubrown to-youredugreen text-transparent w-fit bg-clip-text font-bold"
                            >
                                @{{ getUserUsername ? getUserUsername : 'newuser'}}
                            </div>
                        </div>
                        
                        <div class="mb-4">
                            we hope you do enjoy this new experience of social education
                        </div>
                        <div class="special text-xs">
                            Note: Everything on this page deals with the updating user information and the creation of your personal accounts. If you want more power
                            to do other things, then visit the dashboard
                        </div>
                    </div>
                    <div 
                        class="second-section bg-white shadow-sm p-2 rounded-md my-4 w-[90%] md:w-[70%] mx-auto
                            text-sm text-gray-600 min-h-32
                        "
                    >
                        <div class="name font-bold">
                            {{ getUser ? getUser.fullName : 'update name'}}
                        </div>

                        <div class="w-[90%] sm:w-[80%] mx-auto p-2 my-4 relative">
                            <div class="font-bold my-2">About</div>

                            <div class="grid grid-cols-3 gap-2 mt-4">
                                <div class="text-sm text-gray-600 text-right">first name:</div>
                                <div 
                                    class="col-span-2 font-semibold text-center"
                                    :class="[getUser?.firstName ? 'capitalize' : 'text-xs text-gray-600']"
                                >{{ getUser?.firstName ?? 'no first name'}}</div>
                            </div>

                            <div class="grid grid-cols-3 gap-2 mt-4">
                                <div class="text-sm text-gray-600 text-right">last name:</div>
                                <div 
                                    class="col-span-2 font-semibold text-center"
                                    :class="[getUser?.lastName ? 'capitalize' : 'text-xs text-gray-600']"
                                >{{ getUser?.lastName ?? 'no last name'}}</div>
                            </div>

                            <div class="grid grid-cols-3 gap-2 mt-4">
                                <div class="text-sm text-gray-600 text-right">other names:</div>
                                <div 
                                    class="col-span-2 font-semibold text-center"
                                    :class="[getUser?.otherNames ? 'capitalize' : 'text-xs text-gray-600']"
                                >{{ getUser?.otherNames ?? 'no other names'}}</div>
                            </div>

                            <div class="grid grid-cols-3 gap-2 mt-4">
                                <div class="text-sm text-gray-600 text-right">date of birth:</div>
                                <div 
                                    class="col-span-2 font-semibold text-center"
                                    :class="[getUser?.dob ? 'capitalize' : 'text-xs text-gray-600']"
                                >{{ getUser?.dob ? computedDob : 'no date of birth'}}</div>
                            </div>

                            <div class="grid grid-cols-3 gap-2 mt-4">
                                <div class="text-sm text-gray-600 text-right">gender:</div>
                                <div 
                                    class="col-span-2 font-semibold text-center"
                                    :class="[getUser?.gender ? 'capitalize' : 'text-xs text-gray-600']"
                                >{{ getUser?.gender ?? 'not set'}}</div>
                            </div>

                            <div class="grid grid-cols-3 gap-2 mt-4">
                                <div class="text-sm text-gray-600 text-right">email:</div>
                                <div 
                                    class="col-span-2 font-semibold text-center"
                                    :class="[getUser?.email ? '' : 'text-xs text-gray-600']"
                                >{{ getUser?.email ?? 'no email'}}</div>
                            </div>
                            
                            <div class="edit-user mt-4 flex justify-end">
                                <post-button buttonText='edit user'
                                    @click="editUser"
                                ></post-button>
                            </div>

                            <div class="w-full h-1 rounded absolute top-0 left-0 bg-gradient-to-r from-youredubrown to-youredugreen"></div>
                        </div>
                    </div>
                </div>
                <div class="welcome-body">
                    <div class="welcome-places bg-white shadow-md p-4">
                        <div class="places-heading">
                            the locations you should know about
                        </div>
                        
                        <welcome-button @welcomeButtonClicked="home=!home" :activeClass="home" buttonText='home'>
                        </welcome-button>
                        <fade-in-out>
                            <template #transition>
                                <place-description v-if="home">
                                    <template #body>
                                        <div class="section-body">
                                            this is where the entire community of
                                            
                                            <div class="image">
                                                <!-- <img src="YPlogo.png"> -->
                                                <span class="caption">learners</span>
                                            </div> 
                                            <div class="image">
                                                <!-- <img src="YPlogo.png"> -->
                                                <span class="caption">facilitators</span>
                                            </div>
                                            
                                            <div class="image">
                                                <!-- <img src="YPlogo.png"> -->
                                                <span class="caption">schools</span>
                                            </div> 
                                            <div class="image">
                                                <!-- <img src="YPlogo.png"> -->
                                                <span class="caption">educational professionals</span>
                                            </div> will socially interact, "educationally..."
                                        </div>
                                    </template>
                                    <template #button>
                                        <div>
                                            <post-button buttonText='home'
                                                @click="clickedPostButton"
                                            ></post-button>
                                        </div>
                                    </template>
                                </place-description>
                            </template>
                        </fade-in-out>
                            
                        <welcome-button @welcomeButtonClicked="dashboard=!dashboard" :activeClass="dashboard" buttonText='dashboard'>
                        </welcome-button>
                        <fade-in-out>
                            <template #transition>
                                <place-description v-if="dashboard">
                                    <template #body>
                                        <div>
                                            <div class="section-body">
                                                this section is so personal to you.
                                                this is where you will get to add or access private information.
                                                you will only be able to access one
                                            </div>
                                        </div>
                                    </template>
                                    <template #button>
                                        <div>
                                            <post-button buttonText='dashboard'
                                                @click="clickedPostButton"
                                            ></post-button>
                                        </div>
                                    </template>
                                </place-description>
                            </template>
                        </fade-in-out>

                        
                        <welcome-button @welcomeButtonClicked="profile=!profile" :activeClass="profile" buttonText='profile'>
                        </welcome-button>
                        <fade-in-out>
                            <template #transition>
                                <place-description v-if="profile" :info='info'>
                                    <template #body>
                                        <div>
                                            <div class="section-body">
                                                this is where you will get to show the world who you are and what your contributions are
                                                to this new community.

                                                note:'you can see your profile in entirety or as specific user types such as Learner,
                                                Facilitator, Professional, etc. People who will visit your profile will only be seeing the 
                                                profile of the specific user type in which they are interested'
                                            </div>
                                        </div>
                                    </template>
                                    <template #button>
                                        <div>
                                            <post-button buttonText='profiles'
                                                @click="clickedPostButton"
                                            ></post-button>
                                            <div class="profiles" v-if="showProfiles">
                                                <div class="no-profile"
                                                    v-if="!computedProfiles.length"
                                                >no profiles</div>
                                                <profile-bar
                                                    v-for="(profile,index) in computedProfiles"
                                                    :key="index"
                                                    :smallType="true"
                                                    :profile="profile"
                                                    :navigate="false"
                                                    @clickedProfile="clickedProfile"
                                                ></profile-bar>
                                            </div>
                                        </div>
                                    </template>
                                    <template #info>
                                        
                                    </template>
                                </place-description>
                            </template>
                        </fade-in-out>
                        
                    </div>
                    <div class="welcome-who">
                        <div class="who-heading text-center">
                            additional roles you can play in YourEdu community
                        </div>
                        <div class="create-section" v-if="computedCreationSection">
                            <div class="title">
                                creation of the various community members
                            </div>
                                <place-description>
                                    <template #body>
                                        <div class="question">
                                            who will I be?
                                        </div>
                                        <div class="answer">
                                            {{who}}
                                        </div>
                                        <div class="question">
                                            what can I do?
                                        </div>
                                        <div class="answer">
                                            {{what}}
                                        </div>
                                    </template>
                                    <template #button>
                                        <div>
                                            <post-button 
                                                :buttonText="become" 
                                                @click="becomeClicked"
                                            ></post-button>
                                        </div>
                                    </template>
                                </place-description>
                        </div>
                        <div class="users">
                            <welcome-button 
                                v-if="!isLearner"
                                @welcomeButtonClicked="formType = 'learner'" 
                                :activeClass="formType === 'learner'" buttonText='learner'>
                            </welcome-button>
                            <welcome-button 
                                v-if="!isParent"
                                @welcomeButtonClicked="formType = 'parent'" 
                                :activeClass="formType === 'parent'" buttonText='parent'>
                            </welcome-button>
                            <welcome-button
                                v-if="!isFacilitator"
                                @welcomeButtonClicked="formType = 'facilitator'" 
                                :activeClass="formType === 'facilitator'" buttonText='facilitator'>
                            </welcome-button>
                            <welcome-button 
                                v-if="schoolsCount < 3"
                                @welcomeButtonClicked="formType = 'school'" 
                                :activeClass="formType === 'school'" buttonText='school'>
                            </welcome-button>
                            <welcome-button 
                                v-if="professionalsCount < 3"
                                @welcomeButtonClicked="formType = 'professional'" 
                                :activeClass="formType === 'professional'" buttonText='professional'>
                            </welcome-button>
                        </div>
                    </div>
                </div>
            </div>
        </div>

        <create-account
            :type="formType"
            :show="showModal"
            @closeCreateAccount='showModal = false'
        ></create-account>

        <edit-user
            :fireAction='editUserForm'
            :showForm="editUserForm"
            @mainModalDisappear='editUserForm = false'
        ></edit-user>
    </div>
</template>

<script>
import PlaceDescription from '../components/welcome/PlaceDescription.vue'
import FadeInOut from '../components/transitions/FadeInOut.vue'
import FadeUp from '../components/transitions/FadeUp.vue'
import FadeLeft from '../components/transitions/FadeLeft.vue'
import WelcomeButton from '../components/welcome/WelcomeButton.vue'
import PostButton from '../components/PostButton.vue'
import EditUser from '../components/forms/EditUser.vue'
import CreateAccount from '../components/forms/CreateAccount.vue'
import BlackWhiteBadge from '../components/BlackWhiteBadge.vue'
import { mapGetters, mapActions } from 'vuex'
import { dates } from "../services/helpers";
import { useRouter } from 'vue-router'

    export default {
        components: {
            CreateAccount,
            EditUser,
            FadeUp,
            FadeInOut,
            FadeLeft,
            PlaceDescription,
            PostButton,
            
            BlackWhiteBadge,
            WelcomeButton,
        },
        data() {
            return {
                info: '',
                showModal: false,
                home: false,
                dashboard: false,
                profile: false,
                showProfiles: false,
                who: '',
                what: '',
                formType: '',
                formError: '',
                editUserForm: false,
                become: 'become learner',
                showEditBadge: false,
            }
        },
        watch: {
            showProfiles(newValue){
                if (newValue) {
                    // setTimeout(() => {
                    //     this.showProfiles = false
                    // }, 4000);
                }
            },
            formType(newValue) {
                if (newValue === 'learner') {
                    this.who = 'learner'
                    this.what = 'learner'
                    this.become = 'become learner'
                    this.info = ''
                } else if (newValue === 'parent') {
                    this.what = 'parent'
                    this.who = 'parent'
                    this.become = 'become a parent'
                    this.info = ''
                } else if (newValue === 'facilitator') {
                    this.info = ''
                    this.what = 'facilitator'
                    this.who = 'facilitator'
                    this.become = 'become a facilitator'
                } else if (newValue === 'professional') {                        
                    this.what = 'professional'
                    this.become = this.hasProfessionals ? 'create another professional': 'become a professional'
                    this.info = this.hasProfessionals ? 'You already have professional account(s). Note: You can only own a majority of three': ''
                } else if (newValue === 'school') {
                    this.what = 'school'
                    this.who = 'school'
                    this.become = this.hasSchools ? 'create another school': 'own school'
                    this.info = this.hasSchools ? 'You already own school account(s). Note: You can only own a majority of three': ''
                }
            },
        },
        created () {
            // this.learner = true
        },
        computed: {
            ...mapGetters(['getUserUsername', 'getUser', 'getUserAge',
                'professionalsCount','schoolsCount', 'getProfiles',
                'isFacilitator','isLearner','isParent','authenticatingUser'
            ]),
            computedProfiles(){
                if (this.getProfiles) {
                    return this.getProfiles.filter(profile=>{
                        return profile.userId === this.getUser.id
                    })
                } else return []
            },
            newCreation(){
                let today = new Date()
                if (this.getUser) {
                    let createdAt = new Date(this.getUser.created_at)
                    return dates.dateDiff(dates.toDate(createdAt),dates.toDate(today)) === 0 ? true : false
                }
                return false
            },
            computedCreationSection(){
                return this.formType.length ? true : false
            },
            computedDob(){
                let dob = this.getUser.dob 
                if (!dob) return null

                return new Date(dob).toDateString()
            }
        },
        methods: {
            clickedPostButton(data){
                const router = useRouter()
                
                if (data === 'profiles') {
                    this.showProfiles = true
                } else if (data === 'dashboard') {
                    router.push({name:'dashboard'})
                }  else if (data === 'home') {
                    router.push({name:'home'})
                } 
            },
            clickedProfile(profile){
                const router = useRouter()

                router.push({
                    name: 'profile',
                    params:{
                        account: profile.account,
                        accountId: profile.accountId,
                    }
                })
            },
            editUser(){
                this.editUserForm = true
            },
            modalAppear(){
                // this.showModal = true
            },
            modalDisappear(){
                this.showModal=false
            },
            becomeClicked(buttonText){                
                this.showModal = true
            },
        },
    }
</script>

<style lang="scss" scoped>

$welcome-main-color: rebeccapurple;

    .loading{
        width: 100%;
        height: 100vh;
        display: flex;
        justify-content: center;
        align-items: center;
    }

    .welcome-wrapper{
        // background-color: aliceblue;

        .welcome-message{
            display: block;
            margin: 10px auto 5%;
            text-align: center;
            position: relative;

            
            .first-section{
                background-color: aqua;
                min-height: 40px;
                width: 50%;
                margin: 10px auto;
                border-radius: 5px;
                text-align: center;
                font-size: 20px;
                position: relative;

                .name{
                    font-weight: 900;
                    overflow: hidden;
                    text-overflow: ellipsis;
                    white-space: nowrap;
                    font-size: 16px;
                }
            }
            

            .second-section{
                background-color: aqua;
                min-height: 80px;
                width: 60%;
                margin: 10px auto;
                border-radius: 5px;
                padding: 0 10px;
                font-size: 16px;
                position: relative;

                .name{
                    width: 60%;
                    padding: 10px;
                    text-transform: capitalize;
                    font-weight: 500;
                    overflow: hidden;
                    text-overflow: ellipsis;
                    white-space: nowrap;
                    margin: 0 auto;
                }

                .special{
                    width: 90%;
                    font-size: 14px;
                    font-style: italic;
                    text-align: justify;
                    padding: 10px;
                    margin: 10px auto;
                }
            }
        }

        .welcome-body{
            display: flex;
            justify-content: space-around;
            margin: 2% 0;

            .welcome-places,
            .welcome-who{
                display: block;
                max-width: 30%;
                text-align: center;
                font-size: 16px;

                .places-heading,
                .who-heading{
                    display: block;
                    color: $color-secondary;
                    font-weight: 800;
                    font-size: 18px;
                    font-variant: small-caps;
                    margin-bottom: 10px;
                    padding: 5px;
                }
            }

            .welcome-places{

                .edit-user{
                    width: 80%;
                    height: 100px;
                    margin: 10px auto;
                    display: flex;
                    justify-content: center;
                    align-items: center;
                }
            }

            .welcome-who{
                display: block;
                min-width: 60%;

                .who-heading{
                    text-align: right;
                }

                .create-section{
                    min-height: 200px;
                    width: 90%;
                    margin: 10px auto;

                    .title{
                        font-weight: 600;
                        border-bottom: 1px solid $welcome-main-color;
                        margin: 10px 0 20px;
                    }
                }

                .users{
                    margin: 20px auto 10px;
                    width: 60%;
                }
            }
        }
    }


/* ........................................... */

@media screen and (max-width:800px){
    .welcome-wrapper {

        .welcome-message{
            font-size: 18px;

            .first-section{
                width: 80%;
            }

            .second-section{
                width: 90%;
            }
        }
       
        .welcome-body{
            margin: 2% auto;
            display: block;

            .welcome-places{
                max-width: 80%;
                font-size: 14px;
                margin: 20px auto 40px;

                .places-heading{
                    font-size: 16px;
                }
            }

            .welcome-who{
                font-size: 14px;
                max-width: 80%;
                margin: 0 auto 40px;

                .who-heading{
                    font-size: 16px;
                }
            }

            .users{
                margin: 20px auto 10px;
                width: 60%;
            }
        }
    }
}

</style>