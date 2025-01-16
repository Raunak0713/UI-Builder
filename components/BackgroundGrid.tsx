'use client'
import { useEffect, useState, useRef } from "react";

interface TimeoutRefs {
  [key: number]: NodeJS.Timeout;
}

const BackgroundGrid = () => {
  const [gridCells, setGridCells] = useState<number>(0);
  const [columns, setColumns] = useState<number>(0);
  const [rows, setRows] = useState<number>(0);
  const [hoveredCells, setHoveredCells] = useState<Set<number>>(new Set());
  const timeoutRefs = useRef<TimeoutRefs>({});

  const CELL_SIZE = 50; // Adjust as needed

  useEffect(() => {
    const calculateCells = (): void => {
      const container = document.querySelector(".graph-bg") as HTMLElement;
      if (!container) return;

      const cols = Math.floor(container.clientWidth / CELL_SIZE);
      const rows = Math.floor(container.clientHeight / CELL_SIZE);
      setColumns(cols);
      setRows(rows);
      setGridCells(cols * rows);
    };

    calculateCells();
    window.addEventListener("resize", calculateCells);

    return () => window.removeEventListener("resize", calculateCells);
  }, []);
  
  useEffect(() => {
    return () => {
      Object.values(timeoutRefs.current).forEach((timeout) => clearTimeout(timeout));
    };
  }, []);

  const handleCellHover = (index: number): void => {
    if (timeoutRefs.current[index]) {
      clearTimeout(timeoutRefs.current[index]);
    }

    setHoveredCells((prev) => {
      const newSet = new Set(prev);
      newSet.add(index);
      return newSet;
    });

    timeoutRefs.current[index] = setTimeout(() => {
      setHoveredCells((prev) => {
        const newSet = new Set(prev);
        newSet.delete(index);
        return newSet;
      });
      delete timeoutRefs.current[index];
    }, 250);
  };

 

  return (
    <div className="graph-bg h-screen w-full overflow-hidden">
      <div
        className="grid-overlay"
        style={{
          display: "grid",
          gridTemplateColumns: `repeat(${columns}, ${CELL_SIZE}px)`,
          gridTemplateRows: `repeat(${rows}, ${CELL_SIZE}px)`,
        }}
      >
        {Array.from({ length: gridCells }).map((_, i) => (
          <div
            key={i}
            className={`grid-cell ${hoveredCells.has(i) ? "bg-orange-300/20" : ""}`}
            onMouseEnter={() => handleCellHover(i)}
            style={{ width: CELL_SIZE, height: CELL_SIZE }}
          />
        ))}
      </div>
    </div>
  );
}


export { BackgroundGrid }