import axios from "axios"
import type { User, UserAdd } from "../auth/types"

const API_URL = "https://6713e4de690bf212c7601eb2.mockapi.io/bobr_V1/users"

export const createUser = async (user: UserAdd) => {
    const response = await axios.post(API_URL, user)
    return response.data
}

export const getAllUsers = async (): Promise<User[]> => {
    const response = await axios.get(API_URL)
    return response.data
}

export const updateUser = async (updatedUser: Partial<User>) => {
    const id = updatedUser.id
    const response = await axios.put(`${API_URL}/${id}`, updatedUser)
    return response.data
}

export const deleteUser = async (id: string) => {
    await axios.delete(`${API_URL}/${id}`)
}

export const getUserById = async (id: string): Promise<User | null> => {
    try {
        const response = await axios.get(`${API_URL}/${id}`)
        return response.data
    } catch (error) {
        return null
    }
}
export const checkUserById = async (id: string): Promise<boolean> => {
    const response = await axios.get(`${API_URL}/${id}`)
    return response.data ? true : false
}

export const getUserByUsername = async (username: string): Promise<User | null> => {
    try {
        const response = await axios.get(`${API_URL}?username=^${username}$`)
        return response.data[0]
    } catch (error) {
        return null
    }
}
