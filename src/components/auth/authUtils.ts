import { SignUpUser } from "./types"
import { v4 as uuidv4 } from 'uuid'

const SESSION_KEY = "user_session"
const USERS_KEY = "users"

export const saveLoginSession = (user: SignUpUser) => {
    const { username, password } = user
    const userData = {
        id: username === 'SargisX' ? '13795' : uuidv4(),
        username,
        password,
        role: username === "SargisX" ? "admin" : "user"
    }

    let users = JSON.parse(localStorage.getItem(USERS_KEY) || "[]")

    if (!users.some((u: SignUpUser) => u.username === username)) {
        users.push(userData)
        localStorage.setItem(USERS_KEY, JSON.stringify(users))
    }

    const sessionData = {
        timestamp: new Date().getTime(),
        userId: userData.id,
    }
    sessionStorage.setItem(SESSION_KEY, JSON.stringify(sessionData))
}

export const clearLoginSession = () => {
    sessionStorage.removeItem(SESSION_KEY)
}

export const isSessionValid = () => {
    const sessionData = sessionStorage.getItem(SESSION_KEY)
    if (!sessionData) return false
    const { timestamp } = JSON.parse(sessionData)
    const expirationTime = 2 * 24 * 60 * 60 * 1000
    return new Date().getTime() - timestamp < expirationTime
}

export const getUserRole = () => {
    const sessionData = sessionStorage.getItem(SESSION_KEY)
    return sessionData ? JSON.parse(sessionData).role : null
}
