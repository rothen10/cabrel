import React, { useState } from 'react';
import Canvas from './components/Canvas';
import Controls from './components/Controls';
import ZoomControls from './components/ZoomControls';
import RotationButton from './components/RotationButton';
import './App.css'; // Vos styles ici

function App() {
  const [distances, setDistances] = useState([]);
  const [zoomLevel, setZoomLevel] = useState(1);
  const [rotationAngle, setRotationAngle] = useState(0);
  const [objects, setObjects] = useState([]);
  const [roomDrawn, setRoomDrawn] = useState(false);

  return (
    <div className="App">
      <Canvas
        distances={distances}
        zoomLevel={zoomLevel}
        rotationAngle={rotationAngle}
        objects={objects}
        roomDrawn={roomDrawn}
      />
      <Controls
        setDistances={setDistances}
        setRoomDrawn={setRoomDrawn}
        setObjects={setObjects}
        roomDrawn={roomDrawn}
      />
      <ZoomControls setZoomLevel={setZoomLevel} />
      <RotationButton setRotationAngle={setRotationAngle} />
    </div>
  );
}

export default App;
