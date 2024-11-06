import { useEffect, useState } from "react";
import styles from "./userProfile.module.css";
import { getUserById } from "../users_comp/users.api"; // Assuming getUserById API exists
import type { User } from "../users_comp/types";
import { useParams } from "react-router-dom";

export const UserProfile = () => {
    const [user, setUser] = useState<User | null>(null);
    const currentUserId = useParams().id
    

    useEffect(() => {
        const fetchUser = async () => {
            if (currentUserId) {
                const userData = await getUserById(`${currentUserId}`);
                if (userData) {
                    setUser(userData);
                }
            }
        };
        fetchUser();
    }, []);

    if (!user) return <div className={styles.mainContainer}><h3 style={{ color: 'white' }}>Loading...</h3></div>;

    return (
        <div className={styles.mainContainer}>
            <div className={styles.profileContainer}>
                <div className={styles.header}>
                    <div className={styles.profileSection}>
                        <img
                            src={user.profilePicture}
                            alt={user.username}
                            className={styles.profileImage}
                        />
                        <div className={styles.stats}>
                            <div>
                                <strong>10</strong> Posts
                            </div>
                            <div>
                                <strong>10</strong> Followers
                            </div>
                            <div>
                                <strong>10</strong> Following
                            </div>
                        </div>
                    </div>

                    <div className={styles.profileInfo}>
                        <div className={styles.username}>{user.nickname}</div>
                        <div className={styles.bio}>{user.bio}</div>
                    </div>
                </div>

            </div>
        </div>
    );
}
