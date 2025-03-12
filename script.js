const canvas = document.getElementById('roomCanvas');
const ctx = canvas.getContext('2d');
let distances = [];
let zoomLevel = 1;
let rotationAngle = 0;
let objects = [];
let objectPositions = {};
let roomDrawn = false; // Vérifie si la pièce a été dessinée

// Initialisation du Canvas
function initializeCanvas() {
  canvas.width = window.innerWidth;
  canvas.height = window.innerHeight;
}
initializeCanvas();
window.addEventListener('resize', initializeCanvas);

// Gérer les champs pour les distances
function generateDistanceInputs() {
  const points = parseInt(document.getElementById('points').value);
  if (points < 3) {
    alert("Il faut au moins 3 sommets !");
    return;
  }

  distances = [];
  const distancesDiv = document.getElementById('distances');
  distancesDiv.innerHTML = ''; // Réinitialiser

  for (let i = 0; i < points; i++) {
    const input = document.createElement('input');
    input.type = 'number';
    input.placeholder = `Distance ${i + 1}`;
    input.min = 1;
    distancesDiv.appendChild(input);
  }
}

// Zoomer ou Dézoomer
function zoom(action) {
  if (action === 'in') zoomLevel *= 1.2;
  else if (action === 'out') zoomLevel /= 1.2;
  redraw(); // Re-dessiner tout avec l'échelle mise à jour
}

// Rotation du schéma
function rotateRoom() {
  rotationAngle += Math.PI / 12; // Rotation de 15 degrés
  redraw(); // Re-dessiner tout avec la rotation mise à jour
}

// Dessiner ou re-décaler la pièce avec les transformations
function redraw() {
  const centerX = canvas.width / 2;
  const centerY = canvas.height / 2;

  if (!roomDrawn) return; // Ne rien faire si la pièce n'est pas dessinée

  ctx.clearRect(0, 0, canvas.width, canvas.height); // Effacer

  ctx.save(); // Sauvegarder l'état initial
  ctx.translate(centerX, centerY); // Déplacer au centre
  ctx.scale(zoomLevel, zoomLevel); // Appliquer le zoom
  ctx.rotate(rotationAngle); // Appliquer la rotation
  ctx.translate(-centerX, -centerY); // Revenir à l'origine

  // Dessiner la pièce
  ctx.beginPath();
  let angle = 0;

  distances.forEach((dist, idx) => {
    const x = centerX + dist * Math.cos(angle);
    const y = centerY + dist * Math.sin(angle);

    idx === 0 ? ctx.moveTo(x, y) : ctx.lineTo(x, y);
    angle += (2 * Math.PI) / distances.length;
  });

  ctx.closePath();
  ctx.lineWidth = 1 / zoomLevel; // Épaisseur constante des traits
  ctx.strokeStyle = 'white';
  ctx.stroke();
  ctx.restore(); // Restaurer l'état initial

  // Dessiner les objets
  drawObjects();
}

// Dessiner la pièce
function drawRoom() {
  const points = parseInt(document.getElementById('points').value);

  distances = [];
  const distancesInputs = document.querySelectorAll('#distances input');
  distancesInputs.forEach(input => distances.push(parseFloat(input.value)));

  if (distances.some(d => isNaN(d) || d <= 0)) {
    alert("Vérifiez que toutes les distances sont valides !");
    return;
  }

  roomDrawn = true; // Confirmer que la pièce a été dessinée
  document.getElementById('objectsSection').style.display = 'block'; // Activer la zone des objets

  redraw();
}

// Placer les objets dans la pièce
function placeObjects() {
  objects = Array.from(document.querySelectorAll('.objectCheckbox:checked')).map(input => input.value);
  repositionObjects();
}

// Générer de nouvelles positions pour les objets (dans la pièce)
function repositionObjects() {
  objectPositions = {};

  objects.forEach(obj => {
    let validPosition = false;

    while (!validPosition) {
      // Générer des coordonnées aléatoires
      const x = Math.random() * canvas.width;
      const y = Math.random() * canvas.height;

      // Vérifier si la position est à l'intérieur de la pièce
      if (isInsideRoom(x, y)) {
        let valid = true;

        // Appliquer les règles de distances minimales entre objets
        if (obj === 'object1' && 'object3' in objectPositions) {
          const dx = x - objectPositions['object3'].x;
          const dy = y - objectPositions['object3'].y;
          if (Math.sqrt(dx * dx + dy * dy) < 200) valid = false;
        }
        if (obj === 'object2' && 'object1' in objectPositions) {
          const dx = x - objectPositions['object1'].x;
          const dy = y - objectPositions['object1'].y;
          if (Math.sqrt(dx * dx + dy * dy) < 500) valid = false;
        }

        if (valid) {
          objectPositions[obj] = { x, y };
          validPosition = true;
        }
      }
    }
  });

  redraw(); // Re-dessiner après avoir repositionné
}

// Vérifier si un point est dans la pièce
function isInsideRoom(x, y) {
  const centerX = canvas.width / 2;
  const centerY = canvas.height / 2;

  let angle = 0;
  const vertices = distances.map((dist, idx) => {
    const vx = centerX + dist * Math.cos(angle);
    const vy = centerY + dist * Math.sin(angle);
    angle += (2 * Math.PI) / distances.length;
    return { x: vx, y: vy };
  });

  // Algorithme pour vérifier si le point est dans un polygone
  let isInside = false;
  let j = vertices.length - 1;
  for (let i = 0; i < vertices.length; i++) {
    if ((vertices[i].y > y) !== (vertices[j].y > y) &&
        x < (vertices[j].x - vertices[i].x) * (y - vertices[i].y) / (vertices[j].y - vertices[i].y) + vertices[i].x) {
      isInside = !isInside;
    }
    j = i;
  }

  return isInside;
}

// Dessiner les objets dans la pièce
function drawObjects() {
  for (const [obj, position] of Object.entries(objectPositions)) {
    ctx.beginPath();
    ctx.arc(position.x, position.y, 10, 0, 2 * Math.PI); // Dessiner un cercle pour l'objet
    ctx.fillStyle = obj === 'object1' ? 'red' : obj === 'object2' ? 'blue' : 'green';
    ctx.fill();
    ctx.closePath();

    // Afficher le nom de l'objet
    ctx.fillStyle = 'white';
    ctx.font = '14px Arial';
    ctx.fillText(obj, position.x + 15, position.y - 10);
  }
}

// Calculer et afficher les distances entre les objets
function displayDistances() {
  const distancesDiv = document.getElementById('distances');
  distancesDiv.innerHTML = ''; // Réinitialiser les distances affichées

  const entries = Object.entries(objectPositions);
  for (let i = 0; i < entries.length; i++) {
    for (let j = i + 1; j < entries.length; j++) {
      const [obj1, pos1] = entries[i];
      const [obj2, pos2] = entries[j];
      const dx = pos1.x - pos2.x;
      const dy = pos1.y - pos2.y;
      const distance = Math.sqrt(dx * dx + dy * dy);

      const distanceInfo = document.createElement('div');
      distanceInfo.textContent = `Distance entre ${obj1} et ${obj2} : ${distance.toFixed(2)}`;
      distancesDiv.appendChild(distanceInfo);
    }
  }
}
