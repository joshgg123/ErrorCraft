'use client';

import React, { useState } from 'react';
import { SignIn } from '@clerk/clerk-react';

const Menu: React.FC = () => {
    const [showSignIn, setShowSignIn] = useState(false);

    const startGame = () => {
        
        window.location.href = '/game';
        // Aquí puedes añadir la lógica para iniciar el juego.
    };

    const showControls = () => {
        alert("Controles del juego:\n- Movimiento: WASD o flechas\n- Saltar: Barra espaciadora\n- Pausa: P");
        // Aquí puedes añadir la lógica para mostrar los controles del juego.
    };

    const toggleSignIn = () => {
        setShowSignIn(!showSignIn);
    };

    return (
        <div className="text-center text-white font-sans">
            <h1 className="text-4xl mb-6">Menú del Juego</h1>
            <button 
                onClick={startGame} 
                className="block w-48 mx-auto py-2 my-2 text-lg font-semibold cursor-pointer border-none rounded bg-blue-400 text-gray-800 hover:bg-blue-600"
            >
                Iniciar Juego
            </button>
            <button 
                onClick={showControls} 
                className="block w-48 mx-auto py-2 my-2 text-lg font-semibold cursor-pointer border-none rounded bg-blue-400 text-gray-800 hover:bg-blue-600"
            >
                Ver Controles
            </button>
            <button 
                onClick={toggleSignIn} 
                className="block w-48 mx-auto py-2 my-2 text-lg font-semibold cursor-pointer border-none rounded bg-blue-400 text-gray-800 hover:bg-blue-600"
            >
                {showSignIn ? 'Ocultar Inicio de Sesión' : 'Mostrar Inicio de Sesión'}
            </button>
            {showSignIn && <SignIn />}
        </div>
    );
};

export default Menu;