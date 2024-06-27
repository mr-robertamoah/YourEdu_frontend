import { ref } from "vue";

export default function useModal() {

    const modalData = ref({
        show: false,
        type: '',
        info: false,
        delete: false,
        data: null,
        title: '',
        alerting: false,
        action: '',
        message: ''
    })

    function showModal(type = '', {
        info = false, del = false, data = null, title = '', message = '', alerting = false, action = ''
    }) {
        modalData.value.type = type
        modalData.value.info = info
        modalData.value.title = title
        modalData.value.message = message
        modalData.value.alerting = alerting
        modalData.value.delete = del
        modalData.value.data = data
        modalData.value.action = action
        modalData.value.show = true
    }

    function closeModal() {
        modalData.value.type = ''
        modalData.value.data = null
        modalData.value.show = false
        modalData.value.delete = false
        modalData.value.info = false
        modalData.value.title = ''
        modalData.value.message = ''
        modalData.value.alerting = false
        modalData.value.action = ''
    }
    
    function issueSmallModalDeletionMessage() {
        modalData.value.message = `are you sure you want to delete this ${this.computedItem?.item}?`
        modalData.value.info = false
        modalData.value.delete = true
        modalData.value.show = true
    }

    function clearSmallModal(immediate = true) {
        setTimeout(() => {
            modalData.value.show = false,
            modalData.value.info = false
            modalData.value.delete = false
            modalData.value.alerting = false
            modalData.value.data = null
            modalData.value.message = ''
        }, immediate ? 0 : 4000);
    }

    function issueCustomMessage(data) {
        modalData.value.info= data.type === 'info' ? true : false
        modalData.value.delete= data.type === 'delete' ? true : false
        modalData.value.data = data.data
        modalData.value.message = data.message
        modalData.value.show = true
    }

    function issueSmallModalInfoMessage(data) {
        modalData.value.delete= false
        modalData.value.info = true
        modalData.value.data = data.data
        modalData.value.message = data.message
        modalData.value.show = true
    }

    return {
        modalData, showModal, closeModal, issueCustomMessage, 
        issueSmallModalDeletionMessage, issueSmallModalInfoMessage, clearSmallModal
    }
}