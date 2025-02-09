import {makeAutoObservable} from "mobx";
import AuthStore from "./authStore.tsx";
import {IRoute} from "../interfaces/routeInterface.tsx";

class RouteStore {
    route: IRoute[] = [];

    constructor() {
        makeAutoObservable(this);
    }

    async loadRoute(id: number, dateStart: string, dateEnd: string) {
        try {
            const response = await fetch("https://sputnic.tech/mobile_api/getRoutesPoint", {
                method: "POST",
                headers: {
                    Authorization: `Bearer ${AuthStore.token}`,
                    "Content-Type": "application/json",
                },
                body: JSON.stringify({ id, date_start: dateStart, date_end: dateEnd }),
            });

            const data = await response.json();
            if (data) {
                this.route = data
            }
        } catch (error) {
            console.error("Ошибка загрузки маршрута:", error);
        }
    }
}
const routeStore = new RouteStore()
export default routeStore;