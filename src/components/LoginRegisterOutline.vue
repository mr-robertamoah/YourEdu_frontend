<template>
    <div class="mt-20">
        <div class="login">
            <div class="loading-state">
                <sync-loader
                    :loading="store.getters.authenticating"
                ></sync-loader>
            </div>
            <validation-error class="validation" 
                @clearValidation='issueClearValidation()'
                :errorString='validationErrors'
                v-if="showAuthenticatingErrorMessage">
            </validation-error>
            <validation-error class="validation" 
                @clearValidation='issueClearValidation()'
                :isString="false"
                :errors='store.getters.getValidationErrors'
                v-if="showValidationErrors">
            </validation-error>
            <div class="section-other">
                <div class="mr-auto ml-4">
                    <div class="section-other-login">
                        <span class="mr-2">
                            <slot name="title-icon"></slot>
                        </span>
                        <span>
                            {{title}}
                        </span>
                    </div>

                    <YourEduLogo class="w-16 md:w-24 mt-4"/>
                </div>
            </div>
            <div class="section-main py-3">

                <div class="">
                    <form @submit.prevent class="mt-3 mb2">
                        <slot name="login-controls"></slot>
                    </form>
                </div>
                <div class="other-link">
                    <div v-if="currentLocation==='login'">
                        if you have not registered, 
                        <router-link to="/register">register</router-link>
                    </div>
                    <div v-if="currentLocation==='register'">
                        if you have already registered, 
                        <router-link to="/login">login</router-link>
                    </div>
                    <div>
                        go 
                        <router-link to="/">home</router-link>
                    </div>
                </div>
            </div>
        </div>
    </div>
</template>

<script setup>
import { useRoute } from "vue-router";
import ValidationError from "./ValidationError.vue";
import { useStore } from "vuex";
import YourEduLogo from "./YourEduLogo.vue";
import "v3-infinite-loading/lib/style.css"
import { computed, ref, watch } from "vue";

const store = useStore()
const route = useRoute()

const emits = defineEmits(['clear'])

const props = defineProps({
    title: {
        type: String,
        default: ''
    },
    theErrorMessage: {
        type: String,
        default: ''
    },
})

const showErrorMessage = ref(null)
const specialErrorMessage = ref(null)

watch(() => props.theErrorMessage, (newValue) => {
    showErrorMessage.value = newValue
})

function issueClearValidation(){
    specialErrorMessage.value = ''
    emits('clear')
    store.dispatch('clearValidation')
}

const currentLocation = computed(() => {
    return route.name
})

const validationErrors = computed(() => {
    return specialErrorMessage.value ? specialErrorMessage.value :
        showErrorMessage.value ? showErrorMessage.value : ''
        // 'You may have entered a wrong username or password'
})

const showValidationErrors = computed(() => {
    if (!store.getters.getValidationErrors) {
        return false
    }
    
    return true
})

const showAuthenticatingErrorMessage = computed(() => {
    if (!showValidationErrors.value) {
        let errorMessage = store.getters.authenticatingErrorMessage ?? ''
        
        if ( errorMessage && errorMessage.includes('Server Error')) {
            specialErrorMessage.value = 'The server may be down. Please try again in a few minutes. Apologizes'
            return true
        } 
        else if (errorMessage.includes('Unauthorized')) {
            if (route.name === 'login') {
                specialErrorMessage.value = 'Please enter the correct username or email and password combination'
            }
            
            return true
        } 
        else if (errorMessage.includes('Unauthenticated')) {
            specialErrorMessage.value = 'Please you are unauthorized. Log in again'
            return true
        } 
        else if (errorMessage) {
            specialErrorMessage.value = 'Something broke somewhere. Please try again or alert us via a complaint.'
            return true
        }
        else if (props.theErrorMessage) {
            showErrorMessage.value = props.theErrorMessage
            return true
        }
        
        return false
    }
})

function created () {
    showErrorMessage.value = props.theErrorMessage
}
</script>

<style lang="scss">
$mainSectionColor : rgb(255, 248, 220, .8);
$buttonBackground : rgba(2, 104, 90, .6);

@mixin rotate($deg){
    -webkit-transform: rotate($deg);
    -o-transform: rotate($deg);
    -moz-transform: rotate($deg);
    -ms-transform: rotate($deg);
    transform: rotate($deg);
}

