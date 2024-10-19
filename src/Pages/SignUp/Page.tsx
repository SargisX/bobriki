import { useState } from "react"
import { saveLoginSession } from "../../components/auth/authUtils"
import styles from './signUp.module.css'
import { useNavigate } from "react-router-dom"


const SignUp: React.FC = () => {
    const [username, setUsername] = useState("")
    const [password, setPassword] = useState("")
    const [error, setError] = useState<string | null>(null)
    const [isSubmitting, setIsSubmitting] = useState(false)
    const navigate = useNavigate()

    const handleSignUp = (e: React.FormEvent) => {
        e.preventDefault()

        if (isSubmitting) return

        setIsSubmitting(true)

        if (!username || !password) {
            setError("Please fill all fields.")
            setIsSubmitting(false)
            return
        }

        const users = JSON.parse(localStorage.getItem("users") || "[]")


        if (users.some((user: { username: string }) => user.username === username)) {
            setError("Username already exists. Please choose another.")
            setIsSubmitting(false)
            return
        }

        const role = username === "SargisX" ? "admin" : "user"
        const id = role === 'admin' ? '13795' : String(Date.now())
        const userData = {
            id,
            username,
            password,
            role,
        }

        users.push(userData)
        localStorage.setItem("users", JSON.stringify(users))
        saveLoginSession(userData)
        alert(`Signed up as ${username} with role: ${role}`)
        navigate("/signin")
    }

    return (
        <form className={styles.form} onSubmit={handleSignUp}>
            <input
                type="text"
                placeholder="Username"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                required
                className={styles.input}
            />
            <input
                type="password"
                placeholder="Password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
                className={styles.input}
            />
            <button type="submit" className={styles.button} disabled={isSubmitting}>
                {isSubmitting ? 'Signing Up...' : 'Sign Up'}
            </button>
            {error && <p className={styles.error}>{error}</p>}
        </form>
    )
}

export default SignUp