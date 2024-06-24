"use client";
import React, { useRef, useState, useEffect } from "react";
import { useUser } from "@clerk/nextjs";
import { getMessages, db } from "../firebase/page";
import { setDoc, doc, getDoc } from "firebase/firestore";
import { Engine } from "excalibur";
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
  const [chatOpen, setChatOpen] = useState(false);
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
        const userName = user.fullName ?? user.emailAddresses[0].emailAddress;

        const userRef = doc(db, "users", userId);
        const userSnap = await getDoc(userRef);

        if (!userSnap.exists()) {
          await setDoc(userRef, {
            name: userName,
            Coins: 2000,
          });
        }
        setUserSaved(true); // Marcar que el usuario se ha guardado
      }
    };

    // Suscripción al chat solo si el usuario está guardado
    const unsubscribeChat = userSaved ? getMessages((newMessages) => {
      setMessages(newMessages);
    }) : () => {};

    initialize();

    return () => {
      isMounted = false;
      unsubscribeChat();
      if (gameInstance) {
        gameInstance.stop();
        setGameInstance(null);
      }
    };
  }, [gameInstance, user, isLoaded, isSignedIn, userSaved]); // userSaved agregado como dependencia

  if (!clerkPublishableKey) {
    return <div>Error: Clerk publishable key is not set.</div>;
  }

  return (
    <div className="fondo-about">
      <div className="flex justify-center items-center h-screen">
        <div className="border-8 border-stone-900 relative">
          <canvas ref={canvasRef} className="m-auto" />
          <ClerkProvider publishableKey={clerkPublishableKey}>
            <SignedIn>
              {isLoaded && isSignedIn && ( 
                <div className="absolute bottom-0 left-0 p-4 w-full">
                  <button
                    className="open-chat-button"
                    onClick={() => setChatOpen(!chatOpen)}
                  >
                    {chatOpen ? "Cerrar Chat" : "Abrir Chat"}
                  </button>
                  {chatOpen && <ChatWindow onClose={() => setChatOpen(false)} messages={messages} />} 
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
