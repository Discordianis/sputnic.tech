export interface IRoute {
    [key: number]: {
        [key: number]: RouteData
    }
}

export interface RouteData {
    parking: Parking[];
    refuels: Refuel[];
    route: RoutePoint[];
}

export interface Parking {
    dtime_start: string;
    duration: number;
    lat: number;
    lng: number;
    ptype: number;
}

export interface Refuel {
    datetime: string;
    volume: number;
    lat: number;
    lng: number;
}

export interface RoutePoint {
    datetime: string;
    lat: number;
    lng: number;
    reserve: Reserve;
    speed: number;
}

export interface Reserve {
    alt: number;
    direction: number;
    fuel1: number;
    ignition: number;
    speed: number;
    voltage: number;
}
