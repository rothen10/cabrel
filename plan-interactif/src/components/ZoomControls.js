function ZoomControls({ setZoomLevel }) {
    const handleZoom = (direction) => {
      setZoomLevel((prev) => (direction === 'in' ? prev * 1.2 : prev / 1.2));
    };
  
    return (
      <div className="zoomControls">
        <button onClick={() => handleZoom('in')}>🔍+</button>
        <button onClick={() => handleZoom('out')}>🔍-</button>
      </div>
    );
  }
  
  export default ZoomControls;
  