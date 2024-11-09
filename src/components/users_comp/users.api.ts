import axios from "axios"
import type { User, UserAdd } from "./types"

const upload_preset = import.meta.env.VITE_UPLOAD_PRESET
const IMG_URL = `https://api.cloudinary.com/v1_1/sargisx/image/upload?upload_preset=${upload_preset}`
// My server  
// const API_URL = "https://bobriki-backend.onrender.com/api/users"
const API_URL = "https://6713e4de690bf212c7601eb2.mockapi.io/bobr_V1/users"

/* Image */
export const uploadProfilePicture = async (image: FormData): Promise<any> => {
    try {
        const response = await axios.post(IMG_URL, image, {
            params: { upload_preset },
        })
        return response.data
    } catch (error) {
        console.error("Error uploading image:", error)
        throw error
    }
}

/* User */
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
