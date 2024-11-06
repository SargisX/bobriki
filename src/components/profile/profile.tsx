import { useEffect, useState } from "react";
import styles from "./profile.module.css";
import { getUserById, updateUser } from "../users_comp/users.api"; // Assuming getUserById API exists
import { getCurrentSession } from "../users_comp/auth/authUtils";
import { UpdateProfile, User } from "../users_comp/types";
import { EditProfile } from "./editProfile";

export const Profile = () => {
  const [user, setUser] = useState<User | null>(null);

  useEffect(() => {
    const fetchUser = async () => {
      const id = getCurrentSession()?.userId;
      if (id) {
        const userData = await getUserById(`${id}`);
        if (userData) {
          setUser(userData);
        }
      }
    };
    fetchUser();
  }, []);

  if (!user) return <div className={styles.mainContainer}><h3 style={{ color: 'white' }}>Loading...</h3></div>;

  const handleSaveChanges = (updatedUser: UpdateProfile) => {
    const updatedUserData: User = {
      ...user,
      ...updatedUser, // Spread the updated fields to the user
    };

    updateUser(updatedUserData)
    setUser(updatedUserData); // Update user state with the new data
  };

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

        {/* Pass the save callback to EditProfile */}
        <EditProfile user={user} onSave={handleSaveChanges} />
      </div>
    </div>
  );
};