@mixin backgroundTransition($time){
    transition-property: background-color;
    transition-duration: $time;
}

.login{
    display: block;
    width: 100%;
    margin: 40px auto 0;
    background-color: cornsilk;
    min-height: 70vh;

    .other-link{
        position: absolute;
        bottom: -45px;
        text-align: center;

        div{
            width: auto;
            margin: 0 auto;
            font-size: 14px;

            a{
                text-decoration: none;
                color: $buttonBackground;
                font-weight: 800;
            }
        }
    }

    .loading-state{
        width: 40%;
        // background-color: rgba(153, 205, 50, 0.4);
        // color: rgba(153, 205, 50, 0.9);
        // font-weight: 800;
        // padding: 10px;
        text-align: center;
        position: absolute;
        top: 8%;
        left: 30%;
    }
}

.section-other{
    @include rotate(10deg);
    background-color: $background-color-other;
    height: 70vh;
    width: 50%;
    position: absolute;
    display: flex;
    justify-content: center;
    align-items: center;

    > div:first-child{
        @include rotate(-10deg);
    }

    .section-other-login{
        font-size: 3vw;
        font-weight: 800;
        display: flex;
    }
}

.section-main{
    background-color: $color-primary;
    width: 70%;
    min-height: 70vh * 0.65;
    border-radius: 0 2vw 2vw 0;
    margin: 0 0 0 auto;
    position: absolute;
    top: 15vh;
    left: 30%;
    display: flex;
    justify-content: center;
    align-items: center;

    > div:first-child{
        width: 80%;
    }
    .form-control{
        margin: 0 !important;
    }

    .form-section{
        width: 100%;
        display: flex;
        flex-wrap: wrap;
        justify-content: space-between;
        align-self: center;
        margin-top: 10px;

        label{
            width: 100%;
            color: $mainSectionColor;
        }
    }

    .login-btn{
        width: auto;
        display: block;
        margin: 0 auto;
        background-color: $buttonBackground;
        border-radius: 10vh;
        border: 1px solid rgba(2, 104, 90, 1);
        color: $mainSectionColor;
        @include backgroundTransition(1s);
        font-size: 3vw;

        &:hover{
            background-color: rgba(2, 104, 90, 1);
        }
    }

    .login-with{
        margin-top: 20px;
        font-size: 2.5vw;
    }
    .login-type-btn{
        color: rgb(2, 104, 90);
        border-radius: 10vh;
        background-color: $mainSectionColor;
        border: 1px solid rgba(255, 248, 220, .8);
        @include backgroundTransition(1s);
        font-size: 3vw;

        &:hover{
            background-color: rgba(255, 248, 220, .8);
        }
    }

    .register-datepicker-section{
        .form-control .form-control:disabled, .form-control .form-control[readonly] {
            border: 2px solid rgba(22, 233, 205, 1);
            border-radius: 10px;
            background-color: white;
            opacity: 1;
        }
    }
}

.cursor-pointer{
    cursor: pointer;
}

 /* Extra small devices (phones, 600px and down) */
@media only screen and (max-width: 500px) {
    .login{
        
        .other-link{
            bottom: -40px;
        }

        .validation{
            .validation-errors{
                font-size: 14px;
            }
        }
    }
}

/* Small devices (portrait tablets and large phones, 600px and up) */
@media only screen and (min-width: 600px) {
    .section-main{
        .login-btn{
            font-size: 2vw;
        }

        .login-with{
            font-size: 1.5vw;
        }
        .login-type-btn{
            font-size: 2vw;
        }
    }
}

/* Medium devices (landscape tablets, 768px and up) */
@media only screen and (min-width: 768px) {
    .login {
        width: 60%;
    }

    .section-main{
        width: 50%;
        left: 45%;

        .login-btn{
            font-size: 1.5vw;
        }

        .login-with{
            font-size: 1vw;
        }
        .login-type-btn{
            font-size: 1.5vw;
        }
    }
}

/* Large devices (laptops/desktops, 992px and up) */
@media only screen and (min-width: 992px) {
    
}

/* Extra large devices (large laptops and desktops, 1200px and up) */
@media only screen and (min-width: 1200px) {
    
} 
</style>