import {makeAutoObservable} from "mobx";
import {IRoute} from "../interfaces/routeInterface.tsx";
import tokenStore from "./tokenStore.tsx";
import AuthStore from "./authStore.tsx";

class RouteStore {
    route: IRoute = [];

    constructor() {
        makeAutoObservable(this);
    }

    async loadRoute(id: number, dateStart: string, dateEnd: string): Promise<void> {
        try {
            const response = await fetch("https://sputnic.tech/mobile_api/getRoutesPoint", {
                method: "POST",
                headers: {
                    Authorization: `Bearer ${tokenStore.token}`,
                    "Content-Type": "application/json",
                },
                body: JSON.stringify({ id, date_start: dateStart, date_end: dateEnd }),
            });

            const data = await response.json();
            if (data) {
                this.route = data
            }
            if (data.code === 401) {
                const refreshed = await AuthStore.refresh();
                if (refreshed) {
                    return this.loadRoute(id, dateStart, dateEnd);
                }
            }
        } catch (error) {
            console.error("Ошибка загрузки маршрута:", error);
        }
    }
}
const routeStore = new RouteStore()
export default routeStore;