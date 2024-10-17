import { useEffect, useState } from "react"
import { getAllMemes } from "./memes.api"
import { Meme } from "./types"
import styles from "./Memes.module.css"

export const Memes = () => {
  const [memes, setMemes] = useState<Meme[]>([])

  useEffect(() => {
    getAllMemes().then((res) => {
      setMemes(res.memes)
    })
  }, [])

  return (
    <div className={styles.container}>
      <h1 className={styles.title}>Memes</h1>
      {
        memes.map((meme) => (
          <div key={meme.id} className={styles.card}>
            <img src={meme.photo} alt={meme.id} className={styles.image} />
            <h3 className={styles.participants}>
              {meme.participants.join(", ")}
            </h3>
            <p className={styles.likes}>Likes: {meme.likes}</p>
            <p className={styles.info}>Rating: {meme.rating}</p>
            <p className={styles.info}>Category: {meme.category}</p>
            <p className={styles.info}>Location: {meme.location}</p>
          </div>
        ))
      }
    </div>
  )
}
