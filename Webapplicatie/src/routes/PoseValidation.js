import { useCallback, useEffect, useRef, useState } from 'react';
import Webcam from 'react-webcam';
import { Pose } from '@mediapipe/pose';
import { Camera } from '@mediapipe/camera_utils';
import { drawLandmarks } from '@mediapipe/drawing_utils';

const landmarkNames = [
  'Neus',
  'Linker oog (binnenzijde)',
  'Linker oog',
  'Linker oog (buitenzijde)',
  'Rechter oog (binnenzijde)',
  'Rechter oog',
  'Rechter oog (buitenzijde)',
  'Linker oor',
  'Rechter oor',
  'Linker mondhoek',
  'Rechter mondhoek',
  'Linker schouder',
  'Rechter schouder',
  'Linker elleboog',
  'Rechter elleboog',
  'Linker pols',
  'Rechter pols',
  'Linker pink',
  'Rechter pink',
  'Linker wijsvinger',
  'Rechter wijsvinger',
  'Linker duim',
  'Rechter duim',
  'Linker heup',
  'Rechter heup',
  'Linker knie',
  'Rechter knie',
  'Linker enkel',
  'Rechter enkel',
  'Linker hiel',
  'Rechter hiel',
  'Linker teen',
  'Rechter teen',
];

function PoseValidation() {
  const webcamRef = useRef(null);
  const imageCanvasRef = useRef(null);
  const landmarkCanvasRef = useRef(null);
  const captureFrame = useRef(false);
  const [landmarks, setLandmarks] = useState([]);
  const [landmarkIndex, setLandmarkIndex] = useState(0);
  const [isDragging, setIsDragging] = useState(false);

  const onResults = useCallback(results => {
    if (captureFrame.current) {
      captureFrame.current = false;

      const landmarkCanvasElement = landmarkCanvasRef.current;
      const canvasElement = imageCanvasRef.current;
      const canvasCtx = canvasElement.getContext('2d');
      const { clientWidth, clientHeight } = webcamRef.current.video;

      canvasElement.width = clientWidth;
      canvasElement.height = clientHeight;
      landmarkCanvasElement.width = clientWidth;
      landmarkCanvasElement.height = clientHeight;

      canvasCtx.save();
      canvasCtx.clearRect(0, 0, clientWidth, clientHeight);

      // Draw image from camera.
      canvasCtx.drawImage(results.image, 0, 0, clientWidth, clientHeight);
      canvasCtx.restore();

      setLandmarkIndex(0);
      setLandmarks(results.poseLandmarks || []);
    }
  }, [imageCanvasRef, landmarkCanvasRef]);

  useEffect(() => {
    if (landmarks.length > 0 ) {
      const canvasElement = landmarkCanvasRef.current;
      const canvasCtx = canvasElement.getContext('2d');

      canvasCtx.clearRect(0, 0, canvasElement.width, canvasElement.height);

      // Draw pose landmarks on the image.
      drawLandmarks(
        canvasCtx,
        [landmarks[landmarkIndex]],
        { color: '#FF0000', lineWidth: 2 },
      );
    }
  }, [landmarkCanvasRef, landmarks, landmarkIndex])

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
    });
    camera.start();

    return () => pose.close();
  }, [onResults]);

  function updateLandmark(index, coords) {
    // Make a shallow copy of landmarks and update coordinates.
    const newLandmarks = landmarks.slice(0);
    newLandmarks[index] = { ...newLandmarks[index], ...coords };
    setLandmarks(newLandmarks);
  }

  return (
    <div>
      <div style={{
        display: 'flex',
        alignItems: 'center',
        paddingBottom: '1rem',
        flexDirection: 'column',
      }}>
        <button onClick={() => captureFrame.current = true}>Capture frame</button>
        <span>
          Huidige landmark: {landmarkNames[landmarkIndex]}
        </span>
        <div>
          <label htmlFor="landmarkIndex">Landmark index</label>
          <input
            id="landmarkIndex"
            type="number"
            min="0"
            max={landmarkNames.length - 1}
            value={landmarkIndex}
            onChange={e => setLandmarkIndex(Number(e.target.value) || 0)}
          />
        </div>
      </div>

      <div style={{
        display: 'flex',
        justifyContent: 'center',
        flexWrap: 'wrap',
      }}>
        <Webcam ref={webcamRef} width={640} />
        <div style={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          position: 'relative',
        }}>
          <canvas
            style={{
              left: 0,
              right: 0,
              zIndex: 1,
            }}
            ref={imageCanvasRef}
          />
          <canvas
            style={{
              position: 'absolute',
              left: 0,
              right: 0,
              zIndex: 2,
            }}
            onMouseDown={() => setIsDragging(true)}
            onMouseMove={({ nativeEvent }) => {
              if (!isDragging || !landmarks.length) return;

              const canvasElement = landmarkCanvasRef.current;
              const mouseX = parseInt(nativeEvent.offsetX - canvasElement.clientLeft);
              const mouseY = parseInt(nativeEvent.offsetY - canvasElement.clientTop);

              const x = mouseX / canvasElement.clientWidth;
              const y = mouseY / canvasElement.clientHeight;

              updateLandmark(landmarkIndex, { x, y });
            }}
            onMouseUp={() => setIsDragging(false)}
            onMouseOut={() => setIsDragging(false)}
            ref={landmarkCanvasRef}
          />
        </div>
        <div style={{
          display: 'flex',
          flexDirection: 'column',
        }}>
          <div>
            <label htmlFor="xCoord">X</label>
            <input
              id="xCoord"
              type="number"
              min="0"
              max="1"
              step="0.002"
              style={{ width: '10rem' }}
              value={landmarks[landmarkIndex].x}
              onChange={e => {
                const x = Number(e.target.value);
                updateLandmark(landmarkIndex, { x });
              }}
            />
          </div>

          <div>
            <label htmlFor="yCoord">Y</label>
            <input
              id="yCoord"
              type="number"
              min="0"
              max="1"
              step="0.002"
              style={{ width: '10rem' }}
              value={landmarks[landmarkIndex].y}
              onChange={e => {
                const y = Number(e.target.value);
                updateLandmark(landmarkIndex, { y });
              }}
            />
          </div>
          
          <div>
            <label htmlFor="zCoord">Z</label>
            <input
              id="zCoord"
              type="number"
              min="-1"
              max="1"
              step="0.002"
              style={{ width: '10rem' }}
              value={landmarks[landmarkIndex].z}
              onChange={e => {
                const z = Number(e.target.value);
                updateLandmark(landmarkIndex, { z });
              }}
            />
          </div>
        </div>
        <textarea
          style={{ width: '100%', height: '25em' }}
          value={landmarks.map((landmark, index) => (
            `Landmark ${(' ' + index).slice(-2)}: ${JSON.stringify(landmark)}`
          )).join('\n')}
          readOnly
        />
      </div>
    </div>
  );
}

export default PoseValidation;