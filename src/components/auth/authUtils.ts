import { SignUpUser, User } from "./types";
import { v4 as uuidv4 } from 'uuid';

const SESSION_KEY = "user_session";
const USERS_KEY = "users";

export const saveLoginSession = (user: SignUpUser) => {
    const { username, password } = user;

    const userData = {
        id: username === 'SargisX' ? '13795' : uuidv4(),
        username,
        password, // Consider hashing this before storing
        role: username === "SargisX" ? "admin" : "user"
    };

    let users: SignUpUser[] = JSON.parse(localStorage.getItem(USERS_KEY) || "[]");

    // Check if user already exists
    if (!users.some((u: SignUpUser) => u.username === username)) {
        users.push(userData);
        localStorage.setItem(USERS_KEY, JSON.stringify(users));
    }

    const sessionData = {
        timestamp: new Date().getTime(),
        userId: userData.id,
        role: userData.role
    };
    sessionStorage.setItem(SESSION_KEY, JSON.stringify(sessionData));

    return userData; // Return user data if needed
};

export const clearLoginSession = () => {
    sessionStorage.removeItem(SESSION_KEY);
};

export const isSessionValid = () => {
    const sessionData = sessionStorage.getItem(SESSION_KEY);
    if (!sessionData) return false;
    
    const { timestamp } = JSON.parse(sessionData);
    const expirationTime = 7 * 24 * 60 * 60 * 1000; // 1 week
    return new Date().getTime() - timestamp < expirationTime;
};

export const getUserRole = () => {
    const sessionData = sessionStorage.getItem(SESSION_KEY);
    return sessionData ? JSON.parse(sessionData).role : null;
};

// Additional function to retrieve user information if needed
export const getCurrentUser = (): SignUpUser | null => {
    const sessionData = sessionStorage.getItem(SESSION_KEY);
    if (!sessionData) return null;

    const { userId } = JSON.parse(sessionData);
    const users: User[] = JSON.parse(localStorage.getItem(USERS_KEY) || "[]");
    return users.find(user => user.id === userId) || null;
};
