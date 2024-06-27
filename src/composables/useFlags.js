import { useStore } from 'vuex';
import { useRoute } from 'vue-router';
import { ref, watch } from 'vue';
import useAlert from './useAlert';
import useModal from './useModal';
import useProfiles from './useProfiles';

export default function useFlags(computedItem) {

    const store = useStore()
    const {alertData} = useAlert()
    const {issueCustomMessage, clearSmallModal} = useModal()
    const {profilesAppear, profilesData} = useProfiles()
    const route = useRoute()
    const listening = ref(false)
    const flagData = ref({
        isFlagged: false,
        myFlag: null,
        flagReason: '',
        flagTitle: '',
        flagRed: '',
        showReason: false,
    })

    watch(() => flagData.value.isFlagged, (newValue) => {
        if (newValue) {
            flagData.value.flagTitle = 'unflag this discussion'
            flagData.value.flagRed = 'red'
        } else {
            flagData.value.flagTitle = 'flag this discussion'
            flagData.value.flagRed = ''
        }
    })
    watch(() => flagData.value.myFlag, (newValue) => {
        if (newValue) {
            flagData.value.isFlagged = true
            return
        }
        
        flagData.value.isFlagged = false
    })
    
    function listenForFlags() {
        if (listening.value) return

        listening.value = false

        Echo.channel(`youredu.${computedItem.item}.${computedItem.itemId}`)
            .listen('.newFlag', data=>{
                store.dispatch(`${route.name}/newFlag`, {
                    ...computedItem,
                    flag: data.flag
                })
            })
            .listen('.deleteFlag', data => {
                
                if (computedItem.item === 'comment') return
                
                store.dispatch(`${route.name}/removeFlag`, {
                    ...computedItem,
                    flagId: data.flagId
                })
            })
    }
    
    function reasonGiven(data){
        flagData.value.showReason = false
        flagData.value.flagReason = data
        profilesAppear()
    }

    function continueFlagProcess(){
        flagData.value.flagReason = null
        flagData.value.showReason = false
        profilesAppear()
    }

    function cancelFlagProcess(){
        flagData.value.flagReason = ''
        flagData.value.showReason = false
    }

    function clickedFlag({disabled, banned, emits, schoolAdmin}){
        if (disabled || banned) return

        if (flagData.value.isFlagged) {
            flag({who: null, schoolAdmin, emits})
            return
        }

        if (!store.getters.getUser) {
            emits('askLoginRegister', computedItem.item)
            return
        }
        
        if (!store.getters.getProfiles.length) {
            issueCustomMessage({
                type: 'info',
                message: 'you must have an account (eg. learner, parent, etc) before you can flag.',
            })
            
            clearSmallModal(false)
            return
        }
        
        profilesData.value.text = 'flag as'
        profilesData.value.action = 'flag'
        flagData.value.showReason = true
    }

    async function flag({who, emits, schoolAdmin}){
        let data = {}
        let response = null

        data.where = route.name
        data.itemId = computedItem.itemId
        data.item = computedItem.item
        
        if (schoolAdmin) data.adminId = schoolAdmin.id

        if (who) {
            data.account = who.account
            data.accountId = who.accountId
            data.reason = flagData.value.flagReason

            response = await store.dispatch('profile/createFlag', data)
        } 
        
        if (flagData.value.myFlag?.flagId && !store.getters.isAdult) {
            alertData.value.danger = true
            alertData.value.message = "sorry 😞, you cannot unflag because it was flagged by a parent or school"
            return
        }

        if (! who && flagData.value.myFlag) {

            data.flagId = flagData.value.myFlag.id

            response = await store.dispatch('profile/deleteFlag', data)
        }

        flagData.value.flagReason = ''

        if (! response.status) {

            alertData.value.danger = true
            alertData.value.message = 'oops! something unfortunate happened. try again later 😏'
            return
        }

        clearSmallModal()
        setMyFlag()
        alertData.value.success = true

        if (who) {
            alertData.value.message = 'successfully flagged'
            emits('flaggedSuccessful', computedItem) //postDeleteSuccess
            return
        }

        alertMessage = 'successfully unflagged'
         emits('unflaggedSuccessful', { //postUnflaggedSuccess
            flag: response.flag,
            ...computedItem
        })
    }

    function setMyFlag() {
        if (! store.getters.getUser || ! computedItem) {
            flagData.value.myFlag = null
            return
        }
        
        let index = computedItem.flags.findIndex(flag=>{
            return flag.userId == store.getters.getUser.id
        })

        if (index > -1) {
            flagData.value.myFlag = computedItem.flags[index]
            return
        }

        flagData.value.myFlag = null
    }

    return {
        flagData, cancelFlagProcess, continueFlagProcess, reasonGiven, listenForFlags, 
        setMyFlag, clickedFlag, flag
    }
}