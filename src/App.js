import React, { useState, useEffect, useCallback, useRef } from "react";
import produce from "immer";

import PlayArrowIcon from "@mui/icons-material/PlayArrow";
import StopIcon from "@mui/icons-material/Stop";
import DeleteForeverIcon from "@mui/icons-material/DeleteForever";

import "./App.css";

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

function App() {
  // Se establecen los estados iniciales
  // • para el tablero:
  const [grid, setGrid] = useState(() => {
    return generateEmptyGrid();
  });
  // • para el tiempo de cada turno:
  const [time, setTime] = useState(300);
  // • para la generacion (*):
  // (*): cada generacion se cuenta al pasar un turno
  const [generation, setGeneration] = useState(0);

  const [running, setRunning] = useState(false);
  const runningRef = useRef(running);
  runningRef.current = running;

  const runSimulation = useCallback(() => {
    // Se va a re-reenderizar cada vez que el valor del estado *time* se actualice

    if (!runningRef.current) {
      return;
    }

    setGrid((g) => {
      return produce(g, (gridCopy) => {
        // 2 bucles for para recorrer tanto filas como columnas
        for (let i = 0; i < numRows; i++) {
          for (let k = 0; k < numCols; k++) {
            let neighbors = 0;
            operations.forEach(([x, y]) => {
              const newI = i + x;
              const newK = k + y;
              if (newI >= 0 && newI < numRows && newK >= 0 && newK < numCols) {
                neighbors += g[newI][newK];
              }
            });

            if (neighbors < 2 || neighbors > 3) {
              gridCopy[i][k] = 0;
            } else if (g[i][k] === 0 && neighbors === 3) {
              gridCopy[i][k] = 1;
            }
          }
        }
      });
    });
    // Se llama a la funcion recursiva
    setTimeout(runSimulation, time);
  }, [time]);

  // Features
  const increaseSpeed = () => {
    // MAX-speed -> 2000ms
    time <= 1900 && setTime(time + 100);
  };

  const decreaseSpeed = () => {
    // MIN-speed -> 0ms
    time >= 100 && setTime(time - 100);
  };

  useEffect(() => {
    // Se define la primera iteracion cuando empieza a correr:
    runningRef.current && setGeneration(generation + 1);
    // Se definen las siguientes iteraciones si ya esta corriendo:
    if (runningRef.current) {
      const interval = window.setInterval(() => {
        setGeneration((generation) => generation + 1);
      }, time);
      return () => window.clearInterval(interval);
    }
    return undefined;
  }, [runningRef.current]);

  const resetGame = () => {
    setGrid(generateEmptyGrid());
    setGeneration(0);
    setRunning(false);
  };

  return (
    <div className="game-container">
      {/* Board */}
      <div
        className="board-container"
        style={{
          gridTemplateColumns: `repeat(${numCols}, 26px)`,
        }}
      >
        {grid.map((rows, i) =>
          rows.map((col, k) => (
            /* Cell */
            <div
              key={`${i}-${k}`}
              onClick={() => {
                const newGrid = produce(grid, (gridCopy) => {
                  gridCopy[i][k] = grid[i][k] ? 0 : 1;
                });
                setGrid(newGrid);
              }}
              style={{
                width: 22,
                height: 22,
                backgroundColor: grid[i][k] ? "#9afcb3" : "#5a5e77",
                border: "solid 1px #44475a",
                borderRadius: "20px",
                margin: "1px",
              }}
            />
          ))
        )}
      </div>
      {/* Control Bar */}
      <div className="control-bar">
        <button
          onClick={() => {
            setRunning(!running);
            if (!running) {
              runningRef.current = true;
              runSimulation();
            }
          }}
        >
          {running ? (
            <StopIcon sx={{ fontSize: 40 }} />
          ) : (
            <PlayArrowIcon sx={{ fontSize: 40 }} />
          )}
        </button>
        <button onClick={resetGame}>
          <DeleteForeverIcon sx={{ fontSize: 40 }} />
        </button>

        {/* Increase/Decrease game speed */}
        <button onClick={decreaseSpeed}>-</button>
        <h3 style={{ color: "#ffffff", marginRight: "8px" }}>{time}</h3>
        <button onClick={increaseSpeed}>+</button>

        {/* Input Patterns */}
        <input
          type="text"
          list="items"
          placeholder="Patterns"
          className="patterns-input"
        />
        <datalist id="items">
          {patterns.map((p) => {
            return <option value={p} />;
          })}
        </datalist>
      </div>
      <div style={{ alignItems: "center", color: "#ffffff" }}>
        <h3>Generation {generation}</h3>
      </div>
    </div>
  );
}

export default App;
