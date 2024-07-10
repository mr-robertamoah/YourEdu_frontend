<template>
    <div>
        <app-nav></app-nav>

        <login-register-outline title="Register"
            :theErrorMessage='errorMessage' 
            @clear="clearErrorMessage"
        >
            <template v-slot:login-controls>
                <div class="section-one" 
                    v-show="registrationSection===null || registrationSection===1">
                    <div class="form-group form-section text">
                        <label for="login-username">username *</label>
                        <text-input placeholder="your username"
                            v-model="data.username"
                            :error='!!errors.username'
                        ></text-input>
                    </div>
                    <div class="form-group form-section">
                        <label for="login-email">email</label>
                        <text-input placeholder="your email"
                            v-model="data.email"
                            :error='!!errors.email'
                        ></text-input>
                    </div>
                    <div class="form-group form-section">
                        <label for="login-password">password *</label>
                        <text-input placeholder="your password"
                            :textInput="passwordType" 
                            v-model="data.password"
                            :error='!!errors.password'
                            @iconChange='passwordIconChange' 
                            :title='passwordTitle'
                            :icon='passwordIcon'
                            :inputType="passwordType"
                            :prepend='true'
                        ></text-input>
                    </div>
                    <div class="form-group form-section">
                        <label for="login-confirmation">password confirmation *</label>
                        <text-input placeholder="your password confirmation"
                            :textInput="passwordConfirmationType" 
                            v-model="data.passwordConfirmation"
                            :error='!!errors.passwordConfirmation'
                            :inputType="passwordType"
                            @iconChange='passwordIconChange' 
                            :title='passwordConfirmationTitle'
                            :icon='passwordIcon'
                            :prepend='true'
                        ></text-input>
                    </div>
                </div>
                <div class="section-two" v-show="registrationSection===2">
                    <div class="form-group form-section">
                        <label for="login-first-name">first name</label>
                        <text-input placeholder="your first name"
                            v-model="data.firstName"
                        ></text-input>
                    </div>
                    <div class="form-group form-section">
                        <label for="login-last-name">last name</label>
                        <text-input placeholder="your last name"
                            v-model="data.lastName"
                        ></text-input>
                    </div>
                    <div class="form-group form-section">
                        <label for="login-other-names">other names</label>
                        <text-input placeholder="your other names"
                            v-model="data.otherNames"
                        ></text-input>
                    </div>
                    <div class="form-group form-section register-datepicker-section">
                        <label for="register-datepicker">date of birth</label>
                        <!-- <FlatPickrInput id="register-datepicker" :config="config"
                            v-model="data.dob" class=" form-control mb-2"></FlatPickrInput> -->
                        <text-input placeholder="select date of birth"
                            v-model="data.dob"
                            :inputType="'date'"
                        ></text-input>
                    </div>
                    <button class="btn login-btn mb-3" 
                        @click.prevent="sendRegistrationDetails">register</button>
                </div>
                <button class="btn login-btn" 
                    @click.prevent="nextSection">{{sectionButtonText}}</button>
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
import { mapActions, mapGetters, useStore } from "vuex";
import { ref, watch } from 'vue';
// import "v3-infinite-loading/lib/style.css"
import FlatPickrInput from '../components/FlatPickrInput.vue';

const store = useStore()
const route = useRoute()
const router = useRouter()

const data = ref({
    username: '',
    email: '',
    password: '',
    firstName: '',
    lastName: '',
    otherNames: '',
    dob: '',
    passwordConfirmation: '',
})
const registrationSection = ref(null)
const sectionButtonText = ref('next')
const errorMessage = ref('')
const config = ref({
    maxDate: 'today',
    dateFormat: 'Y-m-d',
    altInput: true,
    altFormat: "F j, Y",
    defaultDate:['1990-01-01']
})
const passwordTitle = ref('show password')
const passwordConfirmationTitle = ref('show password')
const passwordType = ref('password')
const passwordConfirmationType = ref('password')
const errors = ref({
    username: '',
    email: '',
    password: '',
    passwordConfirmation: '',
})
const passwordIcon = ref(['fa','eye'])

watch(() => data.value.username, () => {
    errors.value.username = false
})
watch(() => data.value.email, () => {
    errors.value.email = false
})
watch(() => data.value.password, () => {
    errors.value.password = false
    errors.value.passwordConfirmation = false
})

function clearErrorMessage(){
    errorMessage.value = ''
}
function clearCredentials(){
    data.value.username = ''
    data.value.email = ''
    data.value.password = ''
    data.value.passwordConfirmation = ''
    data.value.firstName = ''
    data.value.lastName = ''
    data.value.otherNames = ''
    data.value.dob = ''
}
function nextSection(){
    errorMessage.value = ''
    if (registrationSection.value === null || registrationSection.value === 1) {
        
        if (!data.value.username) {
            errorMessage.value = 'Please, enter your username in the field.'
            errors.value.username = true
        }
        else if(data.value.username?.length < 8){
            errorMessage.value = 'Please, your username should have at least 8 characters.'
            errors.value.username= true
        }
        else if(!data.value.password){
            errorMessage.value = 'Please, enter your password in the field.'
            errors.value.password= true
        }
        else if(!data.value.passwordConfirmation){
            errorMessage.value = 'Please, confirm your password in the field.'
            errors.value.passwordConfirmation= true
        }
        else if(data.value.password !== data.value.passwordConfirmation){
            errorMessage.value = 'Please, password confirmation must match password.'
            errors.value.password= true
            errors.value.passwordConfirmation= true
        }
        else{
            registrationSection.value = 2
            sectionButtonText.value = 'previous'
        }
        
    } else if (registrationSection.value === 2){
        registrationSection.value = 1
        sectionButtonText.value = 'next'
    }
}
async function sendRegistrationDetails(){

    let registrationCredentials = {
        username: data.value.username.trim(),
        email: data.value.email.trim(),
        password: data.value.password.trim(),
        passwordConfirmation: data.value.passwordConfirmation.trim(),
        first_name: data.value.firstName.trim(),
        last_name: data.value.lastName.trim(),
        other_names: data.value.otherNames.trim(),
        dob: data.value.dob.trim(),
    }
    
    let response = await store.dispatch('register', registrationCredentials)

    if (!response.status) return

    if (response.user) router.push( route.query?.redirectTo || '/welcome')

    clearCredentials()
}
function passwordIconChange(){
    if (passwordIcon.value[1] === 'eye') {
        passwordIcon.value[1] = 'eye-slash'
        passwordType.value = 'text'
        passwordConfirmationType.value = 'text'
        passwordTitle.value = 'hide password'
        passwordConfirmationTitle.value = 'hide password'
        return
    }

    passwordIcon.value[1] = 'eye'
    passwordConfirmationType.value = 'password'
    passwordType.value = 'password'
    passwordConfirmationTitle.value = 'show password'
    passwordTitle.value = 'show password'
}
</script>

<style lang="scss">
$sectionMainBackground: rgba(22, 233, 205, 0.65);

    .form-control:disabled, .form-control[readonly] {
        border: 2px solid rgba(22, 233, 205, 1);
        border-radius: 10px;
        background-color: white;
        opacity: 1;
    }
</style>