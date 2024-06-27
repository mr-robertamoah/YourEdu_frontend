import { mapActions, useStore } from "vuex"
import { default as _ } from 'lodash';
import { useRoute } from "vue-router";
import { computed, ref } from "vue";

export default function useComments(computedItem) {
    const store = useStore()
    const route = useRoute()
    const showAddComment = ref(false)
    const listening = ref(false)

    const computedComments = computed(() => {
        return computedItem.comments?.length > 0 ?
            _.take(computedItem.comments, 2) : null
    })

    function listenForComments() {
        if (listening.value) return

        listening.value = true

        Echo.channel(`youredu.${computedItem.item}.${computedItem.itemId}`)
            .listen('.updateComment', commentData=>{
                store.dispatch(`${route.name}/replaceComment`, commentData)
            })
            .listen('.deleteComment', data=>{
                store.dispatch(`${route.name}/removeComment`, {
                    ...data,
                    ...computedItem
                })
            })
            .listen('.newComment', comment=>{
                store.dispatch(`${route.name}/newComment`, comment)
            })
    }

    return {
        showAddComment, computedComments, listenForComments
    }
}