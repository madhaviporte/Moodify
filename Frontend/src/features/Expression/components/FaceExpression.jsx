import { useEffect, useRef, useState } from "react";
import { detect, init } from "../utils/utils";
import "./faceExpression.scss";

export default function FaceExpression({ onClick = () => {} }) {
    const videoRef = useRef(null);
    const landmarkerRef = useRef(null);
    const streamRef = useRef(null);

    const [expression, setExpression] = useState("Detecting...");
    const [cameraError, setCameraError] = useState(null);
    const [detecting, setDetecting] = useState(false);

    useEffect(() => {
        init({ landmarkerRef, videoRef, streamRef, setCameraError });

        return () => {
            if (landmarkerRef.current) {
                landmarkerRef.current.close();
            }
            if (videoRef.current?.srcObject) {
                videoRef.current.srcObject.getTracks().forEach((track) => track.stop());
            }
        };
    }, []);

    async function handleClick() {
        if (detecting) return; // P2: prevent rapid repeated clicks
        setDetecting(true);
        try {
            const expression = detect({ landmarkerRef, videoRef, setExpression });
            onClick(expression);
        } finally {
            setDetecting(false);
        }
    }

    if (cameraError) {
        return (
            <div style={{ textAlign: "center" }}>
                <p style={{ color: "#ff4444", fontSize: "0.95rem" }}>{cameraError}</p>
            </div>
        );
    }

    return (
        <div style={{ textAlign: "center" }}>
            <video
                ref={videoRef}
                style={{ width: "100%", maxWidth: "400px", borderRadius: "12px" }}
                playsInline
            />
            <h2>{expression}</h2>
            <button className="detect-btn" onClick={handleClick} disabled={detecting}>
                {detecting ? "Detecting..." : "Detect expression"}
            </button>
        </div>
    );
}