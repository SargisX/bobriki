import type { SignUpUser, User } from "./types"

const SESSION_KEY = "user_session"

export const saveLoginSession = (user: User) => {
    const { id, username, role } = user

    const sessionData: SignUpUser = {
        timestamp: new Date().getTime(),
        userId: id,
        role,
    }

    sessionStorage.setItem(SESSION_KEY, JSON.stringify(sessionData))

    return { id, username, role }
}


export const clearSession = () => {
    sessionStorage.removeItem(SESSION_KEY)
}

export const isSessionValid = () => {
    const sessionData = sessionStorage.getItem(SESSION_KEY)
    if (!sessionData) return false

    const { timestamp } = JSON.parse(sessionData)
    const expirationTime = 7 * 24 * 60 * 60 * 1000
    return new Date().getTime() - timestamp < expirationTime
}

export const getUserRole = () => {
    const sessionData = sessionStorage.getItem(SESSION_KEY)
    return sessionData ? JSON.parse(sessionData).role : null
}


export const getCurrentSession = (): SignUpUser | null => {
    const sessionData = sessionStorage.getItem(SESSION_KEY)
    return sessionData ? JSON.parse(sessionData) : null
}
