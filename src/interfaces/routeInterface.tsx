export interface IRoute {
    [key: number]: N740
}

export interface N740 {
    [key: number]: N0
}

export interface N0 {
    parking: Parking[]
    refuels: []
    route: Route[]
}

export interface Parking {
    [key: number]: N02
}

export interface N02 {
    dtime_start: string
    duration: number
    lat: number
    lng: number
    ptype: number
}

export interface Route {
    [key: number]: N03
}

export interface N03 {
    datetime: string
    lat: number
    lng: number
    reserve: Reserve
    speed: number
}

export interface Reserve {
    alt: number
    direction: number
    fuel1: number
    ignition: number
    speed: number
    voltage: number
}
