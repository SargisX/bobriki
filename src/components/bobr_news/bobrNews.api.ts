import axios from "axios"
import { IBobrNews } from "./types"

const upload_preset = import.meta.env.VITE_UPLOAD_PRESET
const IMG_URL = `https://api.cloudinary.com/v1_1/sargisx/image/upload?upload_preset=${upload_preset}`
const News_URL = `https://bobriki-backend.onrender.com/api/news`

/* Image */
export const uploadImage = async (image: FormData): Promise<any> => {
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



/* Post */
export const getBobrNews = async (): Promise<IBobrNews[]> => {
    try {
        const response = await axios.get(News_URL)
        return response.data
    } catch (error) {
        console.error("Error fetching news:", error)
        throw error
    }
}

export const createBobrNews = async (post: any): Promise<IBobrNews> => {
    const response = await axios.post(News_URL+"/add", post)
    return response.data
}

export const updateBobrNews = async (post: IBobrNews): Promise<IBobrNews> => {
    const response = await axios.put(`${News_URL}/${post.id}`, post)
    return response.data
}

export const deleteBobrNews = async (id: string) => {
    await axios.delete(`${News_URL}/${id}`)
}

export const getBobrNewsById = async(id:string):Promise<IBobrNews> =>{
    const response = await axios.get(`${News_URL}/${id}`)
    return response.data
}