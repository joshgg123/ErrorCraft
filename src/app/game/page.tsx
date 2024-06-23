"use client";
import React, { useRef, useState, useEffect } from "react";
import { useUser } from "@clerk/nextjs"; // Importar useClient desde Clerk
import { getMessages, db } from "../firebase/page";
import { setDoc, doc } from "firebase/firestore";
import { Engine, Actor, Label, vec, Font } from "excalibur";
import ChatWindow from "../componentes/ChatWindow";
import { ClerkProvider, SignedIn, SignedOut, RedirectToSignIn } from '@clerk/clerk-react';

interface ChatMessageData {
  id: string;
  message: string;
  user: string;
  timestamp: Date;
}

const clerkPublishableKey = process.env.NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY;

export default function GamePage() {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [gameInstance, setGameInstance] = useState<Engine | null>(null);
  const { isLoaded, isSignedIn, user } = useUser();
  const [messages, setMessages] = useState<ChatMessageData[]>([]);
  const [chatOpen, setChatOpen] = useState(false); // Estado para controlar la apertura y cierre del chat
  const formatMessage = (msg: ChatMessageData) => `${msg.user}: ${msg.message}`;

  useEffect(() => {
    let isMounted = true;
    if (canvasRef.current && !gameInstance) {
      import("./main").then(({ initializeGame, startGame }) => {
        if (isMounted) {
          const engine = initializeGame(canvasRef.current!);
          setGameInstance(engine);
          startGame(engine);

          const chatActor = new Actor({
            pos: vec(200, 100),
            width: 400,
            height: 300,
          });

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

          const unsubscribe = getMessages((newMessages) => {
            setMessages(newMessages);
            updateChatLabel();
          });

          return () => {
            unsubscribe();
          };
        }
      });
    }

    if (user) {
      const userId = user.id;
      const userEmail = user.emailAddresses[0].emailAddress;

      const saveUserToFirebase = async () => {
        try {
          await setDoc(doc(db, "users", userId), {
            name: userEmail,
            id: userId,
            Coins: 2000,
          });
        } catch (error) {
          console.error("Error saving user to Firebase:", error);
        }
      };
      saveUserToFirebase();
    }

    return () => {
      isMounted = false;
      if (gameInstance) {
        gameInstance.stop();
        setGameInstance(null);
      }
    };
  }, [gameInstance]);

  if (!clerkPublishableKey) {
    return <div>Error: Clerk publishable key is not set.</div>;
  }

  return (
    <div className="fondo-about">
      <div className="flex justify-center items-center h-screen">
        <div className="border-8 border-stone-900 relative">
          <canvas ref={canvasRef} className="m-auto" />
          <button className="queonda">Que onda</button>
          <ClerkProvider publishableKey={clerkPublishableKey}>
            <SignedIn>
              {isLoaded && isSignedIn && (
                <div className="absolute bottom-0 left-0 p-4 w-full">
                  <button className="open-chat-button" onClick={() => setChatOpen(!chatOpen)}>
  {chatOpen ? "Cerrar Chat" : "Abrir Chat"}
</button>
                  {chatOpen && <ChatWindow onClose={() => setChatOpen(false)} />}
                </div>
              )}
            </SignedIn>
            <SignedOut>
              <RedirectToSignIn />
            </SignedOut>
          </ClerkProvider>
        </div>
      </div>
    </div>
  );
}
