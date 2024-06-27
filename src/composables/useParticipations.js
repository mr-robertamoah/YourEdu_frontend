import { computed, ref } from 'vue'
import { useRoute } from 'vue-router'
import { useStore } from 'vuex'
import useAlert from './useAlert'

export default function useParticipations(computedItem) {
    const store = useStore()
    const route = useRoute()
    const { alertData, issueDangerAlertForResponse } = useAlert()

    const listening = ref(false)
    const removedParticipant = ref(null)
    const joinOrInvitationType = ref('')

    const computedPendingParticipant = computed(() => {
        return store.getters.getUser && 
            this.computedItemable.pendingParticipants.findIndex(pending=>{
                return pending.userId === store.getters.getUser.id
            }) > -1
    })
    
    function doneRemovingParticipant() {
        removedParticipant.value = null
    }

    function listenForParticipation({
        showDiscussionEdit = null, showDiscussionInfo = null, computedAdmin = false
    }) {
        if (listening.value) return

        listening.value = true

        Echo.channel(`youredu.${computedItem.item}.${computedItem.itemId}`)
            .listen('.newParticipant', data=>{
                
                store.dispatch(`${route.name}/newItemParticipant`, {
                    ...data,
                    ...computedItem
                })
                
                alertData.value.success = true
                alertData.value.message = 'a new participant just joined this discussion'
            })
            .listen('.updateParticipant', data=>{
                
                store.dispatch(`${route.name}/updateItemParticipant`, {
                    ...data,
                    ...computedItem
                })

                if (store.getters.getUser && data.participant.userId === store.getters.getUser.id) {
                    if (data.participant.state === 'RESTRICTED' ||
                        data.participant.state === 'BANNED') {
                        
                        if (showDiscussionInfo)
                            showDiscussionInfo.value = false

                        if (showDiscussionEdit)
                            showDiscussionEdit.value = false

                        alertData.value.danger = true
                        alertData.value.message = `you have been ${data.participant.state.toLowerCase()}`
                    }
                }                        
            })
            .listen('.removeParticipant', data=>{
                
                store.dispatch(`${route.name}/removeItemParticipant`, {
                    ...data,
                    ...computedItem
                })
                
                if (store.getters.getUser && data.userId === store.getters.getUser.id) {
                        
                    if (showDiscussionInfo)
                        showDiscussionInfo.value = false

                    if (showDiscussionEdit)
                        showDiscussionEdit.value = false

                    alertData.value.danger = true
                    alertData.value.message = `you have been removed`
                }    
            })
            .listen('.newPendingParticipant', data=>{
                if (computedAdmin) {
                    alertData.value.success = true
                    alertData.value.message = 'new join request received'
                }

                store.dispatch(`${route.name}/newItemPendingParticipant`, {
                    ...data,
                    ...computedItem
                })
            })
            .listen('.removePendingParticipant', data=>{
                
                store.dispatch(`${route.name}/removeItemPendingParticipant`, {
                    ...data,
                    ...computedItem
                })
            })
    }

    async function join(account) {
        let response,
            data = {
                account: account.account,
                accountId: account.accountId,
                type: joinOrInvitationType.value
            }

        response = await store.dispatch('profile/joinItem', {
            computedItem: computedItem,
            item: computedItem.main,
            data
        })

        joinOrInvitationType.value = ''
        
        if (! response.status) {
            issueDangerAlertForResponse(response, "oops 😕! something happened. please try again later")
            return
        }

        alertData.value.success = true

        if (computedItem.main.type === 'PRIVATE') { // TODO
            alertData.value.message = `you have successfully requested to participate in this ${computedItem.item}. have fun as you wait for owners response 😏.`
            return
        }

        alertData.value.message = `you have been successfully added to ${computedItem.item}. you can now participate 😎.`
    }

    async function invite(account){
        let response,
            data = {
                account: account.account,
                accountId: account.accountId,
                type: joinOrInvitationType.value
            }

        response = await store.dispatch('profile/inviteAccount', {
            item: computedItem.main,
            computedItem: computedItem, 
            data
        })

        joinOrInvitationType.value = ''
        if (response.status) {
            alertData.value.success = true
            alertData.value.message = `invitation request to ${account.name} was successfully sent`

            removedParticipant.value = account
            return
        }

        issueDangerAlertForResponse(response, `invitation request to ${account.name} was unsuccessfully`)
    }

    function clickedParticpantAction(data) {
        if (data.action === 'invite') {
            invite(data.account)
        }
    }

    return {
        removedParticipant, joinOrInvitationType, listenForParticipation, doneRemovingParticipant,
        clickedParticpantAction, invite, join, computedPendingParticipant
    }
}