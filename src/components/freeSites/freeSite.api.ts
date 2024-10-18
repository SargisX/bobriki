import axios from "axios"
import { Website } from "./types"

const URL = 'https://raw.githubusercontent.com/SargisX/bobriki/main/DATA/websites.json'


export const getAllSites = async (): Promise<Website[]> => {
    const response = await axios.get(URL)
    return response.data.Websites as Website[]
}


export const getSiteById = async (id: string): Promise<Website | null> => {
    const response = await axios.get(URL)
    const sites: Website[] = response.data.Websites
    const site = sites.find(site => site.id === id)
    return site || null
}
