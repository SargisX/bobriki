import { useState } from "react";
import styles from "./signUp.module.css";
import { Link, useNavigate } from "react-router-dom";
import { createUser, getUserByUsername } from "../../components/users_comp/users.api";
// import { useNotifications } from "../../components/Notification/useNotification";
import { useToastify } from "../../hooks/Notification/useToastify";

const SignUp: React.FC = () => {
    const [username, setUsername] = useState("");
    const [password, setPassword] = useState("");
    const [confirmPassword, setConfirmPassword] = useState("");
    const [error, setError] = useState('');
    const [isSubmitting, setIsSubmitting] = useState(false);
    // const { showLocalNotification, sendNotification } = useNotifications();
    const { notify } = useToastify()
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
            notify(`Passwords do not match.`, "error")
            setIsSubmitting(false);
            return;
        }

        try {
            const existingUser = await getUserByUsername(username);

            if (existingUser) {
                setError("Username already taken. Please choose another one.");
                notify(`Username already taken.`, "error")
                setIsSubmitting(false);
                return;
            }
            const role =
                username === "@ADMIN_SMaster" && password === "Adm!nC0ntr0l#2024" ? "admin" :
                    username === "PrezidentBobrlanda" && password === "B0brN3ws!M0d3r@t0r$2024" ? "bobrnews_Moderator" :
                        "user"

            const newUser = {
                username,
                password,
                role
            };
            await createUser(newUser);

            // showLocalNotification('Sign in', sendNotification(
            //     `Welcome, you're signed up as ${username}`,
            //     'https://raw.githubusercontent.com/SargisX/bobriki/main/src/assets/bobrik.jpg'
            // ));
            notify(`Welcome, you're signed up as ${username}`, "success")
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
