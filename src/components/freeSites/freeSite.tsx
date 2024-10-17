import { useEffect, useState } from "react"
import { Website } from "./types"
import { getAllSites } from "./freeSite.api"

export const FreeSite = () => {

    const [sites, SetSites] = useState<Website[]>([])

    useEffect(() => {
        getAllSites()
            .then(res => {
                SetSites(res)
            })
    }, [])
    return (
        <div>
            <h2>FreeSite</h2>
            <p>Sites = {sites.length} </p>

            {
                sites.map((site) => (
                    <div key={site.id}>
                        <h3>{site.name}</h3>
                        <img src={site.image} alt="" />
                    </div>
                ))
            }
        </div>
    )
}
