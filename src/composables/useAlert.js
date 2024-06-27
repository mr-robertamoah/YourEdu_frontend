import { ref } from "vue"

export default function useAlert() {
    const alertData = ref({
        message: '',
        danger: false,
        success: false,
        lengthy: false,
    })

    function clearAlert() {
        alertData.value.success = false
        alertData.value.danger = false
        alertData.value.lengthy = false
        alertData.value.message = ''
    }

    function issueDangerAlert(data) {
        data.type = 'danger'

        issueAlert(data)
    }

    function issueSuccessAlert(data) {
        data.type = 'success'

        issueAlert(data)
    }

    function issueAlert(data) {
        alertData.value.danger = data.type === 'danger' ? true : false
        alertData.value.success = data.type === 'success' ? true : false
        alertData.value.lengthy = data.lengthy
        alertData.value.message = data.message
    }

    function issueDangerAlertForResponse(response, message = null, edit = null) {
        alertData.value.danger = true
        
        if (response?.data?.message) {
            alertData.value.message = response.data.message
            return
        }
        
        if (response?.message) {
            alertData.value.message = response.message
            return
        }
        
        if (response?.response?.data?.message) {
            alertData.value.message = response.response.data.message
            return
        }

        if (message) {
            alertData.value.message = message
            return
        }

        if (edit) {
            alertData.value.message = `${edit ? 'editing' : 'creation'} was unsuccessful 😞`
            return
        }

        alertData.value.message = 'oops! something happened 😕. please try again later.'
    }

    return {
        alertData, clearAlert, issueAlert, issueDangerAlert, issueSuccessAlert, issueDangerAlertForResponse
    }
}