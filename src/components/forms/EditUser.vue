<template> 
    <just-fade>
        <template #transition v-if="showForm">
            <main-modal :show="showForm" 
                @mainModalDisappear='closeModal'
                @clearAlert='clearAlert'
                :loading="computedLoading"
                heading="edit user information"
                :alertMessage="alertData.message"
                :requests="false"
                :mainOther="false"
                :alertError="alertData.danger"
                :alertSuccess="alertData.success"
            >   
                <template #loading>
                    <sync-loader :loading="computedLoading"></sync-loader>
                </template>
                <template #main>
                    <welcome-form>
                        <template #input>
                            <div class="form-edit">
                                <text-input type="text" 
                                    placeholder="first name" 
                                    :bottomBorder="true"
                                    v-model="data.firstName"></text-input>
                            </div>
                            <div class="form-edit">
                                <text-input type="text" 
                                    placeholder="last name"  
                                    :bottomBorder="true"
                                    v-model="data.lastName"></text-input>
                            </div>
                            <div class="form-edit">
                                <text-input type="text" 
                                    placeholder="other names"  
                                    :bottomBorder="true"
                                    v-model="data.otherNames"></text-input>
                            </div>
                            <div class="form-edit">
                                <text-input type="text" 
                                    placeholder="email"  
                                    :bottomBorder="true"
                                    v-model="data.email"></text-input>
                            </div>

                            <div class="form-edit">
                                <!-- <date-picker 
                                    :flatPickrConfig="{
                                                maxDate: 'today',
                                                dateFormat: 'F j, Y',
                                                altFormat: 'F j, Y',
                                            }"
                                    :placeholder="computedDob"
                                    @datePicked="dobPicked"
                                    :bottomBorder="true"
                                ></date-picker> -->
                                <text-input
                                    :inputType="'date'" 
                                    :placeholder="computedDob"
                                    v-model="data.dob"
                                    :bottomBorder="true"
                                ></text-input>
                            </div>

                            <main-list @listItemSelected='selectGender'
                                :multiple='false'
                                :value="data.gender"
                                select='choose your gender'
                                :itemList="['male','female']"
                                class="max-w-[70%]"
                            ></main-list>

                            <main-list @listItemSelected='selectSecret'
                                v-if="computedShowSecret"
                                :multiple='false'
                                :loading='loading'
                                select='choose a secret question to answer'
                                :itemList="secretQuestions"
                            ></main-list>

                            <div class="form-edit" v-if="showAnswerText">
                                <text-input type="text" 
                                    placeholder="your answer"  
                                    :bottomBorder="true"
                                    v-model="inputAnswer"></text-input>
                            </div>

                            <main-list @listItemSelected='selectAnswer'
                                :multiple='false'
                                v-if="showAnswerList"
                                select='choose your answer'
                                :itemList="possibleAnswers"
                            ></main-list>
                        </template>
                        <template #buttons>
                            <post-button buttonText='save' buttonStyle='success'
                                @click="clickedCreate"
                            ></post-button>
                        </template>
                    </welcome-form>
                </template>
            </main-modal>
        </template>
    </just-fade>
</template>

<script setup>
import DatePicker from '../DatePicker.vue'
import PostButton from '../PostButton.vue'
import MainList from '../MainList.vue'
import TextInput from '../TextInput.vue'
import { useStore } from 'vuex'
import { dates } from '../../services/helpers'
import { computed, ref, watch } from 'vue'
import useAlert from '../../composables/useAlert'

const { alertData, clearAlert, issueDangerAlert, issueSuccessAlert } = useAlert()

const emits = defineEmits(['mainModalDisappear'])
const store = useStore()
const props = defineProps({
    showForm: {
        type: Boolean,
        default: false
    },
    fireAction: {
        type: Boolean,
        default: false
    },
})

const data = ref({
    email: '',
    firstName: '',
    gender: '',
    lastName: '',
    otherNames: '',
    dob: '',
    answer: '',
})
const mainLoading = ref(false)
const showAnswerList = ref(false)
const showAnswerText = ref(false)
const secretQuestionId = ref(null)
const possibleAnswers = ref([])

