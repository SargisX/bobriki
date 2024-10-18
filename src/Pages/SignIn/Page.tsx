import { useState } from "react"
import { saveLoginSession } from "../../components/auth/authUtils"
import styles from './signIn.module.css'
import { useNavigate } from "react-router-dom"
import { User } from "../../components/auth/types"

interface SignInProps {
    setIsLoggedIn: (value: boolean) => void
    setRole: (role: string | null) => void
}

const SignIn: React.FC<SignInProps> = ({ setIsLoggedIn, setRole }) => {
    const [username, setUsername] = useState("")
    const [password, setPassword] = useState("")
    const [error, setError] = useState<string | null>(null)
    const navigate = useNavigate()

    const handleSignIn = (e: React.FormEvent) => {
        e.preventDefault()


        const users: User[] = JSON.parse(localStorage.getItem("users") || "[]")


        const user = users.find((u: { username: string, password: string }) =>
            u.username === username && u.password === password
        )

        if (user) {

            const role = user.username === "SargisX" && user.id === '13795' ? "admin" : user.role


            setIsLoggedIn(true)
            setRole(role)
            saveLoginSession(user)
            console.log("Session saved:", { role })
            alert(`Logged in as ${role}`)
            navigate("/")
        } else {
            setError("Invalid username or password.")
        }
    }

    return (
        <form className={styles.form} onSubmit={handleSignIn}>
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
            <button type="submit" className={styles.button}>Sign In</button>
            {error && <p className={styles.error}>{error}</p>}
        </form>
    )
}

export default SignIn
