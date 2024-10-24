import { useState } from "react";
import { deleteBobrNews } from "../bobrNews.api";
import styles from "./bobrNewsDelete.module.css";

interface BobrNewsDeleteProps {
    id: string;
    onDelete: () => void; // Callback to refresh the news list
}

export const BobrNewsDelete: React.FC<BobrNewsDeleteProps> = ({ id, onDelete }) => {
    const [isDeleting, setIsDeleting] = useState(false);

    const handleDelete = () => {
        setIsDeleting(true); // Start animation
        setTimeout(async () => {
            await deleteBobrNews(id); // Delete from the server
            onDelete(); // Refresh the news list after deletion
        }, 300); // Delay to match animation duration
    };

    return (
        <button 
            className={`${styles.deleteButton} ${isDeleting ? styles.deleting : ""}`} 
            onClick={handleDelete}
        >
            ✖
        </button>
    );
};
