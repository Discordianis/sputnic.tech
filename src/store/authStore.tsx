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
                console.log("Токен обновлен:", data.refresh_token);
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
        if (!this.refreshToken) return false;

        try {
            const response = await fetch("https://sputnic.tech/mobile_api/token/refresh", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                    "Authorization": `Bearer ${this.refreshToken}`
                }
            });

            const data = await response.json();
            if (data.token) {
                this.token = data.token;
                return true;
            }
        } catch (error) {
            console.error("Ошибка обновления токена:", error);
        }
        return false;
    }
}

const authStore = new AuthStore();
export default authStore;
