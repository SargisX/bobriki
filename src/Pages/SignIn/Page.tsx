import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { isSessionValid, saveLoginSession } from "../../components/auth/authUtils";
import styles from "./signIn.module.css";
import { getUserByUsername } from "../../components/Users/users.api";
// import { useNotifications } from "../../components/Notification/useNotification";
import { useToastify } from "../../hooks/Notification/useToastify";

interface SignInProps {
    setIsLoggedIn: (value: boolean) => void;
    setRole: (role: string | null) => void;
}

const SignIn: React.FC<SignInProps> = ({ setIsLoggedIn, setRole }) => {
    const [username, setUsername] = useState("");
    const [password, setPassword] = useState("");
    const [error, setError] = useState("");
    // const { showLocalNotification, sendNotification } = useNotifications();
    const { notify } = useToastify()
    const navigate = useNavigate();

    const handleSignIn = async (e: React.FormEvent) => {
        e.preventDefault();

        try {
            const user = await getUserByUsername(username);

            if (!user || user.password !== password) {
                setError("Invalid username or password.");
                notify('Invalid username or password.','error', {
                    });
                return;
            }


            const role = user.username === "@ADMIN_SMaster" ? "admin" : user.role;
            if (isSessionValid()) {
                setIsLoggedIn(true)
                setRole(role);
                navigate('/')
            }
            setIsLoggedIn(true);
            setRole(role);
            saveLoginSession(user);

            // showLocalNotification('Sign in', sendNotification(
            //     `Logged in as ${role}`,
            //     'https://raw.githubusercontent.com/SargisX/bobriki/main/src/assets/bobrik.jpg'
            // ));
            notify(`Logged in as ${role}`, "success")

            navigate("/");
        } catch (error) {
            console.error("Error during sign-in:", error);
            setError("Failed to sign in. Please try again.");
        }
    };

    return (
        <div className={styles.container}>
            <form className={styles.form} onSubmit={handleSignIn}>
                <h2 className={styles.title}>Sign in to Account</h2>
                <div className={styles.imageContainer}>
                    <img src="https://raw.githubusercontent.com/SargisX/bobriki/main/src/assets/bobrik.jpg" alt="Login" className={styles.image} />
                    <div className={styles.overlay}></div>
                </div>
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

                <div className={styles.links}>
                    <Link to="/forgot-password" className={styles.link}>Forgot Password?</Link>
                    <span className={styles.separator}>|</span>
                    <Link to="/signup" className={styles.link}>Don't have an account? Sign up</Link>
                </div>
            </form>
        </div>
    );
};

export default SignIn;
