import { ref, watch } from "vue"
import { useRoute } from "vue-router"
import { useStore } from "vuex"
import useProfiles from "./useProfiles"
import useModal from "./useModal"

export default function useLikes(computedItem) {
    const route = useRoute()
    const store = useStore()
    const { profileData, profilesAppear } = useProfiles()
    const { issueCustomMessage, clearSmallModal } = useModal()

    const listening = ref(false)
    const likeData = ref({
        likeTitle: '',
        isLiked: false,
        myLike: null,
        likes: 0,
    })

    watch(() => likeData.value.isLiked, (newValue) => {
        if (newValue) {
            likeData.value.likeTitle = `unlike this ${computedItem.value.item}`
        } else {
            likeData.value.likeTitle = `like this ${computedItem.value.item}`
        }
    })
    watch(() => likeData.value.myLike, (newValue) => {
        if (newValue) {
            likeData.value.isLiked = true
            return
        }
        
        likeData.value.isLiked = false
    })

    function listenForLikes() {
        if (listening.value) return

        listening.value = true

        Echo.channel(`youredu.${computedItem.item}.${computedItem.itemId}`)
            .listen('.newLike', data=>{
                store.dispatch(`${route.name}/newLike`, {
                    ...computedItem,
                    like: data.like
                })
            })
            .listen('.deleteLike', data=>{
                store.dispatch(`${route.name}/removeLike`, {
                    ...computedItem,
                    likeId: data.likeId
                })
            })
    }

    async function clickedLike({ disabled, banned, emits, schoolAdmin, owner }) {
        if (disabled || banned) return

        if (!store.getters.getUser && emits) {
            emits('askLoginRegister', computedItem.item)
            return
        }
        
        if (! store.getters.getProfiles.length) {
            issueCustomMessage({
                type: 'info',
                message: 'you must have an account (eg. learner, parent, etc) before you can like.',
            })

            clearSmallModal(false)

            return
        }
        
        if (!likeData.value.isLiked) {
            profileData.value.text = 'like as'
            profileData.value.action = 'like'
            profilesAppear()
            return
        }
        
        if (
            likeData.value.myLike || 
            likeData.value.myLike.hasOwnProperty('id')
        ) return
        
        deleteLike({ owner, schoolAdmin, emits})
    }

    async function deleteLike({owner, schoolAdmin, emits}) {
        likeData.value.likes -= 1
        likeData.value.isLiked = false

        let data = {
            likeId: likeData.value.myLike.id,
            item: computedItem.item,
            itemId: computedItem.itemId,
            owner: owner.account,
            ownerId: owner.accountId,
        }

        if (schoolAdmin) data.adminId = schoolAdmin.id

        data.where = route.name

        let response = await store.dispatch('profile/deleteLike', data)

        if (response === 'unsuccessful') {
            likeData.value.isLiked = true
            likeData.value.likes += 1

            if (emits)
                emits('unlikeSuccessful', {...computedItem, likeId: data.like})
            return
        }

        setMyLike()
    }

    async function like({who, owner, schoolAdmin, emits}){
        profileData.value.show = false

        likeData.value.isLiked = true
        likeData.value.likes += 1

        let data = {
            item: computedItem.item,
            itemId: computedItem.itemId,
            account: who.account,
            accountId: who.accountId,
            owner: owner.account,
            ownerId: owner.accountId,
        }

        if (schoolAdmin) data.adminId = schoolAdmin.id
        
        data.where = route.name

        let response = await store.dispatch('profile/createLike', data)

        if (response === 'unsuccessful') {
            likeData.value.isLiked = false
            likeData.value.likes -= 1

            if (emits)
                emits('likeSuccessful', {...computedItem, like: response.like}) //commentLikeSuccessful
            
            return
        }

        setMyLike()
    }

    function setMyLike() {
        if (! store.getters.getUser || ! computedItem) {
            likeData.value.myLike = null
            return
        }

        let index = computedItem.likes.findIndex(like=>{
            return like.userId == store.getters.getUser.id
        })

        if (index > -1) {
            likeData.value.myLike = computedItem.likes[index]
            return
        }

        likeData.value.myLike = null
    }

    return {
        likeData, setMyLike, like, deleteLike, clickedLike, listenForLikes
    }
}