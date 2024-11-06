import { useState } from 'react';

export const useNotifications = () => {
    const [permission, setPermission] = useState<NotificationPermission>(
        Notification.permission
    );

    const requestPermission = async () => {
        // Detect if the user is on iOS
        const isIOS = /iPad|iPhone|iPod/i.test(navigator.userAgent);
    
        // Skip requesting permission if on iOS
        if (isIOS) {
            console.log("Notifications are not supported on iOS PWAs.");
            return;
        }
    
        // Request permission for other platforms
        const newPermission = await Notification.requestPermission();
        setPermission(newPermission);
        if (newPermission !== 'granted') {
            alert('Please enable notifications to receive updates!');
        }
    };
    

    const showLocalNotification = (title: string, options: NotificationOptions) => {
        if (permission === 'granted' && navigator.serviceWorker.controller) {
            navigator.serviceWorker.ready.then((registration) => {
                registration.showNotification(title, options);
            });
        }
    };

    const sendNotification = (body:string,icon:string) => {
        const options: NotificationOptions = {
            body,
            icon
        }
        return options
      }; 

    return { permission, requestPermission, showLocalNotification ,sendNotification};
};
