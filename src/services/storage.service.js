
class StorageService {
    types = ['localStorage', 'sessionStorage']
    currentType = null
    storage = null

    constructor(type = 'localStorage') {
        if (this.types.includes(type)) {
            
            this.currentType = type
        } else {

            this.currentType = 'localStorage'
        }

        this.initiateStorage()
    }

    initiateStorage() {
        this.storage = window[this.currentType]
    }

    set(key, value, stringify = true){

        if (stringify) {
            value = JSON.stringify(value)
        }

        this.storage.setItem(key, value)
    }
    
    async get(key, parse = true){
        let item = await this.storage.getItem(key)

        if (parse && !item)
            return JSON.parse(item)

        return item
    }
    
    remove(key){
        this.storage.removeItem(key)
    }
}

export default StorageService