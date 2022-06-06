import React, { useState, useEffect, useCallback, useRef } from "react";
import produce from "immer";

// Icons
import PlayArrowIcon from "@mui/icons-material/PlayArrow";
import StopIcon from "@mui/icons-material/Stop";
import DeleteForeverIcon from "@mui/icons-material/DeleteForever";

// Utils
import {
  numRows,
  numCols,
  operations,
  patterns,
  generateEmptyGrid,
} from "./utils/utils";

// Styles
import "./App.scss";

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
  const runningRef = useRef(running); // Crea una referencia mutable del objeto **running**
  runningRef.current = running;

  const runSimulation = useCallback(() => {
    // Se va a re-reenderizar cada vez que el valor del estado *time* se actualice

    if (!runningRef.current) {
      return;
    }

    setGrid((g) => {
      return produce(g, (gridCopy) => {
        // Se utiliza la funcion 'produce' para generar el nuevo grid y setearlo de una forma mas clara en el estado
        // g -> actual grid
        // gridCopy -> nuevo grid
        for (let i = 0; i < numRows; i++) {
          for (let k = 0; k < numCols; k++) {
            // 2 bucles for para recorrer tanto filas como columnas
            // Calcula los vecinos existentes
            let neighbors = 0;
            operations.forEach(([x, y]) => {
              const newI = i + x;
              const newK = k + y;
              if (newI >= 0 && newI < numRows && newK >= 0 && newK < numCols) {
                // Se validan los limites con el 'if'
                neighbors += g[newI][newK];
              }
            });

            if (neighbors < 2 || neighbors > 3) {
              gridCopy[i][k] = 0; // Elimina a la celula
            } else if (g[i][k] === 0 && neighbors === 3) {
              gridCopy[i][k] = 1; // Nace una nueva celula
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
                  // Se utiliza la funcion 'produce' para generar el nuevo grid y setearlo de una forma mas clara en el estado
                  // grid -> estado actual del grid
                  // gridCopy -> nuevo estado del grid
                  gridCopy[i][k] = grid[i][k] ? 0 : 1; // Cambia el estado actual de la celda
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
              runSimulation(); // Se llama a la funcion CallBack
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
