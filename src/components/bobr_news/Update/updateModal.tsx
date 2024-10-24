import React, { useState, useEffect, ChangeEvent, FormEvent } from "react";
import { getBobrNewsById, updateBobrNews, uploadImage } from "../bobrNews.api";
import styles from "./updateModal.module.css";
import { IBobrNews } from "../types";

interface UpdateModalProps {
  newsId: string;
  onClose: () => void;
  onRefresh: () => void;
}

export const UpdateModal: React.FC<UpdateModalProps> = ({ newsId, onClose, onRefresh }) => {
  const [title, setTitle] = useState<string>("");
  const [description, setDescription] = useState<string>("");
  const [photo, setPhoto] = useState<string>("");
  const [imagePreview, setImagePreview] = useState<string | null>(null);
  const [newPhotoFile, setNewPhotoFile] = useState<File | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(false);

  useEffect(() => {
    const fetchNews = async () => {
      try {
        const news = await getBobrNewsById(newsId);
        setTitle(news.title);
        setDescription(news.description);
        setPhoto(news.photo);
        setImagePreview(news.photo);
      } catch (error) {
        console.error("Failed to fetch news:", error);
      }
    };

    fetchNews();
  }, [newsId]);

  const handleImageChange = (e: ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setNewPhotoFile(file);
      setImagePreview(URL.createObjectURL(file));
    }
  };

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    setIsLoading(true);

    try {
      let imageUrl = photo;

      if (newPhotoFile) {
        const formData = new FormData();
        formData.append("file", newPhotoFile);
        const data = await uploadImage(formData);
        imageUrl = data.secure_url;
      }

      const updatedNews: IBobrNews = {
        id: newsId,
        title,
        description,
        photo: imageUrl,
        members: [],
        date: Math.floor(+Date.now() / 1000),
        likes: [],
        comments: [],
      };

      await updateBobrNews(updatedNews);
      alert("News updated successfully!");
      onRefresh();
      onClose();
    } catch (error) {
      console.error("Update failed:", error);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className={styles.modalBackground} onClick={onClose}>
      <div className={styles.modalContent} onClick={(e) => e.stopPropagation()}>
        <form onSubmit={handleSubmit}>
          <div className={styles.formGroup}>
            <label>Title:</label>
            <input
              className={styles.inputField}
              type="text"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              required
            />
          </div>

          <div className={styles.formGroup}>
            <label>Description:</label>
            <textarea
              className={styles.textAreaField}
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              required
            />
          </div>

          <div className={styles.formGroup}>
            <label>Image:</label>
            <input type="file" accept="image/*" onChange={handleImageChange} />
            {imagePreview && (
              <img
                src={imagePreview}
                alt="Preview"
                className={styles.imagePreview}
              />
            )}
          </div>

          <div className={styles.buttonGroup}>
            <button
              type="submit"
              className={styles.submitButton}
              disabled={isLoading}
            >
              {isLoading ? "Updating..." : "Update News"}
            </button>
            <button
              type="button"
              className={styles.cancelButton}
              onClick={onClose}
            >
              Cancel
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
