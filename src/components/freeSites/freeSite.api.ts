import axios from "axios"

const URL = 'https://raw.githubusercontent.com/SargisX/bobriki/main/DATA/websites.json'

export const getAllSites = async() =>{
    const response = await axios.get(URL)
    return response.data.Websites
}