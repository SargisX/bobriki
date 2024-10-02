import { useEffect } from "react"
import { getAllMemes } from "./memes.api"

export const Memes = () => {

    useEffect(()=>{
        getAllMemes()
        .then(res=>{
            console.log(res)
        })
    },[])
  return (
    <div>
        <h1>Memes</h1>
    </div>
  )
}
