"use client";
import React, { useRef, useState, useEffect } from "react";
<<<<<<< HEAD
import { useUser } from "@clerk/nextjs"; // Importar useClient desde Clerk
import { getMessages, db } from "../firebase/page";
import { setDoc, doc } from "firebase/firestore";
import { Engine, Actor, Label, vec, Font } from "excalibur";
=======
import { useUser } from "@clerk/nextjs";
import { getMessages, db } from "../firebase/page";
import { setDoc, doc, getDoc, collection, onSnapshot } from "firebase/firestore";
import { Engine } from "excalibur";
>>>>>>> BrunoJoshua
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
<<<<<<< HEAD
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
=======
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
        const userName = user.fullName || user.emailAddresses[0].emailAddress;

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

    const unsubscribe = onSnapshot(collection(db, "messages"), (snapshot) => {
      const newMessages: ChatMessageData[] = [];
      snapshot.forEach((doc) => {
        newMessages.push({ id: doc.id, ...doc.data() } as ChatMessageData);
      });
      setMessages(newMessages);
    }
    );


    // Suscripción al chat solo si el usuario está guardado
    const unsubscribeChat = userSaved ? getMessages((newMessages) => {
      setMessages(newMessages);
    }) : () => {};

    initialize();

    return () => {
      isMounted = false;
      unsubscribeChat();
      unsubscribe();
      if (gameInstance) {
        gameInstance.stop();
        setGameInstance(null);
      }
    };
  }, [gameInstance, user, isLoaded, isSignedIn, userSaved]); // userSaved agregado como dependencia
>>>>>>> BrunoJoshua

  if (!clerkPublishableKey) {
    return <div>Error: Clerk publishable key is not set.</div>;
  }

  return (
    <div className="fondo-about">
      <div className="flex justify-center items-center h-screen">
        <div className="border-8 border-stone-900 relative">
          <canvas ref={canvasRef} className="m-auto" />
<<<<<<< HEAD
          <button className="queonda">Que onda</button>
          <ClerkProvider publishableKey={clerkPublishableKey}>
            <SignedIn>
              {isLoaded && isSignedIn && (
                <div className="absolute bottom-0 left-0 p-4 w-full">
                  <button className="open-chat-button" onClick={() => setChatOpen(!chatOpen)}>
  {chatOpen ? "Cerrar Chat" : "Abrir Chat"}
</button>
                  {chatOpen && <ChatWindow onClose={() => setChatOpen(false)} />}
=======
  
          {/* ClerkProvider para la autenticación */}
          <ClerkProvider publishableKey={clerkPublishableKey}>
            <SignedIn>
              {isLoaded && isSignedIn && ( // Mostrar botón y chat solo si está autenticado
                <div className="absolute bottom-0 left-0 p-4 w-full">
                  <button
                    className="open-chat-button"
                    onClick={() => setChatOpen(!chatOpen)}
                  >
                    {chatOpen ? "Cerrar Chat" : "Abrir Chat"}
                  </button>
                  {chatOpen && <ChatWindow onClose={() => setChatOpen(false)} messages={messages} />} 
>>>>>>> BrunoJoshua
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

