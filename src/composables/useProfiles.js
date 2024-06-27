import { mapGetters, useStore } from 'vuex'
import ProfileBar from '../components/profile/ProfileBar.vue'
import { computed, ref, watch } from 'vue'

export default function useProfiles() {
    const store = useStore()

    const profilesData = ref({
        action: '',
        text: '',
        only: false,
        show: false,
    })

    watch(() => profilesData.value.show, (newValue) => {
        if (newValue) {
            setTimeout(() => {
                clearProfilesData()
            }, 4000);
        }
    })

    const computedProfiles = computed(() => {
        return store.getters.getProfiles ? store.getters.getProfiles : []
    })

    const profilesAppear = () => {
        profilesData.value.show = true
    }

    const clearProfilesData = () => {
        profilesData.value.show = false
        profilesData.value.only = false
        // profilesData.value.action = ''
        profilesData.value.text = ''
    }

    return {
        profilesData, computedProfiles, profilesAppear, clearProfilesData
    }
}
