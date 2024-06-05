"use client";
import React, { useRef, useState, useEffect } from "react";
import { useUser } from "@clerk/nextjs";
import ChatInput from "../componentes/ChatInput";
import { getMessages, db,  } from "../firebase/page";
import { setDoc, doc } from "firebase/firestore";
import { Engine, Actor, Label, vec, Font } from "excalibur";

interface ChatMessageData {
  id: string;
  message: string;
  user: string;
  timestamp: Date;
}

export default function GamePage() {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [gameInstance, setGameInstance] = useState<Engine | null>(null);
  const { isLoaded, isSignedIn, user } = useUser();
  const [messages, setMessages] = useState<ChatMessageData[]>([]);
  const formatMessage = (msg: ChatMessageData) => `${msg.user}: ${msg.message}`;

  useEffect(() => {
    let isMounted = true;
    if (canvasRef.current && !gameInstance) {
      import("./main").then(({ initializeGame, startGame }) => {
        if (isMounted) {
          const engine = initializeGame(canvasRef.current!);
          setGameInstance(engine);
          startGame(engine);

          // Crear un actor para el chat y agregarlo a la escena
          const chatActor = new Actor({
            pos: vec(200, 100), // Posición inicial del chat
            width: 400, // Ancho del chat
            height: 300, // Alto del chat
          });

           // Crear label para mostrar mensajes (usando Font)
           const chatFont = new Font({
            size: 16,
            family: "sans-serif",
          });
          const chatLabel = new Label({
            text: "",
            pos: vec(0, 0), 
            font: chatFont,
          });
          chatActor.addChild(chatLabel);
          engine.add(chatActor);

          const updateChatLabel = () => {
            chatLabel.text = messages.map(formatMessage).join("\n"); 
        };
        updateChatLabel(); 

          // Suscribirse a nuevos mensajes y actualizar el label
          const unsubscribe = getMessages((newMessages) => {
            setMessages(newMessages);
            updateChatLabel();
          });

          // Limpieza al desmontar
          return () => {
            unsubscribe();
          };
        }
      });
    }

    
    // Guardar información del usuario en Firebase
    if (user) {
      console.log("User detected:", user); // Log para verificar que `user` está disponible

      const userId = user.id;
      const userEmail = user.emailAddresses[0].emailAddress;

      const saveUserToFirebase = async () => {
        try {
          console.log("Saving user to Firebase:", { userId, userEmail }); // Log antes de guardar
          await setDoc(doc(db, "users", userId), {
            name: userEmail,
            id: userId,
            Coins: 2000,
        });
        console.log("User saved to Firebase:", { userId, userEmail }); // Log después de guardar
        } catch (error) {
          console.error("Error saving user to Firebase:", error); // Manejo de errores
        }
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
  }, [gameInstance]);

  return (
    <div className="fondo-about">
      <div className="flex justify-center items-center h-screen">
        <div className="border-8 border-stone-900 relative">
          <canvas ref={canvasRef} className="m-auto" />
          {isLoaded && isSignedIn && (
            <div className="absolute bottom-0 left-0 p-4 w-full">
              <ChatInput />
            </div>
          )}
        </div>
      </div>
    </div>
  );
}


