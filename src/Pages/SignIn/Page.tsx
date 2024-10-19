import { useState } from "react"
import { saveLoginSession } from "../../components/auth/authUtils"
import styles from './signIn.module.css'
import { useNavigate } from "react-router-dom"
import { User } from "../../components/auth/types"
import triggerWorkflow from "../../components/auth/githubWorkflow"

interface SignInProps {
    setIsLoggedIn: (value: boolean) => void
    setRole: (role: string | null) => void
}

const SignIn: React.FC<SignInProps> = ({ setIsLoggedIn, setRole }) => {
    const [username, setUsername] = useState("")
    const [password, setPassword] = useState("")
    const [error, setError] = useState<string | null>(null)
    const navigate = useNavigate()

    const handleSignIn = async (e: React.FormEvent) => {
        e.preventDefault();
    
        const users: User[] = JSON.parse(localStorage.getItem("users") || "[]");
    
        const user = users.find((u: { username: string, password: string }) =>
            u.username === username && u.password === password
        );
    
        if (user) {
            const role = user.username === "SargisX" && user.id === '13795' ? "admin" : user.role;
    
            setIsLoggedIn(true);
            setRole(role);
            saveLoginSession(user);
            console.log("Session saved:", { role });
            
            // Call the triggerWorkflow function here
            try {
                await triggerWorkflow(); // Make sure to handle this if you want to show a loading state or handle errors
            } catch (error) {
                console.error("Error triggering workflow:", error);
                setError("An error occurred while logging in.");
                return; // Exit the function if there's an error
            }
    
            alert(`Logged in as ${role}`);
            navigate("/");
        } else {
            setError("Invalid username or password.");
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
