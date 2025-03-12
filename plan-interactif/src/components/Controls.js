import React, { useState } from 'react';

function Controls({ setDistances, setRoomDrawn, setObjects, roomDrawn }) {
  const [points, setPoints] = useState(4);

  const handleGenerateDistances = () => {
    const newDistances = Array.from({ length: points }, () =>
      Math.floor(Math.random() * 300 + 50)
    );
    setDistances(newDistances);
  };

  const handleDrawRoom = () => {
    setRoomDrawn(true);
  };

  const handleObjectsSelection = (event) => {
    const selectedObjects = Array.from(
      event.target.form.querySelectorAll('input[type="checkbox"]:checked')
    ).map(input => ({
      name: input.value,
      color: input.dataset.color,
      x: Math.random() * 500, // Coordonnées aléatoires (à ajuster avec la logique)
      y: Math.random() * 500,
    }));
    setObjects(selectedObjects);
  };

  return (
    <div className="controls">
      <h2>Configurer la Pièce</h2>
      <label>
        Nombre de Sommets :
        <input
          type="number"
          min="3"
          value={points}
          onChange={(e) => setPoints(Number(e.target.value))}
        />
      </label>
      <button onClick={handleGenerateDistances}>Configurer Distances</button>
      <button onClick={handleDrawRoom}>Dessiner</button>

      {roomDrawn && (
        <form className="objectsSection">
          <h2>Objets à Ajouter</h2>
          <label>
            <input type="checkbox" value="Objet 1" data-color="red" /> Objet 1
          </label>
          <label>
            <input type="checkbox" value="Objet 2" data-color="blue" /> Objet 2
          </label>
          <label>
            <input type="checkbox" value="Objet 3" data-color="green" /> Objet 3
          </label>
          <button type="button" onClick={handleObjectsSelection}>
            Placer les Objets
          </button>
        </form>
      )}
    </div>
  );
}

export default Controls;
