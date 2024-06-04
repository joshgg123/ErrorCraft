"use client";
import React, { useRef, useState, useEffect } from "react";
import { Engine } from "excalibur";
import { useUser } from "@clerk/nextjs";
import { doc, setDoc } from "firebase/firestore";
import { db } from "../firebase/page";

const GamePage: React.FC = () => {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [gameInstance, setGameInstance] = useState<Engine | null>(null);
  const { user } = useUser();

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

    // Guardar información del usuario en Firebase
    if (user) {
      console.log("User detected:", user); // Log para verificar que `user` está disponible

      const userId = user.id;
      const userName = user.fullName || user.emailAddresses[0].emailAddress;

      const saveUserToFirebase = async () => {
        
          console.log("Saving user to Firebase:", { userId, userName }); // Log antes de guardar

          await setDoc(doc(db, "users", userId), {
            name: userName,
            id: userId
          });
          console.log("User saved to Firebase:", { userId, userName }); // Log después de guardar
        
      };

      saveUserToFirebase();
    } else {
      console.log("No user detected."); // Log cuando `user` es null o undefined
    }

    return () => {
      isMounted = false;
      if (gameInstance) {
        gameInstance.stop();
        setGameInstance(null);
      }
    };
  }, [gameInstance, user]);

  return (
    <div className="fondo-about">
      <div className="flex justify-center items-center h-screen">
        <div className="border-8 border-stone-900">
          <canvas ref={canvasRef} className="m-auto" />
        </div>
      </div>
    </div>
  );
};

export default GamePage;
