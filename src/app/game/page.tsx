"use client";
import React, { useRef, useState, useEffect } from "react";
import { Engine } from "excalibur";
import { useUser } from "@clerk/nextjs";
import { doc, setDoc, getDoc } from "firebase/firestore";
import { db } from "../firebase/page";

const GamePage: React.FC = () => {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [gameInstance, setGameInstance] = useState<Engine | null>(null);
  const { user, isLoaded, isSignedIn } = useUser();
  const [userSaved, setUserSaved] = useState(false);

  useEffect(() => {
    let isMounted = true;

    const initialize = async () => {
      if (canvasRef.current && !gameInstance && user && isLoaded && isSignedIn) {
        import("./main").then(async ({ initializeGame, startGame }) => {
          if (isMounted) {
            const engine = await initializeGame(canvasRef.current!, user.id);
            setGameInstance(engine);
            startGame(engine);
          }
        });

        const userId = user.id;
        const userName = user.fullName || user.emailAddresses[0].emailAddress;

        const userRef = doc(db, "users", userId);
        const userSnap = await getDoc(userRef);

        if (userSnap.exists()) {
          console.log("User already exists in Firebase:", { userId, userName });
        } else {
          console.log("User does not exist in Firebase:", { userId, userName });
          await setDoc(userRef, {
            name: userName,
            Coins: 2000,
          });
          console.log("User saved to Firebase:", { userId, userName });
        }
        setUserSaved(true);
      }
    };

    initialize();

    return () => {
      isMounted = false;
      if (gameInstance) {
        gameInstance.stop();
        setGameInstance(null);
      }
    };
  }, [gameInstance, user, isLoaded, isSignedIn, userSaved]);

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
