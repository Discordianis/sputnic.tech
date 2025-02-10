import {makeAutoObservable} from "mobx";


class TokenStore {
    token: string | null = null
    constructor() {
        makeAutoObservable(this)
    }
    getToken() {
        const token = localStorage.getItem('token')
        if (token) {
            this.token = token
        }
    }
}
const tokenStore = new TokenStore()
export default tokenStore