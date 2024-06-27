<template>
    <div class="">
        <app-nav></app-nav>
        
        <login-register-outline title="Login" 
            :theErrorMessage='errorMessage'
            @clear="clearErrorMessage"
        >
            <template v-slot:login-controls>
                
                <div class="form-group form-section" v-if="signinWith==='username'">
                    <label for="login-username">username *</label>
                    <text-input placeholder="your username"
                        v-model="data.username"
                        :error='errors.username'
                    ></text-input>
                </div>
                <div class="form-group form-section" v-else-if="signinWith==='email'">
                    <label for="login-email">email *</label>
                    <text-input placeholder='your email'
                        v-model="data.email"
                        :error='errors.email'
                    ></text-input>
                </div>
                <div class="form-group form-section">
                    <label for="login-password">password *</label>
                    <text-input placeholder="your password"
                        :inputType="passwordType" 
                        v-model="data.password"
                        :error='errors.password'
                        @iconChange='passwordIconChange' 
                        :title='passwordTitle'
                        :icon='passwordIcon'
                        :prepend='true'
                    ></text-input>
                </div>

                <button type="submit" class="btn login-btn my-auto bg-slate-600"
                    @click.prevent="sendLoginDetails"    
                >login</button>
                
                <div class="login-with">
                    <button class="btn login-type-btn" 
                        @click.prevent="setToEmail"
                        v-if="signinWith==='username'"
                        >use email</button>
                    <button class="btn login-type-btn" 
                        @click.prevent="setToUsername"
                        v-if="signinWith==='email'"
                    >use username</button>
                </div>
            </template>
            
            <template v-slot:title-icon>
                <font-awesome-icon :icon="['fas','sign-in-alt']"/>
            </template>

        </login-register-outline>
        
    </div>
</template>

<script setup>
import { useRoute, useRouter } from 'vue-router';
import LoginRegisterOutline from '../components/LoginRegisterOutline.vue'
import TextInput from '../components/TextInput.vue'
import { useStore } from "vuex";
import { onBeforeUnmount, ref, watch } from 'vue';

const store = useStore()
const route = useRoute()
const router = useRouter()

const signinWith = ref('username')
const data = ref({
    username: '',
    email: '',
    password: '',
})
const errors = ref({
    username: '',
    email: '',
    password: '',
})
const errorMessage = ref('')
const passwordTitle = ref('show password')
const passwordType = ref('password')
const emailError = ref(false)
const usernameError = ref(false)
const passwordError = ref(false)
const passwordIcon = ref(['fa','eye'])
    
watch(() => data.value.username, () => {
    errors.value.username = false
})
watch(() => data.value.email, () => {
    errors.value.email = false
})
watch(() => data.value.password, () => {
    errors.value.password = false
})

onBeforeUnmount(() => {
    clearCredentials()
})

function clearErrorMessage(){
    errorMessage.value = ''
}
function clearCredentials(){
    data.value.username = true
    data.value.email = true
    data.value.password = true
}
function setToEmail(){
    signinWith.value = 'email'
    clearCredentials()
}
function setToUsername(){
    signinWith.value = 'username'
    clearCredentials()
}
async function sendLoginDetails(){
    
    if (signinWith.value ==='username' && data.value.username === '') {
        errorMessage.value = 'Please enter your username in the field.'
        errors.value.username = true
    } 
    else if (signinWith.value ==='email' && data.value.email === '') {
        errorMessage.value = 'Please enter your email in the field.'
        errors.value.email = true
    }
    else if (data.value.password ==='') {
        errorMessage.value = 'Please enter your password in the field.'
        errors.value.password = true
    }
    else if (data.value.username.trim().length < 8) {
        errorMessage.value = 'Please your username is too short.'
        errors.value.username = true
    }
    else if (data.value.password.trim().length < 8) {
        errorMessage.value = 'Please your password is too short.'
        errors.value.password = true
    }
    else{
        //only send login data based on users choice
        let loginCredentials = {}
        if (signinWith.value ==='username') {
            loginCredentials = {
                password: data.value.password.trim(),
                username: data.value.username.trim(),
                loginOrRegister: true
            }
        }
        if (signinWith.value ==='email') {
            loginCredentials = {
                password: data.value.password.trim(),
                email: data.value.email.trim(),
                loginOrRegister: true
            }
        }

        loginCredentials.redirectTo = route.query?.redirectTo

        const res = await store.dispatch('login', loginCredentials)

        if (res?.status) {

            followersAndFollowings()
            router.push( route.query?.redirectTo || '/')
        }
        
        if (res?.message) {
            errorMessage.value = res.message
            return
        }
        errorMessage.value = 'Something unfortunate happened. Please try again shortly.'
    }
}
function followersAndFollowings(){
    store.dispatch('getFollowers')
    setTimeout(() => {
        store.dispatch('getFollowings')
    }, 2000);
}
function passwordIconChange(){
    if (passwordIcon.value[1] === 'eye') {
        passwordIcon.value[1] = 'eye-slash'
        passwordType.value = 'text'
        passwordTitle.value = 'hide password'
    } else {
        passwordIcon.value[1] = 'eye'
        passwordType.value = 'password'
        passwordTitle.value = 'show password'
    }
}
</script>

<style lang="scss" scoped>

</style>