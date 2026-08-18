import {
    FaceLandmarker,
    FilesetResolver
} from "@mediapipe/tasks-vision";

// =======================
// INIT CAMERA + MODEL
// =======================
export const init = async ({ landmarkerRef, videoRef, streamRef, setCameraError }) => {
    try {
        const vision = await FilesetResolver.forVisionTasks(
            "https://cdn.jsdelivr.net/npm/@mediapipe/tasks-vision@latest/wasm"
        );

        landmarkerRef.current = await FaceLandmarker.createFromOptions(
            vision,
            {
                baseOptions: {
                    modelAssetPath:
                        "https://storage.googleapis.com/mediapipe-models/face_landmarker/face_landmarker/float16/latest/face_landmarker.task"
                },
                outputFaceBlendshapes: true,
                runningMode: "VIDEO",
                numFaces: 1
            }
        );

        const stream = await navigator.mediaDevices.getUserMedia({
            video: true
        });

        streamRef.current = stream;

        if (videoRef.current) {
            videoRef.current.srcObject = stream;

            videoRef.current.onloadedmetadata = async () => {
                await videoRef.current.play();
            };
        }

    } catch (err) {
        console.error("INIT ERROR:", err);
        if (setCameraError) {
            if (err.name === "NotAllowedError" || err.message?.includes("Permission")) {
                setCameraError("Camera access was denied. Please allow camera permissions and reload.");
            } else if (err.name === "NotFoundError") {
                setCameraError("No camera found on this device.");
            } else {
                setCameraError("Failed to initialize camera: " + err.message);
            }
        }
    }
};


// =======================
// DETECT EMOTION
// =======================
export const detect = ({ landmarkerRef, videoRef, setExpression }) => {
    if (!landmarkerRef.current || !videoRef.current) return "Neutral";

    const video = videoRef.current;

    if (video.readyState < 2) return "Neutral";

    const results = landmarkerRef.current.detectForVideo(
        video,
        Date.now()
    );

    if (!results?.faceBlendshapes?.length) {
        setExpression("Neutral");
        return "Neutral";
    }

    const blendshapes = results.faceBlendshapes[0].categories;

    const getScore = (name) =>
        blendshapes.find((b) => b.categoryName === name)?.score || 0;

    const smileLeft = getScore("mouthSmileLeft");
    const smileRight = getScore("mouthSmileRight");
    const jawOpen = getScore("jawOpen");
    const browUp = getScore("browInnerUp");
    const frownLeft = getScore("mouthFrownLeft");
    const frownRight = getScore("mouthFrownRight");

    let expression = "Neutral";

    // 😄 HAPPY
    if (smileLeft > 0.35 && smileRight > 0.35) {
        expression = "happy";
    }
    // 😮 SURPRISED
    else if (jawOpen > 0.4 && browUp > 0.2) {
        expression = "surprised";
    }
    // 😢 SAD
    else if (frownLeft > 0.15 || frownRight > 0.15) {
        expression = "sad";
    }

    setExpression(expression);
    return expression;
};