import axios from "axios"
import { IBobrNews } from "./types"

const upload_preset = import.meta.env.VITE_UPLOAD_PRESET
const IMG_URL = `https://api.cloudinary.com/v1_1/sargisx/image/upload?upload_preset=${upload_preset}`
const News_URL = `https://6713e4de690bf212c7601eb2.mockapi.io/bobr_V1/bobrnews`

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
export const getBobrNews = async (): Promise<any> => {
    try {
        const response = await axios.get(News_URL)
        return response.data
    } catch (error) {
        console.error("Error fetching news:", error)
        throw error
    }
}

export const createBobrNews = async (post: any): Promise<IBobrNews> => {
    const response = await axios.post(News_URL, post)
    return response.data
}