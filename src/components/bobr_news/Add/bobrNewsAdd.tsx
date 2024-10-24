import { useState, ChangeEvent, FormEvent } from "react"
import styles from "./bobrNewsAdd.module.css"
import { createBobrNews, uploadImage } from "../bobrNews.api"
import { getAllUsers } from "../../Users/users.api"
import type { CreateBobrNews } from "../types";

interface Props {
  addPost: boolean;
  setAddPost: () => void;
  refreshNews: () => void; // Add refreshNews prop
}

export const BobrNewsAdd = ({ setAddPost, refreshNews }: Props) => {
  const [title, setTitle] = useState<string>("")
  const [description, setDescription] = useState<string>("")
  const [photo, setPhoto] = useState<File | null>(null)
  const [users, setUsers] = useState<string[]>([])
  const [userSearch, setUserSearch] = useState<string>("")
  const [suggestions, setSuggestions] = useState<any[]>([])
  const [imagePreview, setImagePreview] = useState<string | null>(null)
  const [isLoading, setIsLoading] = useState<boolean>(false)

  const handleImageChange = (e: ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (file) {
      setPhoto(file)
      setImagePreview(URL.createObjectURL(file))
    }
  }

  const handleAddUser = (name: string) => {
    if (!users.includes(name)) {
      setUsers((prev) => [...prev, name])
    }
    setUserSearch("")
    setSuggestions([])
  }

  const handleUserSearch = async (e: ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value
    setUserSearch(value)

    if (value) {
      const foundUsers = await getUsers(value)
      setSuggestions(foundUsers)
    } else {
      setSuggestions([])
    }
  }


  const handleSelectUser = (user: any) => {
    handleAddUser(user.username)
  }

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault()
    setIsLoading(true)

    try {
      let imageUrl = null
      if (photo) {
        const image = new FormData()
        image.append("file", photo)

        const data = await uploadImage(image)
        imageUrl = data.secure_url

        setImagePreview(null)
      }
      const date = Math.floor(+Date.now() / 1000)

      const bobrnews: CreateBobrNews = {
        title,
        description,
        photo: imageUrl,
        members: users,
        date,
        likes: [],
        comments: []
      }

      await createBobrNews(bobrnews); // Ensure to await this
      alert("Bobr News Posted Successfully!");
      refreshNews(); // Call the refresh function
      setAddPost();
      console.log("Submitted Data:", { title, description, imageUrl, users });
    } catch (error) {
      console.error("Upload error:", error);
    } finally {
      setIsLoading(false);
    }
  }

  const getUsers = async (query: string) => {
    try {
      const allUsers = await getAllUsers()
      return allUsers
        .filter(
          (user) =>
            user.username.toLowerCase().includes(query.toLowerCase()) &&
            user.role !== "admin"
        )
        .slice(0, 5)
    } catch (error) {
      console.error("Error fetching users:", error)
      return []
    }
  }

  return (
    <div className={styles.main}>
      <div className={styles.container}>
        <form onSubmit={handleSubmit}>
          <div className={styles.formGroup}>
            <label>Title:</label>
            <input
              type="text"
              className={styles.input}
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              required
            />
          </div>

          <div className={styles.formGroup}>
            <label>Description:</label>
            <textarea
              className={styles.textarea}
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              required
            />
          </div>

          <div className={styles.formGroup}>
            <label>Image:</label>
            <input type="file" accept="image/*" onChange={handleImageChange} />
            {imagePreview && (
              <img src={imagePreview} alt="Preview" className={styles.imagePreview} />
            )}
          </div>

          <div className={styles.formGroup}>
            <label>Users:</label>
            <input
              type="text"
              placeholder="Search for a user"
              className={styles.input}
              value={userSearch}
              onChange={handleUserSearch}
            />
            <div className={styles.suggestionsContainer}>
              {suggestions.length > 0 &&
                suggestions.map((user) => (
                  <div
                    key={user.id}
                    className={styles.userCard}
                    onClick={() => handleSelectUser(user)}
                  >
                    <img
                      src={user.image || "path/to/default.jpg"}
                      alt={user.username} // Display username here
                      className={styles.userImage}
                    />
                    <span>{user.username}</span> {/* Use username here */}
                  </div>
                ))
              }

            </div>
            <div className={styles.selectedUsers}>
              {users.map((user, index) => (
                <span key={index} className={styles.tag}>
                  {user}
                </span>
              ))}
            </div>
          </div>

          <button type="submit" className={styles.button} disabled={isLoading}>
            {isLoading ? "Uploading..." : "Add News"}
          </button>
          <button type="button" className={styles.cancelButton} onClick={setAddPost}>Cancel</button>
        </form>
      </div>
    </div>
  )
}
