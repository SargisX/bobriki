import { useEffect, useState } from "react";
import { IBobrNews } from "../types";
import { getBobrNews } from "../bobrNews.api";
import styles from "./bobrNews.module.css";
import { BobrNewsAdd } from "../Add/bobrNewsAdd";
import { getUserRole } from "../../auth/authUtils";
import { Link } from "react-router-dom";

export const BobrNews = () => {
    const [news, setNews] = useState<IBobrNews[]>([]);
    const [addPost, setAddPost] = useState(false);
    const [userRole, setUserRole] = useState<string>("");

    useEffect(() => {
        getBobrNews().then((res) => {
            setNews(res);
        });
        setUserRole(getUserRole());
    }, []);

    const parseAndTransformText = (text: string) => {
        // Step 1: Parse links with the specified format
        const linkRegex = /;;(.*?)\((.*?)\)/g;
        const parts: (string | JSX.Element)[] = [];
        let lastIndex = 0;
        let match;

        // Step 2: Handle link parsing
        while ((match = linkRegex.exec(text)) !== null) {
            const [fullMatch, linkText, url] = match;

            // Add the text before the match
            if (match.index > lastIndex) {
                parts.push(text.slice(lastIndex, match.index));
            }

            // Add the Link component
            parts.push(
                <Link key={url} to={url} target="_blank" rel="noopener noreferrer">
                    {linkText}
                </Link>
            );

            lastIndex = linkRegex.lastIndex;
        }

        // Add any remaining text after the last match
        if (lastIndex < text.length) {
            parts.push(text.slice(lastIndex));
        }

        // Step 3: Transform HTML tags in the final parts
        const transformedParts = parts.map((part) => {
            if (typeof part === "string") {
                return part
                    .replace(/<([^>]+)>/g, (_, p1) => p1.toUpperCase()) // Uppercase text inside <>
                    .replace(/<.*?>/g, '') // Remove all HTML tags
                    .trim();
            }
            return part; // Return the Link component as is
        });

        return transformedParts;
    };

    const formatDate = (timestamp: number) => {
        const date = new Date(timestamp * 1000);
        const options: Intl.DateTimeFormatOptions = {
            year: "numeric",
            month: "long",
            day: "numeric",
            hour: "numeric",
            minute: "numeric",
            hour12: true,
            timeZone: "Asia/Yerevan",
        };
        return date.toLocaleString("en-US", options);
    };

    const toggleAddPost = () => {
        setAddPost((prev) => !prev);
    };
    // Add this function to BobrNews component
    const refreshNews = async () => {
        const updatedNews = await getBobrNews();
        setNews(updatedNews);
    };

    // Pass refreshNews to BobrNewsAdd



    return addPost ? (
        <div className={styles.addPostPopup}>
            <BobrNewsAdd addPost={addPost} setAddPost={toggleAddPost} refreshNews={refreshNews} />
        </div>
    ) : (
        <div className={styles.bg}>
            <div className={styles.bobrContainer}>
                {(userRole === "admin" || userRole === "bobrnews_Moderator") && (
                    <div className={styles.AddNewBtn}>
                        <button onClick={toggleAddPost}>ADD</button>
                    </div>
                )}
                <div className={styles.bobrHeader}>
                    <h1>Bobr News</h1>
                    <p>Bobr News is where the most viral stories come to life!</p>
                </div>
                <div className={styles.newsList}>
                    {news.map((item) => (
                        <div key={item.id} className={styles.newsCard}>
                            <div className={styles.newsImageContainer}>
                                <img
                                    src={item.photo}
                                    alt={item.title}
                                    className={styles.newsImage}
                                />
                            </div>
                            <div className={styles.newsContent}>
                                <h2>{parseAndTransformText(item.title)}</h2>
                                <div className={styles.description}>
                                    <span className={styles.coloredPart}></span>
                                    <p>{parseAndTransformText(item.description)}</p>
                                    <span className={styles.articleSign}>“</span>
                                </div>
                                <div className={styles.reactions}>
                                    <span>❤️ {item.likes.length}</span>
                                    <span>💬 {item.comments.length}</span>
                                    <span className={styles.date}>
                                        {formatDate(item.date)}
                                    </span>
                                </div>
                            </div>
                        </div>
                    ))}
                </div>
            </div>
        </div>
    );
};
