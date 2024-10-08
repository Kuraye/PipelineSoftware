import { useEffect, useRef } from 'react';
import Webcam from 'react-webcam';
import { Pose, POSE_CONNECTIONS } from '@mediapipe/pose';
import { Camera } from '@mediapipe/camera_utils';
import { drawConnectors, drawLandmarks } from '@mediapipe/drawing_utils';

function WebcamDemo() {
  const webcamRef = useRef(null);
  const canvasRef = useRef(null);

  function onResults(results) {
    const canvasElement = canvasRef.current;
    const canvasCtx = canvasElement.getContext('2d');
    const { clientWidth, clientHeight } = webcamRef.current.video;

    canvasElement.width = clientWidth;
    canvasElement.height = clientHeight;

    canvasCtx.save();
    canvasCtx.clearRect(0, 0, clientWidth, clientHeight);

    // Draw image from camera.
    canvasCtx.drawImage(results.image, 0, 0, clientWidth, clientHeight);
  
    // Draw connectors between the landmarks.
    drawConnectors(
      canvasCtx,
      results.poseLandmarks,
      POSE_CONNECTIONS,
      { color: '#00FF00', lineWidth: 4 },
    );

    // Draw pose landmarks on the image.
    drawLandmarks(
      canvasCtx,
      results.poseLandmarks,
      { color: '#FF0000', lineWidth: 2 },
    );
    canvasCtx.restore();
  }

  useEffect(() => {
    const pose = new Pose({
      locateFile: file => `https://cdn.jsdelivr.net/npm/@mediapipe/pose/${file}`,
    });
    pose.setOptions({
      modelComplexity: 1,
      minDetectionConfidence: 0.5,
      minTrackingConfidence: 0.5,
    });
    pose.onResults(onResults);

    const { video } = webcamRef.current;
    const camera = new Camera(video, {
      onFrame: async () => {
        await pose.send({ image: video });
      },
      width: 640,
      height: 480,
    });
    camera.start();

    return () => pose.close();
  });

  return (
    <div style={{
      display: 'flex',
      justifyContent: 'center',
      flexWrap: 'wrap',
    }}>
      <Webcam ref={webcamRef} style={{ maxWidth: '100%' }} />
      <canvas ref={canvasRef} style={{ maxWidth: '100%' }} />
    </div>
  );
}

export default WebcamDemo;