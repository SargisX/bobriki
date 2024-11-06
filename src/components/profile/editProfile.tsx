import { useState, useEffect } from "react";
import { UpdateProfile, User } from "../users_comp/types"; // Assuming this is the correct path for the User type
import styles from "./profile.module.css"; // Assuming you're using the same styles

interface EditProfileProps {
  user: User;
  onSave: (updatedUser: UpdateProfile) => void; // A callback to notify when the user updates their profile
}

export const EditProfile = ({ user, onSave }: EditProfileProps) => {
  const [updatedUser, setUpdatedUser] = useState<UpdateProfile>({
    nickname: user.nickname,
    bio: user.bio,
    profilePicture: user.profilePicture, // Allow profile picture editing as well
  });
  const [isEditing, setIsEditing] = useState(false);

  // Close the modal if the user clicks outside of it
  const handleOutsideClick = (e: React.MouseEvent) => {
    if (e.target === e.currentTarget) {
      setIsEditing(false);
    }
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setUpdatedUser((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    // Call onSave to update the profile
    onSave(updatedUser);
    setIsEditing(false); // After submission, switch back to view mode
  };

  const handleCancel = () => {
    setIsEditing(false);
    setUpdatedUser({
      nickname: user.nickname,
      bio: user.bio, // Revert back to original values
      profilePicture: user.profilePicture,
    });
  };

  useEffect(() => {
    // Close the modal if the user clicks escape
    const handleEscape = (e: KeyboardEvent) => {
      if (e.key === "Escape") {
        setIsEditing(false);
      }
    };

    window.addEventListener("keydown", handleEscape);

    return () => {
      window.removeEventListener("keydown", handleEscape);
    };
  }, []);

  return (
    <>
      {isEditing && (
        <div className={styles.modal} onClick={handleOutsideClick}>
          <div className={styles.modalContent}>
            <button
              className={styles.closeButton}
              onClick={() => setIsEditing(false)}
            >
              &times; {/* Close (X) button */}
            </button>
            <form onSubmit={handleSubmit}>
              <div className={styles.profileInfo}>
                <div>
                  <label htmlFor="nickname">Nickname</label>
                  <input
                    type="text"
                    id="nickname"
                    name="nickname"
                    value={updatedUser.nickname || ""}
                    onChange={handleInputChange}
                  />
                </div>
                <div>
                  <label htmlFor="bio">Bio</label>
                  <textarea
                    id="bio"
                    name="bio"
                    value={updatedUser.bio || ""}
                    onChange={handleInputChange}
                  />
                </div>
              </div>

              <div className={styles.editProfileActions}>
                <button className={styles.editProfileButton} type="submit">
                  Save Changes
                </button>
                <button
                  type="button"
                  className={styles.editProfileButton}
                  onClick={handleCancel}
                >
                  Cancel
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
      {!isEditing && (
        <button
          className={styles.editProfileButton}
          onClick={() => setIsEditing(true)}
        >
          Edit Profile
        </button>
      )}
    </>
  );
};