const computedShowSecret = computed(() => {
    //have to change this part so you get secret questions even if you have not answered yours
    return store.getters.getUser?.secret_answer 
            ? false 
            : (
                (
                    !store.getters.getUser?.secret_answer && 
                    store.getters['miscellaneous/getSecretQuestions'].length > 0
                ) ? true : false
            )
})

const secretQuestions = computed(() => {
    return store.getters['miscellaneous/getSecretQuestions']
})

const computedLoading = computed(() => {
    return store.getters['miscellaneous/getLoadingContent'] ? 
        store.getters['miscellaneous/getLoadingContent'] : mainLoading.value
})

const computedDob = computed(() => {
    if (
        store.getters.getUser &&
        (
            dates.toDate(new Date(store.getters.getUser.created_at)) !== 
            dates.toDate(new Date(store.getters.getUser.dob))
        )
    ) return dates.dateReadable(store.getters.getUser.dob).slice(4)

    return 'your date of birth'
})

const loading = computed(() => {
    return store.getters['miscellaneous/getLoadingContent']
})

watch(() => props.fireAction, (newValue) => {
    if (newValue) {
        getSecretQuestions()
    }
})
watch(() => props.showForm, () => {
    data.value.firstName = data.value.firstName ? data.value.firstName : store.getters.getUser?.firstName
    data.value.lastName = data.value.lastName ? data.value.lastName : store.getters.getUser?.lastName
    data.value.otherNames = data.value.otherNames ? data.value.otherNames : store.getters.getUser?.otherNames
    data.value.gender = data.value.gender ? data.value.gender : store.getters.getUser?.gender
    data.value.email = data.value.email ? data.value.email : store.getters.getUser?.email
})

function dobPicked(date){
    data.value.dob = date
}

function closeModal(){
    emits('mainModalDisappear')
}

function getSecretQuestions(){
    store.dispatch('miscellaneous/getSecret')
}

async function clickedCreate(){    
    mainLoading.value = true

    data.value.firstName = data.value.firstName ? data.value.firstName : data.value.firstName.trim()
    data.value.lastName = data.value.lastName ? data.value.lastName : data.value.lastName.trim()
    data.value.otherNames = data.value.otherNames ? data.value.otherNames : data.value.otherNames.trim()
    data.value.email = data.value.email ? data.value.email : data.value.email.trim()

    let localData = {}
    
    if (data.value.gender)
        data.value.gender = data.value.gender === 'male'? 'MALE' : 'FEMALE'
    
    if (!store.getUser.secret_answer && data.value.dob) {
        localData['question_id'] = secretQuestionId.value

        if (data.value.answer?.trim()?.length)
            localData['answer'] = data.value.answer.trim()
        else {
            issueDangerAlert({message: 'please answer the question you selected'})
            return
        }
    }

    localData.first_name = data.value.firstName
    localData.last_name = data.value.lastName
    localData.other_names = data.value.otherNames
    localData.email = data.value.email
    localData.gender = data.value.gender

    if (data.value.dob && data.value.dob !== computedDob.value)
        localData['dob'] = data.value.dob.trim()

    let response = await store.dispatch('editUser', {
        user_id: store.getUser?.id,
        data: localData
    })

    mainLoading.value = false

    if (response === 'successful')
        issueSuccessAlert({ message: 'update was successful'})
    else
        issueDangerAlert({ message: 'update was unsuccessful'})
}

function selectAnswer(item){
    data.value.answer = item
}

function selectGender(item){
    data.value.gender = item
}

function selectSecret(item){
    data.value.answer = ''
    let qa = store.getters['miscellaneous/getSecretQuestionAnswers']
    let a = []
    a = qa.filter(function(el){
        return el.question === item
    })
    
    console.log(a[0].possibleAnswers)
    if (a[0].possibleAnswers.length > 0) {
        showAnswerList.value = true
        showAnswerText.value = false

        secretQuestionId.value = a[0].id
        possibleAnswers.value = a[0].possibleAnswers
    } else {
        showAnswerText.value = true
        showAnswerList.value = false
    }
}
</script>

<style lang="scss" scoped>

</style>