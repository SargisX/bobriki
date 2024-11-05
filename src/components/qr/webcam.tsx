import React, { useEffect, useRef } from "react";
import Webcam from "react-webcam";

interface WebcamCaptureProps {
    onScan: (imageSrc: string | null) => void; // Define the type for the onScan prop
}

export const WebcamCapture: React.FC<WebcamCaptureProps> = ({ onScan }) => {
    const webcamRef = useRef<Webcam>(null); // Type the ref with Webcam

    useEffect(() => {
        const timer = setInterval(() => {
            capture();
        }, 500);
        return () => clearInterval(timer);
    }, []);

    const videoConstraints = {
        width: 400,
        height: 340,
        facingMode: "environment" as const // Using 'as const' to make it a literal type
    };

    const capture = () => {
        const imageSrc = webcamRef.current?.getScreenshot() || null; // Safe access to the method
        onScan(imageSrc);
    }

    return (
        <div>
            <Webcam
                audio={false}
                ref={webcamRef}
                screenshotFormat="image/jpeg"
                videoConstraints={videoConstraints}
                onClick={() => capture()}
            />
        </div>
    );
}

