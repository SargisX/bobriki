import { useState } from "react";
import styles from "./signUp.module.css";
import { Link, useNavigate } from "react-router-dom";
import { createUser, getUserByUsername } from "../../components/Users/users.api";

const SignUp: React.FC = () => {
    const [username, setUsername] = useState("");
    const [password, setPassword] = useState("");
    const [confirmPassword, setConfirmPassword] = useState(""); 
    const [error, setError] = useState('');
    const [isSubmitting, setIsSubmitting] = useState(false);
    const navigate = useNavigate();

    const handleSignUp = async (e: React.FormEvent) => {
        e.preventDefault();
        if (isSubmitting) return;

        setIsSubmitting(true);
        setError('');

        if (!username || !password || !confirmPassword) {
            setError("Please fill all fields.");
            setIsSubmitting(false);
            return;
        }

        if (password !== confirmPassword) {
            setError("Passwords do not match.");
            setIsSubmitting(false);
            return;
        }

        try {
            const existingUser = await getUserByUsername(username);

            if (existingUser) {
                setError("Username already taken. Please choose another one.");
                setIsSubmitting(false);
                return;
            }

            const newUser = {
                username,
                password,
                role: username === "@ADMIN_SMaster" && password === "Adm!nC0ntr0l#2024" ? "admin" : "user",
            };
            await createUser(newUser);

            alert(`Welcome, you're signed up as ${username}`);
            navigate("/signin");
        } catch (error) {
            setError("Sign-up failed. Please try again.");
        } finally {
            setIsSubmitting(false);
        }
    };

    return (
        <div className={styles.container}> 
            <form className={styles.form} onSubmit={handleSignUp}>
                <h2 className={styles.title}>Create Your Account</h2>
                <div className={styles.imageContainer}>
                    <img src="https://raw.githubusercontent.com/SargisX/bobriki/main/src/assets/bobrik.jpg" alt="Sign Up" className={styles.image} />
                    <div className={styles.overlay}></div>
                </div>
                <input
                    type="text"
                    placeholder="Username"
                    value={username}
                    onChange={(e) => setUsername(e.target.value.trim())}
                    required
                    className={styles.input}
                />
                <input
                    type="password"
                    placeholder="Password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value.trim())}
                    required
                    className={styles.input}
                />
                <input
                    type="password"
                    placeholder="Confirm Password" 
                    value={confirmPassword}
                    onChange={(e) => setConfirmPassword(e.target.value.trim())}
                    required
                    className={styles.input}
                />
                <button type="submit" className={styles.button} disabled={isSubmitting}>
                    {isSubmitting ? "Signing Up..." : "Sign Up"}
                </button>
                {error && <p className={styles.error}>{error}</p>}
                
                <div className={styles.links}>
                    <Link to="/signin" className={styles.link}>Already have an account? Sign in</Link>
                </div>
            </form>
        </div>
    );
};

export default SignUp;
