import React, { useEffect, useRef } from 'react';

function Canvas({ distances, zoomLevel, rotationAngle, objects, roomDrawn }) {
  const canvasRef = useRef(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    const ctx = canvas.getContext('2d');

    // Initialisation du canvas
    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;
    ctx.clearRect(0, 0, canvas.width, canvas.height);

    if (roomDrawn) {
      const centerX = canvas.width / 2;
      const centerY = canvas.height / 2;

      // Dessiner la pièce
      ctx.save();
      ctx.translate(centerX, centerY);
      ctx.scale(zoomLevel, zoomLevel);
      ctx.rotate(rotationAngle);
      ctx.translate(-centerX, -centerY);

      ctx.beginPath();
      let angle = 0;
      distances.forEach((dist, idx) => {
        const x = centerX + dist * Math.cos(angle);
        const y = centerY + dist * Math.sin(angle);
        idx === 0 ? ctx.moveTo(x, y) : ctx.lineTo(x, y);
        angle += (2 * Math.PI) / distances.length;
      });
      ctx.closePath();
      ctx.strokeStyle = 'white';
      ctx.stroke();
      ctx.restore();

      // Dessiner les objets
      objects.forEach(obj => {
        const { x, y, color, name } = obj;
        ctx.beginPath();
        ctx.arc(x, y, 10, 0, 2 * Math.PI);
        ctx.fillStyle = color;
        ctx.fill();
        ctx.closePath();
        ctx.fillStyle = 'white';
        ctx.font = '14px Arial';
        ctx.fillText(name, x + 15, y - 10);
      });
    }
  }, [distances, zoomLevel, rotationAngle, objects, roomDrawn]);

  return <canvas ref={canvasRef} className="canvas"></canvas>;
}

export default Canvas;
