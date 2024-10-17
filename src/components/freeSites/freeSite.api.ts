import axios from "axios"

const URL = 'https://raw.githubusercontent.com/SargisX/bobriki/main/data.json'

export const getAllMemes = async() =>{
    const response = await axios.get(URL)
    return response.data
}