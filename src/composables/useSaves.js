import { ref, watch } from "vue"
import { useRoute } from "vue-router"
import { useStore } from "vuex"
import useProfiles from "./useProfiles"
import useAlert from "./useAlert"

export default function useSaves(computedItem) {
    const { profilesAppear, profilesData } = useProfiles()
    const { alertData } = useAlert()
    const route = useRoute()
    const store = useStore()
    const saveData = ref({
        isSaved: false,
        mySave: null,
        saves: 0,
    })

    watch(() => saveData.value.mySave, (newValue) => {
        if (newValue) {
            saveData.value.isSaved = true
            return
        }

        saveData.value.isSaved = false
    })

    function listenForSaves() {
            
        // Echo.channel(`youredu.${this.computedItem.item}.${this.computedItem.itemId}`)
        //     .listen('.newSave', data=>{
        //         this[`${this.$route.name}/newSave`]({
        //             ...this.computedItem,
        //             save: data.save
        //         })
        //     })
        //     .listen('.deleteSave', data=>{
        //         this[`${this.$route.name}/removeSave`]({
        //             ...this.computedItem,
        //             saveId: data.saveId
        //         })
        //     })
    }

    async function save({who, schoolAdmin = null, emits}){
        profilesData.value.show = false

        let data = {
            item: computedItem.item,
            itemId: computedItem.itemId,
        },
            response = null,
            state = ''
        
        if (schoolAdmin) {
            data.adminId = schoolAdmin.id
        }
        
        data.where = route.name
        if (who) {
            data.account = who.account
            data.accountId = who.accountId
            state = 'saving'

            saveData.value.saves += 1
            response = await store.dispatch('profile/createSave', data)
        } else {
            data.saveId = saveData.value.mySave.id
            state = 'unsaving'

            saveData.value.saves -= 1
            response = await store.dispatch('profile/deleteSave', data)
        }

        if (response.status) {
            alertData.value.success = true
            alertData.value.message = `${state} successful`
            
            if (emits)
                emits(who ? 'saveSuccessful' : 'unsaveSuccessful',{
                    ...computedItem,
                    save: response.save,
                    saveId: data.saveId
                })

            setMySave()
            return
        }

        alertData.value.danger = true
        alertData.value.message = `${state} unsuccessful`

        if (who) {
            saveData.saves -= 1
            return
        }

        saveData.value.saves += 1
    }
    
    function clickedSave() {
        profilesData.value.text = 'save as'
        profilesData.value.action = 'save'
        profilesAppear()
    }

    function setMySave(){
        if (! store.getters.getUser || ! computedItem) {
            saveData.value.mySave = null
            return
        }
        
        let index = computedItem.saves.findIndex(save=>{
            return save.userId == store.getters.getUser.id
        })

        if (index > -1) {
            saveData.value.mySave = computedItem.saves[index]
            return
        }

        saveData.value.mySave = null
    }

    return {
        saveData, save, clickedSave, setMySave, listenForSaves
    }
}