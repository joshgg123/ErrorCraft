"use client";
import React, { useRef, useState, useEffect } from "react";
import { Engine } from "excalibur";
import { useUser } from "@clerk/nextjs";
import { addDoc, doc, setDoc, collection, getDoc} from "firebase/firestore";
import { db } from "../firebase/page";
import { Coin } from "../componentes/coins";

const GamePage: React.FC = () => {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [gameInstance, setGameInstance] = useState<Engine | null>(null);
  const { user } = useUser();

  useEffect(() => {
    let isMounted = true;

    if (canvasRef.current && !gameInstance) {
      import("./main").then(async ({ initializeGame, startGame }) => {
        if (isMounted) {
          const engine = await initializeGame(canvasRef.current!, user?.id || "");
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
          //comprobar si esta en la base de datos y si no agregarlo
          const userRef = doc(db, "users", userId);
          const userSnap = await getDoc(userRef);
          if (userSnap.exists()) {
            console.log("User already exists in Firebase:", { userId, userName });
            return;
          }
          else {
            console.log("User does not exist in Firebase:", { userId, userName });
            await addDoc(collection(db, "users"), {
              name: userName,
              id: userId,
              Coins: 2000,
              
            });
          }
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
