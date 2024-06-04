"use client";
import React, { useRef, useState, useEffect } from "react";
import { useUser } from "@clerk/nextjs";
import ChatInput from "../componentes/ChatInput";
import ChatMessage from "../componentes/ChatMessage";
import { getMessages } from "../firebase/page";
import toast from "react-hot-toast";
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
  const { isLoaded, isSignedIn } = useUser();
  const [messages, setMessages] = useState<ChatMessageData[]>([]);

  useEffect(() => {
    let isMounted = true;

    if (canvasRef.current && !gameInstance) {
      import("./main").then(({ initializeGame, startGame }) => {
        if (isMounted) {
          const engine = initializeGame(canvasRef.current!);
          setGameInstance(engine);
          startGame(engine);

          // Crear actor para el chat (usando vec para la posición)
          const chatActor = new Actor({
            pos: vec(200, 100),
            width: 400,
            height: 300,
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

          // Actualizar label del chat
          const updateChatLabel = () => {
            chatLabel.text = messages
              .map((msg) => `${msg.user}: ${msg.message}`)
              .join("\n");
          };
          updateChatLabel();

          // Suscribirse a nuevos mensajes
          const unsubscribe = getMessages((newMessages) => {
            setMessages(newMessages);
            updateChatLabel();
          });

          // Limpieza al desmontar
          return () => unsubscribe(); 
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
