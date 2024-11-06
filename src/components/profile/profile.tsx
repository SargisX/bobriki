import { useEffect, useState, useRef } from "react";
import styles from "./profile.module.css";
import { getUserById, updateUser, uploadProfilePicture } from "../users_comp/users.api";
import { getCurrentSession } from "../users_comp/auth/authUtils";
import { UpdateProfile, User } from "../users_comp/types";
import { EditProfile } from "./editProfile";
interface ProfileProps {
  user: User | null;
  setUser: (user: User | null) => void;
}
export const Profile = ({ user, setUser }: ProfileProps) => {
  const [isUploading, setIsUploading] = useState(false); // Track uploading state
  const fileInputRef = useRef<HTMLInputElement>(null); // Ref for the file input

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

    updateUser(updatedUserData);
    setUser(updatedUserData); // Update user state with the new data
  };

  const handleDoubleClickProfileImage = () => {
    const confirmation = window.confirm("Are you sure you want to change your profile picture?");
    if (confirmation) {
      // Open the file input if confirmed
      fileInputRef.current?.click();
    }
  };

  const handleProfilePictureChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    if (!e.target.files) return;
    const file = e.target.files[0];
    if (!file) return;

    setIsUploading(true);
    const formData = new FormData();
    formData.append("file", file);

    try {
      const uploadedData = await uploadProfilePicture(formData);
      if (uploadedData?.url) {
        const updatedUser = { ...user, profilePicture: uploadedData.url };
        setUser(updatedUser);
        await updateUser(updatedUser);
        alert("Profile picture updated successfully!");
      } else {
        alert("Failed to upload profile picture.");
      }
    } catch (error) {
      console.error("Error uploading profile picture:", error);
      alert("Error uploading profile picture. Please try again.");
    } finally {
      setIsUploading(false);
    }
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
              onDoubleClick={handleDoubleClickProfileImage} // Attach the double-click handler
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
          {isUploading && <div className={styles.uploadingText}>Uploading...</div>} {/* Show uploading state */}

          <div className={styles.profileInfo}>
            <div className={styles.username}>{user.nickname}</div>
            <div className={styles.bio}>{user.bio}</div>
          </div>
        </div>

        {/* Pass the save callback to EditProfile */}
        <EditProfile user={user} onSave={handleSaveChanges} />

        {/* Hidden file input for profile picture */}
        <input
          type="file"
          ref={fileInputRef}
          accept="image/*"
          style={{ display: "none" }}
          onChange={handleProfilePictureChange}
        />
      </div>
    </div>
  );
};
