function RotationButton({ setRotationAngle }) {
    const handleRotate = () => {
      setRotationAngle((prev) => prev + Math.PI / 12); // Incrémenter de 15°
    };
  
    return <button onClick={handleRotate}>↻</button>;
  }
  
  export default RotationButton;
  