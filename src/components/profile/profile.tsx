import { useEffect, useState } from "react";
import styles from "./Profile.module.css"; // CSS for styling
import { getUserById } from "../users/users.api";
import { getCurrentSession } from "../users/auth/authUtils";

// User Type Interface
export interface User {
  id: string;
  username: string;
  password: string;
  role: string;
}

// Component Logic
export const Profile = () => {
  const [user, setUser] = useState<User | null>(null);
  const [visiblePosts, setVisiblePosts] = useState<number>(30); // Control post visibility
  const [posts, setPosts] = useState<string[]>([]); // Store post URLs

  useEffect(() => {
    const fetchUser = async () => {
      try {
        const id = getCurrentSession()?.userId
        const userData = await getUserById(`${id}`); // Replace with the actual user ID
        if (userData) {
          setUser(userData);
          // Simulate post data for now (Replace with actual posts fetching logic)
          setPosts(Array(100).fill("https://via.placeholder.com/150")); // 50 Placeholder images
        }
      } catch (error) {
        console.error("Failed to fetch user:", error);
      }
    };

    fetchUser();
  }, []);

  const handleShowMore = () => {
    setVisiblePosts((prev) => prev + 30); // Show 30 more posts on click
  };

  if (!user) return <div>Loading...</div>;

  return (
    <div className={styles.profileContainer}>
      <div className={styles.header}>
        <img
          src="https://via.placeholder.com/100" // Placeholder profile image
          alt={user.username}
          className={styles.profileImage}
        />
        <div className={styles.stats}>
          <div>
            <strong>{posts.length}</strong> Posts
          </div>
          <div>
            <strong>100</strong> Followers
          </div>
          <div>
            <strong>80</strong> Following
          </div>
        </div>
        <button className={styles.followButton}>Follow</button>
      </div>

      <div className={styles.postGrid}>
        {posts.slice(0, visiblePosts).map((post, index) => (
          <img key={index} src={post} alt={`Post ${index + 1}`} className={styles.postImage} />
        ))}
      </div>

      {visiblePosts < posts.length && (
        <button className={styles.showMoreButton} onClick={handleShowMore}>
          Show More
        </button>
      )}
    </div>
  );
};
