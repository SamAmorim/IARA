import type { UIMatch } from "react-router"

export interface RouteLoaderData {
    pageTitle: string
}

export interface RouteHandle {
    title: string | ((data: RouteLoaderData) => string)
    showBackButton?: boolean
}

export interface RouteMatch extends UIMatch {
    handle: RouteHandle
}