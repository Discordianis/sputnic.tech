import { makeAutoObservable } from "mobx";

interface IAuthStore {
    token: string | null;
    refreshToken: string | null;
    login: (username: string, password: string) => Promise<boolean>;
    refresh: () => Promise<boolean>;
}

class AuthStore implements IAuthStore {
    token = null;
    refreshToken = null;

    constructor() {
        makeAutoObservable(this);
    }

    async login(username: string, password: string): Promise<boolean> {
        try {
            const response = await fetch("https://sputnic.tech/mobile_api/token/login", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                    "Accept": "application/json"
                },
                body: JSON.stringify({ login: username, password: password })
            });

            const data = await response.json();
            if (data.token && data.refresh_token) {
                this.token = data.token;
                this.refreshToken = data.refresh_token;
                localStorage.setItem('token', data.token);
                localStorage.setItem('refreshToken', data.refresh_token);
                window.location.reload()
                return true;
            } else {
                console.log("Ошибка: неверный ответ от сервера");
            }
        } catch (error) {
            console.error("Ошибка входа:", error);
        }
        return false;
    }

    async refresh(): Promise<boolean> {
        try {
            const refreshToken = localStorage.getItem('refreshToken');
            const response = await fetch("https://sputnic.tech/mobile_api/token/refresh", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify({ refresh_token: refreshToken })
            });

            const data = await response.json();
            console.log("Ответ сервера на refresh:", data);

            if (data.token && data.refresh_token) {
                this.token = data.token;
                this.refreshToken = data.refresh_token;
                localStorage.setItem('token', data.token);
                localStorage.setItem('refreshToken', data.refresh_token);
                window.location.reload()
            }
        } catch (error) {
            console.error("Ошибка обновления токена:", error);
        }
        return false;
    }

}

const authStore = new AuthStore();
export default authStore;
