import { useEffect, useState } from "react";
import { getAllMemes } from "./memes.api";
import { Meme } from "./types";
import styles from "./Memes.module.css"; // Import CSS module

export const Memes = () => {
  const [memes, setMemes] = useState<Meme[]>([]);

  useEffect(() => {
    getAllMemes().then((res) => {
      setMemes(res.memes);
    });
  }, []);

  return (
    <div className={styles.container}>
      <h1 className={styles.title}>Memes</h1>
      <div className={styles.grid}>
        {memes.map((meme) => (
          <div key={meme.id} className={styles.card}>
            <img src={meme.photo} alt={meme.id} className={styles.image} />
            <div className={styles.cardContent}>
              <h3 className={styles.participants}>
                {meme.participants.join(", ")}
              </h3>
              <p className={styles.info}>
                <span className={styles.likes}>Likes: {meme.likes}</span>
                <span>Rating: {meme.rating}</span>
              </p>
              <p className={styles.info}>
                <span>Category: {meme.category}</span>
                <span>Location: {meme.location}</span>
              </p>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};
