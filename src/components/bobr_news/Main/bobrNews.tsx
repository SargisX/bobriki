import { useEffect, useState, ChangeEvent } from "react"
import { IBobrNews } from "../types"
import { getBobrNews } from "../bobrNews.api"
import styles from "./bobrNews.module.css"
import { BobrNewsAdd } from "../Add/bobrNewsAdd"
import { getUserRole } from "../../auth/authUtils"
import { Link } from "react-router-dom"

export const BobrNews = () => {
    const [news, setNews] = useState<IBobrNews[]>([])
    const [filteredNews, setFilteredNews] = useState<IBobrNews[]>([])
    const [addPost, setAddPost] = useState(false)
    const [userRole, setUserRole] = useState<string>("")
    const [sidebarVisible, setSidebarVisible] = useState(false)
    const [selectedUsers, setSelectedUsers] = useState<string[]>([])
    const [sortOption, setSortOption] = useState<string>("newest")
    const [startX, setStartX] = useState(0)
    const [searchQuery, setSearchQuery] = useState<string>("")


    useEffect(() => {
        const fetchNews = async () => {
            const res = await getBobrNews()
            setNews(res)
            setFilteredNews(res) // Initialize filtered news with the fetched data
        }
        fetchNews()
        setUserRole(getUserRole())
    }, [])


    const handleTouchStart = (e: React.TouchEvent) => {
        setStartX(e.touches[0].clientX)
    }

    const handleTouchMove = (e: React.TouchEvent) => {
        const currentX = e.touches[0].clientX
        const diffX = currentX - startX

        if (diffX > 50) {
            setSidebarVisible(true)
        } else if (diffX < -50) {
            setSidebarVisible(false)
        }
    }

    const parseAndTransformText = (text: string) => {
        // Step 1: Parse links with the specified format
        const linkRegex = /(.*?)\((.*?)\)/g
        const parts: (string | JSX.Element)[] = []
        let lastIndex = 0
        let match

        // Step 2: Handle link parsing
        while ((match = linkRegex.exec(text)) !== null) {
            const [_, linkText, url] = match

            // Add the text before the match
            if (match.index > lastIndex) {
                parts.push(text.slice(lastIndex, match.index))
            }

            // Add the Link component
            parts.push(
                <Link key={url} className={styles.links} to={url} target="_blank" rel="noopener noreferrer">
                    {linkText}
                </Link>
            )

            lastIndex = linkRegex.lastIndex
        }

        // Add any remaining text after the last match
        if (lastIndex < text.length) {
            parts.push(text.slice(lastIndex))
        }

        // Step 3: Transform HTML tags in the final parts
        const transformedParts = parts.map((part) => {
            if (typeof part === "string") {
                return part
                    .replace(/<([^>]+)>/g, (_, p1) => p1.toUpperCase()) // Uppercase text inside <>
                    .replace(/<.*?>/g, '') // Remove all HTML tags
                    .trim()
            }
            return part // Return the Link component as is
        })

        return transformedParts
    }

    const formatDate = (timestamp: number) => {
        const date = new Date(timestamp * 1000)
        const options: Intl.DateTimeFormatOptions = {
            year: "numeric",
            month: "long",
            day: "numeric",
            hour: "numeric",
            minute: "numeric",
            hour12: true,
            timeZone: "Asia/Yerevan",
        }
        return date.toLocaleString("en-US", options)
    }

    const toggleAddPost = () => {
        setAddPost((prev) => !prev)
    }

    const refreshNews = async () => {
        const updatedNews = await getBobrNews()
        setNews(updatedNews)
        setFilteredNews(updatedNews) // Ensure filtered news is updated too
    }

    const englishToRussian = (text: string) => {
        const transliterationMap: { [key: string]: string } = {
            sh: 'ш', Sh: 'Ш',  // Add mapping for 'sh'
            a: 'а', b: 'б', c: 'ц', d: 'д', e: 'е',
            f: 'ф', g: 'г', h: 'х', i: 'и', j: 'й',
            k: 'к', l: 'л', m: 'м', n: 'н', o: 'о',
            p: 'п', q: 'я', r: 'р', s: 'с', t: 'т',
            u: 'у', v: 'в', w: 'в', x: 'кс', y: 'ы', z: 'з',
            A: 'А', B: 'Б', C: 'Ц', D: 'Д', E: 'Е',
            F: 'Ф', G: 'Г', H: 'Х', I: 'И', J: 'Й',
            K: 'К', L: 'Л', M: 'М', N: 'Н', O: 'О',
            P: 'П', Q: 'Я', R: 'Р', S: 'С', T: 'Т',
            U: 'У', V: 'В', W: 'В', X: 'КС', Y: 'Ы', Z: 'З',
            ' ': ' ', '.': '.', ',': ',', '!': '!', '?': '?',
            // Add any other characters you want to preserve or transliterate
        }

        let result = text

        // Use a loop to replace each key in the transliteration map
        for (const key of Object.keys(transliterationMap)) {
            // Create a safe regex by escaping special characters in the key
            const escapedKey = key.replace(/[-\/\\^$.*+?()[\]{}|]/g, '\\$&') // Escape special characters
            const regex = new RegExp(escapedKey, 'g') // Create regex with global flag
            result = result.replace(regex, transliterationMap[key])
        }

        return result
    }

    const handleFilterChange = () => {
        let result = [...news]

        // Transliterate the search query to match against titles/descriptions
        const transliteratedQuery = englishToRussian(searchQuery.trim().toLowerCase())

        // Sorting logic
        if (sortOption === "newest") {
            result.sort((a, b) => b.date - a.date)
        } else if (sortOption === "oldest") {
            result.sort((a, b) => a.date - b.date)
        } else if (sortOption === "a-z") {
            result.sort((a, b) => a.title.localeCompare(b.title, "ru"))
        } else if (sortOption === "z-a") {
            result.sort((a, b) => b.title.localeCompare(a.title, "ru"))
        } else if (sortOption === "most-popular") {
            result.sort((a, b) => b.likes.length - a.likes.length)
        } else if (sortOption === "least-popular") {
            result.sort((a, b) => a.likes.length - b.likes.length)
        }

        // User filtering logic
        if (selectedUsers.length > 0) {
            result = result.filter((item) =>
                item.members.some((member) => selectedUsers.includes(member))
            )
        }

        // Search filtering logic
        if (transliteratedQuery) {
            result = result.filter((item) => {
                const title = englishToRussian(item.title.toLowerCase())
                const description = englishToRussian(item.description.toLowerCase())

                return (
                    title.includes(transliteratedQuery) ||
                    description.includes(transliteratedQuery)
                )
            })
        }

        setFilteredNews(result)
    }

    useEffect(() => {
        handleFilterChange()
    }, [news, sortOption, selectedUsers, searchQuery])

    const handleSelectChange = (e: ChangeEvent<HTMLSelectElement>) => {
        setSortOption(e.target.value)
    }

    const handleUserSelection = (username: string) => {
        setSelectedUsers((prev) =>
            prev.includes(username)
                ? prev.filter((user) => user !== username)
                : [...prev, username]
        )
    }
    const handleSearchChange = (e: ChangeEvent<HTMLInputElement>) => {
        setSearchQuery(e.target.value) // Update search query state
    }

    const uniqueAuthors = [...new Set(news.flatMap((item) => item.members))]

    const resetFilters = () => {
        setSearchQuery("")
        setSortOption("newest")
        setSelectedUsers([])
        setSidebarVisible(false)
        setFilteredNews(news) // Reset filtered list to the original news
    }

    return (
        <div className={styles.main}>
            {
                addPost ? (
                    <div className={styles.addPostPopup}>
                        <BobrNewsAdd addPost={addPost} setAddPost={toggleAddPost} refreshNews={refreshNews} />
                    </div>
                ) : (
                    <div className={`${styles.bg} ${sidebarVisible ? styles.none : ""}`} onTouchStart={handleTouchStart} onTouchMove={handleTouchMove}>
                        <div className={`${styles.sidebar} ${sidebarVisible ? styles.active : ""}`}>
                            <div className={styles.search}>
                                <input
                                    type="text"
                                    placeholder="Search title or description..."
                                    className={styles.searchInput}
                                    value={searchQuery}
                                    onChange={handleSearchChange} // Use the new handler
                                />

                                <div className={styles.filtersContainer}>
                                    <select className={styles.selectInput} onChange={handleSelectChange} value={sortOption}>
                                        <option value="newest">Newest to Oldest</option>
                                        <option value="oldest">Oldest to Newest</option>
                                        <option value="a-z">A-Z</option>
                                        <option value="z-a">Z-A</option>
                                        <option value="most-popular">Most Popular</option>
                                        <option value="least-popular">Least Popular</option>
                                    </select>
                                </div>

                                <div className={styles.userFilter}>
                                    <h3>Select Users:</h3>
                                    {uniqueAuthors.map((author) => (
                                        <label key={author}>
                                            <input
                                                type="checkbox"
                                                checked={selectedUsers.includes(author)}
                                                onChange={() => handleUserSelection(author)}
                                            />
                                            {author}
                                        </label>
                                    ))}
                                </div>

                                <div className={styles.resetContainer}>
                                    <button className={styles.resetButton} onClick={resetFilters}>
                                        Reset Filters
                                    </button>
                                </div>
                            </div>

                            <div className={styles.moderator}>
                                {(userRole === "admin" || userRole === "bobrnews_Moderator") && (
                                    <div className={styles.AddNewBtn}>
                                        <button onClick={toggleAddPost}>Add new BobrNews🐹📰</button>
                                    </div>
                                )}
                            </div>
                        </div>


                        <div className={styles.bobrContainer}>
                            <div className={styles.bobrHeader}>
                                <h1>Bobr News</h1>
                                <p>Bobr News is where the most viral stories come to life!</p>
                            </div>
                            <div className={styles.newsList}>
                                {filteredNews.map((item) => (
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
                )
            }
        </div>
    )
}
