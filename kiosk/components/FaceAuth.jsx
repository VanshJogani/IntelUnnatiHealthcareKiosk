import React, { useEffect, useRef, useState } from "react";
import * as faceapi from "face-api.js";

export const FaceAuth = ({ mode }) => {
  const videoRef = useRef();
  const [status, setStatus] = useState("Loading models...");

  useEffect(() => {
    const loadModels = async () => {
      await faceapi.nets.tinyFaceDetector.loadFromUri("/models/tiny_face_detector_model");
      await faceapi.nets.faceLandmark68Net.loadFromUri("/models/face_landmark_68_model");
      await faceapi.nets.faceRecognitionNet.loadFromUri("/models/face_recognition_model");
      startVideo();
    };
    loadModels();
  }, []);

  const startVideo = () => {
    navigator.mediaDevices.getUserMedia({ video: {} })
      .then((stream) => {
        videoRef.current.srcObject = stream;
      })
      .catch((err) => {
        console.error(err);
        setStatus("❌ Camera access error: " + err.message);
      });
  };

  const getDescriptor = async () => {
    const detection = await faceapi
      .detectSingleFace(videoRef.current, new faceapi.TinyFaceDetectorOptions())
      .withFaceLandmarks()
      .withFaceDescriptor();

    return detection?.descriptor;
  };

  const handleRegister = async () => {
    const username = prompt("Enter your username:");
    if (!username || typeof username !== "string" || username.trim() === "") {
      setStatus("❌ Username is required for registration");
      return;
    }
    const descriptor = await getDescriptor();

    if (!descriptor) return setStatus("❌ Face not detected");

    const res = await fetch("http://localhost:5050/api/register-face", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ username, descriptor }),
    });

    const data = await res.json();
    setStatus(data.message);
  };

  const handleLogin = async () => {
    const descriptor = await getDescriptor();
    if (!descriptor) return setStatus("❌ Face not detected");

    const res = await fetch("http://localhost:5050/api/descriptors");
    const users = await res.json();

    const labeledDescriptors = users
      .filter(u => typeof u.username === "string" && u.username.trim() !== "")
      .map(
        (u) =>
          new faceapi.LabeledFaceDescriptors(
            u.username,
            [new Float32Array(Object.values(u.descriptor))]
          )
      );

    const matcher = new faceapi.FaceMatcher(labeledDescriptors, 0.6);
    const match = matcher.findBestMatch(descriptor);

    if (match.label === "unknown") {
      setStatus("❌ Face not recognized");
    } else {
      setStatus("✅ Welcome, " + match.label);
    }
  };

  // Helper to style status message
  const getStatusStyle = () => {
    if (status.startsWith("✅")) return { color: 'green', minHeight: 24, marginTop: 8, wordBreak: 'break-word', textAlign: 'center' };
    if (status.startsWith("❌")) return { color: 'red', minHeight: 24, marginTop: 8, wordBreak: 'break-word', textAlign: 'center' };
    return { color: '#222', minHeight: 24, marginTop: 8, wordBreak: 'break-word', textAlign: 'center' };
  };

  return (
    <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', maxWidth: 340, margin: '0 auto', gap: 16 }}>
      <video
        ref={videoRef}
        autoPlay
        muted
        width="320"
        height="240"
        style={{ border: "2px solid black", background: '#000' }}
      />
      <button onClick={mode === "register" ? handleRegister : handleLogin} style={{ marginTop: 12, padding: '10px 24px', borderRadius: 8, border: 'none', background: '#007bff', color: '#fff', fontWeight: 600, fontSize: 16, cursor: 'pointer' }}>
        {mode === "register" ? "Register Face" : "Login with Face"}
      </button>
      <div style={getStatusStyle()}>{status}</div>
    </div>
  );
}; 