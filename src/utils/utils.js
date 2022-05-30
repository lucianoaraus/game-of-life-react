const numRows = 30;
const numCols = 50;

const operations = [
  [0, 1],
  [0, -1],
  [1, -1],
  [-1, 1],
  [1, 1],
  [-1, -1],
  [1, 0],
  [-1, 0],
];

const patterns = [
  "Blinker",
  "Beacon",
  "Glider",
  "Pulsar",
  "Penta-decathlon",
  "Light-weight spaceship",
];

const generateEmptyGrid = () => {
  const rows = [];
  // 1 array padre con 30 arrays (hijos) con 50 elementos (0) cada uno
  // se crea un nuevo array contenedor donde se insertan tantos array (hijos) como *numCols* establecidos externamente
  // cada array hijo posee un numero en su interior (0)
  for (let i = 0; i < numRows; i++) {
    rows.push(Array.from(Array(numCols), () => 0));
  }
  return rows;
};

export { numRows, numCols, operations, patterns, generateEmptyGrid };
