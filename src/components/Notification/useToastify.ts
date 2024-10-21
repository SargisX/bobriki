import { toast, ToastOptions } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';


export const useToastify = () => {
    const notify = (text: string, type: 'success' | 'error' | 'info' | 'warn' = 'info', options?: ToastOptions) => {
        switch (type) {
            case 'success':
                toast.success(text, options);
                break;
            case 'error':
                toast.error(text, options);
                break;
            case 'warn':
                toast.warn(text, options);
                break;
            case 'info':
            default:
                toast.info(text, options);
                break;
        }
    };

    return { notify };
};
