export type UserResource = {
    id?: string
    email?: string
    password?: string
    username: string
    points?: number
    // picture?: string
    premium?: boolean
    level?: number
    gameSound?: boolean
    music?: boolean 
    higherLvlChallenge?: boolean
}

export type GuestResource = {
    id?: string
    username: string
    points?: number
    // picture: string
    level?: number
    gameSound?: boolean
    music?: boolean
}

export type LoginResource = {
    id: string
    /** Expiration time in seconds since 1.1.1970 */
    exp: number
}