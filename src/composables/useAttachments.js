
import {strings} from '../services/helpers'
import { useStore } from 'vuex'
import { useRoute } from 'vue-router'
import { ref, watch, computed } from 'vue'
import useAlert from './useAlert'
import useProfiles from './useProfiles'

export default function useAttachments(computedItem) {

    const route = useRoute()
    const store = useStore()
    const { alertData } = useAlert()
    const { profilesData, profilesAppear } = useProfiles()

    const listening = ref(false)
    const attachmentData = ref({
        isAttached: false, //means i have attached and it goes for likes, etc
        myAttachments: null,
        postAttachments: [],
        attachable: null,
        showAttach: false,
        selectedAttachment: null
    })

    watch(() => attachmentData.value.postAttachments, () => {
        if (attachmentData.value.postAttachments?.length) {
            attachmentData.value.myAttachments = null
            attachmentData.value.isAttached = false
        }
    })
    watch(() => attachmentData.value.myAttachments, () => {
        if (!attachmentData.value.myAttachments?.length) return

        attachmentData.value.isAttached = true
    })

    const computedRouteName = computed(() => {
        return route.name
    })

    function listenForAttachments({item, itemId}) {
        if (!item || !itemId || listening.value) return

        listening.value = true
        Echo.channel(`youredu.${item}.${itemId}`)
            .listen('.newAttachment', data=>{
                store.dispatch(`${computedRouteName.value}/newAttachment`, {
                    item, itemId,
                    attachment: data.attachment
                })
            })
            .listen('.deleteAttachment', data=>{
                store.dispatch(`${computedRouteName.value}/removeAttachment`, {
                    item, itemId,
                    attachmentId: data.attachmentId
                })
            })
    }

    async function attach(who, {item, itemId, postType}){

        let data = {},
            response = null,
            state = ''

        data.where = computedRouteName.value
        data.item = item
        data.itemId = itemId
        data.postType = postType

        if (who) {
            state = 'attachment'
            data.type = attachmentData.value.attachable.item
            data.typeId = attachmentData.value.attachable.itemId
            data.account = who.account
            data.accountId = who.accountId
            data.note = attachmentData.value.attachable.note
            response = await store.dispatch('profile/createAttachment', data)
        } else {
            state = 'unattachment'
            data.attachmentId = attachmentData.value.selectedAttachment.id
            response = await store.dispatch('profile/deleteAttachment', data)
        }

        if (! response.status) {
            alertData.value.danger = true
            alertData.value.message = `${state} unsuccessful 😞`
            return
        }

        alertData.value.success = true
        alertData.value.message = `${state} successful 👍`
        setMyAttachment()
    }

    function setMyAttachment() {
        if (!store.getters.getUser) return

        if (!computedItem?.hasOwnProperty('attachments')) return

        attachmentData.value.myAttachments = computedItem.attachments
            .filter(attachment => {
                return attachment.user_id == store.getters.getUser.id
            }).map(attachment=>{
                return {
                    id: attachment.id,
                    with_type: strings.getAccount(attachment.attachedwith_type),
                    with_id: attachment.attachedwith_id,
                    with: attachment.name,
                }
            })

        attachmentData.value.postAttachments = computedItem.attachments.map(attach=>{
            return {
                data: {name: attach.name},
                type: strings.getAccount(attach.attachedwith_type)
            }
        })
    }

    function clickedUnattach(attachment){
        attachmentData.value.showAttach = false
        attachmentData.value.selectedAttachment = attachment
        attach(null)
    }

    function attachmentClicked(data){
        attachmentData.value.showAttach = false
        attachmentData.value.attachable = data
        profilesData.value.action = 'attach'
        profilesData.value.text = 'attach as'
        profilesAppear()
    }

    return {
        attachmentData, computedRouteName, listenForAttachments, attach, clickedUnattach, attachmentClicked,
        setMyAttachment
    }
}