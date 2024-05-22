// En el segundo archivo (GamePage.tsx)
"use client";
import React, { useRef, useState, useEffect } from "react";
import { Engine, Color, Vector } from "excalibur";
import { Grid } from "../objects/grid";
import { Player } from "../objects/player";
import { loader } from "../resource";
import { config } from "../config";
import { initializeMenu } from '../Componentes/FloatingMenu'; // Importar la función initializeMenu

export default function GamePage() {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [gameInstance, setGameInstance] = useState<Engine | null>(null);

  useEffect(() => {
    let isMounted = true; 

    if (canvasRef.current && !gameInstance) {
      import("./main").then(({ initializeGame, startGame }) => {
        if (isMounted) {
          const engine = initializeGame(canvasRef.current!);
          setGameInstance(engine);
          startGame(engine);
        }
      });
    }

    return () => {
      isMounted = false;
      if (gameInstance) {
        gameInstance.stop();
        setGameInstance(null);
      }
    };
  }, [gameInstance]);

  return (
    <>
      <div className="fondo-about">
          <div className="flex justify-center items-center h-screen">
            <div className="border-8 border-stone-900">
              <canvas ref={canvasRef} className="m-auto" />
            </div>
          </div>
      </div>
      <div id="menu-content" className="menu-content">
        {/* Aquí puedes colocar el contenido de tu menú si lo deseas */}
      </div>
    </>
  );
}
