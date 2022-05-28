import React, { useState, useCallback, useRef } from "react";
import produce from "immer";
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

const generateEmptyGrid = () => {
  const rows = [];
  for (let i = 0; i < numRows; i++) {
    rows.push(Array.from(Array(numCols), () => 0));
  }

  return rows;
};

function App() {
  const [grid, setGrid] = useState(() => {
    return generateEmptyGrid();
  });
  const [time, setTime] = useState(300);
  const [running, setRunning] = useState(false);
  const runningRef = useRef(running);
  runningRef.current = running;

  const increaseSpeed = () => {
    setTime(time + 100);
  };

  const decreaseSpeed = () => {
    setTime(time - 100);
  };

  const runSimulation = useCallback(() => {
    if (!runningRef.current) {
      return;
    }

    setGrid((g) => {
      return produce(g, (gridCopy) => {
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

    setTimeout(runSimulation, time);
  }, [time]);

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
          {running ? "STOP" : "START"}
        </button>
        <button
          onClick={() => {
            setGrid(generateEmptyGrid());
          }}
        >
          CLEAR
        </button>
        <button onClick={decreaseSpeed}>-</button>
        <h3 style={{ color: "#ffffff", marginRight: "8px" }}>{time}</h3>
        <button onClick={increaseSpeed}>+</button>
      </div>
    </div>
  );
}

export default App;
